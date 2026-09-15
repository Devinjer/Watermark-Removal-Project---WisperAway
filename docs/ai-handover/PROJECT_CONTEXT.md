# Project Context

## Project Description

WisperAway is a permission-based image cleanup and visible-watermark removal web application.

## Main Goal

Deliver a private, secure, maintainable workflow:

`upload → validate → immutable source → manual mask → durable processing attempt → AI inpaint → compare/regenerate → download → delete`.

## Functional Requirements

### MVP
- JPEG, PNG and WebP upload.
- Explicit authorization acknowledgement.
- Private media storage.
- Manual mask editor: brush, mask eraser, rectangle, pan, zoom, undo, redo.
- Durable processing jobs and retries.
- Real LaMa inpainting after the runtime is selected/pinned.
- Before/after comparison.
- Regenerate without destroying a prior successful result.
- Short-lived authorized download.
- Delete all related media.

### Later
- SAM 2 smart selection.
- PaddleOCR + Grounding DINO proposals.
- Automatic overlay detection and confidence scores.
- Intelligent engine routing.
- Monetization only after measured compute economics.

## Non-Functional Requirements

### Security
- Private storage.
- Immutable accepted source/mask assets.
- Database-level ownership constraints and RLS.
- Queue/callback authentication.
- Rate limits and compute quotas before public inference.
- No user-controlled server ownership fields.

### Privacy
- Minimal retention.
- Asset-level expiry.
- History opt-in by default.
- User-triggered deletion.

### Reliability
- At-least-once queue delivery with idempotent side effects.
- Transactional outbox.
- Attempt leasing/fencing.
- Reconciliation for missing callbacks/late results.

### UI/UX
- Dark-first premium technical interface.
- Accessible contrast, keyboard behavior and responsive editor layouts.
- No fake AI controls.

## Technology Stack

### Existing foundation
- Node.js 24.21.0
- pnpm 12.4.1
- Turborepo 2.10.13
- Next.js 16.3.5
- React 19.2.8
- TypeScript 6.0.3
- Tailwind CSS 4.3.3
- ESLint 9.39.5 + eslint-config-next 16.3.5
- Zod 4.6.5
- Vitest 5.0.0
- Python 3.13
- FastAPI 0.141.1
- pydantic-settings 2.15.0
- Uvicorn 0.52.4
- Ruff 0.16.7
- mypy 2.3.1
- pytest 9.1.1

### Planned integrations
- Supabase PostgreSQL/Auth
- Cloudflare R2
- Upstash QStash/Workflow
- Upstash Redis rate limiting
- LaMa inference

## Explicit Constraints

- Use WisperAway consistently as the product name.
- Authenticated product routes will live under `/app/*`.
- Do not prematurely split into many deployable microservices.
- Do not support AVIF until actual end-to-end codec behavior is verified.
- Do not silently strip or misrepresent provenance metadata.
- Product is intended only for images the user owns or has permission to modify.
