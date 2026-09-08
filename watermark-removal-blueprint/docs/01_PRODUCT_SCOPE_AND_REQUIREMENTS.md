# 01 — Product Scope and Requirements

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Defines personas, use cases, functional requirements, constraints and acceptance criteria.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## 1. Product positioning

**Category:** AI-assisted image cleanup / authorized watermark removal.  
**Primary value:** remove a visible unwanted overlay while preserving the rest of the image.  
**Primary UX promise:** user control first; automation second.

## 2. User personas

### A. Creator / marketer
Owns campaign assets or AI-generated assets and needs to remove obsolete text, draft marks or owned logos before republishing.

### B. Photographer / designer
Owns source photos and wants to clean overlays, timestamp text, test-watermarks or client-proof marks after approval.

### C. E-commerce / operations user
Owns catalog imagery and needs a lightweight cleanup flow for old store labels or internal overlays.

### D. Developer / API customer — later phase
Wants programmatic authorized cleanup with a documented asynchronous API and predictable limits.

## 3. Jobs to be done

- “I know exactly where the mark is; let me paint it and remove it.”
- “I can click the logo; select the correct region for me.”
- “Find likely text/logos automatically and let me confirm.”
- “Let me compare the result without losing the original.”
- “If the result looks wrong, let me modify the mask and retry.”
- “Delete my images immediately after I finish.”

## 4. Functional requirements

### FR-001 Upload

- Drag/drop and file picker.
- Supported V1 formats: JPEG, PNG, WebP.
- Optional AVIF support after end-to-end browser/worker tests.
- Direct-to-R2 PUT using a short-lived presigned URL.
- File-size and dimension validation before signed URL issuance and after upload.
- Configurable V1 defaults: 20 MB maximum, 40 megapixels maximum, 128 px minimum on shortest side.
- Preserve the original upload object until the retention policy expires or the user deletes it.

### FR-002 Authorization acknowledgement

- User must confirm they own or are authorized to modify the image.
- Checkbox must be explicit, not pre-selected.
- Save only the acknowledgement timestamp and policy version, not an inference about copyright ownership.

### FR-003 Manual selection

Tools:

- Smart brush
- Mask eraser
- Rectangle
- Lasso — Phase 2 if implementation cost is high
- Undo/redo
- Brush-size control
- Mask overlay opacity
- Expand/shrink mask
- Feather mask
- Clear mask

### FR-004 Smart selection

- Click/box prompt into SAM 2.
- Display proposed mask before processing.
- User can add/subtract regions.
- Multiple disjoint selections supported.

### FR-005 Automatic detection

Candidate sources:

- PaddleOCR text regions
- Grounding DINO prompts such as watermark, logo, text overlay, signature
- Repeating-text grouping
- SAM 2 refinement

Each candidate must include:

```ts
interface WatermarkCandidate {
  id: string;
  type: 'text' | 'logo' | 'signature' | 'repeating' | 'unknown';
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
  maskObjectKey?: string;
  source: 'ocr' | 'grounding_dino' | 'combined' | 'manual';
}
```

### FR-006 Processing quality modes

- **Fast:** OpenCV for tiny/simple masks where classifier permits.
- **Standard:** LaMa default.
- **Detail:** provider-routed diffusion/inpainting for difficult areas.
- System can override unsafe/incompatible choices and explain why.

### FR-007 Job state

Client must show:

- upload
- queued
- detecting
- mask-ready
- processing
- post-processing
- completed
- failed
- expired

No fake percentage when the backend cannot estimate progress. Use named stages plus determinate percentage only where measurable.

### FR-008 Compare

- Before/after swipe slider.
- Toggle original/result.
- 100% zoom inspection.
- Show mask overlay on demand.

### FR-009 Export

- JPEG quality slider.
- PNG lossless.
- WebP quality slider.
- Preserve dimensions by default.
- Optional resize.
- Signed download URL with short TTL.
- Filename suffix such as `-cleaned`.

### FR-010 Delete

“Delete now” must remove source, masks, previews and outputs and mark the job deleted. Deletion should be idempotent.

### FR-011 Account history

For signed-in users only:

- Recent jobs
- Status
- Created time
- Expiry
- Delete
- Reopen editor while source remains available

History should be optional; anonymous use should remain possible if business requirements allow.

### FR-012 Admin

- Job lookup by internal job ID.
- No routine full-resolution image browsing in admin.
- Usage and error statistics.
- Abuse event queue.
- Model version/latency/quality dashboard.
- Feature flags.
- Retention cleanup health.

## 5. Non-functional requirements

### Performance

- Direct uploads bypass application server.
- Lazy-load editor-heavy libraries.
- Generate display preview for huge images while retaining full-resolution source.
- Canvas interactions target 60 fps on mainstream desktop; 30+ fps on moderate mobile devices.
- Avoid full-resolution redraw on every brush pointer event.

### Reliability

- All job submissions use idempotency keys.
- Retries must not create duplicate chargeable inference jobs.
- Job state transitions validated server-side.
- Failed callbacks can be reconciled by scheduled status checks.

### Accessibility

- WCAG 2.2 AA target.
- Keyboard-accessible upload and toolbar.
- Tooltips are not the only labels.
- 44×44 px minimum touch targets for primary editor controls.
- High-contrast mask overlay setting.
- Reduced-motion support.

### Privacy

- Private R2 buckets.
- Short-lived signed URLs.
- No image content in application logs.
- No model-training reuse of customer images by default.
- Separate explicit consent if a future opt-in dataset program is introduced.

## 6. V1 acceptance scenarios

### Scenario A — small corner logo

1. User uploads 2500×1667 JPEG.
2. User brushes the logo.
3. Standard removal completes.
4. Result preserves dimensions.
5. Outside-mask pixels match original after decode/composite policy except unavoidable format re-encoding effects.

### Scenario B — failed AI result

1. User runs automatic mask.
2. Result damages hair near a logo.
3. User reopens mask, erases excess area and retries.
4. Previous result remains available until replacement completes.

### Scenario C — delete

1. User selects Delete Now.
2. App confirms destructive action.
3. Source/mask/output objects are removed.
4. Subsequent signed URL requests return not found/expired.

## 7. Future scope

- Batch processing.
- Team workspaces.
- API keys/webhooks.
- Custom model routing per tenant.
- Background-removal/object-removal companion tools.
- Desktop PWA/offline local inference experiments.
- Video only as a separate product/research track because temporal consistency changes the problem substantially.
