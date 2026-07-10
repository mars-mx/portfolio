# syntax=docker/dockerfile:1

# Mirrors the piet-website build (multi-stage, Next.js standalone output).
# Build context is frontend/ — the backend has its own Dockerfile.

# ---- Base -------------------------------------------------------------------
# Pin Node to match the local toolchain (Node 24).
FROM node:24-slim AS base
# Enable the pnpm version declared by corepack; pinned for reproducible installs.
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@11.5.0 --activate
WORKDIR /app

# ---- Dependencies -----------------------------------------------------------
# Install with a cached pnpm store; only re-runs when manifests/lockfile change.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---- Build ------------------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Telemetry off; build the standalone server output.
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_* is inlined at build time — the browser calls the contact API
# under this URL, so it must be passed as a build arg (the workflow sets it
# from the repository variable; in production it is https://mxdigital.de and
# the /api prefix is routed to the backend by the HTTPRoute).
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# Cloudflare-Turnstile-Site-Key: public und konstant pro Domain, daher als
# Default hier committet (kein Secret — er landet ohnehin im Client-JS). Aktiviert
# das Bot-Gate im Chat; das zugehörige Secret bleibt im Backend (TURNSTILE_SECRET_KEY).
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAADzbl7EpQ0HW3Mk-
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
RUN pnpm build

# ---- Runner -----------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Listen on all interfaces so the container is reachable; override PORT at runtime.
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as a non-root user.
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Public assets and the traced standalone bundle (server.js + minimal node_modules).
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
