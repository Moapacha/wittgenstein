import { z } from "zod";
import type { Result, SensorRequest } from "@polyglot/schemas";
import { SensorRequestSchema } from "@polyglot/schemas";

export const SensorSignalSpecSchema = z.object({
  signal: z.enum(["ecg", "temperature", "gyro"]).default("temperature"),
  sampleRateHz: z.number().positive().default(10),
  durationSec: z.number().positive().default(60),
  notes: z.array(z.string()).default([]),
});

export type SensorSignalSpec = z.infer<typeof SensorSignalSpecSchema>;

export function sensorSchemaPreamble(req: SensorRequest): string {
  return [
    "Emit a JSON procedural signal specification.",
    "Choose one signal family: ecg, temperature, gyro.",
    `Requested signal: ${req.signal ?? "auto"}.`,
    `Requested duration: ${req.durationSec ?? "unspecified"} seconds.`,
  ].join("\n");
}

export function parseSensorSignalSpec(raw: string): Result<SensorSignalSpec> {
  try {
    const json = JSON.parse(raw) as unknown;
    const parsed = SensorSignalSpecSchema.safeParse(json);

    if (!parsed.success) {
      return {
        ok: false,
        error: {
          code: "SENSOR_SCHEMA_INVALID",
          message: "Sensor signal spec failed validation.",
          details: {
            issues: parsed.error.issues,
          },
        },
      };
    }

    return {
      ok: true,
      value: parsed.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "SENSOR_SCHEMA_PARSE_FAILED",
        message: "Sensor signal spec was not valid JSON.",
        cause: error,
      },
    };
  }
}

export { SensorRequestSchema };
