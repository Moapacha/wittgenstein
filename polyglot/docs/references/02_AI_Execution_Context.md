# Polyglot / Modality Harness — AI Execution Context

Paste this into Claude Code / Codex / Cursor / OpenCode at session start.

## Project identity

You are working on **Polyglot**, a modality harness for text-first LLMs.

One-line definition:

> Polyglot is a multimodal compiler layer that lets text-first LLMs emit real media files through portable codecs, local renderers, retrieval pipelines, and lightweight adapter bundles.

## Do not misunderstand the project

This is **not**:

- a generic agent framework,
- a cloud wrapper around DALL-E / ElevenLabs / Runway,
- a claim that a text LLM became a universal native multimodal foundation model,
- or a pixel-by-pixel image generator.

This **is**:

- a harness extension,
- a codec system,
- a structured-output compiler,
- a local rendering/decoding pipeline,
- and optionally a home for tiny modality-specific learned adapters.

## Hard constraints

1. The base model call should remain the main paid token cost.
2. Middleware work should be local whenever possible.
3. Final outputs must be real files: PNG / WAV/MP3 / MP4 / JSON.
4. We prefer deterministic or semi-deterministic paths.
5. The repo must feel agent-native:
   - short AGENTS.md,
   - docs as system of record,
   - small focused skills/codecs,
   - explicit execution plans,
   - pause/resume-friendly jobs.

## Locked architecture

### Layer 1 — Schema / Grammar

- Build modality-specific constrained outputs.
- Prefer JSON first, then compile into lower-level representations.
- Use grammar-constrained generation when it improves reliability.

### Layer 2 — Renderer / Decoder / Mixer / Retriever

- Parse and validate structured output.
- Render SVG/Canvas/HTML to PNG.
- Render SSML/voice spec to WAV/MP3.
- Render video JSON to HyperFrames composition to MP4.
- Render sensor spec to arrays/charts/exports.

### Layer 3 — Optional learned adapter

- Small post-training only.
- Allowed only when tightly scoped and clearly separated from the base model.
- Best candidate: image neural codec spike.

## Shipping priorities

### P0

1. `polyglot image` -> PNG
2. `polyglot audio` -> WAV/MP3
3. `polyglot video` -> MP4
4. `polyglot init` / config
5. benchmark script
6. docs and landing demo

### P1

1. sensor codec
2. soundscape retrieval + mix
3. runtime/skill integration polish
4. image raster painter improvement

### P2

1. image neural codec adapter spike
2. music codec
3. 3D codec

## Image policy

Image is tiered.

### Tier P0

- JSON scene spec
- compile to SVG / HTML / Canvas / program
- render to PNG

### Tier P1

- raster painting route
- textures, blends, masks, typography, procedural effects

### Tier P2

- latent spec -> adapter -> image codes -> frozen decoder -> PNG

Never claim open-domain photorealistic parity with major native image models unless benchmarked.

## Audio policy

### Speech

- default route: SSML/voice spec -> local TTS -> WAV/MP3

### Environmental audio

- default route: soundscape JSON -> semantic retrieval -> deterministic mixing -> MP3

### Music

- optional route: symbolic music -> synth render

## Video policy

- use HyperFrames-style HTML/video compilation
- do not reinvent a new timeline engine for the hackathon

## Sensor policy

- prefer procedural signal specs over giant raw arrays
- generate raw data only after local expansion

## CLI shape

```bash
polyglot init
polyglot image "prompt" --out out.png
polyglot audio "prompt" --out out.mp3
polyglot video "prompt" --out out.mp4
polyglot sensor "prompt" --out out.json
```

## Repo structure

```text
polyglot/
  AGENTS.md
  docs/
  packages/
    core/
    cli/
    codec-image/
    codec-audio/
    codec-video/
    codec-sensor/
  benchmarks/
  site/
```

## Documentation rules

- `AGENTS.md` must be short and act as a map.
- Deep knowledge belongs in `docs/`.
- Each codec must have its own doc page.
- Plans and progress logs belong in versioned markdown files.

## Working style

1. Prefer small composable modules.
2. Prefer schema-first design.
3. Fail loudly and structurally.
4. Keep examples executable.
5. Avoid giant prompt blobs.
6. Never hide architecture decisions inside ad hoc prompts.

## Forbidden moves

- adding external image/audio/video generation APIs to the core product story,
- replacing the harness thesis with a full multimodal model thesis,
- mixing control flow and renderer logic in one file,
- making one gigantic “universal codec” module,
- shipping image features that look impressive but are impossible to explain under scrutiny.

## Acceptance criteria

A build is acceptable when:

1. The CLI works end-to-end for image, audio, and video.
2. Files are saved reliably.
3. The project has a clean README + AGENTS.md + docs index.
4. The pitch demo can run without hand-waving.
5. The architecture matches the harness thesis.
