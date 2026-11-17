import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/ai/systemPrompt";
import { executeWithFallback } from "@/lib/ai/registry";
import { checkRateLimit } from "@/lib/ai/rateLimit";
import { extractActionFromText, validateAction } from "@/lib/ai/actions";
import { ChatMessage } from "@/lib/ai/types";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1, "Message cannot be empty").max(800, "Message exceeds 800 characters")
});

const ChatRequestSchema = z.object({
  messages: z.array(MessageSchema).min(1, "At least one message is required").max(20, "Maximum 20 messages allowed in context")
});

/**
 * Validates Origin/Host headers to prevent cross-site endpoint abuse.
 */
function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");

  if (!origin || !host) return true; // Direct non-browser or same-origin without origin header

  try {
    const originHost = new URL(origin).host;
    if (originHost === host) return true;
    if (host.includes("localhost") || originHost.includes("localhost")) return true;
    return false;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  // 1. Same-origin validation
  if (!isAllowedOrigin(req)) {
    return NextResponse.json(
      { error: "Forbidden: Cross-origin request rejected." },
      { status: 403 }
    );
  }

  // 2. Client IP rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const rateLimit = await checkRateLimit(ip);
  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error: "Rate limit reached. ZER0 is cooling down. Please try again shortly.",
        retryAfter: rateLimit.retryAfterSeconds
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds || 60),
          "X-Content-Type-Options": "nosniff"
        }
      }
    );
  }

  // 3. Body validation with Zod
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request payload.",
        details: parsed.error.issues.map((i) => i.message)
      },
      { status: 400 }
    );
  }

  // Cap context to last 12 messages and strip any system messages
  const sanitizedMessages: ChatMessage[] = parsed.data.messages
    .slice(-12)
    .filter((m) => m.role === "user" || m.role === "assistant");

  const systemPrompt = buildSystemPrompt();

  // 4. Fallback execution & response stream
  try {
    const { stream, providerName } = await executeWithFallback(
      sanitizedMessages,
      systemPrompt,
      req.signal
    );

    const encoder = new TextEncoder();

    const responseStream = new ReadableStream({
      async start(controller) {
        let accumulatedText = "";
        let pendingActionBuffer = "";
        let insideActionBlock = false;

        try {
          for await (const chunk of stream) {
            if (req.signal.aborted) break;

            for (const char of chunk) {
              if (insideActionBlock) {
                pendingActionBuffer += char;
                if (char === "]" && pendingActionBuffer.endsWith("]]")) {
                  insideActionBlock = false;
                  // Action fully captured in pendingActionBuffer
                }
              } else if (char === "[" && !insideActionBlock) {
                pendingActionBuffer += char;
                if (pendingActionBuffer === "[[ACTION:") {
                  insideActionBlock = true;
                } else if (!"[[ACTION:".startsWith(pendingActionBuffer)) {
                  // Not an action tag, flush buffered text
                  accumulatedText += pendingActionBuffer;
                  const data = JSON.stringify({ text: pendingActionBuffer });
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                  pendingActionBuffer = "";
                }
              } else if (pendingActionBuffer.length > 0) {
                pendingActionBuffer += char;
                if (pendingActionBuffer === "[[ACTION:") {
                  insideActionBlock = true;
                } else if (!"[[ACTION:".startsWith(pendingActionBuffer)) {
                  accumulatedText += pendingActionBuffer;
                  const data = JSON.stringify({ text: pendingActionBuffer });
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                  pendingActionBuffer = "";
                }
              } else {
                accumulatedText += char;
                const data = JSON.stringify({ text: char });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }
            }
          }

          // If pendingActionBuffer had text not part of an action, flush it
          if (pendingActionBuffer && !pendingActionBuffer.startsWith("[[ACTION:")) {
            accumulatedText += pendingActionBuffer;
            const data = JSON.stringify({ text: pendingActionBuffer });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          // Extract and validate action from either pending buffer or full accumulated text
          let finalAction = null;
          if (pendingActionBuffer.startsWith("[[ACTION:")) {
            const { action } = extractActionFromText(pendingActionBuffer);
            finalAction = action ? validateAction(action) : null;
          } else {
            const { action } = extractActionFromText(accumulatedText);
            finalAction = action ? validateAction(action) : null;
          }

          // Send terminal done event with validated action
          const endData = JSON.stringify({
            done: true,
            action: finalAction
          });
          controller.enqueue(encoder.encode(`data: ${endData}\n\n`));
          controller.close();
        } catch (streamErr) {
          console.error(`[Streaming error from ${providerName}]:`, streamErr);
          const failData = JSON.stringify({
            done: true,
            error: true,
            text: "\n\n[ZER0]: Stream interrupted. Reconnecting..."
          });
          controller.enqueue(encoder.encode(`data: ${failData}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      }
    });
  } catch (err: any) {
    console.error("[All AI providers failed]:", err?.message || err);
    // User requirement: friendly in-character message with HTTP 200 + error flag, never a stack trace
    return NextResponse.json({
      error: true,
      fallbackMessage:
        "ZERO AI is rebooting. Try again in a minute, or email Chethan directly at chethankp365@gmail.com.",
      action: null
    });
  }
}
