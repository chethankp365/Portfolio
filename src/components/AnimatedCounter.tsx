"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  subtext?: string;
}

export default function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  label,
  subtext
}: CounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setCount(value);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 1400; // ms
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out expo
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.round(easeProgress * value);

            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(value);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div
      ref={elementRef}
      className="h-full bg-[#090E13] p-5 border border-[#00FF9C]/20 hover:border-[#00FF9C]/50 transition-all duration-300 cut-corner-sm group hover:box-glow-green flex flex-col justify-between"
    >
      <div>
        <div className="text-3xl sm:text-4xl font-extrabold text-[#00FF9C] font-mono tracking-tight group-hover:text-glow-green">
          {prefix}
          {count}
          {suffix}
        </div>
        <div className="mt-2 text-sm sm:text-base font-medium text-[#D7FFE9]">
          {label}
        </div>
      </div>
      {subtext && (
        <div className="mt-2 text-xs text-[#6B8A7D] font-mono">{subtext}</div>
      )}
    </div>
  );
}

