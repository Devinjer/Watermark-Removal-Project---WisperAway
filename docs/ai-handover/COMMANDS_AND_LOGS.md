# Commands and Logs

## Local/static verification available in the session environment

```bash
python3 -m compileall -q apps/worker/src apps/worker/tests
```

Result: no Python syntax errors.

JSON package/config files were parsed successfully using Python.

A local system TypeScript compiler emitted no diagnostics for the shared contract source, but GitHub Actions is the authoritative toolchain verification because the local environment did not have pnpm and could not clone/install from GitHub.

## GitHub Actions

Workflow: `.github/workflows/ci.yml`

Final verified run: `35002913404`

### Web/contracts

```text
Install dependencies  PASS
Lint                  PASS
Typecheck             PASS
Test                   PASS
Build                  PASS
```

### Worker

```text
Install dependencies  PASS
Ruff                   PASS
Mypy                   PASS
Pytest                 PASS
Compile                PASS
```

## Important historical CI findings

1. `ERR_PNPM_IGNORED_BUILDS` for `unrs-resolver@1.12.2`.
2. `typescript-eslint does not support TS 7.0.`
3. `react/display-name`: `contextOrFilename.getFilename is not a function` under ESLint 10.

All three are resolved in the branch.
