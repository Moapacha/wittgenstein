# AGENTS.md

Wittgenstein is a harness-first multimodal repo. The LLM is the planner; the runtime in this repo is the operating system. Do not treat prompts as the source of truth when a contract can be written as code or docs.

## Thesis

Wittgenstein turns text-first LLMs into systems that emit real files through codecs:

- L1 Harness / Runtime: routing, schema injection, retry, budget, telemetry, sandbox, invariants.
- L2 IR / Codec: one structured IR per modality.
- L3 Renderer / Decoder: deterministic renderer or frozen decoder turns IR into a file.
- L4 Optional Adapter: a small learned translator when a decoder needs a latent-code bridge.
- L5 Packaging / Distribution: CLI, docs, install, agent primers, artifact conventions.

Read [`docs/architecture.md`](docs/architecture.md) before changing structure.

## Locked Constraints

- Image has exactly one shipping path: `LLM -> structured JSON scene -> adapter -> frozen decoder -> PNG`.
- There is no **raster image** fallback in this scaffold. No SVG-as-PNG, HTML, Canvas, or painter tier for the image codec.
- A separate **`svg` modality** (`packages/codec-svg`) targets vector output via a local grammar-constrained engine (`research/chat2svg-lora/`); it is not an image-path escape hatch.
- Decoder is not generator. Frozen pretrained decoders are allowed; diffusion and text-to-image generators are out of scope.
- Every run must be traceable in `artifacts/runs/<run-id>/`.
- Shared contracts live in `packages/schemas`; codec packages should depend on schemas, not on each other.

## Repo Map

- `packages/agent-contact-text/` — extended agent primers (`00_INDEX`, Build Book, execution context, research dossier); read [`packages/agent-contact-text/README.md`](packages/agent-contact-text/README.md) after this file when you need depth
- `packages/schemas/` — shared zod schemas, `WittgensteinCodec`, `RunManifest`
- `packages/core/` — registry, router, harness, config, retry, budget, seed, telemetry
- `packages/sandbox/` — reserved untrusted-code boundary
- `packages/codec-image/` — sole neural image codec
- `packages/codec-audio/` — speech / soundscape / music codec routes
- `packages/codec-video/` — video composition IR + HyperFrames wrapper stub
- `packages/codec-sensor/` — procedural signal IR + deterministic signal stubs
- `packages/codec-svg/` — SVG IR (`{"svg": "..."}`) + deterministic write; generation is delegated to the grammar engine HTTP contract
- `packages/cli/` — `wittgenstein` entrypoint and subcommands
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

**Start here for any task:**
0. [`.claude/AGENT_PROMPT.md`](.claude/AGENT_PROMPT.md) — what you are, where to find answers, how to work here
1. [`docs/engineering-discipline.md`](docs/engineering-discipline.md) — code style, robustness, testing, reporting standards

**Then context:**
2. [`docs/THESIS.md`](docs/THESIS.md) — smallest locked statement
3. [`docs/hard-constraints.md`](docs/hard-constraints.md) — what will not change
4. [`docs/build-philosophy.md`](docs/build-philosophy.md)
5. [`docs/codec-protocol.md`](docs/codec-protocol.md)
6. [`docs/reproducibility.md`](docs/reproducibility.md)

**Then decision records:**
7. [`docs/tracks.md`](docs/tracks.md)
8. [`docs/rfcs/README.md`](docs/rfcs/README.md)
9. [`docs/adrs/README.md`](docs/adrs/README.md)

**Then research and execution:**
10. [`docs/research/briefs/README.md`](docs/research/briefs/README.md)
11. [`docs/exec-plans/active/codec-v2-port.md`](docs/exec-plans/active/codec-v2-port.md) — the live P6 plan
12. [`docs/codecs/`](docs/codecs/) — per-modality docs (image.md, audio.md, sensor.md)
13. [`docs/agent-guides/`](docs/agent-guides/) — port recipes and implementation briefs

**Optional depth:**
- [`packages/agent-contact-text/README.md`](packages/agent-contact-text/README.md) + context corpus for long-form context
- [`docs/team-split.md`](docs/team-split.md)

## Do Not Do

- Do not add a second image path as a “temporary fallback”.
- Do not hide modality contracts in prompt prose only.
- Do not write artifacts outside `artifacts/` unless the CLI command explicitly asks for an output path.
- Do not bypass the manifest spine for “quick experiments”.
