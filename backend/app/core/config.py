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

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
