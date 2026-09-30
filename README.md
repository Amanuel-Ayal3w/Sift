# Sift

Sift is a multi-tenant SaaS platform that uses an AI agent to qualify inbound sales leads in real time. Instead of following fixed rules, the agent reasons over each lead — scoring it against org-specific criteria and drafting a personalized reply — before routing it to the right pipeline stage. Built with a NestJS + GraphQL API, a dedicated FastAPI agent service, async processing via BullMQ, and a Next.js dashboard.

## Status

Actively in development; tracked phase-by-phase in Linear (team `Sift`). Rough state as of the last pass:

| Area | State |
|---|---|
| Auth, multi-tenant data model, GraphQL API | Built and verified end-to-end, including tenant isolation between orgs |
| Lead ingestion → persist NEW → BullMQ → agent qualification → REVIEWED | Built — webhook saves the row immediately, then the worker scores it |
| Agent service scoring + draft reply (OpenAI) | Built, including optional Clearbit enrichment (skipped if no key / lookup fails) |
| Company enrichment | Built — Clearbit by company domain, or email host if domain is missing |
| Real-time dashboard updates (GraphQL subscriptions) | Built — `leadUpdated` over `graphql-ws` |
| Web dashboard UI | Wired to NestJS GraphQL (queries, mutations, live lead updates) |
| Public demo path, deployment, portfolio packaging | Not started |

## Architecture

```
web/            Next.js dashboard + landing/auth pages
api/            NestJS + GraphQL — auth, multi-tenant data (Prisma/Postgres),
                lead ingestion webhook, BullMQ queue/worker
agent-service/  FastAPI — POST /leads/qualify, scores a lead against an
                org's criteria and drafts a reply (OpenAI)
```

Flow: an inbound lead is POSTed to a per-workspace webhook URL on `api` → validated and saved as `NEW` (responds `202` immediately) → a BullMQ worker loads the workspace's criteria, calls `agent-service`, updates the lead to `REVIEWED`, and publishes `leadUpdated` → the dashboard reads it via GraphQL and stays live over a WebSocket subscription.

## Getting started

### Prerequisites

- Node.js 22+, npm
- Python 3.12+, [uv](https://docs.astral.sh/uv/)
- Postgres and Redis reachable locally (see below for two ways to get these)
- An OpenAI API key (for `agent-service`)

### 1. Postgres + Redis

Either run both via Docker:

```bash
docker compose up -d
```

or, if Docker isn't an option (e.g. limited memory), run a userspace Postgres instance directly:

```bash
initdb -D ~/.local/share/sift-pg -U sift --auth-local=trust --auth-host=trust
pg_ctl -D ~/.local/share/sift-pg -l ~/.local/share/sift-pg/server.log -o "-p 5433 -k /tmp" start
createdb -h localhost -p 5433 -U sift Sift
```

(and point `DATABASE_URL` in `api/.env` at `postgresql://sift@localhost:5433/Sift`). Redis just needs `redis-server` running locally with defaults.

### 2. agent-service

```bash
cd agent-service
cp .env.example .env   # fill in OPENAI_API_KEY
uv sync
uv run uvicorn app.main:app --port 8000
```

### 3. api

```bash
cd api
cp .env.example .env   # adjust DATABASE_URL if not using the docker-compose default
npm install
npx prisma migrate dev
npm run start:dev
```

GraphQL playground: `http://localhost:3001/graphql`.

### 4. web

```bash
cd web
cp .env.example .env
npm install
npm run dev
```

Dashboard at `http://localhost:3000` — sign in and the inbox is live against `api`.

## Repo layout

- `web/` — Next.js app (landing, auth, dashboard)
- `api/` — NestJS + GraphQL API, Prisma schema, BullMQ queue/worker
- `agent-service/` — FastAPI agent service (lead scoring + draft reply)
- `docker-compose.yml` — local Postgres + Redis
