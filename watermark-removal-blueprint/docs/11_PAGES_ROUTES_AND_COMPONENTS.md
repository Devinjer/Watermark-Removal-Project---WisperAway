# 11 — Pages, Routes and Component Inventory

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Defines the information architecture, page scope and reusable UI/component tree.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## 1. Public pages

### `/`

Purpose: explain value and start upload quickly.

Sections:

- hero + upload CTA
- three-step workflow
- supported watermark examples using owned demo assets
- privacy/temporary-processing message
- features
- FAQ
- trust/authorization note
- CTA

### `/remove-watermark`

SEO/product landing page focused on the actual tool. Can host upload dropzone directly.

### `/features`

- manual precision
- smart selection
- auto-detect
- quality modes
- privacy/delete
- provenance handling

### `/pricing`

Free/paid plan limits only after monetization design is stable.

### `/docs`

User documentation.

### `/developers` — later

Public API documentation and keys.

### `/blog`

Educational content. The supplied HTML’s technical blog styling can be adapted here.

### Legal

```text
/legal/terms
/legal/privacy
/legal/acceptable-use
/legal/copyright
```

## 2. Authentication

```text
/login
/signup
/auth/callback
/forgot-password
/reset-password
```

If anonymous processing is supported, do not force login before the user sees value.

## 3. Application pages

### `/editor/[jobId]`

Primary app experience.

Panels:

- canvas
- tool rail
- tool properties
- candidate list
- job stage
- before/after
- export
- deletion/privacy

### `/history`

- thumbnails via signed URLs
- status
- expiry
- open
- download
- delete

### `/settings`

- profile
- theme
- history/retention preference
- privacy
- sessions

### `/settings/billing` — later

- plan
- usage
- credits
- invoices/provider portal

## 4. Admin pages

```text
/admin
/admin/jobs
/admin/attempts
/admin/models
/admin/usage
/admin/abuse
/admin/feature-flags
/admin/system-health
```

Admin must display metadata by default; full image reveal, if ever necessary for user-requested support, should be explicit, permissioned and audited.

## 5. Marketing components

```text
SiteHeader
SiteFooter
HeroUploadCard
FeatureGrid
HowItWorks
OwnedDemoBeforeAfter
PrivacyCallout
FAQAccordion
PricingTable
BlogCard
NewsletterForm
```

## 6. Upload components

```text
UploadDropzone
UploadFileSummary
AuthorizationCheckbox
UploadProgress
UnsupportedFileDialog
ImagePolicyNotice
```

## 7. Editor components

```text
EditorShell
EditorTopBar
EditorCanvas
CanvasStage
ImageLayer
MaskLayer
SelectionLayer
CandidateLayer
ToolRail
ToolButton
BrushOptions
EraserOptions
RectangleOptions
SmartSelectOptions
AutoDetectPanel
CandidateList
CandidateToggle
MaskActions
UndoRedoControls
ZoomControls
FitControls
BeforeAfterSlider
ProcessingStage
QualitySelector
ExportDialog
DeleteJobDialog
ProvenanceBadge
KeyboardShortcutsDialog
```

## 8. Dashboard components

```text
JobGrid
JobCard
JobStatusBadge
ExpiryBadge
UsageMeter
EmptyHistory
```

## 9. Admin components

```text
SystemKpiCard
JobLookup
AttemptTimeline
ModelVersionTable
ProviderHealthTable
QueueHealth
RetentionHealth
AbuseEventTable
FeatureFlagEditor
```

## 10. Shared primitives

Prefer shadcn/ui/Radix-based primitives where suitable:

```text
Button
IconButton
Dialog
Sheet
Popover
Tooltip
DropdownMenu
Tabs
Switch
Checkbox
Slider
Progress
Toast
Skeleton
Alert
Badge
Table
```

## 11. Route-handler inventory

```text
app/api/uploads/presign/route.ts
app/api/jobs/[jobId]/route.ts
app/api/jobs/[jobId]/finalize-upload/route.ts
app/api/jobs/[jobId]/masks/presign/route.ts
app/api/jobs/[jobId]/masks/route.ts
app/api/jobs/[jobId]/detect/route.ts
app/api/jobs/[jobId]/candidates/route.ts
app/api/jobs/[jobId]/process/route.ts
app/api/jobs/[jobId]/download-url/route.ts
app/api/internal/processing-callback/route.ts
app/api/workflows/process/route.ts
app/api/health/route.ts
```

## 12. Keyboard shortcuts

```text
B  Brush
E  Eraser
R  Rectangle
H  Hand/pan
A  Auto select
Cmd/Ctrl+Z  Undo
Cmd/Ctrl+Shift+Z  Redo
0  Fit
1  100%
M  Mask visibility
Space  Temporary pan
```

Shortcuts must not fire while typing in inputs.
