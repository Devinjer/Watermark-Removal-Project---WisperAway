# 05 — Services and Microservices

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Defines deployable services now, logical services later, ownership and extraction criteria.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## 1. V1 deployables

### Service A — Web/BFF

**Runtime:** Next.js / Node.js.  
**Deployment:** Vercel initially.  
**Owns:** web UI, sessions, user-facing APIs, policy gates, jobs metadata, usage authorization, signed R2 URL issuance, queue publish, callback reception.

### Service B — AI Processing

**Runtime:** Python + FastAPI.  
**Deployment:** Modal initially; container-compatible for RunPod/self-hosting.  
**Owns:** image decode, detection, segmentation, inpainting, quality checks, output encoding.

This is intentionally the minimum service split because inference has different runtime, hardware and scaling needs.

## 2. Logical service modules

### Identity/Account module

- profile
- settings
- plan
- entitlements

### Media Gateway module

- presigned upload/download
- object naming
- MIME/file policy
- retention tags

### Job Orchestrator module

- state machine
- idempotency
- QStash publish
- attempt creation
- retry policy
- stale-job reconciliation

### Detection module

- OCR
- visual candidates
- segmentation refinement
- confidence/calibration

### Inference Router module

- classify mask complexity
- choose engine/provider
- budget/capability checks
- fallback chain

### Provenance module

- read C2PA where present
- store validation summary
- optionally add an edit assertion/signature if the product obtains signing infrastructure

### Usage/Billing module

- quota check
- usage ledger
- credit reservation/settlement
- refund on terminal technical failure

### Retention/Cleanup module

- expiry scans
- R2 delete batches
- tombstones
- DB compaction policy

### Admin/Trust module

- abuse reports/events
- rate-limit override
- job metadata inspection
- support tooling

## 3. Service-to-service contracts

Use versioned JSON over HTTPS initially.

Headers:

```text
X-Internal-Service: web
X-Request-Id: <uuid>
X-Idempotency-Key: <uuid>
Authorization: Bearer <short-lived/internal secret or signed token>
```

For QStash-delivered endpoints, verify Upstash signature using official SDK and raw request body.

## 4. AI processing request

```json
{
  "schemaVersion": "1",
  "jobId": "job_...",
  "attemptId": "att_...",
  "source": { "bucket": "media", "key": "originals/..." },
  "mask": { "bucket": "media", "key": "masks/..." },
  "mode": "standard",
  "output": { "format": "webp", "quality": 95 },
  "modelPolicy": {
    "preferred": "lama",
    "allowFallback": true
  },
  "callbackUrl": "https://app.example.com/api/internal/processing-callback"
}
```

Do not include user email, name or unnecessary personal metadata.

## 5. Callback contract

```json
{
  "schemaVersion": "1",
  "jobId": "job_...",
  "attemptId": "att_...",
  "status": "COMPLETED",
  "outputKey": "outputs/...",
  "metrics": {
    "decodeMs": 23,
    "inferenceMs": 1180,
    "encodeMs": 74,
    "gpuSeconds": 1.18
  },
  "models": {
    "inpainter": "lama:<immutable-version>",
    "detector": null,
    "segmenter": null
  }
}
```

## 6. Extraction roadmap

### Extract Detector service when

- auto-detect traffic becomes large independent of removals;
- CPU/GPU profile differs from inpainting;
- model updates need independent deploy cadence.

### Extract Inference Router when

- multiple providers/regions are active;
- budget routing becomes complex;
- retries/fallbacks need an independent control plane.

### Extract Usage/Billing when

- paid plans/API customers launch;
- transactional credit accounting becomes financially material.

### Extract Retention service when

- millions of objects or complex retention classes exist.

## 7. Avoiding distributed-systems problems

- One authoritative job state store.
- Outbox-like record for queue publish if payment/credits make exactly-once semantics important.
- Idempotent callbacks.
- No cross-service shared mutable filesystem.
- Immutable attempt records.
- Monotonic state transitions.
- Correlation ID propagated end-to-end.

## 8. Suggested future deployment names

```text
cleanmark-web
cleanmark-ai
cleanmark-detector          # future
cleanmark-inference-router  # future
cleanmark-retention         # future
cleanmark-billing           # future
```
