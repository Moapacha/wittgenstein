# @wittgenstein/cli

Command-line entry for the Wittgenstein harness.

## Publish to npm (maintainers)

**Do not** run `npm publish` from the **repo root** (`EPRIVATE` + wrong tarball).

From **monorepo root**:

```bash
pnpm run release:npm-cli
npm publish packages/cli/npm-publish
```

From `packages/cli` only:

```bash
pnpm run release:npm
npm publish npm-publish
```

If npm fails and asks for **2FA / OTP** (some accounts require it for publish), add `--otp=<authenticator code>` to that `npm publish` line, or use a **Granular Access Token** with publish rights from [npmjs.com](https://www.npmjs.com/) and `npm config set //registry.npmjs.org/:_authToken=npm_xxxx`.

This produces the **`wittgenstein-cli`** package (unscoped) with a bundled `dist/bundle.cjs` plus a small `bin/` shim — no `workspace:*` dependencies.

## Install (from npm)

```bash
npm install -g wittgenstein-cli
```

Then run `wittgenstein --help`.

Monorepo development: `pnpm exec wittgenstein` from the repository root (uses `tsx` + source until you run `pnpm run bundle` once for a local `dist/bundle.cjs`).

## Minimax text-only → PNG (post-processed)

Minimax returns **plain text only**. This tool **does not** treat the response as image bytes. It asks for line-oriented ASCII art, **normalizes** it to a fixed grid, then **rasterizes** with a deterministic density shader to a PNG.

1. Set API key (or paste when prompted):

   ```bash
   export WITTGENSTEIN_MINIMAX_API_KEY="your_key"
   # optional: export WITTGENSTEIN_MINIMAX_MODEL="your-text-model-id"
   ```

2. Generate (example 60×30 grid):

   ```bash
   wittgenstein asciipng "一只猫的轮廓，高对比" --source minimax --out ./out.png
   ```

3. If you did not set the key, the CLI will ask once on stdin: `Minimax API key (text-only chat model):`

4. Open `out.png` (or the path printed in the JSON as `artifactPath`).

**Dry-run** (no Minimax call; uses your prompt as the local grid seed only):

```bash
wittgenstein asciipng "hello" --source minimax --dry-run --out ./local.png
```

See repository `docs/codecs/` and `AGENTS.md` for modality rules.
