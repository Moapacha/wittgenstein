import { z } from "zod";

export const LlmProviderSchema = z.enum([
  "openai-compatible",
  "anthropic",
  "minimax",
  "moonshot",
  "deepseek",
  "qwen",
]);
export type LlmProvider = z.infer<typeof LlmProviderSchema>;

export const LlmConfigSchema = z.object({
  provider: LlmProviderSchema,
  model: z.string(),
  baseUrl: z.string().url().optional(),
  apiKeyEnv: z.string().default("POLYGLOT_LLM_API_KEY"),
  maxOutputTokens: z.number().int().positive().default(4096),
  temperature: z.number().min(0).max(2).default(0.2),
});
export type LlmConfig = z.infer<typeof LlmConfigSchema>;

export const RuntimeConfigSchema = z.object({
  artifactsDir: z.string().default("artifacts"),
  defaultSeed: z.number().int().nullable().default(null),
  retry: z
    .object({
      maxAttempts: z.number().int().min(1).default(3),
      backoffMs: z.number().int().nonnegative().default(500),
    })
    .default({}),
  budget: z
    .object({
      maxCostUsd: z.number().nonnegative().default(1.0),
      maxTokens: z.number().int().nonnegative().default(100_000),
    })
    .default({}),
});
export type RuntimeConfig = z.infer<typeof RuntimeConfigSchema>;

export const PolyglotConfigSchema = z.object({
  llm: LlmConfigSchema,
  runtime: RuntimeConfigSchema.default({}),
  codecs: z
    .object({
      image: z.object({ enabled: z.boolean().default(true) }).default({}),
      audio: z.object({ enabled: z.boolean().default(true) }).default({}),
      video: z.object({ enabled: z.boolean().default(true) }).default({}),
      sensor: z.object({ enabled: z.boolean().default(true) }).default({}),
    })
    .default({}),
});
export type PolyglotConfig = z.infer<typeof PolyglotConfigSchema>;

export const DEFAULT_POLYGLOT_CONFIG: PolyglotConfig = PolyglotConfigSchema.parse({
  llm: {
    provider: "openai-compatible",
    model: "gpt-4.1-mini",
    apiKeyEnv: "POLYGLOT_LLM_API_KEY",
    maxOutputTokens: 4096,
    temperature: 0.2,
  },
  runtime: {
    artifactsDir: "artifacts",
    defaultSeed: null,
    retry: {
      maxAttempts: 3,
      backoffMs: 500,
    },
    budget: {
      maxCostUsd: 1,
      maxTokens: 100000,
    },
  },
});
