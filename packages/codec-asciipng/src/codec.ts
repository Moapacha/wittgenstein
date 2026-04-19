import type { RenderCtx, RenderResult, WittgensteinCodec } from "@wittgenstein/schemas";
import { Modality } from "@wittgenstein/schemas";
import type { AsciipngRequest } from "@wittgenstein/schemas";
import {
  AsciipngIrSchema,
  AsciipngRequestSchema,
  asciipngSchemaPreamble,
  parseAsciipngIr,
  type AsciipngIr,
} from "./schema.js";
import { renderPseudoAsciiPng } from "./raster.js";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export const asciipngCodec: WittgensteinCodec<AsciipngRequest, AsciipngIr> = {
  name: "asciipng",
  modality: Modality.Asciipng,
  schemaPreamble: asciipngSchemaPreamble,
  requestSchema: AsciipngRequestSchema,
  outputSchema: AsciipngIrSchema,
  parse: parseAsciipngIr,
  async render(parsed: AsciipngIr, ctx: RenderCtx): Promise<RenderResult> {
    const pngBytes = renderPseudoAsciiPng(parsed, ctx.seed);
    await mkdir(dirname(ctx.outPath), { recursive: true });
    await writeFile(ctx.outPath, pngBytes);

    return {
      artifactPath: ctx.outPath,
      mimeType: "image/png",
      bytes: pngBytes.byteLength,
      metadata: {
        codec: "asciipng",
        llmTokens: { input: 0, output: 0 },
        costUsd: 0,
        durationMs: 0,
        seed: ctx.seed,
      },
    };
  },
};
