# Pending Tasks

## P0 — Critical

- [ ] Implement Milestone B PostgreSQL migrations and baseline RLS.
  - Enforce exactly one ownership mode: authenticated user or anonymous session.
  - Add jobs, assets and upload intents.
  - Verification: cross-user and cross-job access fails.

- [ ] Implement private staged upload and immutable canonical promotion.
  - Browser writes only to staging key.
  - Server validates exact bytes and promotes to server-controlled canonical key.
  - Verification: reusing staging PUT cannot mutate accepted source.

- [ ] Implement safe image validation.
  - Decode bytes; enforce format, dimensions, pixel/file limits, orientation and alpha rules.
  - Verification: malformed/oversized files never become canonical assets.

- [ ] Implement asset-level retention and Delete Now.
  - Track source/mask/result/preview/thumbnails independently.
  - Verification: completed and failed jobs can be deleted; late outputs cannot republish.

- [ ] Add baseline rate limiting before public upload/processing.

## P1 — High Priority

- [ ] Milestone C manual source-coordinate mask editor.
- [ ] Coordinate transform fixtures including EXIF rotation and high-DPI/touch cases.
- [ ] Memory-efficient undo/redo based on commands/deltas, not full 40 MP bitmaps.

- [ ] Milestone D transactional outbox + idempotency.
- [ ] Attempt lease/fencing and authenticated QStash delivery.
- [ ] Select/pin exact LaMa artifact, license evidence, checksum and GPU/runtime.
- [ ] Implement real inference and before/after/regenerate/download.

## P2 — Medium Priority

- [ ] Reconciliation/sweeper jobs and operational metrics.
- [ ] E2E Playwright flow.
- [ ] Real inference benchmark dataset.
- [ ] Deployment setup.

## P3 — Later

- [ ] SAM 2 smart selection.
- [ ] PaddleOCR/Grounding DINO proposals.
- [ ] Intelligent model router.
- [ ] Monetization, batch processing, advanced admin.
