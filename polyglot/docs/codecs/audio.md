# Audio Codec

Audio is a multi-route codec with a shared JSON plan and three render routes:

- `speech`
- `soundscape`
- `music`

## IR

The model emits a voice or timeline plan, not raw samples.

## Route Intent

- `speech`: local XTTS-style HTTP synthesis seam
- `soundscape`: retrieval plus deterministic layering
- `music`: symbolic or pattern-led composition into a synth backend

The scaffold stubs each route behind its own file so the audio team can land them independently.
