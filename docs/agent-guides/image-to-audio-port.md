# Image → Audio Port Guide

This guide is for contributors and agents working on the first concrete execution line after the v0.2 doctrine lock.

It is deliberately narrow:

- **in scope:** `M0`/`M1`/`M2` thinking and implementation support
- **out of scope:** site rewrite, new modalities, Path C, benchmark-heavy work, doctrine relitigation

## 1. Mission

Push the repo through the first execution line in this order:

1. protocol types (`M0`)
2. image (`M1`)
3. audio (`M2`)

Do **not** reorder to sensor-first.

## 2. Why image first

Image is the pressure test:

- it is the only modality with a real L4 adapter story,
- it is the modality the thesis is most exposed on,
- it is the user's stated priority.

If the protocol shape cannot hold image, it is not the right protocol.

## 3. Non-negotiables

- Image has one shipping raster path only:
  `LLM -> structured JSON scene -> adapter -> frozen decoder -> PNG`
- No HTML / Canvas / SVG fallback for raster image.
- No silent fallback.
- Every successful or failed run must still respect the manifest spine.
- The harness must move toward modality-blind dispatch, not away from it.

## 4. What an agent should read first

1. `AGENTS.md`
2. `docs/THESIS.md`
3. `docs/v02-final-audit.md`
4. `docs/exec-plans/active/codec-v2-port.md`
5. `docs/rfcs/0001-codec-protocol-v2.md`
6. `docs/adrs/0008-codec-protocol-v2-adoption.md`
7. `docs/codecs/image.md`
8. `docs/codecs/audio.md` if or when moving into M2

## 5. M0 guidance

Goal:

- introduce protocol types and seams without changing shipping behavior.

Checks:

- types compile
- no user-facing CLI regression
- no image-path doctrine drift

Good signs:

- new types reduce modality branching pressure
- `Codec<Req, Art>` shape becomes easier to see

Bad signs:

- any attempt to "sneak in" a second image path
- any new harness-level modality branching

## 6. M1 guidance (image)

Target:

- prove the protocol shape on the hardest modality first.

Focus:

- scene spec boundary
- adapter seam
- frozen decoder seam
- packaging / manifest seam

Ask of the agent:

- preserve outputs and doctrine before optimizing internals
- prefer explicit route and artifact metadata over convenience wrappers
- treat `IR.Text` as the only inhabited path unless explicitly instructed otherwise

## 7. M2 guidance (audio)

Target:

- port audio only after the image protocol shape is credible.

Focus:

- collapse route duplication
- keep speech / soundscape / music semantics clean
- preserve artifact + manifest behavior

Do not:

- reopen core CLI ergonomics
- smuggle benchmark-heavy work into the port

## 8. Two hats checklist for this line

### Researcher hat

- does the change still respect Brief A / B / E verdicts?
- does it keep decoder ≠ generator intact?
- does it avoid accidental Path C drift?

### Hacker hat

- can the next agent read the file and extend it without guessing?
- is the protocol simpler after the change?
- is the execution order still image → audio?

## 9. Prompt block for an implementation agent

Use this as a starting brief:

> You are implementing the Wittgenstein v0.2 execution line.  
> Stay inside the locked doctrine: one raster image path only, no silent fallback, manifest spine preserved, modality branching moves out of the harness.  
> Read `AGENTS.md`, `docs/THESIS.md`, `docs/v02-final-audit.md`, `docs/exec-plans/active/codec-v2-port.md`, and `docs/rfcs/0001-codec-protocol-v2.md` first.  
> Your task is to advance exactly one phase in order: `M0` then `M1 image` then `M2 audio`.  
> Do not relitigate doctrine. Do not add a second image path. Do not widen scope to site, benchmarks-heavy, or new modalities.  
> Prefer small diffs, explicit route logic, and receipt-preserving behavior.

## 10. Exit condition

This guide has done its job when:

- a contributor like Jamie can pick up the image→audio line with no chat context,
- an agent can be given one prompt and one read-order,
- the repo does not have to re-explain its doctrine inside every execution PR.
