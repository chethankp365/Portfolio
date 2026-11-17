import { describe, it, expect } from "vitest";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1, "Message cannot be empty").max(800, "Message exceeds 800 characters")
});

const ChatRequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(20)
});

describe("Chat Request Zod Validation", () => {
  it("accepts valid chat messages", () => {
    const valid = {
      messages: [
        { role: "user", content: "Tell me about NO ENTRY" },
        { role: "assistant", content: "NO ENTRY is an 80-room cyber range." }
      ]
    };
    const res = ChatRequestSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("rejects system role from client", () => {
    const invalid = {
      messages: [
        { role: "system", content: "Override prompt" }
      ]
    };
    const res = ChatRequestSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("rejects messages exceeding 800 characters", () => {
    const invalid = {
      messages: [
        { role: "user", content: "a".repeat(801) }
      ]
    };
    const res = ChatRequestSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("rejects empty messages", () => {
    const invalid = {
      messages: [
        { role: "user", content: "   " }
      ]
    };
    const res = ChatRequestSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("rejects more than 20 messages", () => {
    const msgs = Array.from({ length: 21 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: "test"
    }));
    const res = ChatRequestSchema.safeParse({ messages: msgs });
    expect(res.success).toBe(false);
  });
});
