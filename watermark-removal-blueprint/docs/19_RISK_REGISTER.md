# 19 — Risk Register

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Prioritizes product, technical, legal, model, cost and operational risks with mitigations.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## Risk matrix

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---:|---:|---|
| R1 | Auto-detection selects non-watermark content | High early | High | user confirmation; editable mask; benchmark; confidence thresholds |
| R2 | Inpainting hallucinates/changes image | Medium | High | composite only mask; LaMa default; quality guard; manual retry |
| R3 | Unauthorized copyright-mark removal | Medium | High | authorization attestation; AUP; no provenance stripping; abuse process |
| R4 | Hidden metadata/provenance accidentally stripped | Medium | High | explicit metadata pipeline; C2PA inspection; tests around Sharp/encoding |
| R5 | GPU cost spike | Medium | High | quotas; routing; telemetry; spend alert; circuit breaker |
| R6 | Queue retry duplicates inference | Medium | High | idempotent attempts; unique idempotency keys; completed-state guard |
| R7 | Malformed image decoder exploit | Low/Medium | High | allowlist; decode sandbox/container; dependency patching; pixel limits |
| R8 | Public R2 exposure | Low | Critical | private buckets; IaC/config review; presigned URLs only |
| R9 | QStash endpoint spoofing | Medium without controls | High | signature verification with current/next keys |
| R10 | DB RLS mistake exposes jobs | Low/Medium | Critical | RLS tests; BFF for anonymous jobs; security review |
| R11 | Free-tier pause/outage affects beta | High if free prod | Medium | paid production plan; backups; status messaging |
| R12 | Model license incompatible with commercial use | Medium | High | model registry + legal/license review; pin artifacts |
| R13 | High-res images cause OOM | Medium | Medium/High | pixel limits; crop/tiling; provider memory routing |
| R14 | Mobile canvas memory/performance | Medium | Medium | preview rendering; vector strokes; lazy loading; device testing |
| R15 | User expects exact original pixels | High | Medium | product copy explains reconstruction; before/after inspection |
| R16 | Worker callback lost | Low/Medium | Medium | retries + reconciliation process |
| R17 | Delete action leaves orphan objects | Medium | High privacy | tombstone + cleanup reconciliation + lifecycle rule |
| R18 | Model update silently regresses quality | Medium | High | versioned benchmarks; canary; feature flags; rollback |

## Top five launch blockers

1. authorization/security flaw;
2. media not actually deleted when promised;
3. model license unknown;
4. duplicate-cost job semantics;
5. auto-detection harming unrelated image regions without user review.

## Risk acceptance process

Every high-impact unresolved risk needs:

```text
owner
mitigation
residual risk
expiry/review date
release approver
```

Do not close model-quality risks with “AI sometimes does that”; classify the failure and measure it.
