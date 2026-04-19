"""TTS codec — speech route.

Primary: macOS `say` → AIFF → `afconvert` → MP3/M4A. Zero deps.
Optional: LLM preprocesses prompt → clean speakable script + voice hint.
"""
from __future__ import annotations
import os
import shutil
import subprocess
import time
from .llm import chat


SCRIPT_SYSTEM = """You turn a user prompt into a short spoken script.
Return ONLY the script text (no preamble, no quotes, no stage directions in brackets).
Keep it under 60 seconds when read aloud. Natural spoken English or the prompt's language."""


MAC_VOICES = {
    "en": "Samantha",
    "en-uk": "Daniel",
    "zh": "Tingting",
    "ja": "Kyoko",
    "default": "Samantha",
}


def _have(cmd: str) -> bool:
    return shutil.which(cmd) is not None


def _say_to_aiff(text: str, aiff_path: str, voice: str, rate_wpm: int = 180) -> None:
    subprocess.run(
        ["say", "-v", voice, "-r", str(rate_wpm), "-o", aiff_path, text],
        check=True, capture_output=True,
    )


def _aiff_to_mp3(aiff_path: str, out_path: str) -> str:
    """afconvert can output m4a (aac). If .mp3 requested, fall back to m4a with a warning."""
    root, ext = os.path.splitext(out_path)
    ext = ext.lower().lstrip(".")
    if ext in ("m4a", "aac", "caf"):
        fmt, codec, target = "m4af", "aac", out_path
    elif ext == "mp3":
        # afconvert has no mp3 encoder by default; emit m4a alongside.
        target = root + ".m4a"
        fmt, codec = "m4af", "aac"
    elif ext == "wav":
        fmt, codec, target = "WAVE", "LEI16", out_path
    else:
        target = root + ".m4a"
        fmt, codec = "m4af", "aac"

    subprocess.run(
        ["afconvert", "-f", fmt, "-d", codec, aiff_path, target],
        check=True, capture_output=True,
    )
    return target


def generate_speech(
    prompt: str,
    out_path: str,
    *,
    voice: str | None = None,
    lang: str = "en",
    rate_wpm: int = 180,
    use_llm_script: bool = True,
    seed: int = 0,
) -> dict:
    started = time.time()
    llm_in = llm_out = 0

    if use_llm_script:
        try:
            r = chat(prompt, system=SCRIPT_SYSTEM, temperature=0.5, max_tokens=600)
            llm_in, llm_out = r.input_tokens, r.output_tokens
            script = r.text.strip().strip('"')
        except Exception:
            script = prompt
    else:
        script = prompt

    if not _have("say"):
        raise RuntimeError("macOS `say` not found; TTS requires macOS or an `edge-tts` install.")

    voice = voice or MAC_VOICES.get(lang, MAC_VOICES["default"])

    aiff = out_path + ".__tmp__.aiff"
    _say_to_aiff(script, aiff, voice=voice, rate_wpm=rate_wpm)
    try:
        final_path = _aiff_to_mp3(aiff, out_path)
    finally:
        if os.path.exists(aiff):
            os.unlink(aiff)

    return {
        "ok": True,
        "codec": "audio:speech-macsay",
        "artifact_path": final_path,
        "requested_path": out_path,
        "voice": voice,
        "script": script,
        "llm_tokens": {"input": llm_in, "output": llm_out},
        "duration_ms": int((time.time() - started) * 1000),
        "seed": seed,
    }
