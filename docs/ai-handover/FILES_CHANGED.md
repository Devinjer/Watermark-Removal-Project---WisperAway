# Files Changed

## Root/workspace
- `.env.example` — documented placeholder configuration groups.
- `.gitignore` — Node/Python/build/env ignores.
- `.npmrc` — compatibility settings retained for ESLint/pnpm ecosystem.
- `.nvmrc` — Node 24.21.0.
- `package.json` — root Turbo scripts and pnpm version.
- `pnpm-workspace.yaml` — workspaces plus pnpm 12 `allowBuilds` rule.
- `turbo.json` — build/lint/typecheck/test pipeline.
- `README.md` — current executable foundation and local commands.

## Web
- `apps/web/package.json`
- `apps/web/next.config.ts`
- `apps/web/tsconfig.json`
- `apps/web/postcss.config.mjs`
- `apps/web/eslint.config.mjs`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/globals.css`
- `apps/web/src/app/api/health/route.ts`
- `apps/web/src/lib/env.ts`

## Shared contracts
- `packages/contracts/package.json`
- `packages/contracts/tsconfig.json`
- `packages/contracts/src/index.ts`
- `packages/contracts/src/job-state.ts`
- `packages/contracts/tests/job-state.test.ts`

## Worker
- `apps/worker/.python-version`
- `apps/worker/pyproject.toml`
- `apps/worker/src/wisperaway_worker/__init__.py`
- `apps/worker/src/wisperaway_worker/config.py`
- `apps/worker/src/wisperaway_worker/readiness.py`
- `apps/worker/src/wisperaway_worker/main.py`
- `apps/worker/tests/test_readiness.py`

## CI / architecture
- `.github/workflows/ci.yml`
- `docs/adr/0006-milestone-a-foundation.md`
