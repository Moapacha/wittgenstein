import { z } from "zod";
import type { Result, VideoRequest } from "@polyglot/schemas";
import { VideoRequestSchema } from "@polyglot/schemas";

export const VideoCompositionSchema = z.object({
  durationSec: z.number().positive().default(6),
  fps: z.number().positive().default(24),
  scenes: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        durationSec: z.number().positive(),
      }),
    )
    .default([]),
});

export type VideoComposition = z.infer<typeof VideoCompositionSchema>;

export function videoSchemaPreamble(req: VideoRequest): string {
  return [
    "Emit a JSON video composition spec.",
    "Prefer scene-level structure and timing cues.",
    `Requested duration: ${req.durationSec ?? "unspecified"} seconds.`,
  ].join("\n");
}

export function parseVideoComposition(raw: string): Result<VideoComposition> {
  try {
    const json = JSON.parse(raw) as unknown;
    const parsed = VideoCompositionSchema.safeParse(json);

    if (!parsed.success) {
      return {
        ok: false,
        error: {
          code: "VIDEO_SCHEMA_INVALID",
          message: "Video composition failed validation.",
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
        code: "VIDEO_SCHEMA_PARSE_FAILED",
        message: "Video composition was not valid JSON.",
        cause: error,
      },
    };
  }
}

export { VideoRequestSchema };
