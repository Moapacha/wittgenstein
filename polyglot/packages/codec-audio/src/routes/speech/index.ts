import type { RenderCtx, RenderResult } from "@polyglot/schemas";
import type { AudioPlan } from "../../schema.js";

export async function renderSpeechRoute(
  _plan: AudioPlan,
  _ctx: RenderCtx,
): Promise<RenderResult> {
  throw createNotImplementedError("codec-audio route: speech");
}

function createNotImplementedError(scope: string): Error & { code: string } {
  return Object.assign(new Error(`NotImplementedError(${scope})`), {
    name: "NotImplementedError",
    code: "NOT_IMPLEMENTED",
  });
}
