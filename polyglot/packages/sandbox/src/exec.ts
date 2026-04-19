export interface ExecOptions {
  timeoutMs: number;
  memLimitMb?: number;
  cwd?: string;
  env?: Record<string, string>;
}

export interface ExecResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  durationMs: number;
  timedOut: boolean;
}

/**
 * Reserved boundary for untrusted code execution (e.g. Python-backed audio DSP,
 * LLM-emitted drawing programs). Not implemented in scaffold — callers must
 * handle NotImplementedError.
 */
export async function execProgram(
  _code: string,
  _options: ExecOptions,
): Promise<ExecResult> {
  throw new Error(
    "execProgram: not implemented. This is a reserved sandbox boundary; see packages/sandbox/README.md.",
  );
}
