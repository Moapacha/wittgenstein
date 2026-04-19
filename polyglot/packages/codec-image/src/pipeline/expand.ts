import type { RenderCtx } from "@polyglot/schemas";
import type { ImageSceneSpec } from "../schema.js";

export async function expandSceneSpec(
  parsed: ImageSceneSpec,
  _ctx: RenderCtx,
): Promise<ImageSceneSpec> {
  return parsed;
}
