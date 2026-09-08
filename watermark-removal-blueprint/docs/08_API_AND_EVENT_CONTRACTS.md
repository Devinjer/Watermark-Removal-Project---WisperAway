# 08 — API and Event Contracts

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Defines public/BFF routes, internal endpoints, schemas, idempotency and versioning rules.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## 1. API principles

- JSON for metadata; binary media goes directly to/from R2 using signed URLs.
- Zod validates every external payload.
- Use problem-style structured errors.
- Mutations accept `Idempotency-Key` where duplicate execution is costly.
- Internal APIs are not browser-callable without server authentication/signature.
- Version external developer API separately when it launches; internal BFF routes can evolve with the app.

## 2. Upload

### `POST /api/uploads/presign`

Request:

```json
{
  "filename": "photo.jpg",
  "mime": "image/jpeg",
  "bytes": 2849182,
  "authorizationAccepted": true,
  "policyVersion": "2026-09-01"
}
```

Response:

```json
{
  "jobId": "uuid",
  "upload": {
    "method": "PUT",
    "url": "<presigned-r2-url>",
    "headers": { "Content-Type": "image/jpeg" },
    "expiresAt": "2026-09-08T...Z"
  }
}
```

### `POST /api/jobs/{jobId}/finalize-upload`

Server performs R2 HEAD and moves job to `UPLOADED` if object policy is valid.

## 3. Masks

### `POST /api/jobs/{jobId}/masks/presign`

Returns signed PUT for mask PNG.

### `POST /api/jobs/{jobId}/masks`

```json
{
  "objectKey": "masks/.../3.png",
  "source": "manual",
  "width": 2500,
  "height": 1667
}
```

Server verifies object and creates next immutable mask version.

## 4. Detection

### `POST /api/jobs/{jobId}/detect`

```json
{
  "mode": "auto",
  "candidateTypes": ["text", "logo", "signature"]
}
```

Returns `202` with detection operation ID. Detection may share the same general attempt table or have its own operation table if complexity grows.

### `GET /api/jobs/{jobId}/candidates`

Returns candidates with confidence and preview mask URLs authorized for the current job.

## 5. Processing

### `POST /api/jobs/{jobId}/process`

Headers:

```text
Idempotency-Key: <uuid>
```

Body:

```json
{
  "maskVersionId": "uuid",
  "mode": "standard",
  "output": {
    "format": "webp",
    "quality": 95,
    "preserveDimensions": true
  }
}
```

Response:

```json
{
  "attemptId": "uuid",
  "status": "QUEUED"
}
```

## 6. Job query

### `GET /api/jobs/{jobId}`

```json
{
  "id": "uuid",
  "status": "COMPLETED",
  "source": { "width": 2500, "height": 1667 },
  "activeMaskVersionId": "uuid",
  "activeAttempt": {
    "id": "uuid",
    "mode": "standard",
    "status": "COMPLETED",
    "createdAt": "..."
  },
  "expiresAt": "..."
}
```

Do not return raw R2 object keys to untrusted clients if they reveal implementation details; use opaque asset IDs or signed view URLs.

## 7. Download

### `POST /api/jobs/{jobId}/download-url`

```json
{ "attemptId": "uuid" }
```

Response includes short-lived signed GET. Validate ownership and non-expiry each time.

## 8. Delete

### `DELETE /api/jobs/{jobId}`

- Idempotent.
- Marks tombstone first.
- Deletes objects.
- Returns success even if already deleted.
- Cleanup reconciliation retries partial deletion.

## 9. Internal worker endpoint

### `POST /internal/v1/process`

Invoked through QStash. Verify signature; reject requests if job/attempt state no longer authorizes processing.

## 10. Processing callback

### `POST /api/internal/processing-callback`

Use a separate worker signature/HMAC or other strong service authentication. QStash signature does not protect a callback emitted directly by the worker.

## 11. Error schema

```json
{
  "error": {
    "code": "IMAGE_TOO_LARGE",
    "message": "This image exceeds the current 40 MP limit.",
    "retryable": false,
    "requestId": "req_..."
  }
}
```

Stable user-facing error codes:

```text
UNAUTHORIZED
FORBIDDEN
RATE_LIMITED
QUOTA_EXCEEDED
UNSUPPORTED_MEDIA
IMAGE_TOO_LARGE
UPLOAD_EXPIRED
JOB_EXPIRED
INVALID_JOB_STATE
MASK_EMPTY
MASK_TOO_LARGE
PROCESSING_FAILED
PROVIDER_UNAVAILABLE
OUTPUT_FAILED
```

## 12. Idempotency semantics

- Client generates a unique key per explicit Process action.
- Same key + same payload returns original attempt.
- Same key + different payload returns `409 IDEMPOTENCY_CONFLICT`.
- Worker also guards `attemptId` completion so QStash retries do not re-run a completed attempt.

## 13. Future public API

Launch only after product workflows stabilize:

```text
POST /v1/jobs
PUT  signed upload
POST /v1/jobs/{id}/masks
POST /v1/jobs/{id}/process
GET  /v1/jobs/{id}
POST /v1/webhooks
```

Use API keys with scoped permissions, per-key rate limits and signed webhooks.
