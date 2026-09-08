# WisperAway — Project and Architecture Audit

Reviewed: 8 September 2026  
Repository: [Devinjer / Watermark Removal Project — WisperAway](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway)  
Snapshot: [9fea5b253273d6cb6f1b23cbc6449304bf79da16 — Upload-Documentations](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/commit/9fea5b253273d6cb6f1b23cbc6449304bf79da16)  
Additional requirements: the supplied “WisperAway — Full Project Analysis, Validation, and Implementation” Markdown brief.

## Assessment

**WisperAway now has a substantial architecture specification, but the reviewed repository still has no executable application.** The two-runtime design is a reasonable starting point. Several contracts need tightening before implementing the image pipeline, especially immutable uploads, job recovery, result publication, and deletion.

This audit distinguishes three things: files actually present, requirements documented, and engineering risks inferred from incomplete or conflicting specifications. The risks below are **design findings, not reproduced vulnerabilities in a running application**.

The immediate objective should be a reliable manual removal workflow: upload, validate, mask, process with LaMa, compare, download, and delete. Smart selection and automatic detection can follow after that workflow has measured quality and recovery behavior.

## 1. What was actually inspected

The complete GitHub tree contains **33 files**:

| Material | Count | Verification |
|---|---:|---|
| Numbered specification chapters, 00–21 | 22 | Read in full |
| Architecture decision records | 5 | Read in full |
| Blueprint index, manifest and consolidated specification | 3 | Read index/manifest; verified all 22 chapters occur exactly in the consolidated file |
| Root README, license and Git attributes | 3 | Read |
| Application source files | 0 | No JavaScript, TypeScript, Python or SQL implementation files |
| Build/dependency manifests and lockfiles | 0 | No package.json, pyproject.toml, requirements.txt, pnpm-lock.yaml or uv.lock |
| HTML design reference or image assets | 0 | The referenced visual input is not in the repository |

The consolidated specification duplicates the 22 numbered chapters; its remaining text is an introduction and separators. It does not consolidate the five ADRs. Local relative Markdown links checked in the repository resolve. These checks validate documentation structure, not application behavior.

GitHub also showed one branch, main; no pull requests; and no Actions runs. The source files and workflows illustrated in [the repository file map](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/16_REPOSITORY_STRUCTURE_AND_FILE_MAP.md) are proposed paths, not existing implementation.

The supplied brief was read in full and compared with the repository specification. It describes work to perform; its requirements are not evidence that those features exist.

## 2. Implementation status matrix

“PARTIAL” means the design needs decisions or executable contracts. “MISSING” refers to implementation absent from this snapshot. “BLOCKED” means a requested runtime check has no application to execute.

| Area | Design status | Implementation status | Assessment |
|---|---|---|---|
| Product scope and manual MVP | PARTIAL | MISSING | Good core flow; reconcile AVIF, routes and phase numbering |
| Next.js, React, strict TypeScript, Tailwind | Documented | MISSING | No app, config, dependencies or lockfile |
| Modular architecture and MVVM | Documented | MISSING | Sensible boundaries; avoid generating empty abstractions for future services |
| Routing, layouts, loading/error states | PARTIAL | MISSING | Route maps differ between brief and blueprint |
| Responsive editor and accessibility | PARTIAL | MISSING | Detailed guidance; no runnable UI or device measurements |
| Metadata and public-page SEO | PARTIAL | MISSING | Page inventory only; private routes need explicit indexing/cache policy |
| Supabase authentication and ownership | PARTIAL | MISSING | No session implementation, RLS policies, grants or migrations |
| Database and persistence | PARTIAL | MISSING | Schema sketches omit important integrity and recovery details |
| Private R2 uploads/downloads | PARTIAL | MISSING | Presign flow planned; immutability and validation handoff unresolved |
| QStash and job orchestration | PARTIAL | MISSING | Retries discussed; atomic dispatch and durable execution need concrete contracts |
| Manual masks, undo/redo and comparison | Documented | MISSING | Coordinate and alpha/mask semantics need executable fixtures |
| Python worker and LaMa | PARTIAL | MISSING | No provider code, model artifact, runtime lock or inference evidence |
| SAM 2, OCR and Grounding DINO | PARTIAL | MISSING | Later-stage proposals, with no accuracy or latency benchmarks |
| Retention and deletion | PARTIAL | MISSING | Conflicting defaults and insufficient asset-level lifecycle model |
| Usage, quotas and billing | PARTIAL | MISSING | Ledger described; atomic reservation/settlement not specified |
| Tests, CI, observability and deployment | Documented | MISSING | No test suites, workflows, containers or measured operational evidence |
| Lint, typecheck, tests and production build | — | BLOCKED | No executable project at the reviewed commit |

The repository is ready to start engineering after the high-priority contract decisions below. It is not ready for a functional audit, performance certification or deployment.

## 3. Decisions worth keeping

The [master architecture](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/00_MASTER_PROJECT_BLUEPRINT.md) and [MVVM specification](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/04_MVVM_FRONTEND_ARCHITECTURE.md) establish useful foundations:

- Keep Next.js as the web application and BFF, with a separately deployed Python AI worker.
- Keep media in private R2 storage and transfer large files directly using signed URLs.
- Keep PostgreSQL as the authoritative record for jobs, attempts and ownership.
- Start with manual masks and LaMa. Require review and correction of automatic candidates.
- Composite reconstruction into the allowed edit region and retain the original.
- Keep server state in TanStack Query and transient editor commands in Zustand; keep large pixel buffers out of React state.
- Keep a model adapter boundary, model versions and quality benchmarks.

These choices do not require a separate Express/Nest server or ten independently deployed services.

## 4. Prioritized findings

### F01 — P0 implementation blocker: no executable foundation

**Evidence:** The [complete snapshot](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/tree/9fea5b253273d6cb6f1b23cbc6449304bf79da16) contains documentation only. The required foundation is listed in [the phased plan, lines 14–45](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/15_PHASED_IMPLEMENTATION_PLAN.md#L14-L45).

**Impact:** There is no application to install, build, test or run. Existing documents cannot establish that auth, storage, inpainting or UI works.

**Required work:** Create the minimal web and worker workspaces, locked dependencies, environment schemas, health endpoints, formatting/typecheck scripts and CI. Add modules only as the first working flow needs them.

**Acceptance evidence:** A clean checkout installs deterministically; web builds; worker liveness/readiness behave correctly; CI reports actual checks. Readiness must fail when required model resources are unavailable, rather than reporting a false healthy state.

### F02 — P1: the state model does not fully describe retry, regenerate or deletion

**Evidence:** [System architecture, lines 127–150](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/03_SYSTEM_ARCHITECTURE.md#L127-L150) allows deletion only from non-terminal states. The product requires deletion of completed results and regeneration after success in [requirements, lines 145–159 and 216–228](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/01_PRODUCT_SCOPE_AND_REQUIREMENTS.md#L145-L159). [Storage lifecycle, lines 123–132](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/09_STORAGE_QUEUE_AND_JOB_LIFECYCLE.md#L123-L132) additionally introduces DELETING. The attached brief supplies yet another state list including CANCELLED and UPLOADING_RESULT.

**Impact:** Implementers can disagree about whether completed jobs can be deleted, how failed work retries, and which result remains visible during regeneration.

**Required work:** Separate job/media availability from an individual processing attempt. Define one authoritative transition table, failure transitions from every active stage, cancellation semantics and new-attempt creation. Keep old completed attempts immutable and accessible until their own assets expire.

**Acceptance evidence:** Delete works after completion and failure; regenerate creates a new attempt; a failed regeneration preserves the prior result; duplicate terminal callbacks cannot reverse state.

### F03 — P1: database commit and queue dispatch need a reliable handoff

**Evidence:** [Processing flow, lines 113–124](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/03_SYSTEM_ARCHITECTURE.md#L113-L124) separates database validation from queue publication. [Services, lines 178–186](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/05_SERVICES_AND_MICROSERVICES.md#L178-L186) makes an outbox conditional on future payment concerns. [Idempotency semantics, lines 212–217](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/08_API_AND_EVENT_CONTRACTS.md#L212-L217) specify payload comparison, but the attempt sketch has no request fingerprint or durable dispatch record.

**Impact:** A process crash between saving an attempt and publishing can strand work. Retrying after an ambiguous publish can deliver duplicate messages. Free jobs incur compute costs too.

**Required work:** Commit the attempt, quota reservation and an outbox record in one database transaction. Dispatch and reconcile unsent records. Scope API idempotency to the authenticated principal and operation, retain a canonical request hash, and return the same attempt for a true replay.

**Acceptance evidence:** Inject failure before and after publication; the job recovers without duplicate logical completion or usage settlement. Describe delivery as at least once with idempotent effects; do not promise exactly-once GPU execution from queue deduplication alone.

### F04 — P1: attempt leases and result publication are underspecified

**Evidence:** [Lifecycle, lines 94–103](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/09_STORAGE_QUEUE_AND_JOB_LIFECYCLE.md#L94-L103) correctly calls for an atomic claim and lease. The [attempt schema, lines 119–145](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/07_DATA_MODEL_AND_DATABASE.md#L119-L145) omits the proposed lease fields. The API inventory has no explicit claim/heartbeat contract. The worker environment also provides no documented database connection through which to perform a claim.

**Impact:** Two deliveries could race to run the same attempt. A stale worker may overwrite a newer result or upload an orphan after deletion.

**Required work:** Choose one authoritative claim mechanism, such as authenticated BFF endpoints backed by transactional database operations. Persist lease expiry, owner, execution/fencing generation and provider execution ID. Require completion to match the active execution, attempt and live job. Register output assets before publication; remove rejected late outputs.

**Acceptance evidence:** Concurrent deliveries allow one active owner. An expired worker cannot publish after another worker takes over. Delete during inference blocks result publication, and late outputs are subsequently removed.

### F05 — P1: the retention promise cannot be represented by one job expiry

**Evidence:** [Database retention, lines 227–237](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/07_DATA_MODEL_AND_DATABASE.md#L227-L237) specifies approximately one hour for anonymous sources and up to 24 hours for outputs. The jobs sketch has only one expires_at field. [Environment defaults, lines 63–67](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/17_ENV_CONFIGURATION_AND_SECRETS.md#L63-L67) already distinguish source and output TTLs. Separately, the master requires history only when explicitly enabled, while [profiles, lines 38–46](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/07_DATA_MODEL_AND_DATABASE.md#L38-L46) defaults history_enabled to true.

**Impact:** A job-wide deletion scan can delete results too soon or retain source images too long. The profile default contradicts the stated opt-in history behavior.

**Required work:** Add an asset inventory with kind, object key, verified identity, expiry, deletion status and timestamps. Specify when each TTL begins, whether activity extends it, and how queued/running work interacts with expiry. Set history to opt-in consistently. Show source and result availability separately.

**Provider check:** R2 lifecycle deletion typically occurs within 24 hours of the expiration value, so lifecycle rules cannot enforce an exact one-hour deletion promise. Use an application sweeper with a documented cleanup interval and deadline; keep lifecycle rules as a backup. [Cloudflare lifecycle behavior](https://developers.cloudflare.com/r2/buckets/object-lifecycles/).

**Acceptance evidence:** Expiring an original does not prematurely remove an eligible result; every derived asset is tracked; cleanup failures are retried and observable.

### F06 — P1: reusable upload URLs conflict with immutable sources and masks

**Evidence:** [Upload flow, lines 89–100](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/03_SYSTEM_ARCHITECTURE.md#L89-L100) finalizes an object after HEAD validation, while [architecture principles, lines 154–158](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/03_SYSTEM_ARCHITECTURE.md#L154-L158) require original immutability. [Mask registration, lines 59–74](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/08_API_AND_EVENT_CONTRACTS.md#L59-L74) accepts an objectKey but does not define how it is bound to a specific issued upload intent.

**Impact:** A valid PUT URL can be used again after finalize, changing the bytes subsequently processed. A header check alone does not prove image dimensions, content or decode safety.

**Provider check:** Cloudflare explicitly states that the same presigned URL can be reused until it expires. [R2 presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/).

**Required work:** Upload into a private staging namespace. Bind each intent to the current owner, job, purpose, allowed format and limit. Promote a verified snapshot to a server-controlled immutable key, with conditional identity checks to avoid a copy/validation race. Never issue browser PUT access to that canonical key. Apply the same rule to masks; validate the exact bytes consumed by inference.

**Acceptance evidence:** Reusing a staging PUT cannot alter an accepted source or mask. Foreign-job keys and reused mask intents fail authorization. Oversized or malformed bytes never reach inference.

### F07 — P1: schema examples need integrity constraints and privilege rules

**Evidence:** [Database chapter](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/07_DATA_MODEL_AND_DATABASE.md) contains useful field sketches and indexes, but no executable DDL/RLS. Many relationships are bare UUID fields. Both user_id and anonymous_session_hash are nullable. The shared processing-attempt proposal requires a non-null input mask, yet detection is allowed to share that table in [API lines 78–87](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/08_API_AND_EVENT_CONTRACTS.md#L78-L87).

**Impact:** A direct translation can permit ownerless jobs, cross-job asset references, inconsistent active attempts or detection records that cannot be inserted. Row ownership alone also does not stop a user changing their own plan.

**Required work:** Implement migrations, foreign keys and deletion policy; enforce exactly one ownership mode; validate same-job mask/attempt references; constrain sizes, ratios and status values. Keep plan/status/usage fields server-controlled with grants and policies. Choose a typed operations table or separate detection operations so each operation's required inputs are representable.

**Acceptance evidence:** Cross-user access and cross-job references fail at the server/database boundary. Owners cannot self-upgrade plans or modify usage. Authenticated and anonymous paths have separate authorization tests.

### F08 — P1: required controls and worker configuration appear too late or in the wrong runtime

**Evidence:** The [roadmap places RLS hardening, rate limiting and retention in Phase 7](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/15_PHASED_IMPLEMENTATION_PLAN.md#L222-L238), after manual and automatic inference phases. The same plan calls the app useful at Phase 3. The [worker environment block](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/17_ENV_CONFIGURATION_AND_SECRETS.md#L72-L98) omits QStash current/next signing keys, while the worker is the signed queue receiver.

**Impact:** A publicly exposed intermediate release could accept costly operations before minimum access and cost controls are ready. Copying the worker environment example leaves no documented QStash verifier configuration.

**Required work:** Move ownership enforcement, baseline RLS, upload limits, rate limits, callback authentication, retention and spend caps into the first relevant endpoints. Keep later hardening for broader testing and operational maturity. Document signing keys at every actual receiving runtime; use a distinct callback credential and replay checks.

**Acceptance evidence:** Forged deliveries and callbacks fail closed; quota checks occur before dispatch; preview environments cannot use production secrets.

### F09 — P1: the AI runtime remains an unvalidated dependency proposal

**Evidence:** [Feasibility lines 74–76](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/02_FEASIBILITY_COMPARISON_AND_DECISIONS.md#L74-L76) and [AI model control, lines 221–240](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/06_AI_ML_PIPELINE.md#L221-L240) refer to LaMa and IOPaint but identify no chosen checkpoint, package lock, checksum or tested runtime. GitHub reports [Sanster/IOPaint](https://github.com/Sanster/IOPaint) as archived.

**Impact:** “Use LaMa/IOPaint” is insufficient for a reproducible production engine. An archived wrapper needs an explicit maintenance decision. It does not mean the LaMa method is unusable.

**Required work:** Select an exact LaMa artifact and adapter, record origin/hash/license evidence, and validate Python, PyTorch, device and codec compatibility in a locked image. Start with one engine and a small owned test set. Add SAM 2/OCR/DINO only after measuring their value and resource cost.

**Acceptance evidence:** Real inference succeeds on the chosen runtime; repeatable benchmark results record artifact and code versions; readiness verifies model availability. Stub-based CI checks must be labelled separately from real inference evidence.

### F10 — P2: the HTTP execution boundary needs an explicit timeout strategy

**Evidence:** [Services](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/05_SERVICES_AND_MICROSERVICES.md) and [processing API](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/08_API_AND_EVENT_CONTRACTS.md) propose QStash delivery directly to a Modal/FastAPI worker, but do not specify whether the request runs inference synchronously or durably starts background execution.

**Provider check:** Current QStash Free allows a 15-minute HTTP response duration; Modal web requests have a 150-second limit. Different timeout layers therefore need separate budgets. [QStash pricing](https://upstash.com/pricing/qstash), [Modal request timeouts](https://modal.com/docs/guide/webhook-timeouts).

**Required work:** Either prove a bounded synchronous path fits the smaller limit including cold starts and I/O, or durably submit a provider job, persist its execution ID and acknowledge delivery. An in-process background task alone is not a durable handoff. Specify transient/permanent error handling, callback retry and reconciliation behavior.

**Acceptance evidence:** A slow worker, timeout or lost callback reaches a recoverable state without an endless retry loop.

### F11 — P2: image coordinates and output metadata need precise contracts

**Evidence:** [Preprocessing and masks](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/06_AI_ML_PIPELINE.md#L43-L67) require orientation normalization and feathering; [the editor plan](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/15_PHASED_IMPLEMENTATION_PLAN.md#L81-L106) requires source-coordinate masks. There is no shared schema defining the normalized image identity, preview transform, mask channel semantics or regeneration base.

**Impact:** A mask can look correct in the browser and affect different pixels in the worker. Re-encoding or compositing can unexpectedly change color, alpha or provenance.

**Required work:** Define one canonical orientation/color space, dimensions and coordinate transform; version it with the source and mask. Separate the model's binary removal mask from the compositing alpha mask. Show the effective expanded/feathered region. Specify whether regeneration uses the original or a prior result, PNG alpha handling, JPEG background flattening and export quality semantics.

C2PA also needs more than copying an old metadata block: a hard binding ties a manifest to particular asset content. Validate the source, preserve its provenance relationship as appropriate, and define how an edited output gets a new edit record/credential when signing is available. Do not present the original credential as proof that edited pixels are unchanged. [C2PA hard bindings](https://spec.c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#_hard_bindings).

**Acceptance evidence:** Portrait EXIF fixtures, high-DPI brush tests, alpha images, crop/tiling boundaries and lossless outside-mask checks pass. Lossy JPEG/WebP re-encoding is evaluated separately from exact decoded-pixel preservation.

### F12 — P2: some UX choices need measurements before they become promises

**Evidence:** [Design tokens and gradient](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/10_UI_UX_DESIGN_SYSTEM.md#L33-L78) provide colors, and [the processing button](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/10_UI_UX_DESIGN_SYSTEM.md#L197-L203) uses that gradient without a specified foreground. [Upload requirements](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/01_PRODUCT_SCOPE_AND_REQUIREMENTS.md#L45-L52) allow 40 MP images.

**Calculated contrast check:** Using the standard sRGB relative-luminance formula at the three supplied gradient stops:

| Foreground | Indigo #596FFF | Violet #A876FF | Rose #FF7EAE |
|---|---:|---:|---:|
| White #FFFFFF | 4.08:1 | 3.13:1 | 2.37:1 |
| Main text #E1E1F0 | 3.16:1 | 2.42:1 | 1.83:1 |

Neither combination is sufficient for normal-size text across the gradient; WCAG AA normally requires 4.5:1. This is a conditional design finding, since no rendered button exists yet. Use a measured solid button fill or a foreground/background combination with comfortable contrast across the actual gradient and interaction states. [WCAG contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

**Calculated memory floor:** One 40 MP RGBA byte buffer is 160 MB; one RGB float32 tensor is 480 MB, before model weights, activations, masks, extra copies and browser/GPU overhead. These are arithmetic lower bounds, not measured app memory.

**Required work:** Set explicit preview, undo and worker memory budgets; test real desktop/mobile interactions. Keep unsupported AI buttons out of the functional tool flow until their backend exists. Define measurable quality gates; replace the ambiguous “P95 failure rate” wording in [testing line 187](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/14_TESTING_QA_AND_BENCHMARKS.md#L178-L187) with a failure percentage over a defined population and separate latency percentiles.

### F13 — P2: the two requirement sources need one canonical contract

**Evidence:** Compare the supplied brief with [route inventory](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/11_PAGES_ROUTES_AND_COMPONENTS.md), [environment names](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/17_ENV_CONFIGURATION_AND_SECRETS.md), [phase plan](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/15_PHASED_IMPLEMENTATION_PLAN.md) and [design tokens](https://github.com/Devinjer/Watermark-Removal-Project---WisperAway/blob/9fea5b253273d6cb6f1b23cbc6449304bf79da16/watermark-removal-blueprint/docs/10_UI_UX_DESIGN_SYSTEM.md). The blueprint itself acknowledges CleanMark is a placeholder.

| Topic | Repository blueprint | Attached brief | Recommended resolution |
|---|---|---|---|
| Product name | CleanMark throughout many examples | WisperAway | Use WisperAway consistently in source, docs and deployment labels |
| App routes | /editor, /history, /settings | /app/editor, /app/history, /app/settings | Choose one map before routing/auth tests; /app matches the newer brief |
| Legal routes | /legal/privacy, /legal/terms | /privacy, /terms | Choose canonical paths and link consistently |
| Formats | JPEG/PNG/WebP; AVIF optional after tests | AVIF included initially | Gate AVIF on actual browser/decoder/encoder coverage |
| Phase numbering | Phase 0 foundation; Phase 3 removal | Phase 0 audit; Phase 5 removal | Use milestone names or a single numbering scheme |
| Storage configuration | R2_BUCKET_MEDIA, R2_ENDPOINT | R2_BUCKET, R2_PUBLIC_ENDPOINT | Use one private-storage config schema; avoid implying public media access |
| Worker configuration | AI_WORKER_BASE_URL, callback secret | AI_WORKER_URL, AI_WORKER_SECRET | Name secrets by direction/purpose and validate required variables |
| Design colors | Secondary #D4BBFF, subtle and strong outlines | Secondary #A876FF, one outline | Define semantic tokens and test actual foreground/background pairs |

The referenced HTML design input is absent, so visual fidelity to that reference cannot be verified. Use the documented palette/layout as provisional requirements rather than claiming the original reference was inspected.

The API inventory also needs the browser-facing smart-selection contract, image/preview access, export conversion behavior and internal claim/reconciliation endpoints required by the selected design. A listed Python segmentation module does not itself define the browser's BFF contract.

## 5. External assumptions checked

These checks were performed against current official pages or the upstream repository. They do not validate installed packages, since none are present.

| Assumption | Result | Implication |
|---|---|---|
| Next.js 16.3.3 | Confirmed by the official August 2026 security announcement | The stated baseline is supported; still lock and test the full dependency set. [Next.js releases](https://nextjs.org/blog) |
| Node.js 24.20.0 LTS | Confirmed by the official releases page | Node 24 LTS is consistent with the blueprint. [Node releases](https://nodejs.org/en/about/previous-releases) |
| Tailwind CSS 4.3 | Official release page exists | Do not label this version invented or unavailable. [Tailwind 4.3](https://tailwindcss.com/blog/tailwindcss-v4-3) |
| R2 Standard free allowance | 10 GB-month, 1M Class A, 10M Class B operations; Internet egress free | Storage allowance is not an inference budget. [R2 pricing](https://developers.cloudflare.com/r2/pricing/) |
| QStash Free | 1,000 messages/day; 1 MB message size; per-queue parallelism 2, overall parallelism 10 | Message count and concurrent execution are separate constraints. Each delivery attempt counts. [QStash pricing](https://upstash.com/pricing/qstash) |
| Supabase Free | 500 MB database, 50,000 MAU, 1 GB file storage; inactivity pause documented | A free database is useful for development; production recovery needs a deliberate plan. [Supabase pricing](https://supabase.com/pricing) |
| Modal Starter | $30/month compute credit | This is a finite credit, not unlimited free GPU capacity. [Modal pricing](https://modal.com/pricing) |
| IOPaint | Upstream repository archived | Make the adapter maintenance decision explicit. [IOPaint](https://github.com/Sanster/IOPaint) |

No real inference timing, cost per successful edit, model accuracy or memory result can be derived from these allowances. The blueprint correctly labels its five-second GPU example as hypothetical.

## 6. Recommended delivery order

Keep the two main runtimes and deliver small, testable milestones.

| Milestone | Deliverable | Exit evidence |
|---|---|---|
| A — Resolve contracts and establish foundation | Canonical names/routes/formats; job/asset/attempt contracts; locked web/worker workspaces; CI | Clean install, builds, health endpoints and contract tests |
| B — Secure upload and deletion | Auth/anonymous ownership; RLS; private staging/canonical media; safe decode; asset expiry; Delete Now | Valid upload survives refresh; invalid and foreign assets rejected; deletion verified |
| C — Manual editor | Preview canvas, brush/erase/rectangle, zoom/pan, undo/redo, source-scale mask | Desktop/touch/EXIF coordinate fixtures and actual mask round trip |
| D — Real manual removal | Pinned LaMa, durable dispatch, fenced attempts, comparison, export, quota accounting | Real end-to-end edit; failed/replayed/deleted/expired work tested |
| E — Measured beta readiness | Quality benchmark, cleanup/reconciliation, alerts, privacy behavior, responsive UX | Frozen benchmark and core security/recovery release gates pass |
| F — Smart and automatic selection | SAM 2, then OCR/DINO proposals and user correction | Measured improvement in mask accuracy, latency and correction effort |
| G — Routing and monetization | OpenCV/detail tiers, credits and provider choice | Demonstrable quality/cost benefit and idempotent accounting |

This preserves the blueprint's main architecture while moving minimum security, retention and cost controls alongside the first usable endpoints.

## 7. Smallest useful MVP

Ship only the complete core loop:

1. Upload JPEG, PNG or WebP with explicit authorization acknowledgement.
2. Validate and persist an immutable source privately.
3. Brush, erase or rectangle-select a mask with undo/redo and zoom/pan.
4. Submit a durable LaMa attempt with visible named stages.
5. Compare, adjust and regenerate while retaining a usable prior result.
6. Download through an authorized short-lived URL.
7. Delete all related media and show accurate expiry behavior.

Automatic detection, lasso, detail diffusion, batch processing, a large SEO/blog inventory, advanced admin and subscriptions can follow without changing this foundation. Their absence in the manual MVP should be visible in the product, rather than represented by nonfunctional controls.

## 8. Verification record and limits

| Check | Actual result |
|---|---|
| Recursive GitHub tree | Complete; 33 files; tree not truncated |
| Numbered docs and ADRs | All 22 chapters and all five ADRs reviewed |
| Consolidated specification | All 22 numbered chapters match exactly |
| Relative Markdown link targets | No missing targets found |
| Source/build inventory | No executable app source, dependency manifest, lockfile or workflow |
| Branches / pull requests / Actions | One branch; zero PRs; zero workflow runs at review time |
| Gradient contrast calculation | Reproduced using supplied colors and the sRGB luminance formula |
| Image memory arithmetic | 160 MB for one 40 MP RGBA buffer; 480 MB for one float32 RGB tensor |
| Lint / TypeScript / unit tests / production build | Not run: no application or configuration exists |
| Worker / real AI / GPU benchmarks | Not run: no executable worker or model artifacts exist |
| R2 / Supabase / queue / deployment behavior | Not integration-tested; no configured deployment was inspected |

Only analysis materials were created in this review. No application changes, GitHub commits, issues, pull requests or deployments were made.

**Recommended next engineering task:** implement milestones A–D, with the findings above converted into explicit contracts and acceptance checks. The first success criterion is one reliable, private, recoverable manual edit from upload through deletion.

