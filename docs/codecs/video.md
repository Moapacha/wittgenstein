# Video Codec

Video owns a composition-first JSON IR and a render seam for HyperFrames.

## IR

The model emits scene blocks, timing, and composition metadata.

## Renderer

`packages/codec-video/src/hyperframes-wrapper.ts` is the future integration seam for MP4 generation.

## Benchmark Direction

Once the MP4 branch is merged, video should align with common evaluation practice instead of ad-hoc scores:

- `FVD` for distribution-level video quality
- `Video-Bench` style multi-dimensional evaluation for prompt adherence, visual quality, temporal consistency, and motion fidelity
- motion-specific metrics such as `FVMD` when motion realism matters

The package exists now so video is a first-class codec, not an afterthought, but the current main branch is still a scaffold rather than a runnable MP4 benchmark target.
