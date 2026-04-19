import type { ZodType } from "zod";
import type { CodecError, Result } from "@polyglot/schemas";

export function parseJsonWithSchema<T>(
  raw: string,
  schema: ZodType<T>,
): Result<T, CodecError> {
  try {
    const parsed = JSON.parse(raw) as unknown;
    const validated = schema.safeParse(parsed);

    if (!validated.success) {
      return {
        ok: false,
        error: {
          code: "SCHEMA_VALIDATION_FAILED",
          message: "JSON parsed but failed schema validation.",
          details: {
            issues: validated.error.issues,
          },
        },
      };
    }

    return {
      ok: true,
      value: validated.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "INVALID_JSON",
        message: "Failed to parse JSON output from model.",
        cause: error,
      },
    };
  }
}
