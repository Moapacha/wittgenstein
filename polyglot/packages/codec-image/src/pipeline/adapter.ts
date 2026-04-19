import type { RenderCtx } from "@polyglot/schemas";
import type { ImageSceneSpec } from "../schema.js";

export interface ImageLatentCodes {
  family: "llamagen" | "seed" | "dvae";
  tokens: number[];
  width: number;
  height: number;
}

export async function adaptSceneToLatents(
  _parsed: ImageSceneSpec,
  _ctx: RenderCtx,
): Promise<ImageLatentCodes> {
  throw createNotImplementedError("codec-image pipeline: adapter");
}

function createNotImplementedError(scope: string): Error & { code: string } {
  return Object.assign(new Error(`NotImplementedError(${scope})`), {
    name: "NotImplementedError",
    code: "NOT_IMPLEMENTED",
  });
}
