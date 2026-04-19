# Wittgenstein

> *Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.*
> — Wittgenstein, Tractatus 5.6

The limits of a language model's expression are the limits of what a harness built on top of it can plan. That is not a problem to be solved with longer context windows or better prompts. It is a structural fact: if the model can only express a scene in tokens of natural language, the downstream renderer has no more information than that. Wittgenstein's response is to extend what the model can *express as structured files* — schemas, codec IR, latent codes — rather than what it can *say in tokens*. The expressive contract lives in code, not in prompt copy.

| Resource | |
| --- | --- |
| Upstream | `github.com/Moapacha/wittgenstein` |
| Landing | `pnpm dev:site` → `apps/site` |

## Architecture

Five layers. Data flows top to bottom; schema preambles reflect back up from L2 into the LLM call.

```
 User prompt
      │
      ▼
  L1 HARNESS          routing · retry · budget · manifest · seed
      │
      ▼
  L2 IR / CODEC       LLM → structured JSON (scene spec / audio plan / signal spec)
      │   ▲
      │   └── schema preamble injected before LLM call
      ▼
  L3 RENDERER         JSON → real file
      │               image:  frozen VQ decoder → PNG
      │               audio:  WAV synthesis + ambient mix → WAV/M4A
      │               sensor: operator expand → CSV + loupe HTML
      ▼
  L4 ADAPTER          text embedding → latent code alignment (image only; tiny MLP)
      │               (fires between L2 and L3; no adapter for audio/sensor)
      ▼
  L5 DIST             CLI · npm · AGENTS.md · run manifests → artifacts/runs/<id>/
```

Every run leaves a manifest under `artifacts/runs/<run-id>/`. The harness is the contract; prompts are not.

## Why VQ / Latent Tokens

Raw pixels are too large and too fragile as an LLM output surface. The better contract is:

1. LLM outputs a structured scene spec (cheap, inspectable, schema-validated)
2. A small adapter maps scene semantics to discrete latent codes
3. A frozen decoder maps codes to pixels

BPE tokens are to text what VQ tokens are to images: a finite codebook maps a continuous space to discrete indices that an autoregressive model can predict. DALL-E 1 (2021) demonstrated this bet works at scale. LlamaGen (2024) showed it works with a standard transformer architecture at competitive quality without diffusion.

The adapter's job is narrow: translate scene semantics — what the LLM knows — into codebook indices — what the decoder expects. It does not learn image generation from scratch. That narrowness is intentional and is why the adapter can be tiny.

## Decoder vs. Generator

A diffusion model is a generator: it samples from a learned distribution on every run, is stochastic, compute-expensive, and produces results that vary with noise seed and sampler parameters. Inspecting why it produced a given image requires probing latent noise trajectories.

A frozen VQ decoder is deterministic: given the same token sequence it produces the same pixels, analogous to a lookup table compressed into weights. Reproducibility is not a policy choice layered on top — it follows structurally from the architecture. This is why the repo favors decoder families such as LlamaGen, SEED, and dVAE-style bridges over diffusion generators as the local image path.

## What Ships

| Path | State | Output |
| --- | --- | --- |
| Image | Harness wired; MLP adapter trained on COCO | PNG |
| TTS | CLI alias over audio speech route | WAV |
| Audio | Speech, soundscape, music render locally | WAV |
| Sensor | Deterministic operator spec → samples + dashboard | JSON, CSV, HTML |
| Video | Composition IR scaffold; MP4 branch pending | Pending |
| Image style adapter | 781 COCO examples, 9 s CPU train, val BCE 0.7698 | MLP weights |
| Audio ambient classifier | 369 examples, <5 s, keyword + MLP hybrid | MLP weights |

The adapter training numbers are not projections. They demonstrate that "tiny adapter" is a real implementation constraint, not a framing convenience.

## polyglot-mini

`polyglot-mini` is the Python rapid-prototype surface. It demonstrates the five-layer thesis end-to-end without requiring the TypeScript monorepo to be running. Use it to:

- validate codec IR schemas against live LLM output
- run the image adapter and frozen decoder pipeline locally
- prototype new modality codecs before porting to the TS packages

It is intentionally minimal. The TS monorepo remains the production harness; `polyglot-mini` is the proving ground.

## Fast Start

```bash
pnpm install
pnpm typecheck
pnpm --filter @wittgenstein/cli exec wittgenstein --help
```

## Demo Commands

```bash
pnpm demo:sensor
pnpm demo:audio
pnpm demo:tts
pnpm train:audio-adapter
pnpm launch:check
pnpm benchmark
```

Artifacts land in `artifacts/demo/`.

## CLI Surface

```bash
wittgenstein init
wittgenstein image  "scene prompt" --out out.png
wittgenstein tts    "launch voiceover" --ambient rain --out out.wav
wittgenstein audio  "ambient score" --route music --out out.wav
wittgenstein video  "video prompt" --out out.mp4
wittgenstein sensor "stable ecg trace" --out out.json
wittgenstein doctor
```

## Benchmarks

The harness reports cost, latency, and modality-specific smoke metrics per run. Longer-term standard targets:

- `image`: FID and CLIPScore
- `tts/audio`: MOS and ASR-based WER/PER
- `sensor`: discriminative score and predictive score
- `video`: FVD and Video-Bench once the MP4 branch lands

See `benchmarks/README.md` and `docs/benchmark-standards.md`.

## Key Docs

- `AGENTS.md` — working rules and repo map
- `docs/architecture.md` — five-layer system detail
- `docs/codecs/image.md` — image path, discrete latents, decoder posture
- `docs/codec-protocol.md` — codec contract
- `docs/reproducibility.md` — manifest spine and seed rules
- `packages/cli/README.md` — npm-facing CLI usage

## Workspace Layout

- `packages/schemas` — shared zod schemas and codec contracts
- `packages/core` — harness runtime, routing, retry, telemetry, manifests
- `packages/codec-image` — the only shipping image path
- `packages/codec-audio` — WAV routes plus ambient layering
- `packages/codec-video` — composition-first video scaffold
- `packages/codec-sensor` — deterministic signal generation plus loupe sidecars
- `packages/cli` — the `wittgenstein` command
- `apps/site` — official site scaffold
- `polyglot-mini` — Python rapid-prototype area; five-layer thesis end-to-end

## Locked Constraints

- image has exactly one shipping path
- shared contracts live in `packages/schemas`
- runs stay traceable under `artifacts/`
- frozen decoders are in-bounds; general-purpose local image generators are not the main path

## License

Apache 2.0. See `LICENSE`.
