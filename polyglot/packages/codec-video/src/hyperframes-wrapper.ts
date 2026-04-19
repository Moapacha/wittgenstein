import type { RenderCtx, RenderResult } from "@polyglot/schemas";
import type { VideoComposition } from "./schema.js";

export async function renderWithHyperFrames(
  _composition: VideoComposition,
  _ctx: RenderCtx,
): Promise<RenderResult> {
  throw createNotImplementedError("codec-video renderer: hyperframes");
}

function createNotImplementedError(scope: string): Error & { code: string } {
  return Object.assign(new Error(`NotImplementedError(${scope})`), {
    name: "NotImplementedError",
    code: "NOT_IMPLEMENTED",
  });
}
