# Reproducibility

Every CLI invocation creates `artifacts/runs/<run-id>/manifest.json`.

## Manifest Fields

- git SHA
- lockfile hash
- Node version
- Polyglot version
- command and args
- seed
- codec and route
- provider and model
- prompt raw and prompt expanded
- raw model output and parsed output
- artifact path and artifact hash
- duration, success flag, structured error

## Sibling Files

- `llm-input.txt`
- `llm-output.txt`
- final artifact when rendering succeeds

## Seed Rules

- CLI can pass `--seed`.
- Config can provide `runtime.defaultSeed`.
- The resolved seed is written to the manifest even on failure.

## Why This Exists

The manifest spine is the main quality bar in this scaffold. A failing run is still useful if it leaves a complete trace.
