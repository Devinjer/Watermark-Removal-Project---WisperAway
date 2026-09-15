# Technical Decisions

## Two deployable runtimes for MVP

**Decision:** Next.js web/BFF + Python FastAPI AI worker.

**Status:** ACTIVE

**Reason:** Keeps GPU/ML dependencies isolated without premature microservice fragmentation.

## WisperAway canonical product name

**Status:** ACTIVE

All new source/deployment/UI labels should use WisperAway.

## `/app/*` product namespace

**Status:** ACTIVE

Authenticated application routes will use `/app/*`.

## MVP formats

**Decision:** JPEG, PNG, WebP. AVIF deferred until validated.

**Status:** ACTIVE

## Attempt lifecycle separated from job lifecycle

**Status:** ACTIVE

Retries/regenerations create new immutable attempts.

## Mask contract

**Decision:** 8-bit single-channel PNG; `0 = preserve`, `255 = remove`; coordinate-space version 1.

**Status:** ACTIVE

## Toolchain compatibility

**Decision:** TypeScript 6.0.3 and ESLint 9.39.5 for the current Next.js lint stack.

**Status:** ACTIVE, REVISIT when upstream compatibility changes.

## AI model selection

**Decision:** Exact LaMa checkpoint/runtime remains deliberately unselected during Milestone A. Worker readiness fails while a required model is absent.

**Status:** REVISIT in Milestone D after license/runtime/benchmark validation.
