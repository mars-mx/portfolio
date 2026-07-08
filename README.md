# MX Digital

Persönliche Developer-Homepage von Marius Schäffer ([mxdigital.de](https://mxdigital.de)).
Clean, plain, GitHub-artig — mit Light/Dark Mode.

Konzept & Architektur: siehe [docs/concept.md](docs/concept.md).

## Struktur

```
mxdigital/
├── docs/concept.md   # Grundkonzept
├── frontend/         # Next.js 16, TypeScript, Tailwind v4, shadcn/ui, MagicUI
└── backend/          # FastAPI (uv), Kontakt- & Health-API
```

## Stack

- **Frontend:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · MagicUI (Framer Motion) · next-themes
- **Backend:** FastAPI · Pydantic · uvicorn · uv

## Lokal starten

Einmalig Abhängigkeiten installieren, dann den Stack starten:

```bash
make install   # uv sync + pnpm install
make dev       # Backend + Frontend zusammen, Strg+C beendet beide
```

- **Frontend** → http://localhost:3210
- **Backend**  → http://localhost:8210 (API-Docs: `/docs`)

Die Ports sind bewusst nicht 3000/8000. Überschreiben:

```bash
make dev FRONTEND_PORT=4000 BACKEND_PORT=9000
```

Weitere Targets: `make backend`, `make frontend`, `make build`, `make stop`
(siehe `make help`). `make dev` setzt `NEXT_PUBLIC_API_URL` und `CORS_ORIGINS`
automatisch passend zu den gewählten Ports.

## Nächste Schritte

Siehe Roadmap in [docs/concept.md](docs/concept.md#9-roadmap) — u.a. Inhalte für
Über mich / Impressum / Datenschutz migrieren und den Mailversand des
Kontaktformulars anbinden.
