# Build Philosophy

Polyglot is not “a big prompt that happens to render files.” It is a harness.

## Principles

- The LLM is planner, not runtime.
- Structured IR is the handoff between model semantics and modality-specific execution.
- Decoder does not mean generator. Frozen decoders and deterministic renderers are in-bounds.
- Reproducibility is part of the product, not an afterthought.
- Package boundaries matter because the repo is designed for team split and long-term extension.

## Consequence

When a behavior can be locked in code, schema, docs, or CI, do that instead of burying it in prompt prose.
