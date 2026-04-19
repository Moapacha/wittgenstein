import type { RenderCtx, RenderResult } from "@polyglot/schemas";
import { expandSceneSpec } from "./expand.js";
import { adaptSceneToLatents } from "./adapter.js";
import { decodeLatentsToRaster } from "./decoder.js";
import { packageRasterAsPng } from "./package.js";
import type { ImageSceneSpec } from "../schema.js";

export async function renderImagePipeline(
  parsed: ImageSceneSpec,
  ctx: RenderCtx,
): Promise<RenderResult> {
  const expanded = await expandSceneSpec(parsed, ctx);
  const latentCodes = await adaptSceneToLatents(expanded, ctx);
  const raster = await decodeLatentsToRaster(latentCodes, ctx);
  return packageRasterAsPng(raster, ctx);
}
