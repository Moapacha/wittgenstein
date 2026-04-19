import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { RenderCtx, RenderResult } from "@polyglot/schemas";
import type { DecodedRaster } from "./decoder.js";

export async function packageRasterAsPng(
  raster: DecodedRaster,
  ctx: RenderCtx,
): Promise<RenderResult> {
  await mkdir(dirname(ctx.outPath), { recursive: true });
  await writeFile(ctx.outPath, raster.pngBytes);

  return {
    artifactPath: ctx.outPath,
    mimeType: "image/png",
    bytes: raster.pngBytes.byteLength,
    metadata: {
      codec: "image",
      llmTokens: {
        input: 0,
        output: 0,
      },
      costUsd: 0,
      durationMs: 0,
      seed: ctx.seed,
    },
  };
}
