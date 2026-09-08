# 20 — Definition of Done and Release Gates

**Project:** Watermark Removal Platform (working name: CleanMark)  
**Document version:** 1.0  
**Prepared:** 2026-09-08  
**Status:** Architecture / implementation blueprint  

> **Purpose:** Defines what “complete” means for features, services and the public launch.

> Product boundary: the platform is designed for images the user owns or is authorized to modify. It does not intentionally remove hidden provenance, C2PA Content Credentials, or other non-visible rights-management information.

---

## 1. Feature Definition of Done

A feature is done when:

- product acceptance criteria pass;
- TypeScript/Python types and validation are complete;
- unit/integration tests exist where appropriate;
- accessibility interactions are reviewed;
- analytics event is defined if needed;
- errors/retry UX exists;
- observability is present for backend work;
- docs/configuration are updated;
- no unreviewed secrets/config are committed;
- security/privacy implications are considered.

## 2. V1 public beta release gate

### Product

- [ ] Upload works for JPEG/PNG/WebP.
- [ ] Authorization checkbox required.
- [ ] Manual brush + eraser + rectangle.
- [ ] Zoom/pan/undo/redo.
- [ ] LaMa processing.
- [ ] Before/after.
- [ ] Export.
- [ ] Immediate delete.
- [ ] Clear expiry UI.

### Reliability

- [ ] Duplicate process request does not duplicate a completed attempt.
- [ ] QStash retry tested.
- [ ] Lost callback reconciliation tested.
- [ ] Failed provider leaves editor recoverable.

### Security

- [ ] Private R2 verified.
- [ ] Signed URL TTL verified.
- [ ] Job IDOR tests pass.
- [ ] QStash signature validation passes/fails correctly.
- [ ] Admin authorization tests pass.
- [ ] MIME spoof/malformed file tests pass.
- [ ] Rate limit works.

### Privacy

- [ ] Delete removes all known media objects.
- [ ] Retention cleanup runs automatically.
- [ ] Logs contain no signed URLs/image binary.
- [ ] Training reuse disabled by default.
- [ ] Privacy policy matches actual behavior.

### AI/model

- [ ] LaMa artifact checksum pinned.
- [ ] License record completed.
- [ ] Frozen benchmark executed.
- [ ] Outside-mask preservation check meets threshold.

### Operations

- [ ] Error monitoring configured.
- [ ] Cost alerts configured.
- [ ] Stale-job alert/reconciliation configured.
- [ ] Runbook exists.
- [ ] Rollback tested.

## 3. Auto-detect release gate

- [ ] Candidate benchmark frozen/versioned.
- [ ] Candidate recall/precision targets agreed.
- [ ] Large low-confidence regions require confirmation.
- [ ] User can deselect each candidate.
- [ ] User can edit final union mask.
- [ ] Failures do not auto-process unintended content.

## 4. Paid plan release gate

- [ ] Usage ledger immutable.
- [ ] Credit reservation/settlement idempotent.
- [ ] Technical failure refund behavior tested.
- [ ] Billing webhooks signed and replay-safe.
- [ ] Spend cap / provider anomaly alerts.
- [ ] Plan entitlements enforced server-side, not only hidden in UI.

## 5. Public API release gate

- [ ] API key scopes.
- [ ] per-key rate limit.
- [ ] versioning policy.
- [ ] signed webhooks.
- [ ] idempotency documentation.
- [ ] developer AUP.
- [ ] example clients/tests.
- [ ] no direct object-storage secrets exposed.

## 6. Performance targets to validate, not assume

Set final targets after baseline hardware measurement. Starting product targets:

- BFF non-inference P95 < 500 ms for common metadata routes.
- Editor interaction responsive without full-resolution redraw per pointer event.
- Standard processing P95 tracked separately by image megapixels/mask ratio rather than one misleading global target.

## 7. Launch checklist owner fields

Convert this file to actual issue/checklist items with owner and evidence links before launch.
