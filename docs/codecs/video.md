# Video Codec

Video owns a composition-first JSON IR and a render seam for HyperFrames.

## IR

The model emits scene blocks, timing, and composition metadata.

## Renderer

`packages/codec-video/src/hyperframes-wrapper.ts` is the integration seam for HyperFrames-shaped **HTML compositions**.

Today the codec writes a deterministic HTML file using HyperFrames-style `data-*` timing attributes. MP4 encoding is intentionally delegated to the HyperFrames toolchain (`hyperframes render`) rather than being reimplemented inside Wittgenstein.

Note: the harness default output path for video is still `output.mp4`, but the codec will write `output.hyperframes.html` next to that basename so the artifact type matches what was generated.

The package exists now so video is a first-class codec, not an afterthought.
