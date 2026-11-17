"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  "[ 0.000000] Linux version 6.6.9-kali1-amd64 (devel@kali) #1 SMP PREEMPT",
  "[ 0.124018] Memory: 16384MB available, kernel secure modules initialized",
  "[ 0.358120] ACPI: Core revision 20261117 / Subsystem online",
  "[ 0.589140] [ OK ] Initializing network interfaces (eth0, wlan0)...",
  "[ 0.741005] [ OK ] Loading cryptographic keys & security profiles...",
  "[ 0.962800] [ OK ] Mounting /dev/nvme0n1p2 on /home/chethan...",
  "[ 1.150240] [ OK ] Starting red-team cyber-range engine (80 rooms detected)...",
  "[ 1.340010] [ OK ] GHOST AI Mentor & ZERO AI runtime initialized...",
  "[ 1.512000] [ OK ] System integrity verified. All systems nominal.",
  "[ 1.680000] Launching chethan@kali:~$ personal portfolio shell..."
];

export default function BootLoader({ onComplete }: { onComplete: () => void }) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    // Check if user already booted during this browser session
    const hasBooted = sessionStorage.getItem("chethan_booted");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hasBooted || prefersReducedMotion) {
      onComplete();
      return;
    }

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < BOOT_LINES.length) {
        setDisplayedLines((prev) => [...prev, BOOT_LINES[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          sessionStorage.setItem("chethan_booted", "true");
          onComplete();
        }, 300);
      }
    }, 140);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        clearInterval(interval);
        sessionStorage.setItem("chethan_booted", "true");
        setIsSkipped(true);
        onComplete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem("chethan_booted", "true");
    setIsSkipped(true);
    onComplete();
  };

  if (isSkipped) return null;

  return (
    <div
      onClick={handleSkip}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#05080A] p-6 md:p-12 text-[#D7FFE9] font-mono select-none cursor-pointer overflow-hidden transition-opacity duration-500"
      role="region"
      aria-label="Terminal Boot Sequence"
    >
      <div className="max-w-4xl space-y-1.5 text-xs sm:text-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#00FF9C]/20 text-[#6B8A7D]">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#00FF9C] animate-pulse" />
            BOOT SEQUENCE // CHE-KALI-6.6
          </span>
          <span className="text-[#00FF9C] hover:underline">[ESC / CLICK TO SKIP]</span>
        </div>

        {displayedLines.map((line, idx) => (
          <div
            key={idx}
            className={`font-mono ${
              line.includes("[ OK ]")
                ? "text-[#00FF9C]"
                : line.includes("Linux version")
                ? "text-[#00E5FF]"
                : "text-[#D7FFE9]/90"
            }`}
          >
            {line}
          </div>
        ))}

        <div className="flex items-center gap-1 pt-2 text-[#00FF9C]">
          <span>chethan@kali:~$</span>
          <span className="inline-block w-2 h-4 bg-[#00FF9C] animate-pulse" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#00FF9C]/10 text-xs text-[#6B8A7D]">
        <span>ATRIA INSTITUTE OF TECHNOLOGY // CSD-2027</span>
        <span className="text-[#00FF9C]/80">CLICK ANYWHERE TO ENTER</span>
      </div>
    </div>
  );
}

