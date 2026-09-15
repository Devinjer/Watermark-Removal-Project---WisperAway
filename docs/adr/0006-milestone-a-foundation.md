# ADR 0006 — Milestone A executable foundation

- Status: Accepted
- Date: 2026-09-15

## Context

The 2026-09-08 architecture audit found that WisperAway contained specifications but no executable application. It also identified conflicting job states, premature service decomposition, and an unvalidated AI runtime.

## Decision

1. Use two deployable runtimes for the MVP: a Next.js web/BFF and a Python FastAPI worker.
2. Use `/app/*` for authenticated product routes when those routes are introduced.
3. Limit MVP uploads to JPEG, PNG, and WebP until AVIF is tested end to end.
4. Separate job lifecycle from immutable processing-attempt lifecycle. Retry/regeneration creates a new attempt.
5. Keep AI model selection explicit. Worker readiness fails while the required model version/artifact is unavailable.
6. Defer SAM 2, OCR, Grounding DINO, diffusion, billing, and other non-core services until the manual workflow is verified.

## Consequences

The repository becomes runnable without pretending that inference exists. Milestone B can add secure storage/persistence against stable contracts, while Milestone D can select and pin the exact LaMa artifact before enabling real processing.
