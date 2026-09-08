# 13 — DevOps, Deployment and Observability

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Defines environments, CI/CD, containers, provider deployment and operational telemetry.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## 1. Environments

```text
local
preview / pull request
staging
production
```

Never use production R2/Supabase/provider secrets in preview deployments.

## 2. Monorepo tooling

- pnpm workspaces
- Turborepo
- Python project managed with uv or Poetry; choose one and lock it
- Docker for AI worker
- Renovate or Dependabot for controlled dependency updates

## 3. CI pipeline — web

On pull request:

1. install locked dependencies;
2. formatting check;
3. ESLint;
4. TypeScript `tsc --noEmit` or Next type checks;
5. unit/component tests;
6. build Next.js;
7. Playwright critical smoke against preview when practical;
8. dependency/security audit advisory gate.

## 4. CI pipeline — AI

1. Python format/lint (Ruff).
2. type checks (Pyright/Mypy as chosen).
3. unit tests.
4. CPU smoke inference with tiny fixture/model stub.
5. Docker build.
6. image vulnerability scan.
7. optional scheduled GPU integration benchmark.

Do not download multi-GB model weights on every normal PR if avoidable. Use model artifact cache and scheduled/approved integration jobs.

## 5. Deployment

### Web

Vercel production from protected main branch/tag.

### AI worker

Modal deployment from the same release tag or independent worker tag. Record git SHA in worker `/health/version` and processing attempt metadata.

## 6. Model artifacts

- Download from approved immutable source.
- Verify SHA256.
- Cache in provider volume/image layer.
- Do not use floating `latest` model identifiers in production.

## 7. Health endpoints

### Web

`GET /api/health`

- process alive
- optional lightweight DB connectivity
- no expensive provider calls

### AI

`GET /health/live` — process alive.  
`GET /health/ready` — model/dependencies ready.  
`GET /health/version` — git/model versions.

## 8. Observability

### Metrics

```text
uploads_started_total
uploads_completed_total
jobs_created_total
attempts_completed_total
attempts_failed_total
queue_publish_failures_total
processing_latency_ms{stage,model}
gpu_seconds{provider,model}
output_bytes
mask_area_ratio
provider_errors_total{provider,code}
cleanup_objects_deleted_total
cleanup_failures_total
```

### Tracing

Trace:

```text
presign → finalize → queue → worker → R2 → callback → download
```

Propagate `requestId` / `traceparent` where providers permit.

### Logs

Structured JSON with redaction.

## 9. Sentry

Use separate projects or environment tags for web and worker. Do not attach user image data to exceptions.

## 10. Product analytics

Track product events such as:

```text
upload_started
upload_completed
mask_created
smart_select_used
auto_detect_used
process_started
process_completed
process_failed
mask_adjusted_after_result
export_completed
delete_now_clicked
```

Avoid capturing image URLs or full filenames.

## 11. Alerts

Initial alerts:

- processing failure rate exceeds threshold;
- queue backlog/stale jobs;
- callback failures;
- R2 errors;
- GPU provider unavailable;
- cleanup backlog;
- database connection exhaustion;
- sudden cost/usage spike.

## 12. Rollbacks

Web rollback should not break in-flight worker callbacks. Internal schemas must be backward-compatible across at least one previous deployment during rollouts.

Model rollout:

- feature flag percentage;
- record model version;
- canary cohort;
- compare quality/failure/latency;
- immediate rollback to previous model.

## 13. Backups

Free-tier database plans are development conveniences, not a production backup strategy. Production needs provider backups and tested restore procedures.

R2 media is intentionally ephemeral, so backup requirements differ from application metadata. Do not back up user media beyond promised retention unless explicitly required.
