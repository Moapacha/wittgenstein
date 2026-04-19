# Distribution

Polyglot is designed to be installable and skill-friendly, not just a local experiment.

## Delivery Surface

- `@polyglot/cli` exposes `polyglot`
- `scripts/install.sh` is the future `curl | sh` seam
- `AGENTS.md` and `.claude/CLAUDE.md` are agent primers
- output conventions are stable under `artifacts/runs/*`

## CLI Contract

```bash
polyglot init
polyglot image  "prompt" --out out.png
polyglot audio  "prompt" --out out.wav
polyglot video  "prompt" --out out.mp4
polyglot sensor "prompt" --out out.json
polyglot doctor
```

## Skill-Ready Expectations

- clear command surface
- deterministic artifact locations
- docs that explain the contracts, not just the aspiration
