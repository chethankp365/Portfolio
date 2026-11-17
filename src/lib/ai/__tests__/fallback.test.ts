import { describe, it, expect } from "vitest";
import { executeWithFallback } from "../registry";
import { AIProvider } from "../types";

describe("AI Provider Fallback Rotation", () => {
  it("falls back to the second provider when the first fails", async () => {
    const failingProvider: AIProvider = {
      name: "Failing Provider",
      isConfigured: () => true,
      stream: async () => {
        const err = new Error("Rate limit 429 exceeded");
        (err as any).status = 429;
        throw err;
      }
    };

    const healthyProvider: AIProvider = {
      name: "Healthy Backup Provider",
      isConfigured: () => true,
      stream: async () => {
        async function* gen() {
          yield "Hello from healthy backup";
        }
        return gen();
      }
    };

    const result = await executeWithFallback(
      [{ role: "user", content: "hi" }],
      "system prompt",
      undefined,
      [failingProvider, healthyProvider]
    );

    expect(result.providerName).toBe("Healthy Backup Provider");

    let text = "";
    for await (const chunk of result.stream) {
      text += chunk;
    }
    expect(text).toBe("Hello from healthy backup");
  });

  it("throws when all configured providers fail", async () => {
    const failing1: AIProvider = {
      name: "Fail 1",
      isConfigured: () => true,
      stream: async () => {
        throw new Error("Fail 1 down");
      }
    };

    const failing2: AIProvider = {
      name: "Fail 2",
      isConfigured: () => true,
      stream: async () => {
        throw new Error("Fail 2 down");
      }
    };

    await expect(
      executeWithFallback(
        [{ role: "user", content: "test" }],
        "system prompt",
        undefined,
        [failing1, failing2]
      )
    ).rejects.toThrow();
  });
});
