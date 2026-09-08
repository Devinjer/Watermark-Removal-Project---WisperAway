# ADR 005 — Preserve Provenance; Remove Visible Marks Only

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Records provenance and product boundary.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## Status
Accepted.

## Decision
The product targets **visible overlays** in authorized images. It does not intentionally remove C2PA Content Credentials or hidden rights-management information. The media pipeline must review metadata behavior explicitly instead of letting image-library defaults decide accidentally.

## Reason
Technical trust, legal risk reduction and a clearer legitimate-product position.
