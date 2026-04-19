import type { LlmConfig } from "@polyglot/schemas";
import type { LlmAdapter, LlmGenerationRequest, LlmGenerationResult } from "./adapter.js";

export class AnthropicLlmAdapter implements LlmAdapter {
  public readonly provider = "anthropic";

  public constructor(private readonly config: LlmConfig) {}

  public async generate(
    request: LlmGenerationRequest,
  ): Promise<LlmGenerationResult> {
    const apiKey = process.env[this.config.apiKeyEnv];

    if (!apiKey) {
      throw new Error(
        `Missing API key in env var ${this.config.apiKeyEnv} for Anthropic.`,
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.maxOutputTokens,
        temperature: request.temperature,
        system:
          request.messages.find((message) => message.role === "system")?.content ??
          "Return JSON only.",
        messages: request.messages
          .filter((message) => message.role !== "system")
          .map((message) => ({
            role: message.role === "assistant" ? "assistant" : "user",
            content: message.content,
          })),
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Anthropic request failed with ${response.status}: ${await response.text()}`,
      );
    }

    const json = (await response.json()) as {
      content?: Array<{ text?: string }>;
      usage?: { input_tokens?: number; output_tokens?: number };
    };

    return {
      text: json.content?.[0]?.text ?? "{}",
      tokens: {
        input: json.usage?.input_tokens ?? 0,
        output: json.usage?.output_tokens ?? 0,
      },
      costUsd: 0,
      raw: json,
    };
  }
}
