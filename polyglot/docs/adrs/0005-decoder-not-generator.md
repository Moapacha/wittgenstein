# 0005 Decoder Not Generator

## Status

Accepted

## Decision

Frozen pretrained decoders are allowed in Polyglot render paths. General generative image or audio models are not part of this scaffold.

## Consequence

The project can use VQ-style latent decoders while preserving the product rule against turning the runtime into a diffusion stack.
