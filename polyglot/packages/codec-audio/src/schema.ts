import { z } from "zod";
import type { AudioRequest, Result } from "@polyglot/schemas";
import { AudioRequestSchema } from "@polyglot/schemas";

export const AudioPlanSchema = z.object({
  route: z.enum(["speech", "soundscape", "music"]).default("speech"),
  voice: z
    .object({
      speaker: z.string().default("neutral"),
      tone: z.string().default("clear"),
      language: z.string().default("en"),
    })
    .default({}),
  timeline: z
    .array(
      z.object({
        atSec: z.number().nonnegative(),
        event: z.string(),
      }),
    )
    .default([]),
  music: z
    .object({
      bpm: z.number().positive().default(120),
      key: z.string().default("C"),
      motif: z.string().default("minimal"),
    })
    .default({}),
});

export type AudioPlan = z.infer<typeof AudioPlanSchema>;

export function audioSchemaPreamble(req: AudioRequest): string {
  return [
    "Emit a JSON audio plan.",
    "Choose route from speech, soundscape, or music.",
    "Prefer symbolic structure over raw samples.",
    `Requested route: ${req.route ?? "auto"}.`,
    `Requested duration: ${req.durationSec ?? "unspecified"} seconds.`,
  ].join("\n");
}

export function parseAudioPlan(raw: string): Result<AudioPlan> {
  try {
    const json = JSON.parse(raw) as unknown;
    const parsed = AudioPlanSchema.safeParse(json);

    if (!parsed.success) {
      return {
        ok: false,
        error: {
          code: "AUDIO_SCHEMA_INVALID",
          message: "Audio plan failed validation.",
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
        code: "AUDIO_SCHEMA_PARSE_FAILED",
        message: "Audio plan was not valid JSON.",
        cause: error,
      },
    };
  }
}

export { AudioRequestSchema };
