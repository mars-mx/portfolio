# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal developer homepage of Marius Schäffer (mxdigital.de). Monorepo with a Next.js frontend and a FastAPI backend. All site content and UI copy is **German** (routes: `/ueber-mich`, `/impressum`, `/datenschutz`, `/profil`). Design concept, API contract, and roadmap live in `docs/concept.md` — the guiding aesthetic is "GitHub profile page as a personal brand": neutral zinc palette, 1px borders instead of shadows, subtle motion, content over effect.

## Commands

Frontend uses **pnpm**, backend uses **uv**. Orchestration via the root Makefile:

```bash
make install    # uv sync + pnpm install
make dev        # backend + frontend together (scripts/dev.sh), Ctrl+C stops both
make backend    # backend only (uvicorn --reload)
make frontend   # frontend only
make build      # frontend production build
make knowledge  # regenerate backend/knowledge/website-*.md from frontend/src/lib
make index      # build/refresh the embedding index (backend/.cache/, also for Docker builds)
make stop       # kill processes on both ports
```

- **Ports are deliberately NOT 3000/8000** (usually taken on this machine): frontend → `3210`, backend → `8210` (API docs at `/docs`). Override: `make dev FRONTEND_PORT=4000 BACKEND_PORT=9000`.
- `make dev`/`make backend`/`make frontend` automatically set `NEXT_PUBLIC_API_URL` and `CORS_ORIGINS` to match the chosen ports — if you start the servers manually instead, you must set these yourself or chat requests fail CORS.
- Backend make targets load `backend/.env` via `uv run --env-file` (already-set env vars win). Secrets like `OPENAI_API_KEY` live there locally; the app itself has no dotenv code — SDKs read keys straight from the process environment.
- Lint: `cd frontend && pnpm lint` (ESLint 9 + eslint-config-next). No Python linter is configured.
- There is **no test suite** in either package.

## Commit Style

Use **Conventional Commits**: `type(scope): description` — e.g. `feat(frontend): add projekte section`, `fix(backend): validate contact payload`. Common types: `feat`, `fix`, `refactor`, `docs`, `chore`, `style`. Scope is typically `frontend`, `backend`, or omitted for repo-wide changes.

## Architecture

### Frontend (`frontend/` — Next.js 16 App Router, TypeScript, Tailwind v4)

- **Content lives as data, not in pages.** `src/lib/site.ts` holds site config (name, tagline, nav, social links); `src/lib/profile.ts` holds the full profile content (services, projekte, werdegang, ausbildung, techStack). This data is consumed by both the HTML pages **and** the PDF — edit content there, not in the page components.
- **PDF generation:** `src/app/profil.pdf/route.ts` is a route handler that renders `src/components/profil-pdf.tsx` server-side via `@react-pdf/renderer`, using the local Geist TTFs in `src/fonts/`. The `/profil` page is the HTML counterpart of the same data.
- **Contact:** there is no contact page/form — the "Kontakt" entries (hero CTA + header) open `src/components/contact-menu.tsx`, a dropdown with WhatsApp and mailto links from `siteConfig`.
- **Chat:** `/chat` renders `src/components/assistant.tsx` (assistant-ui + AI SDK v6 transport) against the backend's `POST /api/chat`. Thread UI lives in `src/components/assistant-ui/`; `knowledge-search-tool.tsx` renders the agent's `search_knowledge` tool calls (sources, scores).
- **UI components:** `src/components/ui/` mixes shadcn/ui primitives and MagicUI effect components (blur-fade, border-beam, dot-pattern, …). shadcn config in `components.json` (style `radix-nova`, base color `neutral`, lucide icons, `@/` aliases). Tailwind v4 has no config file — theme tokens are oklch CSS variables in `src/app/globals.css` (`:root` + `.dark`), dark mode via next-themes and the `@custom-variant dark`.
- **Tailwind v4 / Lightning CSS gotcha:** when writing raw CSS with `backdrop-filter`, put `-webkit-backdrop-filter` **before** the unprefixed property (see `globals.css` glass styles) — the other order breaks the blur in Chrome.

### Backend (`backend/` — FastAPI, Python ≥3.12, uv)

Small and deliberate: `app/main.py` (app entry, CORS middleware, lifespan loads the knowledge index, `GET /api/health`), `app/api/routes.py` (`POST /api/chat` — streams the Pydantic-AI agent as AI SDK UI Message Stream v6; `POST /api/contact` — currently **only logs** the request and has no frontend caller since the contact form was removed), `app/agent/` (Pydantic-AI agent + file-based RAG knowledge base), `app/schemas/contact.py` (Pydantic models), `app/core/config.py` (pydantic-settings loading `.env`; `AI_MODEL` is a provider-agnostic Pydantic-AI model string, default `openai:gpt-5.5`).

- **Knowledge base:** content in `backend/knowledge/*.md` — the `website-*.md` files are **generated** (`make knowledge`, source of truth is `frontend/src/lib/profile.ts`/`site.ts`), hand-written background docs go next to them. Embedding index is a hash-guarded JSON cache in `backend/.cache/` (gitignored, self-seeds on startup). Architecture and rationale: `docs/wissensbasis.md`.
