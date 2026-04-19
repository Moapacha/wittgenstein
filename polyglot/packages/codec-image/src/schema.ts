import { z } from "zod";
import type { ImageRequest, Result } from "@polyglot/schemas";
import { ImageRequestSchema } from "@polyglot/schemas";

export const DecoderFamilySchema = z.enum(["llamagen", "seed", "dvae"]);

export const ImageSceneSpecSchema = z.object({
  intent: z.string().default("placeholder scene"),
  subject: z.string().default("placeholder subject"),
  composition: z
    .object({
      framing: z.string().default("medium shot"),
      camera: z.string().default("neutral camera"),
      depthPlan: z.array(z.string()).default(["foreground", "midground", "background"]),
    })
    .default({}),
  lighting: z
    .object({
      mood: z.string().default("neutral"),
      key: z.string().default("soft"),
    })
    .default({}),
  style: z
    .object({
      references: z.array(z.string()).default([]),
      palette: z.array(z.string()).default(["black", "white"]),
    })
    .default({}),
  decoder: z
    .object({
      family: DecoderFamilySchema.default("llamagen"),
      codebook: z.string().default("stub-codebook"),
      latentResolution: z
        .tuple([z.number().int().positive(), z.number().int().positive()])
        .default([32, 32]),
    })
    .default({}),
});

export type ImageSceneSpec = z.infer<typeof ImageSceneSpecSchema>;

export function imageSchemaPreamble(req: ImageRequest): string {
  const requestedSize = req.size ? `${req.size[0]}x${req.size[1]}` : "unspecified";

  return [
    "Emit a JSON scene spec for the sole neural image pipeline.",
    "Describe semantics, composition, style, and decoder hints only.",
    "Do not emit SVG, HTML, Canvas commands, or pixel arrays.",
    `Requested output size: ${requestedSize}.`,
    `Requested seed: ${req.seed ?? "null"}.`,
  ].join("\n");
}

export function parseImageSceneSpec(raw: string): Result<ImageSceneSpec> {
  try {
    const json = JSON.parse(raw) as unknown;
    const parsed = ImageSceneSpecSchema.safeParse(json);

    if (!parsed.success) {
      return {
        ok: false,
        error: {
          code: "IMAGE_SCHEMA_INVALID",
          message: "Image scene spec failed validation.",
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
        code: "IMAGE_SCHEMA_PARSE_FAILED",
        message: "Image scene spec was not valid JSON.",
        cause: error,
      },
    };
  }
}

export { ImageRequestSchema };
