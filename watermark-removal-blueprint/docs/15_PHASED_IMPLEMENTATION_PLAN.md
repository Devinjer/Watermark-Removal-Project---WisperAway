# 15 — Phased Implementation Plan

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Step-by-step build plan with deliverables, files and exit criteria for each phase.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## Phase 0 — Repository and engineering foundation

### Build

1. Create pnpm/Turborepo monorepo.
2. Create `apps/web` Next.js app.
3. Create `apps/ai-worker` Python service.
4. Add shared TypeScript packages.
5. Add formatting/lint/testing.
6. Configure environment validation.
7. Add CI.

### Key files

```text
pnpm-workspace.yaml
turbo.json
package.json
apps/web/package.json
apps/web/next.config.ts
apps/web/src/env.ts
apps/ai-worker/pyproject.toml
apps/ai-worker/Dockerfile
.github/workflows/web-ci.yml
.github/workflows/ai-ci.yml
```

### Exit criteria

- Web preview deploy works.
- AI service health endpoint works.
- CI green.

---

## Phase 1 — Storage, auth, job foundation

### Build

1. Supabase project + migrations.
2. Auth.
3. R2 private bucket.
4. Presigned PUT.
5. Upload intent + job finalize.
6. Image decode validation worker endpoint.
7. Immediate delete.

### Key files

```text
packages/db/migrations/*
packages/storage/src/r2.ts
apps/web/src/app/api/uploads/presign/route.ts
apps/web/src/app/api/jobs/[jobId]/finalize-upload/route.ts
apps/web/src/features/upload/*
apps/ai-worker/app/image_io.py
```

### Exit criteria

- User can upload a valid image directly to R2.
- Invalid/oversized image rejected.
- Job survives browser refresh.
- Delete removes object.

---

## Phase 2 — Manual editor MVP

### Build

1. Konva editor.
2. Brush/eraser/rectangle.
3. Zoom/pan/fit.
4. Undo/redo command stack.
5. Rasterize mask.
6. Upload mask.
7. Before/after shell.

### Key files

```text
apps/web/src/features/editor/views/EditorShell.tsx
apps/web/src/features/editor/components/EditorCanvas.tsx
apps/web/src/features/editor/stores/editor-store.ts
apps/web/src/features/editor/commands/*
apps/web/src/features/editor/view-models/useEditorViewModel.ts
```

### Exit criteria

- User can accurately mask a watermark on desktop/mobile.
- Mask exports at source coordinate resolution.

---

## Phase 3 — LaMa processing pipeline

### Build

1. QStash publish and verification.
2. Processing attempts.
3. AI worker fetches source/mask.
4. LaMa inference.
5. Composite output.
6. R2 output upload.
7. Callback.
8. Polling/SSE job UI.
9. Export.

### Key files

```text
packages/queue/src/qstash.ts
apps/web/src/app/api/jobs/[jobId]/process/route.ts
apps/web/src/app/api/internal/processing-callback/route.ts
apps/ai-worker/app/api/process.py
apps/ai-worker/app/pipelines/inpaint.py
apps/ai-worker/app/providers/lama.py
```

### Exit criteria

- End-to-end manual removal works reliably.
- QStash retry does not duplicate completed attempt.
- Output can be downloaded by authorized user only.

---

## Phase 4 — Smart selection

### Build

1. SAM 2 provider.
2. Click/box prompt endpoint.
3. Candidate mask preview.
4. Add/subtract mask correction.
5. Cache model in GPU image/volume.

### Key files

```text
apps/ai-worker/app/providers/sam2.py
apps/ai-worker/app/api/segment.py
apps/web/src/features/editor/components/SmartSelectOptions.tsx
apps/web/src/features/editor/adapters/segmentation-client.ts
```

### Exit criteria

- User can click a visible logo/object and get a useful editable mask.

---

## Phase 5 — Automatic watermark candidates

### Build

1. PaddleOCR candidate service.
2. Grounding DINO candidates.
3. Candidate merging.
4. SAM 2 refinement.
5. Confidence UI.
6. User confirmation.

### Key files

```text
apps/ai-worker/app/detection/ocr.py
apps/ai-worker/app/detection/grounding.py
apps/ai-worker/app/detection/merge.py
apps/web/src/features/editor/components/AutoDetectPanel.tsx
apps/web/src/features/editor/components/CandidateList.tsx
```

### Exit criteria

- Auto detect is benchmarked and never auto-processes an unreviewed low-confidence large mask.

---

## Phase 6 — Quality router and premium detail mode

### Build

1. Complexity feature extraction.
2. OpenCV route.
3. LaMa default.
4. Detail provider adapter.
5. Fallback policy.
6. Cost/latency telemetry.
7. Quality guard.

### Key files

```text
apps/ai-worker/app/router/complexity.py
apps/ai-worker/app/providers/opencv.py
apps/ai-worker/app/providers/detail.py
apps/ai-worker/app/quality/*
```

### Exit criteria

- Router outperforms “always LaMa” baseline on either cost or quality without unacceptable regressions.

---

## Phase 7 — Production security/privacy

### Build

1. RLS hardening.
2. Rate limiting.
3. CSP/security headers.
4. retention cleanup.
5. account deletion.
6. admin metadata UI.
7. abuse workflow.
8. legal pages.
9. provenance inspection.

### Exit criteria

Security/release gates in document 20 pass.

---

## Phase 8 — Monetization and scale

### Build

- entitlements
- usage ledger/credits
- billing provider
- paid retention
- queue/provider scaling
- model A/B rollout
- public API only if demand exists

### Exit criteria

Financially correct idempotent usage accounting and measured unit economics.

---

## Phase 9 — Custom watermark model

### Build

1. Synthetic generator.
2. Licensed dataset registry.
3. segmentation training pipeline.
4. benchmark.
5. shadow evaluation.
6. canary rollout.

### Exit criteria

Custom model beats existing auto-mask stack on a frozen benchmark and real-user correction rate.

## Recommended implementation order summary

```text
Foundation
→ secure uploads
→ manual editor
→ LaMa removal
→ smart select
→ auto detect
→ routing/detail quality
→ production hardening
→ monetization
→ custom model
```

This order gives a useful product as early as Phase 3.
