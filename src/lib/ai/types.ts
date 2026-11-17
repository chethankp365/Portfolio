export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type AllowedAction =
  | { type: "scroll"; target: "about" | "experience" | "projects" | "skills" | "connect" }
  | { type: "project"; slug: string }
  | { type: "download_cv" };

export interface AIProvider {
  name: string;
  isConfigured: () => boolean;
  stream: (
    messages: ChatMessage[],
    systemPrompt: string,
    signal?: AbortSignal
  ) => Promise<AsyncIterable<string>>;
}

