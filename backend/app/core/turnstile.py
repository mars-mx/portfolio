"""Cloudflare-Turnstile-Verifizierung und signierte Chat-Session-Tokens.

Turnstile-Tokens sind Einweg-Tokens: Cloudflare akzeptiert jedes Token genau
einmal bei siteverify. Damit nicht jede Chat-Nachricht eine neue Challenge
braucht, tauscht das Frontend sein Turnstile-Token einmalig gegen ein
HMAC-signiertes Session-Token (Schlüssel: der Turnstile-Secret-Key), das für
SESSION_TTL_SECONDS alle weiteren /api/chat-Aufrufe autorisiert.
"""

import hmac
import time

import httpx

from app.core.config import settings

SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

# Lebensdauer eines Chat-Session-Tokens. Nach Ablauf antwortet /api/chat mit
# 401 und das Frontend zeigt erneut die Turnstile-Challenge.
SESSION_TTL_SECONDS = 60 * 60


async def verify_turnstile(token: str) -> bool:
    """Prüft ein Turnstile-Token bei Cloudflare (siteverify)."""
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(
            SITEVERIFY_URL,
            data={"secret": settings.turnstile_secret_key, "response": token},
        )
        response.raise_for_status()
        return bool(response.json().get("success"))


def _sign(expires_at: int) -> str:
    return hmac.new(
        settings.turnstile_secret_key.encode(),
        f"chat-session:{expires_at}".encode(),
        "sha256",
    ).hexdigest()


def create_session_token() -> tuple[str, int]:
    """Stellt ein Session-Token aus; gibt (Token, Ablauf als Unix-Zeit) zurück."""
    expires_at = int(time.time()) + SESSION_TTL_SECONDS
    return f"{expires_at}.{_sign(expires_at)}", expires_at


def verify_session_token(token: str) -> bool:
    """Prüft Ablauf und Signatur eines Session-Tokens."""
    expires_str, _, signature = token.partition(".")
    if not expires_str.isdigit() or not signature:
        return False
    expires_at = int(expires_str)
    if expires_at < time.time():
        return False
    return hmac.compare_digest(signature, _sign(expires_at))
