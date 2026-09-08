# ADR 004 — Pragmatic MVVM in React

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Records frontend architecture pattern.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## Status
Accepted.

## Decision
Use MVVM at feature level:

- Models = pure domain/contracts/repositories.
- Views = React render components.
- ViewModels = hooks/controllers coordinating editor state and server actions.

## Rejected
Class-heavy ViewModels for every component; duplicating server state in a global store.
