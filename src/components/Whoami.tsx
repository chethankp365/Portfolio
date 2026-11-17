"use client";

import { Terminal, Shield, Target } from "lucide-react";
import { profile } from "@/data/profile";
import AnimatedCounter from "./AnimatedCounter";

export default function Whoami() {
  return (
    <section
      id="about"
      className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
    >
      {/* Section Header */}
      <div className="mb-10 flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono text-xl sm:text-2xl font-bold text-[#00FF9C]">
          <Terminal className="w-6 h-6 text-[#00FF9C]" />
          <span># whoami</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-[#00FF9C]/40 via-[#00FF9C]/10 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Main Whoami Bio Card */}
        <div className="lg:col-span-7 bg-[#090E13] p-6 sm:p-8 border border-[#00FF9C]/25 cut-corner-tl-br shadow-[0_0_20px_rgba(0,0,0,0.6)] flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-64 h-64 bg-[#00FF9C]/5 blur-3xl pointer-events-none"
          />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between text-xs font-mono text-[#6B8A7D] pb-3 border-b border-[#00FF9C]/10">
              <span className="text-[#00E5FF]">&gt; id -u chethan // UID=1000(chethan) GID=1000(redteam)</span>
              <span>ATRIA I.T. // VTU</span>
            </div>

            <p className="text-base sm:text-lg text-[#D7FFE9]/90 leading-relaxed font-sans">
              {profile.whoami}
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-[#6B8A7D]">
              <div className="flex items-center gap-2 bg-[#05080A] p-2.5 border border-[#00FF9C]/15 rounded-sm">
                <Shield className="w-4 h-4 text-[#00FF9C]" />
                <span>Focus: Offensive Security &amp; Cyber Ranges</span>
              </div>
              <div className="flex items-center gap-2 bg-[#05080A] p-2.5 border border-[#00FF9C]/15 rounded-sm">
                <Target className="w-4 h-4 text-[#00E5FF]" />
                <span>Goal: Red Team / Threat Detection</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#00FF9C]/10 flex items-center justify-between text-xs font-mono text-[#6B8A7D]">
            <span>LOCATION: BENGALURU, KA</span>
            <span className="text-[#00FF9C]">STATUS: READY_TO_DEPLOY</span>
          </div>
        </div>

        {/* 4 Animated Metric Counters Grid */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 h-full">
          {profile.counters.map((c, idx) => (
            <AnimatedCounter
              key={idx}
              value={c.value}
              prefix={c.prefix}
              suffix={c.suffix}
              label={c.label}
              subtext={c.subtext}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

