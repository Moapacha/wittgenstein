# Benchmark Standards

This document separates two things:

1. the **common benchmark definitions** we want to align with, and
2. the **lightweight local harness** we can run today inside this repo.

The goal is to avoid inventing new evaluation language when common practice already exists.

## Three Shared Dimensions

Across modalities, we organize benchmark output under:

- `Price`
- `Latency`
- `Quality`

These are cross-cutting reporting buckets, not new academic metrics by themselves.

## Image

Common quality metrics used in image generation evaluation:

- `FID` for distribution-level visual quality and diversity
- `CLIPScore` or similar text-image alignment metrics for prompt adherence

How Wittgenstein should map them:

- `Price`: API or runtime cost per generated image
- `Latency`: end-to-end generation time per image
- `Quality`: prefer `FID` plus `CLIPScore`

Current repo status:

- We can run a lightweight structural benchmark now.
- Full `FID` requires a real reference dataset and a non-placeholder image model.

## TTS / Audio

Common quality metrics used in TTS evaluation:

- `MOS` for perceived naturalness
- `WER` / `PER` / ASR-based intelligibility metrics for intelligibility

How Wittgenstein should map them:

- `Price`: cost per second or minute of generated audio
- `Latency`: time-to-first-audio for streaming systems, or end-to-end synthesis time for offline systems
- `Quality`: prefer `MOS` for naturalness and ASR-based intelligibility for correctness

Current repo status:

- We can run latency and cost-style reporting now.
- Local quality is currently a lightweight proxy, not human MOS.

## Sensor / Time Series

Time-series synthesis does **not** have one universally accepted benchmark. A 2024 survey explicitly notes the lack of consensus and highlights multidimensional evaluation instead.

Common families of quality metrics include:

- `fidelity`
- `utility`
- `discriminative score`
- `predictive score`

How Wittgenstein should map them:

- `Price`: model/runtime cost to generate traces
- `Latency`: expansion/render time
- `Quality`: prefer `discriminative score` and `predictive score`, with domain-specific checks where possible

Current repo status:

- We now use an algorithm/operator spec so generation is deterministic and auditable.
- The local benchmark is still a fast proxy until we wire real downstream utility tasks.

## Video

Common video-generation quality metrics include:

- `FVD` for distribution-level video quality
- `Video-Bench` style multi-dimensional evaluation for prompt adherence, visual quality, temporal consistency, and motion fidelity
- motion-specific metrics such as `FVMD` when motion realism matters

How Wittgenstein should map them:

- `Price`: cost per generated clip
- `Latency`: end-to-end time per clip
- `Quality`: prefer `FVD` plus a human- or MLLM-aligned benchmark such as `Video-Bench`

Current repo status:

- The main branch still has a video scaffold, not a real MP4 renderer.
- Once the MP4 branch is merged, this is the first place to upgrade from proxy benchmarking to standard video metrics.

## What Runs Today

The local harness in `benchmarks/` is intentionally lightweight:

- it records `Price`, `Latency`, and a structural `Quality` proxy
- it is cheap to rerun
- it is useful for regression checks during fast iteration

It should be treated as a **smoke benchmark**, not a replacement for modality-standard evaluation.
