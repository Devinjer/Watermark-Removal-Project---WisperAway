# 14 — Testing, QA and Benchmarks

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Defines automated tests, image-quality benchmarks, load tests, security tests and release criteria.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## 1. Testing pyramid

### Unit

- domain state transitions
- quota calculations
- object-key generation
- MIME policy
- mask geometry/morphology helpers
- provider router
- error mapping

### Integration

- Supabase repositories
- R2 signed PUT/GET against test bucket
- QStash dev server or test environment
- worker + object storage fixture
- callback idempotency

### End-to-end

Playwright flows:

- anonymous upload → manual mask → process → export → delete
- login → history → reopen
- expired upload
- failed processing retry
- mobile touch toolbar

## 2. Editor-specific tests

- mask remains aligned after zoom/pan.
- undo/redo exactness.
- brush on high-DPI screens.
- pointer cancellation.
- touch/pinch interactions.
- orientation-corrected image coordinates.
- browser resize.
- large preview rendering.

## 3. Image fixtures

Commit only small, licensed/owned fixtures to the repository. Store large benchmark datasets in a private research bucket with documented license/source metadata.

Fixture classes:

```text
simple_corner_logo
transparent_text
repeating_diagonal
face_overlap
hair_overlap
fine_pattern_fabric
gradient_background
transparent_png
very_large_image
invalid_truncated_jpeg
```

## 4. Detection benchmark

Track:

- candidate recall
- candidate precision
- pixel IoU
- pixel F1
- false-positive area
- confidence calibration

Report by watermark class, not only aggregate.

## 5. Inpainting benchmark

On synthetic paired data:

- PSNR
- SSIM
- LPIPS
- boundary seam metric
- outside-mask pixel preservation

On real authorized data:

- blinded human rating 1–5
- “usable without edit?” yes/no
- failure taxonomy

## 6. Performance benchmark

Measure by megapixels and mask ratio:

```text
1 MP / tiny mask
4 MP / small mask
12 MP / medium mask
24 MP / medium mask
40 MP / repeating mask
```

Record:

- download time
- decode time
- detection
- segmentation
- inference
- encode
- upload
- total GPU seconds
- peak memory

## 7. Load testing

Use k6/Artillery for BFF metadata routes, not by blasting expensive GPU inference from CI.

Scenarios:

- presign burst
- job status polling
- download URL generation
- callback bursts
- admin history queries

Separate controlled inference load test with a capped budget.

## 8. Security tests

- IDOR job access.
- expired signed URL.
- forged QStash request.
- replayed callback.
- MIME spoofing.
- huge-pixel decompression bomb.
- malformed PNG/JPEG.
- SVG rejected.
- rate-limit bypass attempts.
- RLS policies.
- admin route authorization.

## 9. Visual regression

Screenshot:

- upload page desktop/mobile
- editor dark/light
- processing states
- candidate panel
- error states
- export dialog

Do not rely on screenshot tests for canvas pixel correctness; add deterministic image checks separately.

## 10. Browser matrix

Minimum:

- current Chrome/Edge
- current Firefox
- current Safari macOS
- iOS Safari current/previous major
- Android Chrome current

## 11. Release quality gates

No production release if:

- auth/IDOR security test fails;
- deletion does not delete media;
- job retry can double-charge/duplicate completion;
- model license record missing;
- unsupported files can reach inference decoder unsafely;
- P95 failure rate on controlled benchmark regresses beyond agreed threshold.

## 12. Benchmark versioning

Every model release references:

```text
benchmark_dataset_version
benchmark_code_git_sha
model_version
runtime_version
hardware
precision
results_json_sha256
```

This prevents “quality improved” claims based on changing test sets.
