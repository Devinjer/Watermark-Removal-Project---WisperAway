# Instructions for the Next AI Agent

You are continuing an existing implementation. **Do not restart the project and do not produce another broad architecture audit.**

## Read First

1. `HANDOVER.md`
2. `CURRENT_STATE.md`
3. `ERRORS_AND_FIXES.md`
4. `PENDING_TASKS.md`
5. `DECISIONS.md`
6. the 2026-09-08 repository audit in `watermark-removal-blueprint/docs/audits/`

## First Objective

Implement Milestone B secure persistence/upload/deletion while preserving the green Milestone A CI baseline.

## Inspect First

- `packages/contracts/src/`
- `apps/web/src/`
- `apps/worker/src/`
- `.env.example`
- `.github/workflows/ci.yml`
- `pnpm-workspace.yaml`
- `docs/adr/0006-milestone-a-foundation.md`

## Run First

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build

cd apps/worker
uv sync --extra dev
uv run ruff check .
uv run mypy
uv run pytest -q
```

## Then Continue With

1. Add database package/migrations only when required by Milestone B.
2. Define `jobs`, `assets`, `upload_intents` and ownership/RLS.
3. Implement upload intent creation and private staging key policy.
4. Implement server-side exact-byte validation and immutable promotion.
5. Add asset expiry/deletion model.
6. Add rate limits and authorization tests.
7. Keep upload UI disabled until these controls are operational.

## Do Not Repeat

- Do not use TypeScript 7 with the current lint stack.
- Do not upgrade to ESLint 10 until React/Next plugin compatibility is verified.
- Do not use `package.json#pnpm.onlyBuiltDependencies` for pnpm 12.
- Do not reintroduce job states that model individual inference attempts.
- Do not expose canonical R2 object keys to browser PUT access.

## Definition of Milestone B Done

- [ ] User/session can create a job and staging upload intent.
- [ ] Uploaded bytes are decoded and validated before acceptance.
- [ ] Accepted source is immutable and privately stored.
- [ ] Ownership is enforced by server and database/RLS.
- [ ] Asset expiry is tracked independently.
- [ ] Delete Now removes all tracked media and is retry-safe.
- [ ] Rate limits protect upload/finalize endpoints.
- [ ] Integration/authorization tests pass.
- [ ] Existing CI remains green.
