import { access, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Command } from "commander";
import { resolveExecutionRoot } from "./shared.js";

const DEFAULT_CONFIG = `import type { PolyglotConfig } from "@polyglot/schemas";

const config: PolyglotConfig = {
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
  codecs: {
    image: { enabled: true },
    audio: { enabled: true },
    video: { enabled: true },
    sensor: { enabled: true },
  },
};

export default config;
`;

const DEFAULT_ENV = `POLYGLOT_LLM_API_KEY=
POLYGLOT_LLM_MODEL=gpt-4.1-mini
POLYGLOT_LLM_PROVIDER=openai-compatible
`;

export function registerInitCommand(program: Command): void {
  program
    .command("init")
    .description("Create polyglot.config.ts and .env.example in the current workspace")
    .option("--force", "overwrite existing files")
    .action(async (options: { force?: boolean }) => {
      const workspaceRoot = resolveExecutionRoot();
      await writeIfMissing(
        resolve(workspaceRoot, "polyglot.config.ts"),
        DEFAULT_CONFIG,
        options.force ?? false,
      );
      await writeIfMissing(
        resolve(workspaceRoot, ".env.example"),
        DEFAULT_ENV,
        options.force ?? false,
      );
      console.log("Initialized Polyglot config files.");
    });
}

async function writeIfMissing(
  target: string,
  content: string,
  force: boolean,
): Promise<void> {
  if (!force && (await exists(target))) {
    return;
  }

  await writeFile(target, content, "utf8");
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
