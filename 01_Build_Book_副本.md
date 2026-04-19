# Polyglot / Modality Harness — Build Book

## 0. Executive position

### The project in one sentence

**Polyglot is a modality harness / multimodal adapter that lets a text-first LLM output real files — PNG, WAV/MP3, MP4, JSON sensor traces — by shifting modality-specific work into a portable middleware layer instead of requiring heavyweight model-side multimodal training.**

### The precise claim

Do **not** claim: “we turned a plain text LLM into a frontier-native universal multimodal model.”

Claim instead:

> We built a **portable multimodal output layer**. The LLM does planning, specification, compression, and structural reasoning. The harness does schema control, decoding, rendering, retrieval, mixing, and file packaging.

That claim is both stronger and more defensible.

### What changed after reviewing your background + Claude’s drafts

Your instinct was directionally right, but the architecture needed to be made sharper:

1. **Harness is not just “a skill or SDK.”** In current agent practice, harness means the surrounding execution system: tools, memory, control flow, docs, validation, recovery, and sandboxing.
2. **“Rule encoding + tiny post-training” is not a binary.** It is three layers:
   - schema / grammar,
   - renderer / decoder,
   - optional learned adapter.
3. **LLM-to-image is not one problem.** It is at least three different image problems:
   - deterministic structured graphics,
   - programmatic raster generation,
   - learned neural codec decoding.
4. **Your image story must be stratified by difficulty.** Otherwise the pitch sounds magical and breaks under scrutiny.

---

## 1. Requirement extraction

Below is the cleaned requirement set inferred from your messages, the pasted Claude material, and your uploaded background.

### 1.1 Hard requirements

1. Final outputs must be **real files**, not only symbolic previews.
   - image: preferably PNG (or JPEG when compression is needed)
   - audio: WAV/MP3
   - video: MP4
   - sensor: JSON / CSV / NumPy-friendly spec

2. The middleware should ideally incur **no extra paid token cost** beyond the normal LLM call.
   - local compute is allowed
   - deterministic renderers are allowed
   - a small pretrained decoder is allowed if it behaves as a decoder / codec component rather than a cloud generator

3. The project must feel like an actual **harness/skill/runtime extension**:
   - installable by `curl` / `npm`
   - usable from CLI/bash
   - callable by agent runtimes via docs, commands, and structured prompts

4. It should be possible to demonstrate the system on top of a strong text model / agent runtime so the effect feels like:
   - “the base model only speaks text”
   - “after mounting the harness, it produces media files too”

5. The system needs a strong **research story**, not only a product wrapper:
   - modality as codec / representation problem
   - post-training deferred to harness layer
   - structural compression + decoding
   - relationship to classic multimodal lines of work

### 1.2 Soft requirements

1. You want the project to feel **frontier** rather than purely utilitarian.
2. You want philosophical / first-principles grounding, not only implementation recipes.
3. You want to preserve room for bold claims, but only if they survive technical scrutiny.
4. You want something agents can build fast with Claude Code / Codex.
5. You want the materials to support:
   - development,
   - pitch,
   - judge Q&A,
   - future open-source packaging.

### 1.3 Constraints that matter strategically

1. You should **not** keep using the line “MiniMax originally has no image/audio/video generation.” MiniMax’s official platform now exposes text, speech, video, image, and music APIs, so that framing is outdated. Use MiniMax as a *text-first harness host* or as a *reference runtime*, not as a fake “missing multimodality” example.
2. You cannot promise open-domain photorealistic image generation under all constraints. That over-claims the system.
3. You can still ship a strong demo if you define the image layer correctly.

---

## 2. What is right in your current intuition, and what must be corrected

## 2.1 What you were right about

### A. The core direction: modality can be deferred

This is the strongest part of your idea.

You are effectively saying:

> not every modality capability needs to be fused into a giant end-to-end pretrained model;
> some of it can be deferred into a portability layer that sits between the text model and the final output file.

That is a real research and product insight.

### B. LLMs do contain compressed structural knowledge about images and audio

A good text model has seen huge amounts of description, code, diagrams, markup, layout language, visual metaphors, file format discourse, and engineering representations. It does not “contain raw pictures,” but it does contain compressed priors about:

- object structure,
- composition,
- style language,
- scene decomposition,
- layout conventions,
- markup and code that can produce visual/audio outputs.

So your statement “the model has already compressed a lot of image structure in parameters” is directionally correct.

### C. The midpoint is not a full model; it is a bridge

Also correct.

The bridge can be one of the following:

- a pure schema+renderer path,
- a programmatic generation path,
- a learned adapter + decoder path,
- a retrieval + composition path,
- or a hybrid.

It does **not** have to be a giant multimodal foundation model to be useful.

### D. Video is easiest to frame as compilation

Correct again.

For short-form agent-generated video, HTML/CSS/JS + timeline + render is already a highly credible route.

### E. Sensor data is easier than you first thought

This is actually a gift. Sensor traces are often much more naturally parameterized than images. The harness can generate:

- raw arrays for small cases,
- parameterized procedural specs for long traces,
- or compressed signal tokens in later versions.

---

## 2.2 What needs correction

### A. “LLM outputs pixels directly” is not your winning route

Pixel-by-pixel generation is the wrong P0 story.

Why:

- token-inefficient,
- weak coherence,
- brittle quality,
- ugly demos,
- hard to benchmark fairly.

Keep it only as a philosophical contrast: “why naive pixel output is the wrong abstraction.”

### B. “No extra token” does not mean “no extra compute, no decoder, no retrieval, no renderer”

This point must be cleaned up in your language.

The right statement is:

> We avoid extra **paid language-model token consumption** in the middleware path. The extra work happens locally through renderers, decoders, retrieval systems, DSP pipelines, or small pretrained adapters.

That is defensible.

### C. “Harness as multimodal model replacement” is too broad

Do not claim you replace native multimodal models across the board.

The better claim:

> We unlock a practical class of multimodal outputs for text-first systems through codecs and portable adapter bundles.

### D. Image generation must be tiered

If you blur all image paths together, judges or technical listeners will ask one hard question and the whole story collapses.

So fix the taxonomy.

---

## 3. The correct image framing: one project, three image tiers

This is the single most important design decision.

## Tier P0 — Deterministic image compiler (must ship)

**Goal:** high reliability, strong semantic relevance, real PNG output.

**How it works:**

1. User prompt → LLM expands into structured image spec.
2. Harness validates/specifies into JSON.
3. JSON compiles into one of:
   - SVG
   - HTML/CSS/Canvas
   - p5.js / PIL / matplotlib program
4. Renderer produces PNG.
5. Optional post-process with `sharp`/Pillow for resize, sharpen, denoise, contrast, alpha handling.

**Best for:**

- diagrams,
- product cards,
- posters,
- UI mockups,
- geometric art,
- banners,
- infographics,
- stylized illustrations,
- architecture visuals.

**Why this tier matters:**

It gives you a **real PNG** with high control, low failure, and no extra paid token usage.

**What to say on stage:**

> We start by treating image generation as compilation. The model writes a high-level image program; the harness turns it into a real raster file.

## Tier P1 — Programmatic raster painter (should ship if possible)

**Goal:** richer raster images than plain SVG, while staying deterministic.

**How it works:**

1. LLM outputs a constrained “image program” or Python/JS paint spec.
2. Harness executes a sandboxed drawing pipeline using:
   - Pillow,
   - NumPy,
   - scipy transforms,
   - node-canvas,
   - headless Chromium canvas,
   - gradients, textures, blends, masks, typography.
3. The output is rendered into PNG.

**This is where you get:**

- more natural textures,
- more layered light/shadow,
- stronger visual polish,
- less obvious “this was just SVG.”

**Narrative advantage:**

This route is beautifully aligned with the idea that **the shortest program that produces the image is the image’s compressed essence**.

## Tier P2 — Neural codec image adapter (research stretch / powerful if feasible)

**Goal:** move from structured description to semantic image tokens, then decode to real raster.

**How it works:**

1. LLM rewrites prompt into a richer visual latent description.
2. A small adapter maps that description into discrete image codes.
3. A frozen/pretrained image decoder reconstructs pixels.
4. Harness packages output as PNG.

**Important distinction:**

This is not “run Stable Diffusion locally.”

This is closer to:

- semantic token prediction,
- learned codec decoding,
- lightweight post-training on top of an existing decoder stack.

**Why it is exciting:**

Because it directly supports your philosophical claim that modality-specific heavy lifting can be moved out of the foundation model and into a portable layer.

**Why it is dangerous:**

Because it is the easiest place to over-claim. For hackathon reality, treat this as:

- a research proof point,
- or an internal prototype,
- not the only image story.

---

## 4. The winning system architecture

## 4.1 Final name recommendation

Use one of these formulations:

- **Polyglot** — product/project name
- **Modality Harness** — technical category
- **Multimodal Adapter** — most understandable phrase
- **Multimodal Compiler** — best engineering metaphor

My recommended stack is:

> **Polyglot**
> 
> *A modality harness for text-first models.*

And your clean one-line thesis becomes:

> Polyglot is a multimodal compiler layer that lets text-first LLMs emit real media files through portable codecs, local renderers, and lightweight adapter bundles.

## 4.2 The architecture in one block

```text
User Prompt
  -> Harness Router
  -> Prompt/Schema Injection
  -> Text LLM
  -> Structured Output (JSON / DSL / code / latent spec)
  -> Codec Module
  -> Renderer / Decoder / Retriever / Mixer
  -> File Packaging
  -> PNG / WAV / MP3 / MP4 / JSON
```

## 4.3 The codec abstraction

Every modality codec should have the same conceptual skeleton:

1. **schema preamble**
   - what the LLM is allowed to output
   - how the result is structured

2. **constrained output layer**
   - JSON schema, grammar, XML subset, or typed DSL

3. **post-LLM compiler**
   - parse
   - validate
   - normalize
   - fill defaults

4. **execution layer**
   - render / decode / retrieve / mix / package

5. **artifact layer**
   - file path
   - preview
   - metadata
   - benchmark stats

That structure makes the whole project feel principled rather than stitched together.

---

## 5. Concrete modality plans

## 5.1 Image

### Recommended shipped path

**P0:** `JSON scene spec -> SVG/Canvas/HTML -> PNG`

### Recommended stretch path

**P1:** `JSON scene spec -> Python/Canvas painter -> PNG`

### Research path

**P2:** `latent description -> adapter -> discrete image codes -> frozen decoder -> PNG`

### Image file format recommendation

- **PNG** for demos, diagrams, posters, UI renders, illustration-like outputs, and transparency.
- **JPEG** only when you need lighter weight photographic-ish exports.

### Minimal JSON spec example

```json
{
  "canvas": { "width": 1024, "height": 1024, "background": "#0B0D10" },
  "style": {
    "mode": "neo-brutalist-editorial",
    "palette": ["#0B0D10", "#F5F7FA", "#9AE6B4", "#FF7A59"],
    "lighting": "flat-graphic",
    "texture": "subtle-noise"
  },
  "layout": {
    "type": "poster",
    "safe_margin": 72,
    "grid": { "columns": 12, "gutter": 20 }
  },
  "elements": [
    { "type": "title", "text": "POLYGLOT", "x": 72, "y": 120, "size": 96 },
    { "type": "shape", "shape": "rounded-rect", "x": 72, "y": 180, "w": 520, "h": 320, "fill": "#F5F7FA" },
    { "type": "caption", "text": "A modality harness for text-first models", "x": 72, "y": 560, "size": 28 }
  ]
}
```

### Why this is good for judges

It looks clean, deterministic, and agent-friendly. They can immediately imagine:

- more codecs,
- more runtimes,
- better renderers,
- and later learned adapters.

## 5.2 Audio

Treat audio as **three separate products**, not one blob.

### A. TTS / spoken voice — ship this

Best path:

- LLM writes SSML or your own speech JSON.
- Harness passes it to a local TTS engine.
- Output WAV/MP3.

Why this works:

- very credible,
- fast,
- controllable,
- already gives “text model speaks with voice” magic.

### B. Environmental sound / text-to-audio — ship as retrieval+composition

Best path:

- LLM outputs a soundscape timeline.
- A local index maps text descriptions to sample assets.
- Harness retrieves samples, layers them, adjusts timing/volume, exports WAV/MP3.

This is crucial because it answers your earlier uncertainty:

> no, this part does **not** have to mean training a full audio generator.

It can be:

- semantic retrieval,
- sample selection,
- deterministic mixing,
- lightweight DSP.

### C. Music — optional

Best path:

- MusicXML / ABC / Tone.js / MIDI-like JSON.
- Render through a synth or browser audio engine.

This is great if you have time, but it is not the first battle to win.

### Audio answer to your two explicit questions

#### “Does this require database training?”

- **TTS:** not necessarily. A pretrained engine is enough for MVP.
- **Environmental audio:** not necessarily training; often indexing a curated sample library is enough.
- **Music:** not necessarily training; symbolic generation plus synthesis may be enough.
- **Open-domain neural text-to-audio:** yes, that would normally need heavy training or a pretrained specialist model.

#### “After training, is it directly generated or is there extra processing?”

Usually there is still extra processing:

- voice selection,
- segmentation,
- prosody control,
- retrieval,
- timing,
- mixing,
- mastering,
- transcoding.

So even trained audio stacks still benefit from a strong harness.

## 5.3 Video

Do not reinvent this.

Use:

- HyperFrames or an equivalent HTML-native render route,
- a JSON-to-composition compiler,
- your own wrapper, schema, and CLI,
- your own unified “polyglot video” experience.

Your novelty is **not** “we invented HTML-to-video.”

Your novelty is:

> we unified image, audio, video, and other modalities under one harness protocol and one install surface.

## 5.4 Sensor data

This is the easiest “extra modality” win.

### Best shipped format

- procedural spec JSON,
- plus rendered preview chart,
- plus optional raw array export.

### Example

```json
{
  "signal_type": "ecg",
  "duration_s": 12,
  "sampling_rate_hz": 500,
  "base_hr_bpm": 86,
  "noise_level": 0.015,
  "events": [
    { "type": "mild_arrhythmia", "start_s": 7.2, "duration_s": 1.3 }
  ]
}
```

Harness then generates:

- full trace array,
- PNG plot,
- CSV export.

This is an excellent proof that your abstraction generalizes beyond “marketing media.”

---

## 6. Harness design: use the newest agent thinking correctly

This is where the articles you sent matter.

## 6.1 The harness rules to adopt

### Rule 1: AGENTS.md should be a map, not a monolith

Do **not** make a huge one-file agent manual.

Use a short `AGENTS.md` that points to:

- architecture,
- product specs,
- codec docs,
- active execution plans,
- reference notes.

This matches the current OpenAI harness guidance:

- short entrypoint,
- repository docs as the system of record,
- progressive disclosure.

### Rule 2: Own the control flow

Borrow heavily from the 12-factor agent mindset.

For Polyglot, this means:

- the LLM should not “decide everything in a vague loop”; 
- the harness should own routing, retries, validation, pause/resume, and packaging.

### Rule 3: Small, focused skills

Do not create one mega-skill.

Create:

- `image` codec/skill,
- `audio` codec/skill,
- `video` codec/skill,
- `sensor` codec/skill,
- and a top-level router.

### Rule 4: Treat errors as structured context

Parse failures, render failures, missing assets, and invalid specs should be compacted into structured repair messages, not giant raw logs.

### Rule 5: Pause/resume is a real product feature

This matters especially for:

- video render,
- long audio,
- batch generation,
- benchmark runs.

### Rule 6: keep docs inside the repo as a living knowledge base

Repo proposal:

```text
polyglot/
  AGENTS.md
  docs/
    index.md
    architecture.md
    build-philosophy.md
    product-spec.md
    pitch/
    references/
    codecs/
      image.md
      audio.md
      video.md
      sensor.md
    exec-plans/
      active/
      completed/
```

This mirrors the strongest current harness-engineering pattern.

---

## 7. Packaging strategy

## 7.1 What the user installs

You originally wanted `curl` / `npm` / skill-like mounting. Keep that.

### Recommended packaging

#### Core package

- `@polyglot/core`
- router, schemas, config, CLI framework, runtime adapters

#### Codec packages

- `@polyglot/codec-image`
- `@polyglot/codec-audio`
- `@polyglot/codec-video`
- `@polyglot/codec-sensor`

#### Optional heavier bundles

- `@polyglot/codec-image-neural`
- `@polyglot/codec-audio-library`

#### CLI

- `polyglot`

### CLI shape

```bash
polyglot init
polyglot image "editorial poster about multimodal harnesses" --out out.png
polyglot audio "calm Chinese voice reading the release note" --out out.mp3
polyglot video "10-second product teaser" --out out.mp4
polyglot sensor "simulate a 12-second ECG trace with mild arrhythmia" --out ecg.json
```

### Agent/runtime integration

Support:

- AGENTS.md instructions,
- slash-command style skill docs,
- shell-first use,
- OpenAI-compatible / Anthropic-compatible text model backends.

## 7.2 What the user sees in the UI

Your product is mostly terminal-native.

That is fine.

So the UI layers are:

1. **Primary:** terminal / CLI
2. **Secondary:** runtime/agent integration
3. **Tertiary:** landing page / docs / gallery

That is actually a strong modern shape.

---

## 8. The concrete image decision tree

This section is the part you should keep returning to.

## If the user asks for...

### A diagram / logo / architecture chart / poster / UI mock

Use:

- structured JSON
- SVG/HTML/Canvas route
- deterministic PNG output

### A stylized illustration / editorial cover / abstract art / branded visual

Use:

- structured JSON
- programmatic raster painter
- optional light post-processing

### A truly open-domain realistic image

Do **not** pretend you solved it fully with P0 alone.

Say internally:

- P2 neural codec path or future work
- optional restricted-domain learned adapter

This honesty actually makes the pitch stronger.

---

## 9. The exact research line you should claim

You asked for a deeper, more correct research story. Here it is.

## 9.1 What lineage you are closest to

Your project sits at the intersection of five lines:

1. **Agent harness / scaffold engineering**
   - model + harness
   - controlled execution
   - docs, tools, loops, memory, repair

2. **Structured generation / constrained decoding**
   - JSON / XML / CFG / grammar as control surfaces

3. **Symbolic/code-based media generation**
   - SVG, HTML, canvas, timeline specs, shader code, MusicXML

4. **Frozen-LLM multimodality / lexicalized visual tokens**
   - image/video content translated into token spaces a frozen LLM can work with

5. **Neural codec / tokenization paths**
   - semantic or discrete latent codes decoded into pixels/audio

## 9.2 The strongest research phrasing

Use this:

> We are exploring **modality separability**: how much of multimodal generation can be moved out of model-scale pretraining and into a portable harness layer consisting of schemas, codecs, local decoders, and lightweight adapter bundles.

And this:

> Our claim is not that the base LLM becomes a universal native multimodal model. Our claim is that a surprisingly large and useful subset of multimodal output can be unlocked by treating modalities as compilable or decodable representations rather than as capabilities that must always be fused into the base model.

## 9.3 The philosophy connection that actually works

You wanted older ideas and first principles. Use them in this order:

1. **Compression view of intelligence**
   - models store compact regularities of the world;
   - media generation can be framed as decompression through the right representation.

2. **Language / sequence as universal interface**
   - if a modality can be represented as a sequence or structural program, a text model can participate in producing it.

3. **World-model / abstract representation view**
   - the key is not raw pixels; the key is the right level of representation.

This is much stronger than saying “language is the whole world.”

---

## 10. What to borrow from existing work, and what not to copy badly

## 10.1 Borrow aggressively

### For video

- HyperFrames style HTML-native, agent-first render workflow.

### For agent process

- short AGENTS.md,
- repo docs as truth source,
- explicit plans,
- small focused skills,
- control flow owned by code.

### For structured output

- grammar constrained generation where useful,
- especially JSON/XML subsets for reliability.

### For image research framing

- frozen-LLM + latent/lexical translation literature,
- neural codec/tokenizer literature,
- but only as framing unless you truly implement the learned path.

## 10.2 Do not borrow badly

1. Don’t bolt on a cloud image API and call it the same thing.
2. Don’t copy a multimodal foundation model repo and pretend that is “harness deferred multimodality.”
3. Don’t create one unreadable 1,500-line prompt.
4. Don’t let the LLM directly emit arbitrary raw HTML/JS without schema normalization.
5. Don’t let image ambition outrun what you can demo beautifully.

---

## 11. Recommended repository structure

```text
polyglot/
  AGENTS.md
  README.md
  package.json
  pnpm-workspace.yaml
  packages/
    core/
    cli/
    runtime-adapters/
    codec-image/
    codec-audio/
    codec-video/
    codec-sensor/
    codec-image-neural/        # optional stretch
  docs/
    index.md
    architecture.md
    product.md
    build-philosophy.md
    pitch/
      talk-track.md
      demo-script.md
      judge-faq.md
    references/
    codecs/
      image.md
      audio.md
      video.md
      sensor.md
    exec-plans/
      active/
      completed/
  examples/
  benchmarks/
  site/
```

---

## 12. Evaluation and benchmarking

Your benchmark story matters almost as much as the product story.

## 12.1 What to measure

### Image

- semantic prompt alignment,
- render success rate,
- latency,
- cost,
- subjective quality by category.

### Audio

- intelligibility for speech,
- prompt-match for soundscapes,
- latency,
- cost.

### Video

- render success rate,
- timeline correctness,
- asset synchronization,
- latency.

### Sensor

- structural validity,
- plausibility,
- chart readability,
- export correctness.

## 12.2 What to compare against

Do not compare everything against one impossible baseline.

Compare each route against the right category:

- diagrams/posters vs other structured graphic generation paths,
- speech vs local/offline TTS routes,
- short product video compilation vs comparable video authoring tools,
- sensor traces vs hand-coded procedural generation.

## 12.3 The benchmark claim you want

> We trade absolute open-domain generation power for portability, cost discipline, controllability, and installable multimodal output.

That is a mature benchmark stance.

---

## 13. The 72-hour build plan

## Day 0 / pre-hack

- lock project name and positioning
- define repo structure
- define JSON specs for image/audio/video/sensor
- prepare demo prompts
- prepare asset/sample library
- prepare benchmark prompts

## Day 1

- core CLI
- config and backend adapters
- image P0 end-to-end
- save PNG successfully

## Day 2

- audio TTS end-to-end
- audio soundscape mixer path
- video wrapper around HyperFrames
- first integrated demo

## Day 3

- sensor codec
- benchmark script
- docs cleanup
- landing page
- pitch rehearsal
- stretch: image P1 painter or image P2 adapter spike

---

## 14. What you should say yes to, and what you should reject

## Say yes to

- “multimodal compiler”
- “portable modality adapter”
- “codec protocol”
- “local renderers / decoders / mixers”
- “lightweight adapter bundles”
- “agent-native installation surface”
- “one text-first model, many output modalities”

## Reject or sharply qualify

- “we surpassed multimodal model training in general”
- “any text LLM becomes DALL-E / Sora quality”
- “zero compute overhead”
- “we do not use any model-like decoder at all”
- “the image problem is solved with ASCII art generalized to many more pixels”

---

## 15. Final recommendation

If I had to freeze the project today, I would lock it like this:

### Product framing

**Polyglot: a modality harness for text-first models**

### Ship list

1. **Image P0:** structured spec -> SVG/Canvas/HTML -> PNG
2. **Audio P0:** SSML/voice spec -> TTS -> WAV/MP3
3. **Audio P0.5:** soundscape timeline -> retrieval/mix -> MP3
4. **Video P0:** JSON scene spec -> HyperFrames wrapper -> MP4
5. **Sensor P1:** procedural signal spec -> JSON/CSV + PNG plot

### Stretch

6. **Image P1:** raster painter
7. **Image P2:** neural codec spike

### Research sentence

> We investigate how much multimodal output can be unlocked by moving modality-specific generation from the model into a portable harness layer of schemas, codecs, local renderers, and lightweight adapters.

That is your best, cleanest, and most future-proof line.
