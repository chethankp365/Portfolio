import { AllowedAction } from "./types";
import { projects } from "@/data/projects";

const ALLOWED_TARGETS = new Set([
  "about",
  "experience",
  "projects",
  "skills",
  "connect"
]);

const ALLOWED_PROJECT_SLUGS = new Set(projects.map((p) => p.slug));

/**
 * Validates whether an action object conforms to the strict allow-list.
 */
export function validateAction(action: unknown): AllowedAction | null {
  if (!action || typeof action !== "object") return null;

  const act = action as Record<string, unknown>;

  if (act.type === "scroll" && typeof act.target === "string") {
    const target = act.target.toLowerCase();
    if (ALLOWED_TARGETS.has(target)) {
      return { type: "scroll", target: target as any };
    }
  }

  if (act.type === "project" && typeof act.slug === "string") {
    const slug = act.slug.toLowerCase().trim();
    if (ALLOWED_PROJECT_SLUGS.has(slug)) {
      return { type: "project", slug };
    }
  }

  if (act.type === "download_cv") {
    return { type: "download_cv" };
  }

  return null;
}

/**
 * Parses any [[ACTION:{...}]] block from text.
 * Returns the cleaned text and the parsed action if valid.
 */
export function extractActionFromText(text: string): {
  cleanText: string;
  action: AllowedAction | null;
} {
  const regex = /\[\[ACTION:(\{[\s\S]*?\})\]\]/;
  const match = text.match(regex);

  if (!match) {
    return { cleanText: text, action: null };
  }

  try {
    const parsed = JSON.parse(match[1]);
    const validated = validateAction(parsed);
    const cleanText = text.replace(match[0], "").trim();
    return { cleanText, action: validated };
  } catch {
    const cleanText = text.replace(match[0], "").trim();
    return { cleanText, action: null };
  }
}

