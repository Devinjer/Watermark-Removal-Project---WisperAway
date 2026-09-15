# Changes Made

## Change — Executable monorepo foundation

### Problem
Repository had specifications but no buildable application.

### Solution
Added pnpm/Turborepo workspace with Next.js web/BFF, FastAPI worker, shared contracts and CI.

### Verification
GitHub Actions verifies web/contracts and worker successfully.

## Change — Separate job and attempt lifecycle

### Problem
Earlier specification mixed logical job availability with retry/regeneration execution state.

### Solution
Added a small job lifecycle and a separate immutable processing-attempt lifecycle. Terminal attempts cannot transition back into processing.

### Verification
Vitest transition tests pass.

## Change — Worker readiness semantics

### Problem
A worker could otherwise report healthy before a required AI artifact exists.

### Solution
`/health/live` represents process liveness; readiness evaluates model requirement/version/artifact marker and returns not-ready when unavailable.

### Verification
pytest readiness cases pass.

## Change — pnpm 12 build policy

### Problem
pnpm blocked the `unrs-resolver` install script.

### Solution
Configured `allowBuilds` in `pnpm-workspace.yaml` for that exact dependency.

### Verification
GitHub Actions dependency installation passes.

## Change — Compatible TypeScript/ESLint toolchain

### Problem
TypeScript 7 and ESLint 10 were ahead of current Next/typescript-eslint/react-plugin compatibility.

### Solution
Pinned TypeScript 6.0.3 and ESLint 9.39.5 without disabling rules.

### Verification
Lint, typecheck, tests and Next production build pass.
