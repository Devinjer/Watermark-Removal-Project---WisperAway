# 04 — MVVM Frontend Architecture

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Defines a pragmatic MVVM mapping for Next.js/React, state ownership and feature structure.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## 1. Why MVVM here

The editor contains many interactions: brush state, mask versions, zoom/pan, undo/redo, async jobs and server state. MVVM gives a clean boundary between rendering and orchestration without forcing a non-React class architecture.

## 2. Mapping

### Model

Pure application/domain concepts:

```text
src/domain/
  job/
  image/
  mask/
  usage/
  provenance/
  policy/
```

Includes:

- TypeScript types/interfaces.
- Zod schemas.
- Domain validation functions.
- State-transition rules.
- Repository interfaces.
- API response contracts.

### View

React components that focus on rendering and user events:

```text
src/features/editor/views/
  EditorShell.tsx
  CanvasViewport.tsx
  ToolRail.tsx
  ToolOptionsPanel.tsx
  ProcessingPanel.tsx
  BeforeAfterView.tsx
```

Views do not call storage/queue/database SDKs directly.

### ViewModel

Hooks/controllers compose state and commands:

```text
src/features/editor/view-models/
  useEditorViewModel.ts
  useMaskViewModel.ts
  useJobViewModel.ts
  useExportViewModel.ts
```

Example API:

```ts
export interface EditorViewModel {
  job: JobSummary;
  tool: EditorTool;
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  isProcessing: boolean;
  selectTool(tool: EditorTool): void;
  undo(): void;
  redo(): void;
  process(mode: ProcessingMode): Promise<void>;
  deleteJob(): Promise<void>;
}
```

## 3. State ownership

### TanStack Query — server state

Use for:

- job status
- attempts
- account/history
- entitlements
- candidates metadata
- download URL mutation

Do not copy this data into Zustand unless required for a temporary editor transaction.

### Zustand — editor-local state

Use for:

- active tool
- brush size
- zoom/pan
- current mask commands
- undo/redo stack metadata
- UI panel state
- before/after slider position

Do **not** store full-resolution image pixel arrays in Zustand.

### React local state

Use for simple component-local controls, popovers and transient focus/hover state.

### URL state

Use search params for stable shareable editor mode when appropriate, e.g. `?mode=manual`, but never place object keys or secrets in URLs.

## 4. Editor command model

Store mask edits as commands or vector paths where possible rather than taking a new full PNG snapshot after every pointer move.

```ts
interface MaskStroke {
  id: string;
  tool: 'paint' | 'erase';
  points: number[];
  radius: number;
  hardness: number;
}
```

Periodically rasterize to a preview mask; create an authoritative mask PNG only when saving/processing. This reduces memory and makes undo/redo cheap.

## 5. Suggested feature structure

```text
src/features/editor/
  components/
  views/
  view-models/
  stores/
  commands/
  adapters/
  utils/
  tests/
  index.ts
```

## 6. Server/client component boundary

### Server Components

- marketing pages
- dashboard shell
- pricing/docs
- job/history initial data
- account shell

### Client Components

- upload drag/drop interactions
- editor canvas
- tool rail
- before/after slider
- progress poll/SSE subscription
- dialogs requiring local interaction

Keep `"use client"` boundaries low in the tree to avoid shipping server-only code.

## 7. Data-access boundary

Browser code calls only the Next.js BFF except direct R2 presigned PUT/GET.

```text
View → ViewModel → typed BFF client → Route Handler/Server Action → repositories/providers
```

Never expose Supabase service-role, R2 secret keys, QStash token or worker secret to the browser.

## 8. Error model

ViewModels convert transport errors to product errors:

```ts
export type EditorError =
  | { kind: 'unsupported-file'; message: string }
  | { kind: 'upload-failed'; retryable: boolean; message: string }
  | { kind: 'quota'; message: string }
  | { kind: 'processing-failed'; retryable: boolean; code?: string; message: string }
  | { kind: 'expired'; message: string };
```

Views render action-oriented recovery, not raw stack traces.

## 9. Testing MVVM

- Models: pure unit tests.
- ViewModels: hook tests with fake repositories/API clients.
- Views: component tests with mock ViewModels where useful.
- Editor: Playwright pointer/touch tests plus visual regression.

## 10. Anti-patterns

- One global mega-store.
- Canvas implementation coupled directly to fetch calls.
- UI component importing Supabase admin client.
- Full image base64 in React state.
- Server status inferred only from client timer.
- Duplicated business rules between route handlers and ViewModels.
