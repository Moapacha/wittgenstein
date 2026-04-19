# Hard Constraints

- TypeScript + Node 20+ + pnpm workspaces are locked.
- Shared contracts live in `@polyglot/schemas`.
- `packages/core` and `packages/cli` are shared foundation, not codec-owned.
- Image has one path only: JSON scene to latent codes to frozen decoder to PNG.
- No emergency image fallback may be added “just for now”.
- Every run must leave a manifest in `artifacts/runs/*`.
- Full codec implementations are out of scope for this scaffold.
