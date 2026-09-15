# Session History

## 2026-09-08 — Architecture Audit

### Result
The repository was verified to contain architecture/specification documentation but no executable application. The audit prioritized a reliable manual removal workflow and identified P0/P1 contracts: immutable uploads, attempts/leases, transactional dispatch, asset-level retention, RLS, exact model runtime and coordinate/mask semantics.

## 2026-09-15 — Milestone A Implementation

### Objective
Start actual implementation rather than produce another plan.

### Work
- Verified latest repository state.
- Created branch `build/milestone-a-foundation`.
- Added executable web and worker foundations plus shared contracts and CI.
- Opened PR #1.
- Ran GitHub Actions and fixed failures iteratively.

### CI Failure 1
pnpm install failed with `ERR_PNPM_IGNORED_BUILDS` for `unrs-resolver@1.12.2`.

### Failed Fix
Added `pnpm.onlyBuiltDependencies` in root `package.json`. pnpm 12 explicitly reported that this location is no longer read.

### Final Fix
Moved build permission into `pnpm-workspace.yaml` using `allowBuilds` for `unrs-resolver`.

### CI Failure 2
Lint failed because typescript-eslint did not support TypeScript 7.0 in the installed stack.

### Fix
Pinned TypeScript to `6.0.3` in web and contracts packages.

### CI Failure 3
Lint then reached `eslint-plugin-react` and crashed under ESLint 10 (`contextOrFilename.getFilename is not a function`).

### Fix
Pinned ESLint to `9.39.5`.

### Final Result
GitHub Actions run `35002913404` passed both jobs. Web dependency install, lint, typecheck, tests and production build passed. Worker dependency install, Ruff, mypy, pytest and Python compilation passed.
