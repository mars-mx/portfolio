"""Fehler des Modell-Providers (OpenAI) erkennen und einordnen.

OpenAI antwortet bei Streams zuerst mit HTTP 200 und meldet Fehler (z. B.
leeres Guthaben) erst als Event im Stream. Pydantic-AI ignoriert die Events
`error` (flache Form) und `response.failed` stillschweigend und fragt das
Modell danach erneut an. Dieses Modul macht daraus eine Exception und ordnet
sie für ein greppbares Log ein (siehe app.api.routes).
"""

import re
from collections.abc import AsyncIterator, Iterator
from dataclasses import dataclass

import openai
from openai.types import responses
from pydantic_ai.exceptions import ModelAPIError, ModelHTTPError
from pydantic_ai.models.openai import OpenAIResponsesModel


class UpstreamStreamError(Exception):
    """Fehler-Event im OpenAI-Stream (`error` oder `response.failed`)."""

    def __init__(self, code: str | None, message: str | None) -> None:
        super().__init__("Upstream-Stream meldet einen Fehler")
        self.code = code
        # Nur zur Einordnung, nie loggen oder an den Client geben.
        self.upstream_message = message


async def _raise_on_error_events(
    stream: openai.AsyncStream[responses.ResponseStreamEvent],
) -> AsyncIterator[responses.ResponseStreamEvent]:
    try:
        async for event in stream:
            if isinstance(event, responses.ResponseErrorEvent):
                raise UpstreamStreamError(event.code, event.message)
            if isinstance(event, responses.ResponseFailedEvent):
                error = event.response.error
                raise UpstreamStreamError(
                    error.code if error else None, error.message if error else None
                )
            yield event
    finally:
        await stream.close()


class GuardedResponsesModel(OpenAIResponsesModel):
    """OpenAI-Responses-Modell, das Fehler-Events im Stream als Exception wirft.

    Hängt sich in die private Methode `_process_streamed_response` von
    Pydantic-AI (kein öffentlicher Hook mit Zugriff auf die Roh-Events) — nach
    einem Pydantic-AI-Update zeigen die Tests in tests/, ob das noch greift.
    """

    async def _process_streamed_response(self, response, *args, **kwargs):  # type: ignore[override]
        return await super()._process_streamed_response(
            _raise_on_error_events(response), *args, **kwargs
        )


# Codes/Typen, unter denen OpenAI leeres Guthaben bzw. Billing-Probleme meldet.
_BILLING_CODES = {"insufficient_quota", "billing_hard_limit_reached", "billing_not_active"}
_BILLING_HINTS = ("credit", "quota", "billing")
_SAFE_TOKEN = re.compile(r"^[\w.\-]{1,64}$")


@dataclass(frozen=True)
class UpstreamError:
    """Log-taugliche Einordnung eines Provider-Fehlers — ohne Freitext."""

    kind: str  # billing | rate_limit | auth | timeout | connection | upstream
    code: str | None = None
    type: str | None = None
    status: int | None = None

    def log_line(self) -> str:
        return (
            f"chat_upstream_error kind={self.kind} code={self.code or '-'} "
            f"type={self.type or '-'} status={self.status or '-'}"
        )


def _safe(value: object) -> str | None:
    """Nur kurze Bezeichner übernehmen (z. B. "insufficient_quota"), nie Freitext."""
    return value if isinstance(value, str) and _SAFE_TOKEN.match(value) else None


def _kind(code: str | None, type_: str | None, status: int | None, message: object) -> str:
    text = message.lower() if isinstance(message, str) else ""
    if (
        {code, type_} & _BILLING_CODES
        or any((v or "").startswith("billing") for v in (code, type_))
        or any(hint in text for hint in _BILLING_HINTS)
    ):
        return "billing"
    if status == 429 or code == "rate_limit_exceeded":
        return "rate_limit"
    if status in (401, 403):
        return "auth"
    return "upstream"


def _from_body(body: object, status: int | None) -> UpstreamError:
    body = body if isinstance(body, dict) else {}
    # Manche Bodies kommen verpackt als {"error": {...}}.
    if isinstance(body.get("error"), dict):
        body = body["error"]
    code, type_ = _safe(body.get("code")), _safe(body.get("type"))
    return UpstreamError(_kind(code, type_, status, body.get("message")), code, type_, status)


def _chain(exc: BaseException) -> Iterator[BaseException]:
    seen: set[int] = set()
    current: BaseException | None = exc
    while current is not None and id(current) not in seen:
        seen.add(id(current))
        yield current
        current = current.__cause__ or current.__context__


def describe_upstream_error(exc: BaseException) -> UpstreamError | None:
    """Ordnet eine Exception als Provider-Fehler ein; None = kein Provider-Fehler."""
    fallback: UpstreamError | None = None
    for e in _chain(exc):
        if isinstance(e, UpstreamStreamError):
            code = _safe(e.code)
            return UpstreamError(_kind(code, None, 200, e.upstream_message), code, None, 200)
        if isinstance(e, ModelHTTPError):
            return _from_body(e.body, e.status_code)
        if isinstance(e, openai.APITimeoutError):
            return UpstreamError("timeout")
        if isinstance(e, openai.APIConnectionError):
            return UpstreamError("connection")
        if isinstance(e, openai.APIStatusError):
            return _from_body(e.body, e.status_code)
        if isinstance(e, openai.APIError):
            # Fehler-Event mit verschachteltem "error"-Objekt: das SDK wirft
            # mitten im HTTP-200-Stream.
            return _from_body(e.body, 200)
        if isinstance(e, ModelAPIError) and fallback is None:
            fallback = UpstreamError("upstream")
    return fallback
