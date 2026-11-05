import logging
from collections.abc import AsyncIterator
from datetime import UTC, datetime

import httpx
from fastapi import APIRouter, HTTPException
from pydantic_ai.ui.vercel_ai import VercelAIAdapter, VercelAIEventStream
from pydantic_ai.ui.vercel_ai.response_types import BaseChunk, ErrorChunk
from pydantic_ai.usage import UsageLimits
from starlette.requests import Request
from starlette.responses import Response

from app.agent.assistant import agent, chat_model
from app.agent.upstream import describe_upstream_error
from app.core.config import settings
from app.core.turnstile import (
    create_session_token,
    verify_session_token,
    verify_turnstile,
)
from app.schemas.chat import (
    ChatConsentRequest,
    ChatConsentResponse,
    ChatVerifyRequest,
    ChatVerifyResponse,
)
from app.schemas.contact import ContactRequest, ContactResponse

# Kostendeckel pro Run: der Endpoint ist öffentlich und unauthentifiziert.
# Begrenzt Tool-Schleifen und Token-Verbrauch einer einzelnen Anfrage;
# Rate-Limiting über Requests hinweg ist Sache des Deployments (Reverse Proxy).
CHAT_USAGE_LIMITS = UsageLimits(request_limit=6, total_tokens_limit=50_000)

# Einziger Fehlertext, den der Browser je sieht; das Frontend übersetzt ihn
# (MessageError in thread.tsx). Details landen ausschließlich im Log.
CHAT_ERROR_CODE = "chat_unavailable"

# Header, in dem das Frontend sein Chat-Session-Token mitschickt.
SESSION_HEADER = "X-Chat-Session"

logger = logging.getLogger("mxdigital")

router = APIRouter(prefix="/api")


@router.post("/contact", response_model=ContactResponse)
async def contact(payload: ContactRequest) -> ContactResponse:
    """Nimmt eine Kontaktanfrage entgegen.

    TODO: Versand per E-Mail (Resend/Postmark/SMTP) anbinden.
    Aktuell wird die Anfrage nur protokolliert.
    """
    logger.info("Kontaktanfrage von %s <%s>", payload.name, payload.email)
    return ContactResponse(ok=True)


def _client_ip(request: Request) -> str:
    """Client-IP; hinter dem Reverse Proxy steht sie im X-Forwarded-For-Header."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unbekannt"


@router.post("/chat/consent", response_model=ChatConsentResponse)
async def chat_consent(
    payload: ChatConsentRequest, request: Request
) -> ChatConsentResponse:
    """Protokolliert die Zustimmung zur Datenschutzerklärung vor Chat-Beginn.

    Dient als Nachweis: IP, Zeitpunkt (UTC) und die explizite Zustimmung
    landen im Anwendungslog.
    """
    logger.info(
        "Datenschutz-Zustimmung: ip=%s zeit=%s zustimmung=%s",
        _client_ip(request),
        datetime.now(UTC).isoformat(),
        payload.accepted,
    )
    return ChatConsentResponse()


@router.post("/chat/verify", response_model=ChatVerifyResponse)
async def chat_verify(payload: ChatVerifyRequest) -> ChatVerifyResponse:
    """Tauscht ein bestandenes Turnstile-Token gegen ein Chat-Session-Token."""
    if not settings.turnstile_secret_key:
        raise HTTPException(status_code=404, detail="Turnstile ist nicht aktiviert")
    try:
        ok = await verify_turnstile(payload.token)
    except httpx.HTTPError:
        logger.exception("Turnstile-siteverify nicht erreichbar")
        raise HTTPException(
            status_code=502, detail="Verifizierung derzeit nicht möglich"
        ) from None
    if not ok:
        raise HTTPException(
            status_code=403, detail="Turnstile-Verifizierung fehlgeschlagen"
        )
    session_token, expires_at = create_session_token()
    return ChatVerifyResponse(session_token=session_token, expires_at=expires_at)


class ChatEventStream(VercelAIEventStream):
    """Loggt Fehler eines Chat-Runs und schickt dem Client nur CHAT_ERROR_CODE.

    Standardmäßig reicht Pydantic-AI str(exception) an den Browser durch —
    bei OpenAI inklusive Billing-Link und ohne jede Logzeile.
    """

    async def on_error(self, error: Exception) -> AsyncIterator[BaseChunk]:
        # Eine Zeile mit festem Präfix, ohne Freitext/Prompt (greppbar, alarmierbar).
        if upstream := describe_upstream_error(error):
            logger.error(upstream.log_line())
        else:
            logger.error("chat_run_error type=%s", type(error).__name__)
        async for chunk in super().on_error(error):
            yield ErrorChunk(error_text=CHAT_ERROR_CODE) if isinstance(chunk, ErrorChunk) else chunk


class ChatAdapter(VercelAIAdapter):
    def build_event_stream(self) -> ChatEventStream:
        return ChatEventStream(
            self.run_input,
            accept=self.accept,
            sdk_version=self.sdk_version,
            server_message_id=self.server_message_id,
        )


@router.post("/chat")
async def chat(request: Request) -> Response:
    """Streamt Antworten des Website-Assistenten als AI-SDK UI Message Stream (v6, SSE)."""
    if settings.turnstile_secret_key:
        if not verify_session_token(request.headers.get(SESSION_HEADER, "")):
            raise HTTPException(
                status_code=401, detail="Chat-Session ungültig oder abgelaufen"
            )
    return await ChatAdapter.dispatch_request(
        request,
        agent=agent,
        model=chat_model(),
        sdk_version=6,
        usage_limits=CHAT_USAGE_LIMITS,
    )
