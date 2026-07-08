# MX Digital — Dev-Stack
# Ports bewusst nicht 3000/8000 (auf diesem System meist belegt).
# Override z.B.: make dev FRONTEND_PORT=4000 BACKEND_PORT=9000

FRONTEND_PORT ?= 3210
BACKEND_PORT  ?= 8210
export FRONTEND_PORT BACKEND_PORT

.PHONY: help install dev backend frontend build stop

help:
	@echo "make install   – Abhängigkeiten installieren (uv sync + pnpm install)"
	@echo "make dev       – Backend + Frontend zusammen starten (Strg+C beendet beide)"
	@echo "make backend   – nur Backend"
	@echo "make frontend  – nur Frontend"
	@echo "make build     – Frontend Production-Build"
	@echo "make stop      – Prozesse auf den Ports beenden"
	@echo ""
	@echo "Ports: Frontend=$(FRONTEND_PORT)  Backend=$(BACKEND_PORT)"
	@echo "Override: make dev FRONTEND_PORT=4000 BACKEND_PORT=9000"

install:
	cd backend && uv sync
	cd frontend && pnpm install

dev:
	./scripts/dev.sh

backend:
	cd backend && CORS_ORIGINS=http://localhost:$(FRONTEND_PORT) \
		uv run uvicorn app.main:app --reload --port $(BACKEND_PORT)

frontend:
	cd frontend && NEXT_PUBLIC_API_URL=http://localhost:$(BACKEND_PORT) \
		pnpm dev --port $(FRONTEND_PORT)

build:
	cd frontend && NEXT_PUBLIC_API_URL=http://localhost:$(BACKEND_PORT) pnpm build

stop:
	@-lsof -ti tcp:$(FRONTEND_PORT) | xargs kill 2>/dev/null || true
	@-lsof -ti tcp:$(BACKEND_PORT)  | xargs kill 2>/dev/null || true
	@echo "Ports $(FRONTEND_PORT)/$(BACKEND_PORT) freigegeben."
