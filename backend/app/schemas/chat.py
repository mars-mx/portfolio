from pydantic import BaseModel, Field


class ChatVerifyRequest(BaseModel):
    """Turnstile-Token aus dem Frontend-Widget."""

    token: str = Field(min_length=1, max_length=4096)


class ChatVerifyResponse(BaseModel):
    """Session-Token für nachfolgende /api/chat-Aufrufe (Header X-Chat-Session)."""

    session_token: str
    expires_at: int
