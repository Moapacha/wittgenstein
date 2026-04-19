import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface RuntimeFingerprint {
  gitSha: string | null;
  lockfileHash: string | null;
  nodeVersion: string;
  polyglotVersion: string;
}

export async function collectRuntimeFingerprint(
  cwd: string,
): Promise<RuntimeFingerprint> {
  const rootPackageJsonPath = resolve(cwd, "package.json");
  const lockfilePath = resolve(cwd, "pnpm-lock.yaml");

  const [gitSha, lockfileHash, polyglotVersion] = await Promise.all([
    readGitSha(cwd),
    hashFile(lockfilePath),
    readPolyglotVersion(rootPackageJsonPath),
  ]);

  return {
    gitSha,
    lockfileHash,
    nodeVersion: process.version,
    polyglotVersion,
  };
}

export async function hashFile(filePath: string): Promise<string | null> {
  try {
    const data = await readFile(filePath);
    return createHash("sha256").update(data).digest("hex");
  } catch {
    return null;
  }
}

async function readGitSha(cwd: string): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync("git", ["rev-parse", "HEAD"], { cwd });
    return stdout.trim();
  } catch {
    return null;
  }
}

async function readPolyglotVersion(packageJsonPath: string): Promise<string> {
  try {
    const raw = await readFile(packageJsonPath, "utf8");
    const parsed = JSON.parse(raw) as { version?: string };
    return parsed.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}
