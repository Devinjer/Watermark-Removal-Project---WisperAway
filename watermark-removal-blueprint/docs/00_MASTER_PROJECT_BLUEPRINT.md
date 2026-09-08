# 00 — Master Project Blueprint

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Single executive specification defining the product, architecture, boundaries and build strategy.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## Executive summary

The product is an **authorized visual-cleanup web application** focused on removing visible watermarks and overlays from images. The first release should optimize for reliability and user control rather than claiming one-click perfection. A user can upload an image, confirm authorization, automatically or manually create a removal mask, run an inpainting engine, compare before/after, correct the mask if necessary, and export the result.

The project is feasible because the difficult computer-vision tasks already have strong open-source building blocks. The engineering challenge is less about inventing a novel model on day one and more about **mask quality, model routing, image fidelity, latency, GPU economics, abuse resistance and a polished editor**.

## Product thesis

Users usually do not need a complicated Photoshop workflow; they need a narrow flow:

```text
Upload → Find mark → Correct selection → Remove → Compare → Export
```

The app wins when this takes seconds, preserves untouched pixels, works well on text/logo/repeating overlays, and gives users a manual escape hatch when automatic detection is uncertain.

## Product boundaries

### Included

- Visible text watermark removal from authorized images.
- Visible logo/brand-overlay removal from authorized images.
- Visible overlays on AI-generated images when the user is permitted to edit the image.
- Manual brush/lasso/rectangle masking.
- Smart click-to-select.
- Automatic candidate detection with confidence scoring.
- Fast/standard/detail processing modes.
- Before/after comparison.
- Export to JPEG, PNG and WebP; AVIF can be added after compatibility testing.
- Temporary/ephemeral processing by default.
- User history for signed-in users when explicitly enabled.
- Preservation/inspection of provenance metadata where practical.

### Explicitly out of scope for V1

- Video watermark removal.
- Hidden/invisible watermark removal.
- C2PA or rights-management-information stripping.
- PDF/document watermark removal.
- Guaranteed recovery of the original obscured pixels.
- Public image URL ingestion; direct uploads only in V1 to avoid SSRF and unclear ownership.
- Batch processing for anonymous users.
- Native mobile apps.

## Core architectural decision

Use a **hybrid modular-monolith + isolated inference service**:

```text
Browser
  │
  ├── Next.js Web/BFF ── Supabase Postgres/Auth
  │       │
  │       ├── R2 signed upload/download URLs
  │       ├── QStash/Workflow orchestration
  │       └── Usage, policy, job state, audit metadata
  │
  └── Direct upload/download ↔ Cloudflare R2
                              │
                              ▼
                    Python AI Processing Service
                    OpenCV / LaMa / OCR / DINO / SAM2
                              │
                              ▼
                        Output → R2
```

This keeps the Next.js application responsive and prevents large ML dependencies from entering the serverless bundle. Vercel functions currently allow substantial runtime compared with earlier years, but the request/response payload limit and lack of GPUs still make them the wrong place for production inference.

## Technology baseline

### Product application

- Next.js 16.3.x Active LTS
- React version supported by that Next.js release
- TypeScript strict mode
- Node.js 24 LTS
- Tailwind CSS 4.x
- shadcn/ui primitives
- TanStack Query for server state
- Zustand for editor-local state
- React Hook Form + Zod for forms/contracts
- Konva.js for V1 image editor canvas
- Sharp for server-side metadata/thumbnail/format operations

### Data and infrastructure

- Supabase Postgres + Auth
- Cloudflare R2 private bucket(s)
- Upstash QStash and/or Workflow
- Upstash Redis for rate limits and lightweight idempotency keys
- Modal for MVP GPU workers
- RunPod as scale/price benchmark alternative
- Sentry for errors/traces
- PostHog or equivalent for product analytics
- GitHub Actions for CI/CD

### AI worker

- Python 3.12 or 3.13 after compatibility validation
- FastAPI
- PyTorch
- OpenCV
- Pillow
- LaMa / IOPaint-compatible erase pipeline
- PaddleOCR for text candidates
- Grounding DINO for open-vocabulary watermark/logo candidates
- SAM 2 for mask refinement
- Hugging Face Diffusers adapter for optional detail-quality fallback

## Why not “pure microservices” now?

A full microservice topology introduces distributed tracing, deployment coordination, retries, schema/version compatibility, secrets, networking and cost before the product has validated traffic. The intended evolution is:

1. **V1:** web/BFF + AI worker.
2. **V1.5:** optional detector service if it has different scaling needs.
3. **V2:** independent inference-router and model workers.
4. **Scale:** billing/usage, cleanup and admin analytics may become independent services if ownership or load warrants it.

## Quality principle

The system must preserve all unmasked pixels exactly whenever possible. Generative models should be used only inside the intended mask, with output composited back onto the original image. The user should be able to inspect the mask at all times.

## Processing hierarchy

1. Analyze image and mask.
2. Try deterministic/low-cost OpenCV only for tiny low-complexity regions.
3. Use LaMa as the default eraser.
4. Route difficult semantic regions to a higher-quality inpaint adapter.
5. Run artifact checks.
6. Composite only the processed mask region back into the original.

## Success metrics

### Product

- Upload completion rate ≥ 98% for supported images.
- Processing job success ≥ 97% excluding invalid/abusive inputs.
- First useful result without manual correction ≥ 80% in the early auto-detect release, then improve.
- Manual-editor completion rate ≥ 85%.
- P95 API orchestration latency under 500 ms excluding upload/inference.

### Model

- High recall is favored for candidate detection, but auto-selected masks must not silently cover large unrelated areas.
- Track mask IoU/F1 on a labeled benchmark.
- Track LPIPS/SSIM/PSNR on synthetic images where clean ground truth exists.
- Maintain a human quality score for real photos because reference metrics alone are insufficient.

## Product safety and authorization

Before processing, require a clear affirmation such as:

> I own this image or have permission to modify it, and I understand this service is not intended to remove rights-management information without authorization.

Do not market the product as a way to bypass licensing restrictions. Add terms, acceptable-use rules, abuse handling and a complaint process before public launch.

## V1 release definition

A V1 is complete when a user can:

1. upload an eligible image directly to private object storage;
2. create or edit a mask using brush/eraser/rectangle;
3. submit a reliable asynchronous job;
4. receive a LaMa-based result;
5. compare before/after;
6. regenerate after adjusting the mask;
7. download the result through a short-lived signed URL;
8. delete source/mask/output immediately;
9. use the experience from desktop and touch devices;
10. receive clear failures without losing the editor state.
