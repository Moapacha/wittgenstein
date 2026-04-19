# Polyglot / Modality Harness — Research Reference Dossier

This document is the annotated research and evidence pack behind the project.

It is organized by problem, not by chronology.

---

## 1. Agent / harness thinking

### 1.1 Anthropic — *Building effective agents*
- Source: https://www.anthropic.com/research/building-effective-agents/
- Also surfaced via search result: https://www.anthropic.com/engineering/building-effective-agents
- Why it matters:
  - Anthropic’s public guidance argues that the most successful agent systems often use **simple, composable patterns** rather than overly complex frameworks.
  - This supports the design choice to keep Polyglot’s runtime modular and codec-based instead of inventing an over-generalized mega-framework.
- Useful line for product philosophy:
  - Favor composable patterns, clear interfaces, and explicit recovery over abstract “autonomy theater.”

### 1.2 OpenAI — *Harness engineering: leveraging Codex in an agent-first world* (Feb 11, 2026)
- Source: https://openai.com/index/harness-engineering/
- Why it matters:
  - OpenAI explicitly frames engineering in an agent-first world as environment design, intent specification, feedback loops, repository structure, and human attention management.
  - Strongly relevant takeaways:
    - humans steer, agents execute,
    - short `AGENTS.md` + repository docs as the real source of truth,
    - progressive disclosure beats monolithic instruction manuals,
    - architecture and taste should be enforced by invariants, not giant prompts.
- What Polyglot should borrow:
  - `AGENTS.md` as map,
  - docs/ as system of record,
  - explicit plans,
  - small skills,
  - mechanical checks for drift.

### 1.3 OpenAI — *The next evolution of the Agents SDK* (Apr 15, 2026)
- Source: https://openai.com/index/the-next-evolution-of-the-agents-sdk
- Why it matters:
  - OpenAI now publicly describes the Agents SDK as a **model-native harness** with native sandbox execution.
  - That means “harness” is no longer an informal hobbyist term; it is platform-level language.
- Why that helps your project:
  - It legitimizes talking about Polyglot as a *modality harness* or *modality layer* rather than merely a script collection.

### 1.4 HumanLayer — *12-Factor Agents*
- Sources:
  - GitHub: https://github.com/humanlayer/12-factor-agents
  - Blog: https://www.humanlayer.dev/blog/12-factor-agents
- Why it matters:
  - The principles include owning prompts, owning context windows, controlling execution state, pause/resume, small focused agents, structured outputs, and stateless reducers.
  - This maps almost perfectly to Polyglot’s desired operational style.
- Most relevant factors for Polyglot:
  - own prompts,
  - own context window,
  - tools as structured outputs,
  - unify execution state and business state,
  - launch/pause/resume with simple APIs,
  - own your control flow,
  - small, focused agents.

---

## 2. Why the “harness” framing is credible

### 2.1 Industry shift

Official platform and engineering narratives now emphasize that agent performance depends not only on the model, but on:

- the harness,
- the repo knowledge layout,
- the feedback loop,
- the execution environment,
- and the repair path.

Polyglot extends this shift into the **output-modality** dimension.

### 2.2 The precise thesis

Traditional harnesses expand what an agent can **do**.

Polyglot expands what an agent can **express as files**.

That is the key differentiator.

---

## 3. Multimodality as tokens / sequences / codecs

### 3.1 Google Research — *SPAE: Semantic Pyramid AutoEncoder for Multimodal Generation with Frozen LLMs* (NeurIPS 2023)
- Source: https://research.google/pubs/spae-semantic-pyramid-autoencoder-for-multimodal-generation-with-frozen-llms/
- Why it matters:
  - SPAE shows that a **frozen** LLM can participate in image generation and understanding when raw pixels are translated into lexical/token forms the LLM can operate over.
- Relevance to Polyglot:
  - Strong support for your intuition that not all multimodal capability must be fused into the base model from scratch.
  - Supports the idea of a translation layer between modality space and language space.

### 3.2 Chameleon — mixed-modal early-fusion token modeling (2024)
- ArXiv paper page surfaced via: https://huggingface.co/papers/2405.09818
- Why it matters:
  - Chameleon treats images and text as a single token stream and shows that unified token-based multimodal generation is viable.
- Relevance to Polyglot:
  - Even though Chameleon is a heavy model-side approach, it reinforces the broader idea that **tokens can be a universal interface** across modalities.
- Important difference:
  - Chameleon bakes multimodality into the model.
  - Polyglot tries to defer more of it into the harness layer.

### 3.3 SEED / SEED-LLaMA
- Source: https://github.com/AILab-CVC/SEED
- Why it matters:
  - Official implementation of SEED/SEED-LLaMA, which uses visual tokenization to enable multimodal understanding and generation.
- Relevance to Polyglot:
  - Good evidence that a tokenizer/adapter/LLM stack can bridge text and image modes without inventing a totally new paradigm.

### 3.4 LlamaGen
- Sources:
  - GitHub: https://github.com/FoundationVision/LlamaGen
  - Hugging Face: https://huggingface.co/FoundationVision/LlamaGen
- Why it matters:
  - LlamaGen is a strong modern example of next-token prediction over image tokens.
  - The repo exposes tokenizers and decoders that help clarify what a codec-style visual stack looks like in practice.
- Relevance to Polyglot:
  - Not a drop-in hackathon path, but very useful as a model of how **discrete image tokens + decoder** form a legitimate image pipeline.

---

## 4. Structured output and grammar control

### 4.1 XGrammar
- Source: https://github.com/mlc-ai/xgrammar
- Why it matters:
  - Efficient structured generation with near-zero overhead for many structured output cases.
  - Supports JSON, regex, and custom context-free grammars.
  - Integrated into multiple inference stacks.
- Relevance to Polyglot:
  - This is the missing reliability piece that turns “the model can kind of emit JSON/XML” into something much closer to a dependable engineering system.
- Where to use it:
  - image scene JSON,
  - SSML subset,
  - video composition JSON,
  - sensor spec JSON.

---

## 5. Image: symbolic and programmatic generation lines

### 5.1 Why SVG / code-based image generation is valid

Claude’s earlier drafts correctly identified that there is an entire line of work around LLMs generating structured graphics, diagrams, and code-driven visuals.

Even when the final target is PNG, this route is still important because:

- it yields deterministic real files,
- it is highly controllable,
- it is explainable in a pitch,
- and it gives you a strong P0 story.

### 5.2 What to claim carefully

Do not say:

> SVG proves we solved general raster image generation.

Say instead:

> SVG/Canvas/HTML prove that a large class of useful images can already be compiled from LLM-generated structure, and this gives us a robust shipping path while we explore deeper codec-based raster routes.

### 5.3 Program-as-image

This route is underused in casual demos but strategically powerful.

The model can emit:

- drawing code,
- canvas instructions,
- PIL/NumPy programs,
- shader-like structured programs,
- or a higher-level paint graph.

This is extremely aligned with your compression / “shortest program” intuition.

---

## 6. Audio

### 6.1 Coqui XTTS v2
- Source: https://docs.coqui.ai/en/latest/models/xtts.html
- Why it matters:
  - multilingual,
  - voice cloning,
  - streaming support,
  - inference-focused deployment.
- Relevance to Polyglot:
  - Gives you a credible local/offline-ish speech route without needing to make audio generation the hardest problem in the project.

### 6.2 Audio as retrieval + composition

Claude’s earlier proposal to handle environmental sound through retrieval and deterministic mixing is strategically sound.

Why:

- it avoids overclaiming open-domain text-to-audio generation,
- it works well in a harness frame,
- it is explainable,
- and it stays compatible with the “no extra paid token” thesis.

For research notes, the relevant conceptual pairing is:

- semantic text/audio embedding or tag-based lookup,
- plus deterministic timeline-based mixing.

### 6.3 The right audio decomposition

Treat audio as three products:

1. speech,
2. soundscape/foley,
3. music.

Do not force one mechanism to cover all three.

---

## 7. Video

### 7.1 HyperFrames
- Sources:
  - GitHub: https://github.com/heygen-com/hyperframes
  - Docs/player page: https://hyperframes.heygen.com/packages/player
- Why it matters:
  - Agent-first,
  - HTML-native,
  - deterministic rendering,
  - local MP4 rendering workflow,
  - explicit AI-agent integration surface.
- Relevance to Polyglot:
  - It is the cleanest proof that some media modalities are already highly compatible with a “LLM writes structured spec, harness renders file” model.

### 7.2 Strategic conclusion

Your project should not compete with HyperFrames at the core video rendering layer.

It should **wrap and unify** that style of workflow under a broader modality harness system.

---

## 8. Product/reality check: MiniMax and why wording matters

### 8.1 MiniMax official platform overview
- Source: https://platform.minimax.io/docs/api-reference/api-overview
- Why it matters:
  - MiniMax now officially exposes text, speech, video, image, and music APIs.
- Consequence:
  - The pitch should not hinge on “MiniMax lacks multimodal generation.”
- Better use of MiniMax in the story:
  - “text-first agent runtime host,”
  - “compatible backend,”
  - “evidence that harness-capable runtimes are a natural environment for Polyglot.”

---

## 9. Narrative / public speaking reference

### 9.1 Eric Hudson — *Why Every Educator Needs Their Own Public Narrative*
- Source: https://medium.com/@ejhudson/why-every-educator-needs-their-own-public-narrative-d38e3f5329c1
- Why it matters:
  - Good distillation of Marshall Ganz’s “Story of Self, Story of Us, Story of Now” frame.
- Relevance to Polyglot pitch:
  - story of self -> why you care about this problem,
  - story of us -> why developers and builders share the problem,
  - story of now -> why the harness moment and multimodal moment coincide right now.

---

## 10. The most important synthesis

If you have to explain the research lineage in one paragraph, use this:

> Recent agent engineering work from Anthropic, OpenAI, and HumanLayer argues that model capability alone is not enough; harness design, repository knowledge, control flow, and execution environments now determine much of real-world performance. At the same time, multimodal research from SPAE, SEED, Chameleon, and LlamaGen shows that images and other modalities can be translated into tokenized or structured representations that language-model-style systems can work with. Polyglot combines these two shifts: it treats multimodal output not primarily as a property that must live inside one giant model, but as a portable harness-layer problem built from schemas, codecs, decoders, renderers, and lightweight adapters.

---

## 11. Notes from your uploaded background and prior dialogue

The uploaded conversation log and Claude’s previous drafts contributed several useful intermediate ideas that were preserved in refined form:

- modality codecs as the core abstraction,
- schema / renderer / adapter as the real three-layer split,
- HyperFrames as the right video move,
- soundscape retrieval/mixing instead of overclaiming text-to-audio generation,
- image neural codec as a stretch research path,
- short AGENTS.md + docs-as-truth for agent construction,
- and the need to move from “magic demo” framing to “defensible layered system” framing.

Those ideas were not taken wholesale; they were tightened, corrected, and reorganized into the final architecture.
