import { z } from "zod";

export const RunManifestSchema = z.object({
  runId: z.string(),
  gitSha: z.string().nullable(),
  lockfileHash: z.string().nullable(),
  nodeVersion: z.string(),
  polyglotVersion: z.string(),

  command: z.string(),
  args: z.array(z.string()),
  seed: z.number().int().nullable(),

  codec: z.string(),
  tier: z.string().nullable().optional(),
  route: z.string().optional(),

  llmProvider: z.string(),
  llmModel: z.string(),
  llmTokens: z.object({
    input: z.number().int().nonnegative(),
    output: z.number().int().nonnegative(),
  }),
  costUsd: z.number().nonnegative(),

  promptRaw: z.string(),
  promptExpanded: z.string().nullable(),
  llmOutputRaw: z.string().nullable(),
  llmOutputParsed: z.unknown().nullable(),

  artifactPath: z.string().nullable(),
  artifactSha256: z.string().nullable(),

  startedAt: z.string(),
  durationMs: z.number().nonnegative(),
  ok: z.boolean(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
      stack: z.string().optional(),
    })
    .nullable()
    .optional(),
});

export type RunManifest = z.infer<typeof RunManifestSchema>;
