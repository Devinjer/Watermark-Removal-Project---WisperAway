# 21 — Research Sources

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Records primary official sources used to verify platform assumptions as of the blueprint date.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## Verification date

2026-09-08.

Pricing, limits, versions and licenses change. Re-check immediately before implementation lock and launch.

## Framework/runtime

- Next.js blog / releases: https://nextjs.org/blog
- Node.js releases: https://nodejs.org/en/blog/release
- Tailwind CSS v4.3: https://tailwindcss.com/blog/tailwindcss-v4-3
- Vercel function limits: https://vercel.com/docs/functions/limitations

## Storage / queue / database / GPU

- Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/
- Cloudflare R2 presigned URLs: https://developers.cloudflare.com/r2/api/s3/presigned-urls/
- Upstash QStash pricing: https://upstash.com/pricing/qstash
- Upstash QStash signature verification: https://upstash.com/docs/qstash/howto/signature
- Upstash Workflow pricing: https://upstash.com/docs/workflow/pricing
- Supabase pricing: https://supabase.com/pricing
- Modal pricing: https://modal.com/pricing
- RunPod pricing: https://www.runpod.io/pricing

## AI / imaging

- OpenCV inpainting: https://docs.opencv.org/5.0/main_modules/photo_inpaint.html
- SAM 2 repository: https://github.com/facebookresearch/sam2
- Grounding DINO repository: https://github.com/IDEA-Research/GroundingDINO
- PaddleOCR repository: https://github.com/PaddlePaddle/PaddleOCR
- IOPaint repository: https://github.com/Sanster/IOPaint
- Hugging Face Diffusers inpainting: https://huggingface.co/docs/diffusers/en/using-diffusers/inpaint

## Provenance

- Content Authenticity c2pa-js: https://github.com/contentauth/c2pa-js

## Legal source

- Government of India Copyright Act Chapter XIII / Section 65B: https://copyright.gov.in/Copyright_Act_1957/chapter_xiii.html

## Source-evaluation note

The architecture intentionally relies on open interfaces and a model registry because **repository code licenses, model-weight licenses and hosted-provider terms are separate review items**. Do not infer commercial rights from a library name alone.
