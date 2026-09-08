# ADR 002 — Cloudflare R2 for Media Storage

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Records object-storage decision.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## Status
Accepted for MVP.

## Decision
Use private Cloudflare R2 as the primary object store. Browser uploads/downloads use short-lived S3-compatible presigned URLs.

## Why
- free egress to Internet;
- generous free operations/storage for MVP;
- S3 compatibility;
- bypasses Vercel 4.5 MB function payload limit for large image transfers.

## Consequences
Need CORS policy, key lifecycle and presigned bearer-token discipline.
