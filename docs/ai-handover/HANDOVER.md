# Project Handover

## Project Name
WisperAway

## Current Objective
Build a secure, recoverable manual image-cleanup workflow before smart/automatic watermark detection.

## User's Final Goal
A production-quality web application that can remove visible watermarks, logos, text overlays and unwanted image elements from images the user owns or is authorized to modify. The intended stack is Next.js/TypeScript/Node for the web/BFF and a separate Python AI worker, with private object storage, asynchronous processing, and eventually LaMa + smart detection models.

## Current Status

- Project builds: **VERIFIED**
- Web lint/typecheck/tests/build: **VERIFIED in GitHub Actions**
- Worker lint/typecheck/tests/compile: **VERIFIED in GitHub Actions**
- Application launches locally: **NOT VERIFIED in this session**
- Secure upload: **NOT IMPLEMENTED**
- Manual editor: **NOT IMPLEMENTED**
- Real AI inference: **NOT IMPLEMENTED**
- CI/CD checks: **VERIFIED**
- Deployment: **NOT IMPLEMENTED**

## What Was Completed

- Created executable monorepo foundation.
- Added Next.js web/BFF shell and health endpoint.
- Added FastAPI worker foundation with distinct liveness/readiness behavior.
- Added shared MVP image, asset, mask, job and processing-attempt contracts.
- Added canonical attempt transition tests.
- Added environment template and initial implementation ADR.
- Added GitHub Actions CI for web/contracts and worker.
- Opened PR #1 from `build/milestone-a-foundation` to `main`.
- Fixed pnpm 12 ignored-build policy issue.
- Fixed TypeScript 7 incompatibility with current typescript-eslint stack by pinning TypeScript 6.0.3.
- Fixed ESLint 10 incompatibility with the current React ESLint plugin by pinning ESLint 9.39.5.

## Most Important Discoveries

1. The repository began as documentation-only; Milestone A created the first executable application.
2. pnpm 12 reads build-policy configuration from `pnpm-workspace.yaml`, not the old `package.json#pnpm.onlyBuiltDependencies` location.
3. Current `eslint-config-next` dependencies in this stack do not yet support TypeScript 7 through typescript-eslint.
4. ESLint 10 is not compatible with the installed React plugin API; ESLint 9.39.5 is working.
5. Worker readiness intentionally fails when a required model artifact is not selected/available; this prevents false-ready deployments.

## Current Blockers

No Milestone A CI blocker remains. Milestone B requires external Supabase/R2 credentials for real integration testing, but schema, interfaces and local test doubles can be implemented without production credentials.

## Recommended Next Action

Begin Milestone B: database migrations and RLS first, then upload-intent + staged R2 object flow, exact-byte image validation, immutable canonical promotion, asset-level retention, Delete Now and rate limiting.

## Critical Warnings for Next Agent

- Do not merge PR #1 unless the user explicitly requests it.
- Do not expose a working upload control before ownership, validation and immutable-media controls exist.
- Do not add SAM 2/OCR/Grounding DINO before the manual workflow is operational.
- Do not claim LaMa works until a specific checkpoint/runtime is selected and real inference is measured.
- Retry/regeneration must create new immutable processing attempts; do not mutate successful attempts back into processing.
