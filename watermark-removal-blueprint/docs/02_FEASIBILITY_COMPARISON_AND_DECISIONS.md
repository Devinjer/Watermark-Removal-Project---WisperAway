# 02 — Feasibility, Comparison and Architecture Decisions

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Re-thinks the initial technology choices and records why each major platform/model is or is not selected.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## 1. Feasibility conclusion

The product is feasible. The risk is not whether an image can be inpainted; it is whether the app can consistently obtain the **correct mask** and deliver a natural-looking result at an acceptable cost. Therefore the recommended roadmap begins with manual mask creation and gradually increases automation.

## 2. Application framework comparison

| Option | Strengths | Weaknesses | Decision |
|---|---|---|---|
| Next.js + TypeScript | Full-stack React, App Router, server rendering, route handlers, excellent deployment ecosystem | Serverless runtime is not a GPU inference environment | **Use** |
| Separate Express/Nest backend on day 1 | Strong backend organization | Adds deployment/network complexity before needed | **Do not add initially** |
| Python-only web app | ML proximity | Worse fit for the desired TS/React product stack | **Do not use for product UI** |

**Decision:** Next.js is the BFF/product server. Python is isolated to AI inference.

## 3. Node runtime

Use **Node.js 24 LTS**, not the latest Current branch, for production stability. Current official release material lists Node 24.20.0 as LTS and Node 26.x as Current at research time.

## 4. Image object storage

| Provider | Pros | Cons | Decision |
|---|---|---|---|
| Cloudflare R2 | S3-compatible, 10 GB-month free tier, free Internet egress, presigned GET/PUT | Presigned URLs use R2 S3 domain, not custom domain | **Primary** |
| Supabase Storage | Simple with Supabase auth/policies | Free storage/egress smaller; couples heavy media to DB provider | Secondary / small assets |
| Upstash Blob | S3-compatible and convenient with Next.js | Less reason to add a third storage platform when R2 already fits | Alternative |

**Decision:** private R2 for original, mask, preview and output objects. Supabase stores metadata only.

## 5. Queue/orchestration

| Option | Pros | Cons | Decision |
|---|---|---|---|
| QStash | Serverless, automatic delivery/retries, 1,000 free messages/day | HTTP-based, free parallelism limits | **Use** |
| Upstash Workflow | Durable multi-step orchestration over QStash | Each workflow step consumes messages | **Use for multi-step jobs where useful** |
| BullMQ + Redis | Flexible and familiar | Requires always-on worker/Redis topology and operational ownership | Later if self-hosted workers become dominant |
| SQS/Cloud Tasks | Very robust | Adds cloud-account complexity | Scale alternative |

**Important:** queue payloads contain IDs/object keys, never raw images or base64.

## 6. Database/auth

Supabase remains a strong MVP choice because Postgres, Auth, RLS and generated APIs solve common product needs. Free tier is enough for development, but production should expect a paid plan to avoid inactivity pausing and to gain backups/operational guarantees.

## 7. GPU hosting

| Option | Best use | Decision |
|---|---|---|
| Modal | MVP and bursty inference; $30 monthly starter credit at research time | **Default MVP** |
| RunPod Serverless | Benchmark for sustained/scale GPU economics | **Secondary provider** |
| Replicate/fal | Fastest integration, broad model catalog, less infrastructure ownership | **Fallback / premium provider adapter** |
| Dedicated GPU VM | Predictable high utilization | Later after utilization justifies idle-cost risk |

Build an `InferenceProvider` interface so switching does not affect product routes.

## 8. Inpainting model decisions

### OpenCV

Use only for tiny, simple regions. It is deterministic and cheap; OpenCV provides Telea and Navier-Stokes inpainting.

### LaMa

Use as V1 default erase engine. It is purpose-built for inpainting and is a proven watermark/object-removal baseline. IOPaint provides a useful implementation reference and model wrapper.

### Diffusion inpainting

Use as a **fallback quality tier**, not as default. It is slower, more expensive and more likely to hallucinate. Keep the original outside-mask area fixed by compositing.

## 9. Detection decisions

### PaddleOCR

Good for text-like overlays and gives boxes even if recognition content is irrelevant.

### Grounding DINO

Good general open-vocabulary detector for prompts like “watermark”, “logo” and “signature”. It should propose candidates rather than silently decide final pixels.

### SAM 2

Good mask refinement and interactive selection. Apache-2.0 checkpoints/code in the official repository at research time.

## 10. Custom model decision

Do **not** train a custom segmentation model before collecting a benchmark and understanding failure classes. Once manual/smart/auto flows generate opt-in annotations and a synthetic pipeline exists, train a dedicated watermark mask model.

## 11. MVVM decision

MVVM is useful as an organizational pattern in React if kept pragmatic:

- **Model:** domain types, schemas, repositories, API clients and domain policies.
- **View:** presentational React components.
- **ViewModel:** feature hooks/controllers that orchestrate View state, API calls and editor commands.

Do not turn every component into a class-like ViewModel. Use feature-level hooks and stores.

## 12. Microservices decision

### V1 deployments

1. `web` — Next.js UI/BFF.
2. `ai-worker` — FastAPI inference service.

### Logical modules but not separate deployments yet

- auth/account
- upload/storage
- jobs
- billing/usage
- detection
- inpainting
- provenance
- cleanup
- admin

### Extraction triggers

Extract a module only when at least one is true:

- scaling profile differs materially;
- independent deploy cadence is needed;
- team ownership is independent;
- security boundary is valuable;
- runtime/language differs;
- failure isolation materially improves reliability.

## 13. Revised product recommendation

The project should be marketed as an **AI cleanup editor with authorized watermark removal**, not as a universal “remove anyone's copyright mark” service. This improves legal posture, trust, payment-provider compatibility and product longevity.
