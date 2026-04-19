# Video Codec

Video owns a composition-first JSON IR and a render seam for HyperFrames.

## IR

The model emits scene blocks, timing, and composition metadata.

## Renderer

`packages/codec-video/src/hyperframes-wrapper.ts` is the future integration seam for MP4 generation.

The package exists now so video is a first-class codec, not an afterthought.
