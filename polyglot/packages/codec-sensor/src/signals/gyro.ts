import type { RenderCtx, RenderResult } from "@polyglot/schemas";
import type { SensorSignalSpec } from "../schema.js";

export async function renderGyroSignal(
  _spec: SensorSignalSpec,
  _ctx: RenderCtx,
): Promise<RenderResult> {
  throw createNotImplementedError("codec-sensor signal: gyro");
}

function createNotImplementedError(scope: string): Error & { code: string } {
  return Object.assign(new Error(`NotImplementedError(${scope})`), {
    name: "NotImplementedError",
    code: "NOT_IMPLEMENTED",
  });
}
