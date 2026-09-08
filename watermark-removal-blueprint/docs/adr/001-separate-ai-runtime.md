# ADR 001 — Separate AI Runtime

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Records why GPU inference is separated from the Next.js application.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## Status
Accepted.

## Context
The product stack is Next.js/Node, while the best-supported computer-vision ecosystem is Python/PyTorch and GPU-oriented. Vercel Functions are useful for orchestration but have request/response limits and no production GPU execution model for this workload.

## Decision
Deploy AI processing as a separate Python/FastAPI service. Exchange only object keys and metadata.

## Consequences

### Positive
- GPU autoscaling independent of web traffic.
- Model dependencies stay out of Next.js bundle.
- Easy provider migration.
- Python ML ecosystem available.

### Negative
- service authentication/callbacks required.
- distributed failure modes introduced.

## Mitigation
Keep only two deployables initially and use strict idempotent contracts.
