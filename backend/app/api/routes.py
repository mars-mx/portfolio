import logging

import httpx
from fastapi import APIRouter, HTTPException
from pydantic_ai.ui.vercel_ai import VercelAIAdapter
from pydantic_ai.usage import UsageLimits
from starlette.requests import Request
from starlette.responses import Response

from app.agent.assistant import agent
from app.core.config import settings
from app.core.turnstile import (
    create_session_token,
    verify_session_token,
    verify_turnstile,
)
from app.schemas.chat import ChatVerifyRequest, ChatVerifyResponse
from app.schemas.contact import ContactRequest, ContactResponse

# Kostendeckel pro Run: der Endpoint ist öffentlich und unauthentifiziert.
# Begrenzt Tool-Schleifen und Token-Verbrauch einer einzelnen Anfrage;
# Rate-Limiting über Requests hinweg ist Sache des Deployments (Reverse Proxy).
CHAT_USAGE_LIMITS = UsageLimits(request_limit=6, total_tokens_limit=50_000)

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


@router.post("/chat")
async def chat(request: Request) -> Response:
    """Streamt Antworten des Website-Assistenten als AI-SDK UI Message Stream (v6, SSE)."""
    if settings.turnstile_secret_key:
        if not verify_session_token(request.headers.get(SESSION_HEADER, "")):
            raise HTTPException(
                status_code=401, detail="Chat-Session ungültig oder abgelaufen"
            )
    return await VercelAIAdapter.dispatch_request(
        request, agent=agent, sdk_version=6, usage_limits=CHAT_USAGE_LIMITS
    )
