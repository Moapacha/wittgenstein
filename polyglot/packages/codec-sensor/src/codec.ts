import type { PolyglotCodec, RenderCtx, RenderResult, SensorRequest } from "@polyglot/schemas";
import { Modality } from "@polyglot/schemas";
import {
  SensorRequestSchema,
  SensorSignalSpecSchema,
  parseSensorSignalSpec,
  sensorSchemaPreamble,
  type SensorSignalSpec,
} from "./schema.js";
import { renderEcgSignal } from "./signals/ecg.js";
import { renderGyroSignal } from "./signals/gyro.js";
import { renderTemperatureSignal } from "./signals/temperature.js";

export const sensorCodec: PolyglotCodec<SensorRequest, SensorSignalSpec> = {
  name: "sensor",
  modality: Modality.Sensor,
  schemaPreamble: sensorSchemaPreamble,
  requestSchema: SensorRequestSchema,
  outputSchema: SensorSignalSpecSchema,
  parse: parseSensorSignalSpec,
  async render(parsed: SensorSignalSpec, ctx: RenderCtx): Promise<RenderResult> {
    try {
      if (parsed.signal === "ecg") {
        return await renderEcgSignal(parsed, ctx);
      }

      if (parsed.signal === "gyro") {
        return await renderGyroSignal(parsed, ctx);
      }

      return await renderTemperatureSignal(parsed, ctx);
    } catch (error) {
      throw createNotImplementedError("codec: sensor", error);
    }
  },
};

function createNotImplementedError(scope: string, cause?: unknown): Error & { code: string } {
  return Object.assign(new Error(`NotImplementedError(${scope})`, { cause }), {
    name: "NotImplementedError",
    code: "NOT_IMPLEMENTED",
  });
}
