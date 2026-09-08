# 09 — Storage, Queue and Job Lifecycle

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Defines object layout, signed URL policy, QStash usage, retries, cleanup and lifecycle invariants.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## 1. R2 bucket policy

Use private storage. Recommended initially:

```text
cleanmark-media-prod
cleanmark-media-staging
```

Keep environments isolated by bucket/account rather than relying solely on prefixes when practical.

## 2. Object keys

Never use raw user email or original path.

```text
originals/{scopeHash}/{jobId}/source.jpg
previews/{scopeHash}/{jobId}/v1.webp
masks/{scopeHash}/{jobId}/v0003.png
outputs/{scopeHash}/{jobId}/{attemptId}/result.webp
```

## 3. Signed URL TTL

Suggested starting points:

- Upload PUT: 5–10 minutes.
- Preview GET: 5 minutes; refresh automatically.
- Output download GET: 5–15 minutes.

R2 supports presigned GET/PUT/HEAD/DELETE with expirations up to 7 days, but short lifetimes are preferable for private user media.

## 4. Browser direct upload

Configure R2 CORS narrowly:

- only production/staging origins;
- PUT/GET/HEAD as needed;
- exact allowed headers;
- no wildcard credentials behavior.

Presigned URLs are bearer capabilities. Do not log them.

## 5. QStash payload discipline

Good:

```json
{ "jobId": "...", "attemptId": "..." }
```

Bad:

```json
{ "imageBase64": "..." }
```

Free QStash message size is 1 MB at research time and images should never transit through the queue anyway.

## 6. Retry strategy

Classify errors:

### Retryable

- temporary R2 read error
- GPU worker capacity failure
- provider 5xx
- transient network error

### Not retryable

- invalid image
- empty mask
- unauthorized job
- expired/deleted source
- unsupported format

QStash delivery retries can replay requests; worker operations therefore need idempotency.

## 7. Attempt lease

When worker starts:

- atomically claim attempt if `QUEUED`;
- set `PROCESSING` + `lease_expires_at`;
- heartbeat only if processing is long enough to justify it;
- reconciliation can return stale attempts to retryable state.

For Modal jobs that finish in seconds, a simple start timestamp + stale threshold may be enough.

## 8. Cleanup

Two layers:

### R2 lifecycle rules

Best-effort automatic expiration where object prefixes/metadata support your policy.

### Application cleanup worker

- find DB jobs past `expires_at`;
- delete known objects;
- record deletion result;
- tombstone job;
- retry partial failures.

Never rely only on a browser `beforeunload` event.

## 9. Immediate delete

Order:

1. mark job `DELETING/DELETED` so new processing is blocked;
2. cancel/ignore queued attempts if possible;
3. delete source/preview/mask/output objects;
4. remove candidate derived artifacts;
5. retain minimal tombstone/usage record according to policy;
6. return idempotent success.

## 10. Storage integrity

Record optional object checksum/ETag, size and MIME after upload. Workers validate decode instead of trusting extension.

## 11. Cache policy

- Original: private, no shared CDN cache.
- Preview/output via signed R2 URL: browser cache only within retention policy.
- Public marketing/demo sample images can use separate public assets/CDN.

## 12. Queue capacity awareness

At research time QStash Free supports 1,000 messages/day and low parallelism; Workflow steps and retries consume additional messages. Therefore a “one image = one message” assumption is wrong if auto-detection, inpainting and callbacks are all orchestrated as separate steps. Track `messages_per_completed_job` from the beginning.
