import type { LlmConfig } from "@polyglot/schemas";
import type { LlmAdapter, LlmGenerationRequest, LlmGenerationResult } from "./adapter.js";

const DEFAULT_BASE_URLS: Record<string, string> = {
  "openai-compatible": "https://api.openai.com/v1",
  minimax: "https://api.minimax.chat/v1",
  moonshot: "https://api.moonshot.cn/v1",
  deepseek: "https://api.deepseek.com/v1",
  qwen: "https://dashscope.aliyuncs.com/compatible-mode/v1",
};

export class OpenAICompatibleLlmAdapter implements LlmAdapter {
  public readonly provider: string;
  private readonly config: LlmConfig;

  public constructor(config: LlmConfig) {
    this.provider = config.provider;
    this.config = config;
  }

  public async generate(
    request: LlmGenerationRequest,
  ): Promise<LlmGenerationResult> {
    const baseUrl =
      this.config.baseUrl ?? DEFAULT_BASE_URLS[this.config.provider] ?? DEFAULT_BASE_URLS["openai-compatible"];
    const apiKey = process.env[this.config.apiKeyEnv];

    if (!apiKey) {
      throw new Error(
        `Missing API key in env var ${this.config.apiKeyEnv} for provider ${this.config.provider}.`,
      );
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature,
        max_tokens: request.maxOutputTokens,
        seed: request.seed ?? undefined,
        response_format:
          request.responseFormat === "json"
            ? { type: "json_object" }
            : undefined,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI-compatible request failed with ${response.status}: ${await response.text()}`,
      );
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };

    return {
      text: json.choices?.[0]?.message?.content ?? "{}",
      tokens: {
        input: json.usage?.prompt_tokens ?? 0,
        output: json.usage?.completion_tokens ?? 0,
      },
      costUsd: 0,
      raw: json,
    };
  }
}
