# Contributing

## Setup

```bash
nvm use
corepack enable
pnpm install
pnpm bootstrap
```

## Workflow

1. Branch from `main`.
2. Keep changes scoped to one ownership area when possible.
3. Record architecture shifts with `pnpm new-adr "title"`.
4. Before pushing, run `pnpm lint && pnpm typecheck && pnpm test`.

## Review Protocol

- Changes under `packages/core/src/runtime/`, `packages/schemas/`, and `packages/sandbox/` need core review.
- Codec changes should update the matching file in `docs/codecs/`.
- Output-shape changes must preserve or explicitly refresh goldens in `fixtures/golden/`.
- If reproducibility behavior changes, update `docs/reproducibility.md` and the manifest schema together.

## Commit Style

Conventional commits are preferred:

- `feat(codec-image): add adapter stub`
- `fix(core): persist manifest on failure`
- `docs: clarify decoder-not-generator rule`

## Engineering Rules

- TypeScript strict mode stays on.
- zod schemas guard every boundary that crosses package or runtime edges.
- Use structured errors from `packages/core/src/runtime/errors.ts`.
- Avoid hidden coupling between codecs and core internals.
- Preserve artifact traceability. A run that fails still deserves a manifest.
