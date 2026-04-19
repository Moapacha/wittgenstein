import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

export interface RunTelemetryOptions {
  runId: string;
  runDir: string;
}

export class RunTelemetry {
  public readonly runId: string;
  public readonly runDir: string;

  public constructor(options: RunTelemetryOptions) {
    this.runId = options.runId;
    this.runDir = options.runDir;
  }

  public async ensureRunDir(): Promise<void> {
    await mkdir(this.runDir, { recursive: true });
  }

  public async writeText(name: string, value: string): Promise<void> {
    const filePath = resolve(this.runDir, name);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, value, "utf8");
  }

  public async writeJson(name: string, value: unknown): Promise<void> {
    await this.writeText(name, `${JSON.stringify(value, null, 2)}\n`);
  }
}
