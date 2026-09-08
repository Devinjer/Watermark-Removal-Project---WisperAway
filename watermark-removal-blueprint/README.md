# Watermark Removal Platform — Documentation Index

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Entry point for the complete product, architecture, engineering, UX, security and delivery specification.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## 1. What this bundle contains

This repository is a **build-ready planning package** for a production web application that removes visible watermarks, logos, text overlays and unwanted visual marks from images the user is authorized to edit. It translates the feasibility research into product scope, architecture, MVVM boundaries, deployable services, AI pipelines, database contracts, UI/UX specifications, implementation phases, testing gates and operational documentation.

The uploaded HTML reference is treated as a **visual-language input**, not as source code to copy. Its dark glass surfaces, indigo/violet/rose gradient, Inter/JetBrains Mono typography and compact technical-product aesthetic are adapted into the image editor while reducing unnecessary visual effects around the canvas.

## 2. Recommended architecture in one sentence

**Next.js 16.3.x + TypeScript + Node.js 24 LTS for the product/BFF, Cloudflare R2 for private image objects, Supabase Postgres/Auth for application data, Upstash QStash/Workflow for durable job orchestration, and a separately deployed Python/FastAPI AI worker using OpenCV + LaMa + PaddleOCR + Grounding DINO + SAM 2 with provider abstractions for higher-quality inpainting.**

## 3. Read in this order

1. [00_MASTER_PROJECT_BLUEPRINT.md](docs/00_MASTER_PROJECT_BLUEPRINT.md)
2. [01_PRODUCT_SCOPE_AND_REQUIREMENTS.md](docs/01_PRODUCT_SCOPE_AND_REQUIREMENTS.md)
3. [02_FEASIBILITY_COMPARISON_AND_DECISIONS.md](docs/02_FEASIBILITY_COMPARISON_AND_DECISIONS.md)
4. [03_SYSTEM_ARCHITECTURE.md](docs/03_SYSTEM_ARCHITECTURE.md)
5. [04_MVVM_FRONTEND_ARCHITECTURE.md](docs/04_MVVM_FRONTEND_ARCHITECTURE.md)
6. [05_SERVICES_AND_MICROSERVICES.md](docs/05_SERVICES_AND_MICROSERVICES.md)
7. [06_AI_ML_PIPELINE.md](docs/06_AI_ML_PIPELINE.md)
8. [07_DATA_MODEL_AND_DATABASE.md](docs/07_DATA_MODEL_AND_DATABASE.md)
9. [08_API_AND_EVENT_CONTRACTS.md](docs/08_API_AND_EVENT_CONTRACTS.md)
10. [09_STORAGE_QUEUE_AND_JOB_LIFECYCLE.md](docs/09_STORAGE_QUEUE_AND_JOB_LIFECYCLE.md)
11. [10_UI_UX_DESIGN_SYSTEM.md](docs/10_UI_UX_DESIGN_SYSTEM.md)
12. [11_PAGES_ROUTES_AND_COMPONENTS.md](docs/11_PAGES_ROUTES_AND_COMPONENTS.md)
13. [12_SECURITY_PRIVACY_LEGAL_AND_ABUSE.md](docs/12_SECURITY_PRIVACY_LEGAL_AND_ABUSE.md)
14. [13_DEVOPS_DEPLOYMENT_AND_OBSERVABILITY.md](docs/13_DEVOPS_DEPLOYMENT_AND_OBSERVABILITY.md)
15. [14_TESTING_QA_AND_BENCHMARKS.md](docs/14_TESTING_QA_AND_BENCHMARKS.md)
16. [15_PHASED_IMPLEMENTATION_PLAN.md](docs/15_PHASED_IMPLEMENTATION_PLAN.md)
17. [16_REPOSITORY_STRUCTURE_AND_FILE_MAP.md](docs/16_REPOSITORY_STRUCTURE_AND_FILE_MAP.md)
18. [17_ENV_CONFIGURATION_AND_SECRETS.md](docs/17_ENV_CONFIGURATION_AND_SECRETS.md)
19. [18_COST_CAPACITY_AND_SCALING.md](docs/18_COST_CAPACITY_AND_SCALING.md)
20. [19_RISK_REGISTER.md](docs/19_RISK_REGISTER.md)
21. [20_DEFINITION_OF_DONE_AND_RELEASE_GATES.md](docs/20_DEFINITION_OF_DONE_AND_RELEASE_GATES.md)
22. [21_RESEARCH_SOURCES.md](docs/21_RESEARCH_SOURCES.md)
23. Architecture decisions under [docs/adr/](docs/adr/)

## 4. Important implementation principle

Do **not** begin by creating ten independent services. Start with a modular application and one isolated AI service. The interfaces in this documentation deliberately let you extract services later when traffic, cost or team ownership justifies the operational overhead.

## 5. Current platform baselines verified for this blueprint

- Next.js: 16.3.3 Active LTS at the time of research.
- Node.js: 24.20.0 LTS at the time of research.
- Tailwind CSS: 4.3 in current official release material.
- Cloudflare R2 free tier: 10 GB-month storage, 1M Class A operations, 10M Class B operations, free Internet egress for Standard storage.
- Upstash QStash Free: 1,000 messages/day, 50 GB bandwidth, 1 MB message size.
- Modal Starter: $30/month compute credit; pay for active compute.
- Supabase Free: 500 MB database, 1 GB file storage, 50,000 MAU, 5 GB egress, two active free projects; free projects may pause after inactivity.

Always re-check pricing, quotas and model licenses immediately before production launch.
