# Architecture

Polyglot is a five-layer harness. The layers are explicit in the repo so future contributors cannot “implement the idea” in the wrong place.

| Layer | Role | Where it lives |
| --- | --- | --- |
| L1 Harness / Runtime | Planner orchestration, routing, retry, budget, telemetry, sandbox, invariants | `packages/core/src/runtime/*`, `packages/sandbox/`, `AGENTS.md`, `.claude/CLAUDE.md`, CI |
| L2 IR / Codec | Natural structured modality IR, expressed as zod schemas and prompt preambles | `packages/codec-*/src/schema.ts`, `docs/codec-protocol.md`, `docs/codecs/*.md` |
| L3 Renderer / Decoder | IR to file via deterministic renderer or frozen decoder | `packages/codec-image/src/pipeline/decoder.ts`, `packages/codec-audio/src/routes/*`, `packages/codec-video/src/hyperframes-wrapper.ts`, `packages/codec-sensor/src/signals/*` |
| L4 Optional Adapter | Small learned translator when a decoder needs latent-code alignment | `packages/codec-image/src/pipeline/adapter.ts`, `packages/codec-image/src/adapters/`, `packages/codec-image/src/training/` |
| L5 Packaging / Distribution | CLI, install, docs, skills, output conventions, ownership | `packages/cli/`, `scripts/install.sh`, `AGENTS.md`, `.claude/CLAUDE.md`, `docs/distribution.md`, `CODEOWNERS` |

## Dataflow

1. CLI validates the user request and loads config.
2. Core chooses a codec by modality.
3. Core injects schema preamble and asks the model for JSON.
4. Codec parses and validates the JSON IR.
5. Codec render path turns IR into a file.
6. Runtime writes artifact traces into `artifacts/runs/<run-id>/`.

## Sole Image Path

Image is intentionally narrow:

`LLM -> structured JSON scene spec -> adapter -> frozen decoder -> PNG`

There is no SVG, HTML, Canvas, or raster-painter fallback. The schedule risk is accepted because the research path is the product path.
