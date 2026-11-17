import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider, ChatMessage } from "../types";

export class GeminiProvider implements AIProvider {
  name = "Google Gemini";

  isConfigured(): boolean {
    return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  }

  async stream(
    messages: ChatMessage[],
    systemPrompt: string,
    signal?: AbortSignal
  ): Promise<AsyncIterable<string>> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
      generationConfig: {
        maxOutputTokens: 450,
        temperature: 0.7
      }
    });

    // Format chat history for Gemini
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const result = await model.generateContentStream({ contents }, { signal });

    async function* generator() {
      for await (const chunk of result.stream) {
        if (signal?.aborted) break;
        const text = chunk.text();
        if (text) {
          yield text;
        }
      }
    }

    return generator();
  }
}

