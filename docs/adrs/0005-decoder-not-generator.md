# 0005 Decoder Not Generator

## Status

Accepted

## Decision

Frozen pretrained decoders are allowed in Wittgenstein render paths. General generative image or audio models are not part of this scaffold.

## Consequence

The project can use LFQ-family discrete-token decoders while preserving the product rule against turning the runtime into a diffusion stack.

## Addendum — 2026-04-26

Brief A forces one vocabulary update: the image decoder slot is named **LFQ-family
discrete-token decoder**, not "VQ decoder". The architectural rule is unchanged:
the decoder stays frozen, deterministic, and non-generative; only the family
label is updated to match the current prior art.
