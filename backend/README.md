# MX Digital — Backend (FastAPI)

API für die MX-Digital-Homepage. Aktuell: Healthcheck und Kontaktformular.

## Entwicklung

```bash
# Abhängigkeiten installieren
uv sync

# Dev-Server (Hot Reload) auf http://localhost:8000
uv run fastapi dev app/main.py

# Interaktive API-Docs: http://localhost:8000/docs
```

## Endpoints

| Methode | Pfad           | Zweck |
|---------|----------------|-------|
| GET     | `/api/health`  | Healthcheck |
| POST    | `/api/contact` | Kontaktformular (name, email, message) |

## Konfiguration

`.env` (siehe `.env.example`):

- `CORS_ORIGINS` — Komma-separierte erlaubte Frontend-Origins
