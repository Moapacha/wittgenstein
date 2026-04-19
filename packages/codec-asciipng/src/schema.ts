import { z } from "zod";
import type { Result } from "@wittgenstein/schemas";
import type { AsciipngRequest } from "@wittgenstein/schemas";
import { AsciipngRequestSchema } from "@wittgenstein/schemas";

export const GlyphModeSchema = z.enum(["pseudo", "density"]);

export const AsciipngIrSchema = z.object({
  text: z.string().max(2000).default(""),
  columns: z.number().int().min(8).max(120).default(60),
  rows: z.number().int().min(4).max(80).default(30),
  cell: z.number().int().min(2).max(16).default(4),
  fg: z.tuple([z.number().int().min(0).max(255), z.number().int().min(0).max(255), z.number().int().min(0).max(255)]).default([68, 255, 170]),
  bg: z.tuple([z.number().int().min(0).max(255), z.number().int().min(0).max(255), z.number().int().min(0).max(255)]).default([6, 8, 10]),
  /** `density`: interpret characters as stroke weight (Minimax text post-process). `pseudo`: local demo pattern. */
  glyphMode: GlyphModeSchema.default("pseudo"),
});

export type AsciipngIr = z.infer<typeof AsciipngIrSchema>;

export function asciipngSchemaPreamble(req: AsciipngRequest): string {
  if (req.source === "minimax") {
    return [
      "Minimax path: the harness calls Minimax chat (text only), then post-processes lines into a grid IR.",
      "You do not emit JSON for the final file; follow the system instructions in the Minimax request.",
      `Grid target: ${req.columns}×${req.rows} characters, cell ${req.cell}px.`,
    ].join("\n");
  }
  return [
    "Local path: tiny JSON IR only (no remote LLM).",
    'Emit JSON: {"text":"...","columns":60,"rows":30,"cell":4,"fg":[r,g,b],"bg":[r,g,b],"glyphMode":"pseudo"}',
    "Text is rendered as a pseudo-ASCII / terminal phosphor grid PNG.",
  ].join("\n");
}

export function parseAsciipngIr(raw: string): Result<AsciipngIr> {
  try {
    const json = JSON.parse(raw) as unknown;
    const parsed = AsciipngIrSchema.safeParse(json);
    if (!parsed.success) {
      return {
        ok: false,
        error: {
          code: "ASCIIPNG_SCHEMA_INVALID",
          message: "ASCII PNG IR failed validation.",
          details: { issues: parsed.error.issues },
        },
      };
    }
    return { ok: true, value: parsed.data };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "ASCIIPNG_SCHEMA_PARSE_FAILED",
        message: "ASCII PNG IR was not valid JSON.",
        cause: error,
      },
    };
  }
}

export { AsciipngRequestSchema };
