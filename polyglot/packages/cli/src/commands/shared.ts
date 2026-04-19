import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { PolyglotRequest } from "@polyglot/schemas";
import { Polyglot } from "@polyglot/core";

export interface CommandRuntimeOptions {
  out?: string;
  seed?: string;
  dryRun?: boolean;
  config?: string;
}

export async function runCodecCommand(
  request: PolyglotRequest,
  command: string,
  args: string[],
  options: CommandRuntimeOptions,
): Promise<void> {
  const workspaceRoot = resolveExecutionRoot();
  const harness = await Polyglot.bootstrap({
    cwd: workspaceRoot,
    ...(options.config ? { configPath: options.config } : {}),
  });

  const outcome = await harness.run(request, {
    command,
    args,
    cwd: workspaceRoot,
    dryRun: options.dryRun ?? false,
    ...(options.out ? { outPath: options.out } : {}),
    ...(options.config ? { configPath: options.config } : {}),
  });

  console.log(
    JSON.stringify(
      {
        ok: outcome.manifest.ok,
        runId: outcome.manifest.runId,
        runDir: outcome.runDir,
        artifactPath: outcome.manifest.artifactPath,
        error: outcome.error,
      },
      null,
      2,
    ),
  );

  if (!outcome.manifest.ok) {
    process.exitCode = 1;
  }
}

export function parseOptionalSeed(seed: string | undefined): number | null | undefined {
  if (seed === undefined) {
    return undefined;
  }

  return Number.parseInt(seed, 10);
}

export function resolveExecutionRoot(): string {
  let current = resolve(process.cwd());

  while (true) {
    if (existsSync(resolve(current, "pnpm-workspace.yaml"))) {
      return current;
    }

    const parent = dirname(current);
    if (parent === current) {
      return process.cwd();
    }

    current = parent;
  }
}
