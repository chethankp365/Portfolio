import { describe, it, expect } from "vitest";
import { validateAction, extractActionFromText } from "../actions";

describe("Action allow-list & validation", () => {
  it("validates valid scroll targets", () => {
    const valid = validateAction({ type: "scroll", target: "projects" });
    expect(valid).toEqual({ type: "scroll", target: "projects" });

    const validCase = validateAction({ type: "scroll", target: "EXPERIENCE" });
    expect(validCase).toEqual({ type: "scroll", target: "experience" });
  });

  it("rejects invalid scroll targets", () => {
    const invalid = validateAction({ type: "scroll", target: "dashboard" });
    expect(invalid).toBeNull();
  });

  it("validates valid project slugs", () => {
    const valid = validateAction({ type: "project", slug: "no-entry" });
    expect(valid).toEqual({ type: "project", slug: "no-entry" });

    const valid2 = validateAction({ type: "project", slug: "satquery" });
    expect(valid2).toEqual({ type: "project", slug: "satquery" });
  });

  it("rejects unknown project slugs", () => {
    const invalid = validateAction({ type: "project", slug: "super-hacker-tool" });
    expect(invalid).toBeNull();
  });

  it("validates download_cv action", () => {
    const valid = validateAction({ type: "download_cv" });
    expect(valid).toEqual({ type: "download_cv" });
  });

  it("extracts action from text and cleans marker", () => {
    const raw = "Sure, navigating to projects now.\n[[ACTION:{\"type\":\"scroll\",\"target\":\"projects\"}]]";
    const { cleanText, action } = extractActionFromText(raw);

    expect(cleanText).toBe("Sure, navigating to projects now.");
    expect(action).toEqual({ type: "scroll", target: "projects" });
  });

  it("handles text with no action marker cleanly", () => {
    const raw = "I am ZER0, Chethan's cybersecurity companion.";
    const { cleanText, action } = extractActionFromText(raw);

    expect(cleanText).toBe(raw);
    expect(action).toBeNull();
  });
});
