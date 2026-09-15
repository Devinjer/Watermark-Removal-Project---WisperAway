# Errors and Fixes

## Error 1 — pnpm ignored dependency build script

### Error
`ERR_PNPM_IGNORED_BUILDS` — ignored build scripts: `unrs-resolver@1.12.2`.

### Root Cause
pnpm 12 requires an explicit build-script allow policy.

### Failed Approach
Added `pnpm.onlyBuiltDependencies` to `package.json`.

### Why It Failed
pnpm 12 emitted a warning that the `pnpm` field in `package.json` is no longer read for this setting.

### Final Fix
Configured in `pnpm-workspace.yaml`:

```yaml
allowBuilds:
  unrs-resolver: true
```

### Verification
Subsequent CI dependency install passed and the `unrs-resolver` postinstall executed.

### Status
RESOLVED

---

## Error 2 — TypeScript 7 unsupported by typescript-eslint stack

### Error
`typescript-eslint does not support TS 7.0.`

### Root Cause
The current Next.js ESLint dependency chain had not adopted TypeScript 7's API.

### Final Fix
Pinned `typescript` to `6.0.3` in `apps/web` and `packages/contracts`.

### Status
RESOLVED

---

## Error 3 — ESLint 10 incompatible with React ESLint plugin

### Error
`TypeError: Error while loading rule 'react/display-name': contextOrFilename.getFilename is not a function`.

### Root Cause
The installed React lint plugin expected the ESLint 9 rule context API while ESLint 10 changed it.

### Final Fix
Pinned `eslint` to `9.39.5`. No lint rule was disabled.

### Verification
Web lint passed in GitHub Actions.

### Status
RESOLVED
