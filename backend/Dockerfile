# syntax=docker/dockerfile:1

# FastAPI backend (contact API). Deps are resolved from the committed uv.lock
# in a builder stage; the runner only ships the venv + app code, no uv.

# ---- Builder ----------------------------------------------------------------
FROM python:3.13-slim AS builder
# Pinned uv to match the local toolchain; bump together with Homebrew.
COPY --from=ghcr.io/astral-sh/uv:0.11 /uv /bin/uv
WORKDIR /app
# Bytecode-compile for faster cold starts; copy (not link) out of the cache
# mount so the venv survives without it.
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev --no-install-project

# ---- Runner -----------------------------------------------------------------
FROM python:3.13-slim AS runner
ENV PYTHONUNBUFFERED=1
WORKDIR /app

# Run as a non-root user.
RUN addgroup --system --gid 1001 apigroup \
    && adduser --system --uid 1001 api

COPY --from=builder /app/.venv ./.venv
COPY app ./app
ENV PATH="/app/.venv/bin:$PATH"

USER api
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
