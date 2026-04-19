import { access } from "node:fs/promises";
import { resolve } from "node:path";

export interface EnvironmentReport {
  nodeVersion: string;
  nodeSatisfied: boolean;
  hasPnpmLockfile: boolean;
  hasPackageJson: boolean;
}

export async function verifyEnvironment(cwd = process.cwd()): Promise<EnvironmentReport> {
  const nodeMajor = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10);

  return {
    nodeVersion: process.version,
    nodeSatisfied: nodeMajor >= 20,
    hasPnpmLockfile: await exists(resolve(cwd, "pnpm-lock.yaml")),
    hasPackageJson: await exists(resolve(cwd, "package.json")),
  };
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}
