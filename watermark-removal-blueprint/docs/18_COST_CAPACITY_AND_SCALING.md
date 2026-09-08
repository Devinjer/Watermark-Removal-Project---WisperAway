# 18 — Cost, Capacity and Scaling

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Provides current free-tier facts, cost formulas, scaling triggers and unit-economics instrumentation.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## 1. Current research snapshot

Verified 2026-09-08 from official sources:

### Cloudflare R2 Standard free tier

- 10 GB-month storage/month
- 1 million Class A operations/month
- 10 million Class B operations/month
- Internet egress free

Paid Standard rates in the source at research time include $0.015/GB-month storage, $4.50/million Class A and $0.36/million Class B.

### Upstash QStash Free

- 1,000 messages/day
- 50 GB monthly bandwidth
- 1 MB max message size
- free plan max parallelism/queue parallelism are limited

### Supabase Free

- 500 MB database
- 50,000 MAU
- 1 GB file storage
- 5 GB egress plus cached egress quota as listed by provider
- two active free projects
- projects may pause after inactivity

### Modal Starter

- $30/month free compute credit
- per-second active compute pricing
- T4 and other GPU types available

## 2. Why free tier is enough only for MVP/testing

The bottleneck becomes GPU compute and queue messages before object-storage egress. Production should not be designed to remain permanently within free-tier quotas.

## 3. Per-job cost formula

Track:

```text
job_cost =
  gpu_seconds * gpu_rate
+ cpu_seconds * cpu_rate
+ memory_gib_seconds * memory_rate
+ storage_gb_month_fraction
+ r2_ops
+ qstash_messages
+ database/observability allocation
+ third_party_model_calls
```

Never estimate profitability using only “GPU price per hour”. Cold start, model load, retries and failed jobs matter.

## 4. Example GPU math

At the research-time Modal T4 rate of `$0.000164/sec`, a hypothetical **5 seconds of billed T4 time** would be about `$0.00082` for GPU time alone, before CPU/memory/storage and startup effects. This is illustrative, not a performance promise.

## 5. Instrument from day one

For each attempt record:

- provider
- GPU type
- billed/active seconds if available
- inference seconds
- model load/cold-start indicator
- source megapixels
- mask ratio
- quality mode
- retry count
- success/failure

Then calculate actual cost distribution by job class.

## 6. Scaling stages

### Stage A — prototype

- Vercel Hobby/preview
- Supabase Free
- R2 Free allowance
- QStash Free
- Modal Starter credit

### Stage B — public beta

- paid database plan for backups/no inactivity pause
- production observability
- paid/burst QStash if message volume requires
- spend alerts on GPU provider

### Stage C — paid product

- explicit credits/limits
- provider benchmark between Modal/RunPod/managed inference
- dedicated warm workers only if cold-start/volume economics justify

### Stage D — scale

- per-model worker pools
- autoscaling queues
- regional storage/processing analysis
- dedicated inference router
- potentially reserved/dedicated GPUs at sustained utilization

## 7. Capacity metrics

Track:

```text
jobs/day
attempts/job
messages/job
MB uploaded/job
MB output/job
GPU seconds/job
P50/P95 processing latency
concurrent processing
cold-start rate
retry rate
```

## 8. Cost guardrails

- hard daily anonymous processing cap.
- account quota.
- maximum megapixels by plan.
- Detail mode entitlement.
- provider per-request timeout.
- maximum retries.
- cost anomaly alert.
- circuit breaker for a failing expensive provider.

## 9. Storage projection

With ephemeral images, storage cost is primarily driven by concurrent retention rather than lifetime total processed volume. Retention is therefore both a privacy control and a cost lever.
