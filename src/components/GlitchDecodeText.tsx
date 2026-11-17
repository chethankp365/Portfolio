"use client";

import { useEffect, useState, useCallback } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>[]{}=";

export default function GlitchDecodeText({
  text,
  className = ""
}: {
  text: string;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState(text);

  const startScramble = useCallback(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 35);

    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => {
    const cleanup = startScramble();
    return () => {
      if (cleanup) cleanup();
    };
  }, [startScramble]);

  return (
    <span
      onMouseEnter={startScramble}
      className={`inline-block font-mono cursor-default select-none tracking-tight ${className}`}
      title={text}
    >
      {displayText}
    </span>
  );
}

