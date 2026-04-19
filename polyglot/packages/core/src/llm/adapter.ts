export interface LlmMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LlmGenerationRequest {
  messages: LlmMessage[];
  model: string;
  maxOutputTokens: number;
  temperature: number;
  seed: number | null;
  responseFormat?: "json" | "text";
}

export interface LlmGenerationResult {
  text: string;
  tokens: {
    input: number;
    output: number;
  };
  costUsd: number;
  raw?: unknown;
}

export interface LlmAdapter {
  readonly provider: string;
  generate(request: LlmGenerationRequest): Promise<LlmGenerationResult>;
}
