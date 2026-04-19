#!/usr/bin/env python3
"""
LoRA SFT: instruction -> JSON {"svg": "<svg ...>...</svg>"} for the Wittgenstein `svg` modality.

Defaults target **~1 hour on one mid-range GPU** (demo / wiring first, not SOTA accuracy):
small base model, capped rows, short context, modest LoRA, few steps.

Dataset columns vary by mirror; extend INSTRUCTION_KEYS / SVG_KEYS after inspecting the HF card.
"""

from __future__ import annotations

import argparse
import json
import os
from typing import Any

import torch
from datasets import load_dataset
from peft import LoraConfig
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from trl import SFTTrainer


# Smallest practical instruct checkpoint for fast iteration (override with --model_id).
_DEFAULT_MODEL = "Qwen/Qwen2.5-0.5B-Instruct"

INSTRUCTION_KEYS = ("instruction", "question", "prompt", "caption", "text", "input")
SVG_KEYS = ("svg", "output", "answer", "code", "content", "target")


def pick(row: dict[str, Any], keys: tuple[str, ...]) -> str | None:
    for k in keys:
        v = row.get(k)
        if v is None:
            continue
        s = str(v).strip()
        if s:
            return s
    return None


def row_to_messages(
    example: dict[str, Any],
    *,
    max_svg_chars: int,
) -> list[dict[str, str]] | None:
    inst = pick(example, INSTRUCTION_KEYS)
    svg = pick(example, SVG_KEYS)
    if not inst or not svg:
        return None
    if "<svg" not in svg.lower():
        return None
    svg_trim = svg.strip()
    if max_svg_chars > 0 and len(svg_trim) > max_svg_chars:
        svg_trim = svg_trim[:max_svg_chars]
    payload = json.dumps({"svg": svg_trim}, ensure_ascii=False)
    return [
        {
            "role": "system",
            "content": (
                "Return JSON only with a single key `svg` whose value is a complete SVG document. "
                "No markdown fences."
            ),
        },
        {"role": "user", "content": inst},
        {"role": "assistant", "content": payload},
    ]


def main() -> None:
    p = argparse.ArgumentParser(
        description="Quick LoRA run (~1h GPU). Use --full_train for larger defaults.",
    )
    p.add_argument("--model_id", default=os.environ.get("WITTGENSTEIN_SVG_MODEL_ID", _DEFAULT_MODEL))
    p.add_argument("--dataset", default=os.environ.get("WITTGENSTEIN_CHAT2SVG_DATASET", "kingno/Chat2SVG"))
    p.add_argument("--split", default="train")
    p.add_argument("--output_dir", default="./out-lora")
    p.add_argument(
        "--full_train",
        action="store_true",
        help="Use larger defaults (longer wall time, better fit).",
    )
    p.add_argument(
        "--max_samples",
        type=int,
        default=-1,
        help="Cap rows after filter. -1 = preset (quick: ~2500; full: all). 0 = all rows.",
    )
    p.add_argument(
        "--max_svg_chars",
        type=int,
        default=-1,
        help="Truncate SVG in labels. -1 = preset (quick: 2048; full: no cap). 0 = no truncate.",
    )
    p.add_argument("--max_steps", type=int, default=-1, help="-1 = preset.")
    p.add_argument("--learning_rate", type=float, default=-1.0, help="-1 = preset.")
    p.add_argument("--per_device_train_batch_size", type=int, default=-1, help="-1 = preset.")
    p.add_argument("--max_seq_length", type=int, default=-1, help="-1 = preset.")
    p.add_argument("--gradient_accumulation_steps", type=int, default=-1, help="-1 = preset.")
    args = p.parse_args()

    if args.full_train:
        preset = dict(
            max_steps=2000,
            learning_rate=2e-4,
            per_device_train_batch_size=1,
            max_seq_length=4096,
            gradient_accumulation_steps=8,
            max_samples=0,
            max_svg_chars=0,
        )
    else:
        # ~1h single-GPU demo path (accuracy secondary).
        preset = dict(
            max_steps=280,
            learning_rate=3e-4,
            per_device_train_batch_size=2,
            max_seq_length=768,
            gradient_accumulation_steps=2,
            max_samples=2500,
            max_svg_chars=2048,
        )

    def pick_i(arg: int, key: str) -> int:
        return preset[key] if arg < 0 else arg

    def pick_f(arg: float, key: str) -> float:
        return preset[key] if arg < 0 else arg

    max_steps = pick_i(args.max_steps, "max_steps")
    learning_rate = pick_f(args.learning_rate, "learning_rate")
    per_device_train_batch_size = pick_i(args.per_device_train_batch_size, "per_device_train_batch_size")
    max_seq_length = pick_i(args.max_seq_length, "max_seq_length")
    gradient_accumulation_steps = pick_i(args.gradient_accumulation_steps, "gradient_accumulation_steps")

    if args.max_samples < 0:
        max_samples = preset["max_samples"]
    else:
        max_samples = args.max_samples

    if args.max_svg_chars < 0:
        max_svg_chars = preset["max_svg_chars"]
    else:
        max_svg_chars = args.max_svg_chars

    tokenizer = AutoTokenizer.from_pretrained(args.model_id, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    raw = load_dataset(args.dataset, split=args.split, trust_remote_code=True)

    def to_text(example: dict[str, Any]) -> dict[str, str]:
        cap = max_svg_chars if max_svg_chars > 0 else 10**9
        msgs = row_to_messages(example, max_svg_chars=cap)
        if msgs is None:
            return {"text": ""}
        return {"text": tokenizer.apply_chat_template(msgs, tokenize=False)}

    mapped = raw.map(to_text, remove_columns=raw.column_names)
    mapped = mapped.filter(lambda ex: bool(ex.get("text")))
    if len(mapped) == 0:
        raise SystemExit(
            "No training rows after column mapping. Inspect the dataset schema on Hugging Face "
            "and extend INSTRUCTION_KEYS / SVG_KEYS in train_lora.py.",
        )

    if max_samples and len(mapped) > max_samples:
        mapped = mapped.shuffle(seed=42).select(range(max_samples))

    use_bf16 = torch.cuda.is_available() and torch.cuda.get_device_capability()[0] >= 8
    use_fp16 = torch.cuda.is_available() and not use_bf16

    model = AutoModelForCausalLM.from_pretrained(
        args.model_id,
        trust_remote_code=True,
    )

    # Tighter LoRA for micro runs.
    peft = LoraConfig(
        r=8 if not args.full_train else 16,
        lora_alpha=16 if not args.full_train else 32,
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
        target_modules=("q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"),
    )

    save_steps = max(50, min(500, max_steps // 2))

    training_args = TrainingArguments(
        output_dir=args.output_dir,
        max_steps=max_steps,
        learning_rate=learning_rate,
        per_device_train_batch_size=per_device_train_batch_size,
        gradient_accumulation_steps=gradient_accumulation_steps,
        logging_steps=max(5, max_steps // 20),
        save_steps=save_steps,
        bf16=use_bf16,
        fp16=use_fp16,
        report_to=[],
    )

    trainer = SFTTrainer(
        model=model,
        args=training_args,
        train_dataset=mapped,
        peft_config=peft,
        processing_class=tokenizer,
        dataset_text_field="text",
        max_seq_length=max_seq_length,
    )
    print(
        "quick-train preset:"
        f" rows={len(mapped)} max_steps={max_steps} seq={max_seq_length} "
        f"batch={per_device_train_batch_size} accum={gradient_accumulation_steps} bf16={use_bf16} fp16={use_fp16}",
    )
    trainer.train()
    trainer.save_model(args.output_dir)
    tokenizer.save_pretrained(args.output_dir)
    print("saved", args.output_dir)


if __name__ == "__main__":
    main()
