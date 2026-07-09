import logging

from fastapi import APIRouter
from pydantic_ai.ui.vercel_ai import VercelAIAdapter
from pydantic_ai.usage import UsageLimits
from starlette.requests import Request
from starlette.responses import Response

from app.agent.assistant import agent
from app.schemas.contact import ContactRequest, ContactResponse

# Kostendeckel pro Run: der Endpoint ist öffentlich und unauthentifiziert.
# Begrenzt Tool-Schleifen und Token-Verbrauch einer einzelnen Anfrage;
# Rate-Limiting über Requests hinweg ist Sache des Deployments (Reverse Proxy).
CHAT_USAGE_LIMITS = UsageLimits(request_limit=6, total_tokens_limit=50_000)

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


@router.post("/chat")
async def chat(request: Request) -> Response:
    """Streamt Antworten des Website-Assistenten als AI-SDK UI Message Stream (v6, SSE)."""
    return await VercelAIAdapter.dispatch_request(
        request, agent=agent, sdk_version=6, usage_limits=CHAT_USAGE_LIMITS
    )
