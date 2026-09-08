# 17 — Environment Configuration and Secrets

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Defines environment variables, validation and secret-handling rules without embedding real credentials.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## 1. Rules

- `.env.example` contains names and safe placeholders only.
- Validate environment at startup.
- Separate public `NEXT_PUBLIC_*` variables from server-only secrets.
- Use provider secret manager/Vercel environment configuration in hosted environments.
- Rotate secrets after exposure; never “hide” leaked secrets only by deleting git history locally.

## 2. Web variables

```dotenv
# App
APP_ENV=development
APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase - public
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase - server only
SUPABASE_SERVICE_ROLE_KEY=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_MEDIA=
R2_ENDPOINT=

# Upstash QStash
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Internal worker
AI_WORKER_BASE_URL=
AI_WORKER_CALLBACK_SECRET=

# Observability
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Retention / feature flags
ANON_SOURCE_TTL_SECONDS=3600
ANON_OUTPUT_TTL_SECONDS=86400
MAX_UPLOAD_BYTES=20971520
MAX_IMAGE_MEGAPIXELS=40
```

`NEXT_PUBLIC_*` values are sent to browsers; never place secrets there.

## 3. AI worker variables

```dotenv
APP_ENV=development
WORKER_SERVICE_NAME=cleanmark-ai

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_MEDIA=
R2_ENDPOINT=

WEB_CALLBACK_URL=
WEB_CALLBACK_SECRET=

MODEL_CACHE_DIR=/models
LAMA_MODEL_PATH=
SAM2_MODEL_PATH=
GROUNDING_DINO_MODEL_PATH=

DEFAULT_INPAINT_ENGINE=lama
ALLOW_DETAIL_PROVIDER=false
DETAIL_PROVIDER_API_KEY=

SENTRY_DSN=
LOG_LEVEL=INFO
```

## 4. Secret classification

### Public

- app URL
- Supabase anon key (designed for browser use with RLS)
- analytics public key

### Confidential

- Supabase service role
- R2 credentials
- QStash token/signing keys
- Redis token
- worker callback secret
- model provider API keys
- billing webhooks

### Critical signing material

- C2PA private signing key/certificate credentials, if adopted.

Keep critical signing material isolated and use a managed key/HSM approach if the product begins issuing trust-significant credentials.

## 5. Rotation

Document owners and rotation procedure for each secret. QStash provides current/next signing keys specifically to support rotation; the verifier should accept the appropriate key set rather than hardcoding one static secret.
