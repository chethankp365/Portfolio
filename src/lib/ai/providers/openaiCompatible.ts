import { AIProvider, ChatMessage } from "../types";

export interface OpenAICompatibleConfig {
  name: string;
  endpoint: string;
  apiKeyEnv: string;
  modelEnv: string;
  defaultModel: string;
  extraHeaders?: Record<string, string>;
}

export class OpenAICompatibleProvider implements AIProvider {
  name: string;
  private endpoint: string;
  private apiKeyEnv: string;
  private modelEnv: string;
  private defaultModel: string;
  private extraHeaders?: Record<string, string>;

  constructor(config: OpenAICompatibleConfig) {
    this.name = config.name;
    this.endpoint = config.endpoint;
    this.apiKeyEnv = config.apiKeyEnv;
    this.modelEnv = config.modelEnv;
    this.defaultModel = config.defaultModel;
    this.extraHeaders = config.extraHeaders;
  }

  isConfigured(): boolean {
    const key = process.env[this.apiKeyEnv];
    return Boolean(key && key.trim().length > 0);
  }

  async stream(
    messages: ChatMessage[],
    systemPrompt: string,
    signal?: AbortSignal
  ): Promise<AsyncIterable<string>> {
    const apiKey = process.env[this.apiKeyEnv];
    if (!apiKey) {
      throw new Error(`${this.apiKeyEnv} is not configured.`);
    }

    const model = process.env[this.modelEnv] || this.defaultModel;

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content }))
    ];

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...this.extraHeaders
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        stream: true,
        max_tokens: 450,
        temperature: 0.7
      }),
      signal
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      const err = new Error(
        `Provider ${this.name} failed with HTTP ${response.status}: ${errorText}`
      );
      (err as any).status = response.status;
      throw err;
    }

    const body = response.body;
    if (!body) {
      throw new Error(`Provider ${this.name} returned an empty response body.`);
    }

    const reader = body.getReader();
    const decoder = new TextDecoder("utf-8");

    async function* generator() {
      let buffer = "";

      try {
        while (true) {
          if (signal?.aborted) break;
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(":") || !trimmed.startsWith("data:")) {
              continue;
            }

            const dataContent = trimmed.slice(5).trim();
            if (dataContent === "[DONE]") {
              return;
            }

            try {
              const parsed = JSON.parse(dataContent);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                yield delta;
              }
            } catch {
              // Ignore partial JSON or keep in buffer
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    }

    return generator();
  }
}

