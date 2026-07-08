import logging

from fastapi import APIRouter

from app.schemas.contact import ContactRequest, ContactResponse

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
