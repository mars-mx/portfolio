"""Upstream-Fehler im Chat-Stream: geloggt, neutral an den Client, nichts sickert durch.

Hintergrund: Am 2026-11-05 fiel der Chat aus, weil das OpenAI-Konto kein
Guthaben mehr hatte. OpenAI antwortet bei Streams mit HTTP 200 und schickt den
Fehler erst als Event im Stream; das Backend reichte ihn ungeloggt und roh
(inkl. Billing-Link) an den Browser weiter.

Die Tests schicken echte SSE-Antworten über einen httpx-MockTransport durch
OpenAI-SDK, Pydantic-AI und den /api/chat-Endpoint.
"""

import json
import logging

import httpx
import pytest
from fastapi.testclient import TestClient
from openai import AsyncOpenAI
from pydantic_ai.providers.openai import OpenAIProvider

from app.agent.assistant import agent
from app.agent.upstream import GuardedResponsesModel
from app.core.config import settings
from app.main import app

BILLING_MESSAGE = (
    "You have no credits remaining. Add credits at "
    "https://platform.openai.com/settings/organization/billing"
)
LEAK_MARKERS = ("platform.openai.com", "billing", "credits", "quota", BILLING_MESSAGE)
NEUTRAL_ERROR = "chat_unavailable"
LOG_PREFIX = "chat_upstream_error"

CREATED = {
    "type": "response.created",
    "sequence_number": 0,
    "response": {
        "id": "resp_1",
        "object": "response",
        "created_at": 1,
        "model": "gpt-5.5",
        "output": [],
        "status": "in_progress",
        "parallel_tool_calls": True,
        "tool_choice": "auto",
        "tools": [],
    },
}
QUOTA_ERROR = {
    "code": "insufficient_quota",
    "type": "insufficient_quota",
    "message": BILLING_MESSAGE,
}

CHAT_BODY = {
    "trigger": "submit-message",
    "id": "chat-1",
    "messages": [
        {"id": "m1", "role": "user", "parts": [{"type": "text", "text": "Hallo"}]}
    ],
}


def _sse(*events: dict) -> httpx.Response:
    body = "".join(f"event: {e['type']}\ndata: {json.dumps(e)}\n\n" for e in events)
    return httpx.Response(
        200, text=body, headers={"content-type": "text/event-stream"}
    )


# Szenario → Handler für den Mock-Transport. Jeder Handler simuliert genau
# eine Art, wie OpenAI einen Fehler melden kann.
def _stream_error_nested(request: httpx.Request) -> httpx.Response:
    # Variante mit verschachteltem error-Objekt: das SDK wirft openai.APIError.
    return _sse(CREATED, {"type": "error", "sequence_number": 1, "error": QUOTA_ERROR})


def _stream_error_flat(request: httpx.Request) -> httpx.Response:
    # ResponseErrorEvent laut Responses-API-Schema (code/message auf oberster Ebene).
    return _sse(
        CREATED,
        {
            "type": "error",
            "sequence_number": 1,
            "code": "insufficient_quota",
            "message": BILLING_MESSAGE,
            "param": None,
        },
    )


def _stream_response_failed(request: httpx.Request) -> httpx.Response:
    failed = {
        **CREATED["response"],
        "status": "failed",
        "error": {"code": "insufficient_quota", "message": BILLING_MESSAGE},
    }
    return _sse(
        CREATED, {"type": "response.failed", "sequence_number": 1, "response": failed}
    )


def _http_429_quota(request: httpx.Request) -> httpx.Response:
    # Client-Exception: das SDK wirft RateLimitError (APIStatusError).
    return httpx.Response(429, json={"error": QUOTA_ERROR})


def _timeout(request: httpx.Request) -> httpx.Response:
    raise httpx.ReadTimeout("read timed out", request=request)


@pytest.fixture(autouse=True)
def _hermetic(monkeypatch: pytest.MonkeyPatch) -> None:
    # .env kann Turnstile aktivieren — für diese Tests ist der Chat offen.
    monkeypatch.setattr(settings, "turnstile_secret_key", "")
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test")


def _post_chat(handler) -> tuple[httpx.Response, int]:
    calls = 0

    def counting(request: httpx.Request) -> httpx.Response:
        nonlocal calls
        calls += 1
        return handler(request)

    client = AsyncOpenAI(
        api_key="sk-test",
        max_retries=0,
        http_client=httpx.AsyncClient(transport=httpx.MockTransport(counting)),
    )
    model = GuardedResponsesModel("gpt-5.5", provider=OpenAIProvider(openai_client=client))
    # Ohne "with": der Lifespan würde die Wissensbasis embedden (echter API-Call).
    with agent.override(model=model):
        response = TestClient(app).post("/api/chat", json=CHAT_BODY)
    return response, calls


def _error_chunks(body: str) -> list[dict]:
    chunks = []
    for line in body.splitlines():
        if line.startswith("data: {"):
            chunk = json.loads(line.removeprefix("data: "))
            if chunk.get("type") == "error":
                chunks.append(chunk)
    return chunks


def _upstream_error_lines(caplog: pytest.LogCaptureFixture) -> list[str]:
    return [
        r.getMessage()
        for r in caplog.records
        if r.levelno == logging.ERROR and r.getMessage().startswith(LOG_PREFIX)
    ]


QUOTA_SCENARIOS = {
    "stream_error_nested": _stream_error_nested,
    "stream_error_flat": _stream_error_flat,
    "stream_response_failed": _stream_response_failed,
    "http_429_quota": _http_429_quota,
}


@pytest.mark.parametrize("handler", QUOTA_SCENARIOS.values(), ids=QUOTA_SCENARIOS.keys())
def test_quota_error_is_logged_once_and_neutral(
    handler, caplog: pytest.LogCaptureFixture
) -> None:
    caplog.set_level(logging.INFO)
    response, calls = _post_chat(handler)

    # (a) genau eine greppbare ERROR-Zeile mit eigenem Billing-Code
    lines = _upstream_error_lines(caplog)
    assert len(lines) == 1, lines
    assert "kind=billing" in lines[0]
    assert "code=insufficient_quota" in lines[0]
    assert BILLING_MESSAGE not in lines[0]
    assert "Hallo" not in lines[0]

    # (b) der Client bekommt nur das neutrale Fehler-Event
    assert response.status_code == 200
    assert _error_chunks(response.text) == [{"type": "error", "errorText": NEUTRAL_ERROR}]

    # (c) kein OpenAI-Text, kein Billing-Link
    for marker in LEAK_MARKERS:
        assert marker not in response.text, marker

    # Kein stiller zweiter Versuch gegen ein leeres Konto.
    assert calls == 1


def test_timeout_is_logged_and_neutral(caplog: pytest.LogCaptureFixture) -> None:
    caplog.set_level(logging.INFO)
    response, _ = _post_chat(_timeout)

    lines = _upstream_error_lines(caplog)
    assert len(lines) == 1, lines
    assert "kind=timeout" in lines[0]
    assert _error_chunks(response.text) == [{"type": "error", "errorText": NEUTRAL_ERROR}]
    assert "timed out" not in response.text
