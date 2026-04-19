import type { RenderCtx } from "@polyglot/schemas";
import type { ImageLatentCodes } from "./adapter.js";

export interface DecodedRaster {
  pngBytes: Uint8Array;
}

export async function decodeLatentsToRaster(
  _codes: ImageLatentCodes,
  _ctx: RenderCtx,
): Promise<DecodedRaster> {
  throw createNotImplementedError("codec-image pipeline: decoder");
}

function createNotImplementedError(scope: string): Error & { code: string } {
  return Object.assign(new Error(`NotImplementedError(${scope})`), {
    name: "NotImplementedError",
    code: "NOT_IMPLEMENTED",
  });
}
