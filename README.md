# WisperAway

WisperAway is a permission-based image cleanup and visible-watermark removal application. The product is being implemented from the architecture blueprint and the 2026-09-08 audit.

## Current implementation

Milestone A foundation is in progress:

- `apps/web` — Next.js 16 web application / BFF
- `apps/worker` — FastAPI AI worker foundation
- `packages/contracts` — canonical job, attempt, asset, format, and mask contracts
- `.github/workflows/ci.yml` — web/contracts and worker verification

The upload and AI-processing controls are intentionally not exposed until the required ownership, immutable-media, rate-limit, and durable-processing controls are implemented.

## Local development

### Web

Requirements: Node.js 24.21.0 and pnpm 12.4.1.

```bash
corepack enable
pnpm install
pnpm dev
```

The web health endpoint is `GET /api/health`.

### Worker

Requirements: Python 3.13 and `uv`.

```bash
cd apps/worker
uv sync --extra dev
uv run uvicorn wisperaway_worker.main:app --app-dir src --reload
```

Worker health endpoints:

- `GET /health/live` — process liveness
- `GET /health/ready` — model readiness; returns 503 until the selected model artifact is installed

## Documentation

- [Project blueprint](watermark-removal-blueprint/README.md)
- [Architecture audit](watermark-removal-blueprint/docs/audits/2026-09-08-project-and-architecture-audit.md)
- [Foundation ADR](docs/adr/0006-milestone-a-foundation.md)

## MVP implementation order

1. Foundation and canonical contracts
2. Secure immutable upload/persistence/deletion
3. Manual source-coordinate mask editor
4. Durable real LaMa processing
5. Measured smart/automatic selection

WisperAway is intended only for images the user owns or is authorized to modify.
