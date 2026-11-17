"use client";

import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;
    const fps = 24;
    const interval = 1000 / fps;

    // Characters: Katakana + Hex + Latin
    const chars = "0123456789ABCDEF!@#$%^&*<>~+=\\/|{}[]:;アイウエオカキクケコサシスセソタチツテト";
    const fontSize = 14;

    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        // Random starting positions
        drops[i] = Math.floor(Math.random() * -50);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);

      // Tab visibility check
      if (document.hidden) return;

      const delta = time - lastTime;
      if (delta < interval) return;
      lastTime = time - (delta % interval);

      // Translucent black overlay to produce trails
      ctx.fillStyle = "rgba(5, 8, 10, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Bright green head, dimmer body
        ctx.fillStyle = "#00FF9C";
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.985) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
    />
  );
}

