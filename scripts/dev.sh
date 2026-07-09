#!/usr/bin/env bash
# Startet Backend (FastAPI) und Frontend (Next.js) zusammen.
# Ports bewusst nicht 3000/8000 — auf diesem System meist belegt.
# Override: FRONTEND_PORT=4000 BACKEND_PORT=9000 ./scripts/dev.sh
set -euo pipefail

FRONTEND_PORT="${FRONTEND_PORT:-3210}"
BACKEND_PORT="${BACKEND_PORT:-8210}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Frontend und Backend füreinander konfigurieren
export NEXT_PUBLIC_API_URL="http://localhost:${BACKEND_PORT}"
export CORS_ORIGINS="http://localhost:${FRONTEND_PORT}"

# Lokale Secrets (z. B. OPENAI_API_KEY) aus backend/.env laden, falls vorhanden.
# uv --env-file überschreibt bereits gesetzte Umgebungsvariablen nicht.
UV_ENV_FILE=""
[[ -f "$ROOT/backend/.env" ]] && UV_ENV_FILE="--env-file .env"

echo "▶ Backend  → http://localhost:${BACKEND_PORT}  (Docs: /docs)"
echo "▶ Frontend → http://localhost:${FRONTEND_PORT}"
echo "  (Strg+C beendet beide)"
echo

pids=()
cleanup() {
  trap - INT TERM EXIT
  echo
  echo "⏹  Stoppe Stack…"
  kill "${pids[@]}" 2>/dev/null || true
  wait 2>/dev/null || true
}
trap cleanup INT TERM EXIT

# --reload-include: auch Änderungen an der Wissensbasis (knowledge/*.md) neu laden.
( cd "$ROOT/backend"  && exec uv run $UV_ENV_FILE uvicorn app.main:app --reload --reload-include '*.md' --port "$BACKEND_PORT" ) &
pids+=("$!")

( cd "$ROOT/frontend" && exec pnpm dev --port "$FRONTEND_PORT" ) &
pids+=("$!")

# Beendet sich einer der beiden, läuft cleanup über den EXIT-Trap.
wait -n
