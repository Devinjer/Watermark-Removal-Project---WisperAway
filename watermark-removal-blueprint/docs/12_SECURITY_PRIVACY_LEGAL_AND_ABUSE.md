# 12 — Security, Privacy, Legal and Abuse Controls

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Defines technical protections, privacy defaults and product-policy safeguards for an image editing service.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## 1. Product/legal boundary

The platform processes only images the user represents they own or are authorized to modify. Visible watermark removal can be lawful in legitimate workflows, but it can also be used to infringe copyright or remove rights-management information without authority. Product design therefore needs explicit authorization, acceptable-use rules and complaint handling.

This document is engineering/product guidance, not legal advice. Obtain qualified counsel for the launch jurisdictions.

## 2. India-specific legal consideration

Section 65B of the Copyright Act, 1957 addresses knowingly removing or altering rights-management information without authority and certain distribution after such removal. The product must not encourage unauthorized removal and should preserve electronic provenance/rights-management information where practical.

## 3. C2PA / Content Credentials policy

### Do

- detect/read existing C2PA with supported SDKs when practical;
- preserve or re-assert provenance for edited output if your signing architecture is ready;
- disclose that the image was edited when adding your own credential.

### Do not

- deliberately build a “strip C2PA” feature;
- market visible watermark removal as provenance erasure;
- silently remove metadata because an image library defaults to stripping it without reviewing the behavior.

`c2pa-node` in the current contentauth/c2pa-js project can read/validate attached manifests and add signed manifests.

## 4. Upload authorization UI

Required checkbox:

```text
[ ] I own this image or have permission to modify it.
```

Secondary link:

```text
By continuing, you agree to the Acceptable Use Policy and confirm you are authorized to edit this content.
```

Never pre-check the box.

## 5. Prohibited-use policy examples

- removing ownership marks from stock/media images without authorization;
- creating misleading official documents;
- removing safety/authenticity marks to facilitate fraud;
- using the service to conceal infringement;
- bypassing rights-management/provenance systems.

## 6. File security

### V1 allowlist

- JPEG
- PNG
- WebP

Optional AVIF after testing.

### Initially reject

- SVG
- PSD
- TIFF
- PDF
- unknown binary formats

### Validation layers

1. Client-side convenience check.
2. BFF size/MIME policy before signed URL.
3. R2 object HEAD verification.
4. Worker magic-byte/decode verification.
5. Re-encode processing copy to canonical raster format if needed.

Protect against decompression bombs by enforcing both compressed bytes and decoded pixel limits.

## 7. SSRF

Do not support `imageUrl` ingestion in V1. If added later:

- outbound fetch proxy;
- DNS/IP revalidation;
- block private/link-local/metadata networks;
- strict size/time/content limits;
- no arbitrary redirects.

## 8. Secrets

Never expose:

- Supabase service-role key
- R2 secret access key
- QStash token/signing keys
- Redis server token where privileged
- Modal/RunPod provider secrets
- worker HMAC secret
- C2PA private signing key

## 9. QStash security

QStash sends a JWT in `Upstash-Signature`. Verify it using the official SDK and the raw body. Maintain both current and next signing keys to support rotation.

## 10. Service authentication

Worker callbacks should use one of:

- short-lived signed JWT with audience and expiry;
- HMAC over timestamp + raw body;
- private network/auth feature of hosting provider when available.

Include replay protection/idempotency.

## 11. Database security

- RLS for user data.
- Server-only service role.
- No direct client writes to attempt status/usage.
- Admin checks server-side.
- Parameterized queries/official clients.

## 12. Rate limiting

Dimensions:

- IP / anonymous session
- authenticated user
- job creation
- presign issuance
- detection
- process attempts
- download URL requests

Add burst and daily limits. Rate limit expensive actions more strictly than reads.

## 13. Privacy defaults

- Images are private.
- No customer-image model training by default.
- Short retention.
- Immediate delete.
- Avoid logging filenames if unnecessary; sanitize if logged.
- Strip GPS EXIF from output by default unless explicit metadata-preservation UX is designed.
- Preserve color profile and provenance intentionally rather than indiscriminately copying all metadata.

## 14. Logging policy

Allowed:

```text
jobId
attemptId
userId/internal scope ID
stage
latency
bytes
dimensions
model version
error code
provider request ID
```

Avoid:

```text
signed URLs
raw access tokens
image binary/base64
OCR-recognized watermark text unless strictly needed
user-provided filename if not needed
```

## 15. Abuse signals

Signals can include unusually high-volume anonymous usage, repeated complaints, automation around prohibited flows, or attempts to upload unsupported/official-document formats. Do not automatically make legal accusations from a model classifier.

## 16. Security headers

At minimum evaluate:

- CSP
- HSTS
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- frame-ancestors / anti-clickjacking

CSP must account for R2 signed domains and analytics providers deliberately.

## 17. Incident response

Maintain runbooks for:

- leaked R2 credential
- leaked QStash signing key
- public bucket misconfiguration
- data-retention failure
- malicious file decode vulnerability
- provider compromise
- model dependency CVE

## 18. Data-subject operations

Support:

- delete media/job;
- delete account according to legal retention constraints;
- export account metadata if required by applicable law/product policy.

Do not promise “zero retention” unless architecture and logs truly satisfy it.
