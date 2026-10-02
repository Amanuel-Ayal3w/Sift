.PHONY: dev dev-agent dev-api dev-web install

# Run agent-service, api, and web concurrently.
# Assumes Postgres and Redis are already running locally.
dev:
	@trap 'kill 0' EXIT; \
	( cd agent-service && uv run uvicorn app.main:app --reload --port 8000 ) & \
	( cd api && npm run start:dev ) & \
	( cd web && npm run dev ) & \
	wait

dev-agent:
	cd agent-service && uv run uvicorn app.main:app --reload --port 8000

dev-api:
	cd api && npm run start:dev

dev-web:
	cd web && npm run dev

install:
	cd agent-service && uv sync
	cd api && npm install
	cd web && npm install
