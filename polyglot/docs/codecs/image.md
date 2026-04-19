# Image Codec

Image is the strictest modality in Polyglot. It has one path and one path only:

`LLM -> structured JSON scene spec -> adapter -> frozen decoder -> PNG`

## What the LLM Emits

The model emits a scene-spec JSON object. It should describe:

- intent and subject
- composition and framing
- lighting and mood
- style cues
- decoder hints such as family and latent resolution

The model does not emit SVG, HTML, Canvas programs, or raw pixels.

## Pipeline Stages

- `pipeline/expand.ts`
  Expands or normalizes the scene spec after parsing.
- `pipeline/adapter.ts`
  Reserved for the only trainable component. Maps scene semantics into discrete latent tokens.
- `pipeline/decoder.ts`
  Calls a frozen pretrained decoder bridge.
- `pipeline/package.ts`
  Packages the decoded raster bytes into the final PNG artifact.

## Adapter Role

The adapter is the small learned translator between the LLM-friendly scene language and the decoder’s latent vocabulary. It is the only trainable part of the image stack in this scaffold.

Planned training shape:

- dataset: captioned image subset with scene-level descriptors
- target: decoder codebook indices
- objective: latent token prediction
- form factor: LoRA or compact translator, not a full image model

## Decoder Candidates

- `llamagen`
- `seed`
- `dvae`-style bridge for smaller ablations

All of these are treated as frozen decoders. The project does not admit diffusion or general text-to-image generators here.

## Failure Modes

- the model emits invalid JSON
- the scene spec validates but the adapter cannot map semantics to latents
- the decoder family does not match the expected codebook
- packaging receives bytes in the wrong shape

## Honest Risk Statement

Without a trained adapter, image renders do not work. That is by design. The scaffold intentionally prefers architectural honesty over a fallback path that would hide the research dependency.
