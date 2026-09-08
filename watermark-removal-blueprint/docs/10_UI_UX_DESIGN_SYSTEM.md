# 10 — UI/UX and Design System

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Adapts the supplied dark technical HTML aesthetic into an accessible, high-performance image editor design system.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## 1. Visual direction

The supplied HTML reference uses:

- dark layered surfaces;
- translucent/glass containers;
- indigo → violet → rose gradient accents;
- Inter for UI/body;
- JetBrains Mono for technical metadata;
- compact status pills;
- rounded cards;
- subtle glow and blurred background orbs.

This is a strong fit for an AI image tool, but the editor itself should be calmer: the canvas must remain visually dominant and color-accurate.

## 2. Brand working name

`CleanMark` is used only as a placeholder in these documents. Final naming/branding should be selected before public design polish.

## 3. Dark palette adapted from the supplied reference

### Core surfaces

| Token | Hex | Use |
|---|---:|---|
| `--bg` | `#11131D` | app background |
| `--surface-lowest` | `#0C0E18` | canvas chrome / deepest panels |
| `--surface-low` | `#191B26` | sidebars |
| `--surface` | `#1D1F2A` | cards/panels |
| `--surface-high` | `#282934` | hover/selected panel |
| `--surface-highest` | `#323440` | input elevated state |
| `--outline` | `#8F8FA1` | strong outline |
| `--outline-subtle` | `#444655` | dividers |

### Text

| Token | Hex |
|---|---:|
| `--text` | `#E1E1F0` |
| `--text-muted` | `#C5C5D7` |
| `--text-inverse` | `#2E303B` |

### Accents

| Token | Hex |
|---|---:|
| `--primary` | `#BBC3FF` |
| `--primary-container` | `#7486FF` |
| `--secondary` | `#D4BBFF` |
| `--tertiary` | `#FFB0C9` |
| `--success` | `#2FB178` |
| `--error` | `#FFB4AB` |

### Signature gradient

```css
background: linear-gradient(
  135deg,
  #596FFF 0%,
  #A876FF 49%,
  #FF7EAE 100%
);
```

Use the gradient for one primary action or active indicator per view, not every clickable element.

## 4. Proposed light palette

The supplied reference is dark-first. For accessibility and user preference, add a light theme:

| Token | Proposed hex |
|---|---:|
| `--bg` | `#F7F7FC` |
| `--surface-lowest` | `#FFFFFF` |
| `--surface` | `#F0F1F8` |
| `--surface-high` | `#E8EAF4` |
| `--text` | `#171925` |
| `--text-muted` | `#5D6072` |
| `--outline-subtle` | `#D8DAE7` |
| `--primary` | `#354CDE` |
| `--secondary` | `#6E40B5` |
| `--tertiary` | `#A73B68` |

This palette is a new proposal and must be contrast-tested before release.

## 5. Typography

### Primary UI

**Inter** — 400/500/600/700.

### Technical metadata

**JetBrains Mono** — 400/500/600.

Recommended scale:

```text
Display      48/56 desktop, 36/44 mobile
H1           36/44
H2           28/36
H3           22/30
Body large   17/28
Body         15/24
Body small   13/20
UI label     12/16 600
Mono label   11–12/16
```

## 6. Spacing

4 px base unit:

```text
4, 8, 12, 16, 24, 32, 40, 56, 80
```

Editor panels should prefer 12–16 px internal spacing to maximize canvas area.

## 7. Radius

- Controls: 8 px.
- Cards/panels: 12–16 px.
- Pills: full radius.
- Editor canvas frame: 12 px max; avoid decorative rounding that clips image inspection.

## 8. Glassmorphism rule

Use background blur only for:

- top navigation;
- floating editor tool popovers;
- modal overlays.

Do **not** blur every editor panel because it increases GPU/compositing cost and reduces visual clarity.

## 9. Editor layout — desktop

```text
┌──────────────────────────────────────────────────────────────┐
│ Logo   File   Undo Redo        Job Status       Export      │
├───────────┬──────────────────────────────────┬───────────────┤
│ Tool Rail │                                  │ Properties    │
│           │             CANVAS               │               │
│ Select    │                                  │ Brush size    │
│ Brush     │                                  │ Feather       │
│ Erase     │                                  │ Quality       │
│ Rect      │                                  │ Candidates    │
│ Auto      │                                  │               │
├───────────┴──────────────────────────────────┴───────────────┤
│ Zoom  Fit  100%       Original ↔ Result        Mask toggle  │
└──────────────────────────────────────────────────────────────┘
```

## 10. Mobile/tablet layout

- Canvas occupies majority of viewport.
- Bottom tool rail with 5 primary tools.
- Tool properties in bottom sheet.
- Export and job status in top bar.
- Pinch zoom/pan.
- Two-finger pan while brush is active or explicit hand tool.
- Prevent accidental browser scroll while interacting with canvas, without breaking page accessibility outside editor.

## 11. Primary components

### Upload dropzone

States:

- idle
- drag active
- validating
- uploading
- failed
- complete

### Tool button

- icon + visible/accessible label on desktop;
- tooltip plus `aria-label` if collapsed;
- selected state uses primary-container border/glow, not gradient fill everywhere.

### Processing button

Primary gradient action. Text changes by context:

- `Remove watermark`
- `Try again`
- `Process selection`

### Stage status

Prefer stage names:

```text
Preparing image
Detecting watermark
Reconstructing area
Finishing result
```

Avoid fabricated percentages for GPU inference.

## 12. Mask colors

Default mask overlay:

- magenta/rose with ~45% alpha because it contrasts against many images.
- alternative cyan/high-contrast mode.
- mask edges rendered with an outline for visibility on similar colors.

## 13. Empty/error UX

Error messages must explain the next action:

Bad: `Inference error 500.`  
Good: `We couldn't process this selection. Your image and mask are still here — retry Standard mode or adjust the selected area.`

## 14. Accessibility details

- Visible focus ring with at least 2 px effective thickness.
- Tool state announced to screen readers.
- Undo/redo shortcuts displayed in tooltips.
- Do not encode detection confidence only by color.
- `prefers-reduced-motion` disables glow pulsing and large transitions.
- Theme choice persisted.

## 15. Motion

- 120–180 ms control transitions.
- 200–250 ms panels/modals.
- Avoid perpetual animated gradient around the canvas.
- Progress animation can be subtle and disabled under reduced-motion.

## 16. Design QA checklist

- Canvas background checked against transparent PNG checkerboard.
- Before/after slider usable at 200% zoom.
- Mask remains aligned after resize/orientation normalization.
- Touch targets ≥44 px for mobile primary tools.
- Dark and light theme contrast reviewed.
- All dialogs keyboard-operable.
