import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  DEFAULT_POLYGLOT_CONFIG,
  PolyglotConfigSchema,
  type PolyglotConfig,
} from "@polyglot/schemas";

export interface LoadConfigOptions {
  cwd?: string;
  configPath?: string;
  env?: NodeJS.ProcessEnv;
}

const CONFIG_CANDIDATES = [
  "polyglot.config.ts",
  "polyglot.config.mts",
  "polyglot.config.js",
  "polyglot.config.mjs",
];

export async function loadPolyglotConfig(
  options: LoadConfigOptions = {},
): Promise<PolyglotConfig> {
  const cwd = resolve(options.cwd ?? process.cwd());
  const env = options.env ?? process.env;
  const configPath = await resolveConfigPath(cwd, options.configPath);
  const loadedConfig = configPath ? await importConfig(configPath) : {};

  const merged = {
    ...DEFAULT_POLYGLOT_CONFIG,
    ...loadedConfig,
    llm: {
      ...DEFAULT_POLYGLOT_CONFIG.llm,
      ...loadedConfig.llm,
    },
    runtime: {
      ...DEFAULT_POLYGLOT_CONFIG.runtime,
      ...loadedConfig.runtime,
      retry: {
        ...DEFAULT_POLYGLOT_CONFIG.runtime.retry,
        ...loadedConfig.runtime?.retry,
      },
      budget: {
        ...DEFAULT_POLYGLOT_CONFIG.runtime.budget,
        ...loadedConfig.runtime?.budget,
      },
    },
    codecs: {
      ...DEFAULT_POLYGLOT_CONFIG.codecs,
      ...loadedConfig.codecs,
    },
  };

  if (env.POLYGLOT_LLM_PROVIDER) {
    merged.llm.provider = env.POLYGLOT_LLM_PROVIDER as PolyglotConfig["llm"]["provider"];
  }

  if (env.POLYGLOT_LLM_MODEL) {
    merged.llm.model = env.POLYGLOT_LLM_MODEL;
  }

  if (env.POLYGLOT_LLM_BASE_URL) {
    merged.llm.baseUrl = env.POLYGLOT_LLM_BASE_URL;
  }

  if (env.POLYGLOT_ARTIFACTS_DIR) {
    merged.runtime.artifactsDir = env.POLYGLOT_ARTIFACTS_DIR;
  }

  return PolyglotConfigSchema.parse(merged);
}

async function resolveConfigPath(
  cwd: string,
  explicitPath?: string,
): Promise<string | null> {
  if (explicitPath) {
    return resolve(cwd, explicitPath);
  }

  for (const candidate of CONFIG_CANDIDATES) {
    const candidatePath = resolve(cwd, candidate);
    if (await pathExists(candidatePath)) {
      return candidatePath;
    }
  }

  return null;
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function importConfig(filePath: string): Promise<Partial<PolyglotConfig>> {
  const imported = await import(pathToFileURL(filePath).href);
  return (imported.default ?? imported.config ?? imported) as Partial<PolyglotConfig>;
}
