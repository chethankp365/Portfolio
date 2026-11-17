import { AIProvider, ChatMessage } from "./types";
import { GeminiProvider } from "./providers/gemini";
import { OpenAICompatibleProvider } from "./providers/openaiCompatible";

// 1. Define list of supported providers in default rotation order
export function createDefaultProviders(): AIProvider[] {
  return [
    new GeminiProvider(),
    new OpenAICompatibleProvider({
      name: "Groq",
      endpoint: "https://api.groq.com/openai/v1/chat/completions",
      apiKeyEnv: "GROQ_API_KEY",
      modelEnv: "GROQ_MODEL",
      defaultModel: "llama-3.3-70b-versatile"
    }),
    new OpenAICompatibleProvider({
      name: "OpenRouter",
      endpoint: "https://openrouter.ai/api/v1/chat/completions",
      apiKeyEnv: "OPENROUTER_API_KEY",
      modelEnv: "OPENROUTER_MODEL",
      defaultModel: "meta-llama/llama-3.3-70b-instruct",
      extraHeaders: {
        "HTTP-Referer": "https://chethankumar.dev",
        "X-Title": "Chethan Kumar Portfolio"
      }
    }),
    new OpenAICompatibleProvider({
      name: "Mistral",
      endpoint: "https://api.mistral.ai/v1/chat/completions",
      apiKeyEnv: "MISTRAL_API_KEY",
      modelEnv: "MISTRAL_MODEL",
      defaultModel: "mistral-small-latest"
    }),
    new OpenAICompatibleProvider({
      name: "Cerebras",
      endpoint: "https://api.cerebras.ai/v1/chat/completions",
      apiKeyEnv: "CEREBRAS_API_KEY",
      modelEnv: "CEREBRAS_MODEL",
      defaultModel: "llama3.1-8b"
    }),
    new OpenAICompatibleProvider({
      name: "Hugging Face",
      endpoint: "https://router.huggingface.co/novita/v1/chat/completions",
      apiKeyEnv: "HF_TOKEN",
      modelEnv: "HF_MODEL",
      defaultModel: "meta-llama/Llama-3.2-3B-Instruct"
    })
  ];
}

// In-memory cooldown tracking for rate-limited/failed providers
const cooldowns = new Map<string, number>();
let roundRobinIndex = 0;

/**
 * Check if a provider is currently cooled down
 */
function isCooledDown(providerName: string): boolean {
  const expiresAt = cooldowns.get(providerName);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    cooldowns.delete(providerName);
    return false;
  }
  return true;
}

/**
 * Put a provider in cooldown for 60 seconds
 */
function setCooldown(providerName: string, durationMs: number = 60_000) {
  cooldowns.set(providerName, Date.now() + durationMs);
}

/**
 * Returns the count of configured providers with present keys
 */
export function getConfiguredProvidersCount(): number {
  const providers = createDefaultProviders();
  return providers.filter((p) => p.isConfigured()).length;
}

/**
 * Executes a streaming chat request with multi-provider rotation & fallback.
 * Uses a 10s timeout to first token, and falls through to the next provider on failure.
 */
export async function executeWithFallback(
  messages: ChatMessage[],
  systemPrompt: string,
  clientSignal?: AbortSignal,
  customProviders?: AIProvider[]
): Promise<{
  stream: AsyncIterable<string>;
  providerName: string;
}> {
  const allProviders = customProviders || createDefaultProviders();
  const configuredProviders = allProviders.filter((p) => p.isConfigured());

  if (configuredProviders.length === 0) {
    throw new Error("No AI providers configured in environment.");
  }

  // Filter out those in active cooldown
  const availableProviders = configuredProviders.filter((p) => !isCooledDown(p.name));
  const candidatePool = availableProviders.length > 0 ? availableProviders : configuredProviders;

  // Round-robin starting position
  const startIndex = roundRobinIndex % candidatePool.length;
  roundRobinIndex = (roundRobinIndex + 1) % 10000;

  const orderedProviders = [
    ...candidatePool.slice(startIndex),
    ...candidatePool.slice(0, startIndex)
  ];

  let lastError: Error | null = null;

  for (const provider of orderedProviders) {
    const startTime = Date.now();
    try {
      // 10s timeout for first token/stream setup
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort(new Error("Timeout (10s) reached while awaiting provider response."));
      }, 10_000);

      // Link client abort signal if provided
      if (clientSignal) {
        clientSignal.addEventListener("abort", () => controller.abort());
      }

      const iterator = await provider.stream(messages, systemPrompt, controller.signal);

      // Wrap iterator to verify first chunk arrives and then clear the 10s timeout
      const wrappedIterator = (async function* () {
        let firstChunkReceived = false;
        try {
          for await (const chunk of iterator) {
            if (!firstChunkReceived) {
              firstChunkReceived = true;
              clearTimeout(timeoutId);
              const latency = Date.now() - startTime;
              console.log(
                `[AI Provider Success]: ${provider.name} responded in ${latency}ms`
              );
            }
            yield chunk;
          }
        } finally {
          clearTimeout(timeoutId);
        }
      })();

      return {
        stream: wrappedIterator,
        providerName: provider.name
      };
    } catch (err: any) {
      const latency = Date.now() - startTime;
      console.warn(
        `[AI Provider Fallback]: ${provider.name} failed after ${latency}ms. Status: ${
          err?.status || "ERR"
        }. Message: ${err?.message || "Unknown error"}`
      );

      // If 429 (rate limit) or 401 (auth), set a 60s cooldown
      if (err?.status === 429 || err?.status === 401) {
        setCooldown(provider.name, 60_000);
      }

      lastError = err;
      // Fall through to next provider
    }
  }

  throw lastError || new Error("All configured AI providers failed to respond.");
}

