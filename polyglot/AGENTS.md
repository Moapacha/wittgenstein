# AGENTS.md

Polyglot is a harness-first multimodal repo. The LLM is the planner; the runtime in this repo is the operating system. Do not treat prompts as the source of truth when a contract can be written as code or docs.

## Thesis

Polyglot turns text-first LLMs into systems that emit real files through codecs:

- L1 Harness / Runtime: routing, schema injection, retry, budget, telemetry, sandbox, invariants.
- L2 IR / Codec: one structured IR per modality.
- L3 Renderer / Decoder: deterministic renderer or frozen decoder turns IR into a file.
- L4 Optional Adapter: a small learned translator when a decoder needs a latent-code bridge.
- L5 Packaging / Distribution: CLI, docs, install, agent primers, artifact conventions.

Read [`docs/architecture.md`](docs/architecture.md) before changing structure.

## Locked Constraints

- Image has exactly one shipping path: `LLM -> structured JSON scene -> adapter -> frozen decoder -> PNG`.
- There is no image fallback in this scaffold. No SVG, HTML, Canvas, or painter tier.
- Decoder is not generator. Frozen pretrained decoders are allowed; diffusion and text-to-image generators are out of scope.
- Every run must be traceable in `artifacts/runs/<run-id>/`.
- Shared contracts live in `packages/schemas`; codec packages should depend on schemas, not on each other.

## Repo Map

- `packages/schemas/` — shared zod schemas, `PolyglotCodec`, `RunManifest`
- `packages/core/` — registry, router, harness, config, retry, budget, seed, telemetry
- `packages/sandbox/` — reserved untrusted-code boundary
- `packages/codec-image/` — sole neural image codec
- `packages/codec-audio/` — speech / soundscape / music codec routes
- `packages/codec-video/` — video composition IR + HyperFrames wrapper stub
- `packages/codec-sensor/` — procedural signal IR + deterministic signal stubs
- `packages/cli/` — `polyglot` entrypoint and subcommands
- `apps/site/` — official site app
- `docs/` — system of record

## Working Rules

- Schema-first: every external boundary gets a zod schema.
- Fail loudly: use structured errors, not magic strings.
- Keep package boundaries clean: `schemas` has no runtime logic; codecs do not own harness code.
- If output semantics change, update docs and goldens together.
- Put future architectural choices in ADRs instead of burying them in PR text.
- When in doubt, prefer traceability over convenience.

## Read Order

1. [`docs/build-philosophy.md`](docs/build-philosophy.md)
2. [`docs/hard-constraints.md`](docs/hard-constraints.md)
3. [`docs/codec-protocol.md`](docs/codec-protocol.md)
4. [`docs/reproducibility.md`](docs/reproducibility.md)
5. [`docs/team-split.md`](docs/team-split.md)
6. [`docs/codecs/image.md`](docs/codecs/image.md) for the sole image path

## Do Not Do

- Do not add a second image path as a “temporary fallback”.
- Do not hide modality contracts in prompt prose only.
- Do not write artifacts outside `artifacts/` unless the CLI command explicitly asks for an output path.
- Do not bypass the manifest spine for “quick experiments”.
