# 16 — Repository Structure and File Map

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Provides the target monorepo structure and explains responsibility of major source files.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## 1. Target repository

```text
cleanmark/
├─ apps/
│  ├─ web/
│  │  ├─ src/
│  │  │  ├─ app/
│  │  │  │  ├─ (marketing)/
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ remove-watermark/page.tsx
│  │  │  │  │  ├─ features/page.tsx
│  │  │  │  │  ├─ pricing/page.tsx
│  │  │  │  │  └─ blog/...
│  │  │  │  ├─ (auth)/
│  │  │  │  ├─ (app)/
│  │  │  │  │  ├─ editor/[jobId]/page.tsx
│  │  │  │  │  ├─ history/page.tsx
│  │  │  │  │  └─ settings/...
│  │  │  │  ├─ admin/...
│  │  │  │  ├─ api/...
│  │  │  │  ├─ layout.tsx
│  │  │  │  └─ globals.css
│  │  │  ├─ domain/
│  │  │  │  ├─ job/
│  │  │  │  ├─ image/
│  │  │  │  ├─ mask/
│  │  │  │  ├─ usage/
│  │  │  │  └─ policy/
│  │  │  ├─ features/
│  │  │  │  ├─ upload/
│  │  │  │  ├─ editor/
│  │  │  │  ├─ history/
│  │  │  │  ├─ account/
│  │  │  │  └─ admin/
│  │  │  ├─ components/
│  │  │  │  ├─ ui/
│  │  │  │  └─ layout/
│  │  │  ├─ server/
│  │  │  │  ├─ auth/
│  │  │  │  ├─ repositories/
│  │  │  │  ├─ services/
│  │  │  │  └─ policies/
│  │  │  ├─ lib/
│  │  │  ├─ env.ts
│  │  │  └─ instrumentation.ts
│  │  ├─ public/
│  │  ├─ tests/
│  │  ├─ next.config.ts
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  │
│  └─ ai-worker/
│     ├─ app/
│     │  ├─ main.py
│     │  ├─ api/
│     │  │  ├─ health.py
│     │  │  ├─ process.py
│     │  │  ├─ detect.py
│     │  │  └─ segment.py
│     │  ├─ domain/
│     │  ├─ image_io/
│     │  ├─ detection/
│     │  │  ├─ ocr.py
│     │  │  ├─ grounding.py
│     │  │  └─ merge.py
│     │  ├─ segmentation/
│     │  │  └─ sam2.py
│     │  ├─ providers/
│     │  │  ├─ base.py
│     │  │  ├─ opencv.py
│     │  │  ├─ lama.py
│     │  │  └─ detail.py
│     │  ├─ router/
│     │  │  ├─ complexity.py
│     │  │  └─ policy.py
│     │  ├─ quality/
│     │  ├─ storage/
│     │  ├─ callbacks/
│     │  ├─ telemetry/
│     │  └─ settings.py
│     ├─ tests/
│     ├─ models/README.md
│     ├─ Dockerfile
│     ├─ pyproject.toml
│     └─ uv.lock
│
├─ packages/
│  ├─ db/
│  │  ├─ src/
│  │  └─ migrations/
│  ├─ storage/
│  │  └─ src/r2.ts
│  ├─ queue/
│  │  └─ src/qstash.ts
│  ├─ contracts/
│  │  └─ src/
│  ├─ config/
│  ├─ telemetry/
│  └─ eslint-config/
│
├─ docs/
│  ├─ adr/
│  └─ ...
├─ scripts/
│  ├─ seed.ts
│  ├─ cleanup-dev.ts
│  └─ benchmark/
├─ .github/workflows/
├─ .env.example
├─ pnpm-workspace.yaml
├─ turbo.json
├─ package.json
└─ README.md
```

## 2. Web domain files

### `domain/job/job.types.ts`

Authoritative TS domain types used by ViewModels and server layers.

### `domain/job/job.schema.ts`

Zod validation for API-safe job representations.

### `domain/job/job-state.ts`

Pure transition policy; server remains authoritative.

### `server/repositories/job-repository.ts`

Repository interface and Supabase implementation.

### `server/services/job-service.ts`

Coordinates authorization, quota, attempt creation and queue publish.

## 3. Editor files

### `editor-store.ts`

Only ephemeral editor state; persistence is explicit.

### `mask-command-stack.ts`

Undo/redo.

### `mask-rasterizer.ts`

Converts strokes/shapes into full-resolution mask coordinate system.

### `useEditorViewModel.ts`

High-level editor commands consumed by views.

## 4. Shared contracts

Keep service payload schema in a versioned package:

```text
packages/contracts/src/processing/v1.ts
packages/contracts/src/callback/v1.ts
```

Python should either generate/consume a matching JSON Schema/OpenAPI representation or maintain contract tests to detect drift.

## 5. AI worker organization

Separate:

- transport/API;
- image I/O;
- model adapters;
- routing;
- quality checks;
- storage/callbacks.

This keeps Modal-specific code at the deployment edge rather than inside core inference logic.

## 6. Documentation files to keep in source repository

Beyond this bundle, maintain:

```text
CONTRIBUTING.md
SECURITY.md
PRIVACY_ENGINEERING.md
MODEL_LICENSES.md
MODEL_CARD_WATERMARK_DETECTOR.md
RUNBOOK.md
CHANGELOG.md
API_CHANGELOG.md
```

## 7. Naming rules

- TypeScript filenames: kebab-case.
- React component files: PascalCase if team preference, but be consistent.
- Python modules: snake_case.
- DB tables: snake_case plural.
- Domain events: past tense (`JobQueued`, `ProcessingCompleted`).
- API error codes: SCREAMING_SNAKE_CASE.
