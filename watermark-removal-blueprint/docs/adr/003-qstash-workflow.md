# ADR 003 — QStash/Workflow for Asynchronous Jobs

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Records queue/orchestration choice.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## Status
Accepted for MVP.

## Decision
Use QStash for reliable HTTP job delivery and Upstash Workflow where durable multi-step flows are beneficial.

## Why
- no queue servers to operate;
- automatic retries;
- good Next.js integration;
- free tier useful for development.

## Constraints
Every delivery/retry/Workflow step affects message usage. Payloads contain IDs only. Receiving endpoints verify signatures.
