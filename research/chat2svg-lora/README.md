# Chat2SVG-style LoRA + grammar engine (Path A)

This folder is **not** part of the TypeScript build graph. It hosts the **training and HTTP inference** stack for the **`svg` modality**: a **very small** instruct model (default **Qwen2.5-0.5B-Instruct**) fine-tuned on **instruction → SVG** pairs, with **Outlines** JSON-schema constrained decoding so the wire format is always valid JSON with an `svg` string. The Node harness then validates and writes `output.svg` (see `packages/codec-svg`).

**Priority:** defaults favor **getting a working adapter in ~1 wall-clock hour on one GPU** (demo / pipeline integration). Accuracy is explicitly secondary; use `--full_train` when you care about fit.

**XGrammar:** NVIDIA [XGrammar](https://github.com/NVIDIA/XGrammar) can enforce the same JSON (or a tighter SVG subset) on vLLM/SGLang; this repo standardizes on **Outlines** first because it pairs directly with Hugging Face `transformers`. Swapping the logits processor to XGrammar behind the same `/v1/generate` contract is intentional.

## Dataset

The paper **Chat2SVG** ([project](https://chat2svg.github.io/), [arXiv](https://arxiv.org/abs/2411.16602)) describes large-scale SVG + text. Public Hugging Face identifiers may change; set:

```bash
export WITTGENSTEIN_CHAT2SVG_DATASET="kingno/Chat2SVG"   # or another HF dataset id
```

Inspect the dataset card and adjust `train_lora.py` column mapping (`INSTRUCTION_KEYS` / `SVG_KEYS`) to match your split.

## Train (~1 hour, quick preset — default)

`train_lora.py` **defaults** (no flags): ~**2500** shuffled rows, **SVG labels truncated** to 2048 chars, **max_seq_length 768**, **~280 steps**, LoRA **r=8**, batch **2** × grad accum **2**. Intended for a single **8–16GB** GPU in **about an hour** (varies by card, driver, and dataset hosting).

```bash
cd research/chat2svg-lora
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

export WITTGENSTEIN_CHAT2SVG_DATASET="kingno/Chat2SVG"
export WITTGENSTEIN_SVG_MODEL_ID="Qwen/Qwen2.5-0.5B-Instruct"

# One command; no need to pass step counts for a smoke-quality adapter
python train_lora.py --output_dir ./out-lora
```

**Even faster (toy, minutes):** e.g. `--max_samples 400 --max_steps 80`.

**Longer / better fit:** `--full_train` (larger steps, full-length context, no row cap by default) or override single knobs, e.g. `--max_steps 500 --max_samples 8000`.

After training, **merge adapters** for the simplest Outlines integration:

```python
# one-off in Python REPL or small script
from peft import PeftModel
from transformers import AutoModelForCausalLM

mid = "Qwen/Qwen2.5-0.5B-Instruct"
base = AutoModelForCausalLM.from_pretrained(mid)
m = PeftModel.from_pretrained(base, "./out-lora")
merged = m.merge_and_unload()
merged.save_pretrained("./out-merged")
```

Point `serve.py` at `./out-merged` or keep `WITTGENSTEIN_SVG_ADAPTER_PATH` for PEFT (merged is fewer surprises).

## Serve (Outlines JSON → harness)

```bash
export WITTGENSTEIN_SVG_MODEL_ID="Qwen/Qwen2.5-0.5B-Instruct"
# or merged weights directory:
# export WITTGENSTEIN_SVG_MODEL_ID="./out-merged"
export WITTGENSTEIN_SVG_ADAPTER_PATH=""   # optional PEFT path if not merged

uvicorn serve:app --host 127.0.0.1 --port 8777
```

The harness posts to `http://127.0.0.1:8777/v1/generate` by default (`WITTGENSTEIN_SVG_INFERENCE_URL` / `wittgenstein.config.*`).

## Wittgenstein CLI

```bash
# from monorepo root, engine running on :8777
pnpm exec wittgenstein svg "minimal flat icon of a seal" --out ./seal.svg
```

Dry-run (no HTTP, fixture SVG):

```bash
pnpm exec wittgenstein svg "seal" --dry-run --out ./seal.svg
```

## License

Respect the **Chat2SVG** / dataset / base model licenses when redistributing weights or outputs.
