from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Anwendungseinstellungen, geladen aus Umgebungsvariablen / .env."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "MX Digital API"
    version: str = "0.1.0"

    # Komma-separierte Liste erlaubter Frontend-Origins für CORS.
    cors_origins: str = "http://localhost:3000"

    # Provider-agnostischer Pydantic-AI-Modellstring ("<provider>:<modell>").
    # Der zugehörige API-Key kommt aus der Prozessumgebung (z. B. OPENAI_API_KEY).
    ai_model: str = "openai:gpt-5.5"

    # OpenAI-Embedding-Modell für die Wissensbasis-Suche.
    embedding_model: str = "text-embedding-3-small"

    # Native Websuche des Modells als Agent-Capability. Braucht bei OpenAI
    # freigeschaltete Hosted Tools (Org-Einstellung), sonst schlägt jede
    # Chat-Anfrage mit 400 fehl — deshalb Opt-in.
    web_search: bool = False

    # Cloudflare-Turnstile-Secret-Key. Sobald gesetzt, verlangt /api/chat eine
    # bestandene Turnstile-Challenge (Token-Tausch über /api/chat/verify);
    # leer = Schutz aus. Das Frontend braucht dann den passenden Site Key
    # (NEXT_PUBLIC_TURNSTILE_SITE_KEY).
    turnstile_secret_key: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
