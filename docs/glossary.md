# Glossary

This page defines the locked vocabulary for v0.2 in one place. It is the shortest useful companion to `AGENTS.md`, `docs/THESIS.md`, and ADR-0011.

## Locked terms

- **Harness** — the L1 runtime that routes, retries, seeds, validates, budgets, and records each run.
- **Codec** — the modality-owned implementation that turns a request into an artifact through a structured pipeline.
- **Spec** — the structured, human-readable modality artifact that the LLM is asked to produce before decoding.
- **IR** — the typed internal representation a codec carries across `expand / adapt / decode`; at v0.2 only `IR.Text` is inhabited.
- **Decoder** — the L3 component that turns IR-adjacent inputs into bytes on disk.
- **Adapter** — the optional L4 learned bridge between symbolic plans and decoder inputs.
- **Packaging** — the L5 layer that exposes the system through CLI, docs, install surfaces, and reproducibility conventions.

## Cross-cutting concepts

- **Route** — a codec-internal strategy path chosen by the codec, not by harness-level modality branching.
- **RunManifest** — the receipts file that records git SHA, seed, artifact hashes, model/provider info, cost, latency, and errors.
- **`produce`** — the canonical codec primitive from RFC-0001 that owns artifact generation end-to-end.
- **`IR.Text`** — the only inhabited IR variant at v0.2; the text-native planning payload that codecs adapt and decode.
- **No silent fallback** — any route or model failure must surface as a structured error and a manifest row, never as an invisible replacement path.
- **Decoder ≠ generator** — the repo allows deterministic or frozen decoders in the default path, not general-purpose image/video generation systems.

## Use

If a new term cannot be mapped to one of the words above, it does not belong in the v0.2 doctrine without a new RFC or ADR.
