import { resolve } from "node:path";
import type { PolyglotRequest, RenderCtx, RenderResult, RunManifest } from "@polyglot/schemas";
import { loadPolyglotConfig } from "./config.js";
import { BudgetTracker } from "./budget.js";
import { collectRuntimeFingerprint, hashFile } from "./manifest.js";
import { routeRequest } from "./router.js";
import { CodecRegistry } from "./registry.js";
import { createRunId, resolveSeed } from "./seed.js";
import { RunTelemetry } from "./telemetry.js";
import { serializeError, ValidationError } from "./errors.js";
import { injectSchemaPreamble } from "../schema/preamble.js";
import type { LlmAdapter, LlmGenerationResult } from "../llm/adapter.js";
import { OpenAICompatibleLlmAdapter } from "../llm/openai-compatible.js";
import { AnthropicLlmAdapter } from "../llm/anthropic.js";
import { registerAudioCodec } from "../codecs/audio.js";
import { registerImageCodec } from "../codecs/image.js";
import { registerVideoCodec } from "../codecs/video.js";
import { registerSensorCodec } from "../codecs/sensor.js";

export interface HarnessRunOptions {
  command: string;
  args: string[];
  cwd?: string;
  dryRun?: boolean;
  outPath?: string;
  configPath?: string;
}

export interface HarnessOutcome {
  manifest: RunManifest;
  result: RenderResult | null;
  runDir: string;
  error: ReturnType<typeof serializeError> | null;
}

export interface PolyglotOptions {
  registry?: CodecRegistry;
  llmAdapter?: LlmAdapter | null;
}

export class Polyglot {
  public constructor(
    private readonly config: Awaited<ReturnType<typeof loadPolyglotConfig>>,
    private readonly registry: CodecRegistry,
    private readonly llmAdapter: LlmAdapter | null,
  ) {}

  public static async bootstrap(
    options: PolyglotOptions & { cwd?: string; configPath?: string } = {},
  ): Promise<Polyglot> {
    const config = await loadPolyglotConfig({
      ...(options.cwd ? { cwd: options.cwd } : {}),
      ...(options.configPath ? { configPath: options.configPath } : {}),
    });
    const registry = options.registry ?? createDefaultRegistry();
    const llmAdapter = options.llmAdapter ?? createLlmAdapter(config.llm);
    return new Polyglot(config, registry, llmAdapter);
  }

  public async run(
    request: PolyglotRequest,
    options: HarnessRunOptions,
  ): Promise<HarnessOutcome> {
    const cwd = resolve(options.cwd ?? process.cwd());
    const codec = routeRequest(request, this.registry);
    const runId = createRunId();
    const runDir = resolve(cwd, this.config.runtime.artifactsDir, "runs", runId);
    const telemetry = new RunTelemetry({ runId, runDir });
    const fingerprint = await collectRuntimeFingerprint(cwd);
    const budget = new BudgetTracker(this.config.runtime.budget);
    const seed = resolveSeed(request.seed, this.config.runtime.defaultSeed);
    const promptExpanded = injectSchemaPreamble(
      request.prompt,
      codec.schemaPreamble(request),
    );
    const startedAt = new Date();

    await telemetry.ensureRunDir();
    await telemetry.writeText("llm-input.txt", promptExpanded);

    const manifest: RunManifest = {
      runId,
      ...fingerprint,
      command: options.command,
      args: options.args,
      seed,
      codec: codec.name,
      tier: null,
      route: "route" in request ? request.route : undefined,
      llmProvider: this.config.llm.provider,
      llmModel: this.config.llm.model,
      llmTokens: {
        input: 0,
        output: 0,
      },
      costUsd: 0,
      promptRaw: request.prompt,
      promptExpanded,
      llmOutputRaw: null,
      llmOutputParsed: null,
      artifactPath: null,
      artifactSha256: null,
      startedAt: startedAt.toISOString(),
      durationMs: 0,
      ok: false,
      error: null,
    };

    let result: RenderResult | null = null;
    let error: ReturnType<typeof serializeError> | null = null;

    try {
      const generation = options.dryRun
        ? createDryRunGeneration()
        : await this.generateStructured(promptExpanded, seed);

      budget.consume(
        generation.tokens.input + generation.tokens.output,
        generation.costUsd,
      );

      manifest.llmOutputRaw = generation.text;
      manifest.llmTokens = generation.tokens;
      manifest.costUsd = generation.costUsd;
      await telemetry.writeText("llm-output.txt", generation.text);

      const parsed = codec.parse(generation.text);
      if (!parsed.ok) {
        throw new ValidationError("Codec output could not be parsed", {
          details: {
            codec: codec.name,
            error: parsed.error,
          },
        });
      }

      manifest.llmOutputParsed = parsed.value;

      const renderCtx: RenderCtx = {
        runId,
        runDir,
        seed,
        outPath: resolve(
          options.outPath ?? defaultOutputPathFor(request.modality, cwd, runId),
        ),
        logger: createRunLogger(runId),
      };

      result = await codec.render(parsed.value, renderCtx);
      manifest.artifactPath = result.artifactPath;
      manifest.artifactSha256 = await hashFile(result.artifactPath);
      manifest.ok = true;
      manifest.durationMs = Date.now() - startedAt.getTime();
      manifest.llmTokens = result.metadata.llmTokens;
      manifest.costUsd = result.metadata.costUsd;
    } catch (caughtError) {
      error = serializeError(caughtError);
      manifest.error = error;
      manifest.durationMs = Date.now() - startedAt.getTime();
      manifest.ok = false;
    }

    await telemetry.writeJson("manifest.json", manifest);

    return {
      manifest,
      result,
      runDir,
      error,
    };
  }

  private async generateStructured(
    promptExpanded: string,
    seed: number | null,
  ): Promise<LlmGenerationResult> {
    if (!this.llmAdapter) {
      throw new ValidationError(
        "No LLM adapter is configured for non-dry-run execution.",
      );
    }

    return this.llmAdapter.generate({
      model: this.config.llm.model,
      maxOutputTokens: this.config.llm.maxOutputTokens,
      temperature: this.config.llm.temperature,
      seed,
      responseFormat: "json",
      messages: [
        {
          role: "system",
          content: "Return JSON only. Do not wrap it in markdown.",
        },
        {
          role: "user",
          content: promptExpanded,
        },
      ],
    });
  }
}

export function createDefaultRegistry(): CodecRegistry {
  const registry = new CodecRegistry();
  registerImageCodec(registry);
  registerAudioCodec(registry);
  registerVideoCodec(registry);
  registerSensorCodec(registry);
  return registry;
}

function createLlmAdapter(
  llmConfig: Awaited<ReturnType<typeof loadPolyglotConfig>>["llm"],
): LlmAdapter | null {
  if (llmConfig.provider === "anthropic") {
    return new AnthropicLlmAdapter(llmConfig);
  }

  return new OpenAICompatibleLlmAdapter(llmConfig);
}

function createDryRunGeneration(): LlmGenerationResult {
  return {
    text: "{}",
    tokens: {
      input: 0,
      output: 0,
    },
    costUsd: 0,
    raw: {
      dryRun: true,
    },
  };
}

function defaultOutputPathFor(modality: PolyglotRequest["modality"], cwd: string, runId: string) {
  const extension =
    modality === "image"
      ? "png"
      : modality === "audio"
        ? "wav"
        : modality === "video"
          ? "mp4"
          : "json";

  return resolve(cwd, "artifacts", "runs", runId, `output.${extension}`);
}

function createRunLogger(runId: string): RenderCtx["logger"] {
  return {
    debug: (message, data) => {
      console.debug(`[polyglot:${runId}] ${message}`, data ?? "");
    },
    info: (message, data) => {
      console.info(`[polyglot:${runId}] ${message}`, data ?? "");
    },
    warn: (message, data) => {
      console.warn(`[polyglot:${runId}] ${message}`, data ?? "");
    },
    error: (message, data) => {
      console.error(`[polyglot:${runId}] ${message}`, data ?? "");
    },
  };
}
