# Adapter Training Recipe

This folder is reserved for the only trainable part of the image pipeline.

Planned recipe:

- data: captioned image subset with scene-level descriptors
- target: discrete latent tokens aligned to a frozen decoder codebook
- objective: token prediction over latent indices with optional CLIP/VQAScore eval
- form factor: LoRA or compact translator, not a full end-to-end image model

The scaffold intentionally ships without weights.
