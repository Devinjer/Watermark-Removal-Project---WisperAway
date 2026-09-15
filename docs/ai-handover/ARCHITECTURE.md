# Architecture

## Existing Architecture

```text
Repository
├── apps/
│   ├── web/       Next.js web/BFF foundation
│   └── worker/    Python FastAPI worker foundation
├── packages/
│   └── contracts/ Shared lifecycle/media contracts
├── docs/
├── watermark-removal-blueprint/
└── .github/workflows/ci.yml
```

### Existing runtime boundaries

1. **Web/BFF** — presentation, future authentication/API orchestration and signed-media control.
2. **AI worker** — independent Python runtime for future image processing.

No independent detection/billing/provenance microservices exist yet. This is intentional.

## Current Data/Control Flow

Only health and foundation behavior exist. Upload/database/queue/inference are not yet wired.

## Proposed Milestone B Flow

```text
Browser
  → Web/BFF: create job + upload intent
  → R2: PUT into private staging key
  → Web/BFF: finalize exact bytes
  → safe image decode/validation
  → server-controlled immutable canonical key
  → PostgreSQL asset record + expiry
```

## Proposed Milestone D Processing Flow

```text
Web transaction
  → create attempt
  → reserve usage
  → create outbox event
Dispatcher
  → QStash
Worker
  → authenticate delivery
  → atomically claim/fence attempt
  → download immutable source + mask
  → LaMa
  → upload candidate result
  → publish only if fence/job still valid
  → callback/reconciliation
```

## Architectural Rules

- At-least-once delivery + idempotent effects, never pretend exactly-once GPU execution.
- Accepted media is immutable.
- Retry/regeneration creates a new attempt.
- Prior successful results remain usable if a later attempt fails.
- Retention belongs to individual assets, not a single job expiry.
- Model-specific code remains behind an adapter boundary.
