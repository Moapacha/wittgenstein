# Benchmarks

The benchmark layer has two levels:

1. a lightweight local harness for fast regression checks
2. modality-standard metrics we should align with as each pipeline matures

The standard-metrics plan lives in [`docs/benchmark-standards.md`](../docs/benchmark-standards.md).

## What Runs Today

The local harness is intentionally lightweight. It is designed for fast hackathon feedback, not heavyweight evaluation infrastructure.

It reports:

- `Price`: `manifest.costUsd` plus token counts
- `Latency`: total wall-clock run duration from the manifest
- `Quality`: a reproducible structural proxy based on whether the expected artifact exists and has the right shape

## Cases

`benchmarks/cases.json` includes one minimal runnable case for:

- `image`
- `tts` via `audio.route = speech`
- `audio` via `music`
- `sensor`

`video` is intentionally not in the runnable set yet because the current main branch still lacks the MP4 renderer that exists on another branch.

## Run

```bash
pnpm benchmark
```

Results land in `artifacts/benchmarks/latest.json`.

## Standard Metrics We Intend To Track

- `image`: `FID` and `CLIPScore`
- `tts/audio`: `MOS` plus ASR-based intelligibility such as `WER` or `PER`
- `sensor`: common time-series synthesis measures such as `discriminative score` and `predictive score`
- `video`: `FVD` plus a multi-dimensional benchmark such as `Video-Bench`

## Why This Shape

- It is cheap to run repeatedly.
- It is reproducible because the default mode is `dryRun`.
- It gives a quick comparative view without pretending the current proxy is a full academic benchmark.
