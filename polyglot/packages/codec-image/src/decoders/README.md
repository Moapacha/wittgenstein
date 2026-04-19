# Frozen Decoder Candidates

The scaffold keeps decoder bridges close to `codec-image` because image has one path only.

Candidate decoder families:

- `llamagen` for discrete token decoders with a clear VQ interface
- `seed` for language-aligned image token stacks
- `dvae`-style bridges for smaller ablations and eval tooling

All decoders here are intended to be frozen pretrained decoders, not generators.
