"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import Image from "next/image";
import { Terminal, Download, ExternalLink, ShieldAlert, ChevronRight } from "lucide-react";
import MatrixRain from "./MatrixRain";
import GlitchDecodeText from "./GlitchDecodeText";
import TypingRole from "./TypingRole";
import { profile } from "@/data/profile";

export default function Hero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [canTilt, setCanTilt] = useState(false);
  const photoCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isTouch && !isReduced) {
      setCanTilt(true);
    }
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !photoCardRef.current) return;
    const rect = photoCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const statusBadge = (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#090E13] border border-[#00FF9C]/30 text-xs sm:text-sm font-mono shadow-[0_0_12px_rgba(0,255,156,0.15)] w-fit max-w-full">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF9C] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF9C]" />
      </span>
      <span className="text-[#00FF9C] font-semibold shrink-0">[STATUS]:</span>
      <span className="text-[#D7FFE9]/90">{profile.statusLine}</span>
    </div>
  );

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Matrix Rain */}
      <MatrixRain />

      {/* Decorative cyber grid backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#00ff9c08_1px,transparent_1px),linear-gradient(to_bottom,#00ff9c08_1px,transparent_1px)] bg-[size:32px_32px]"
      />

      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 items-center">
        {/* Mobile-Only Status Badge (Order 1 on mobile, hidden on lg) */}
        <div className="order-1 lg:hidden flex justify-start">
          {statusBadge}
        </div>

        {/* Left Column: Text, Status, Pitch, Buttons (Order 3 on mobile, lg:order-1 on desktop) */}
        <div className="order-3 lg:order-1 lg:col-span-7 flex flex-col space-y-5 sm:space-y-6 text-left">
          {/* Desktop-Only Status Badge (hidden on mobile, shown on lg) */}
          <div className="hidden lg:block">
            {statusBadge}
          </div>

          {/* Glitch Name */}
          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-mono text-[#6B8A7D] tracking-wider uppercase flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#00E5FF]" />
              <span>SECURITY ANALYST // RED TEAM CANDIDATE</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#00FF9C] tracking-tight leading-none text-glow-green">
              <GlitchDecodeText text={profile.heroName} />
            </h1>
          </div>

          {/* Typing Role Loop */}
          <TypingRole roles={profile.roles} />

          {/* Pitch / Summary */}
          <p className="text-base sm:text-lg text-[#D7FFE9]/85 max-w-2xl leading-relaxed font-sans">
            {profile.summary}
          </p>

          {/* Action Terminal Buttons */}
          <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 font-mono text-xs sm:text-sm">
            {/* View Projects */}
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00FF9C] text-[#05080A] font-bold rounded-sm hover:bg-[#00E5FF] transition-all duration-200 shadow-[0_0_20px_rgba(0,255,156,0.4)] group"
            >
              <Terminal className="w-4 h-4 text-[#05080A] group-hover:rotate-12 transition-transform" />
              <span>./view_projects</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            {/* Download CV */}
            <a
              href={profile.cvPath}
              download="Chethan_Kumar.CV.pdf"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#090E13] text-[#00FF9C] border border-[#00FF9C]/40 hover:border-[#00FF9C] hover:bg-[#00FF9C]/10 rounded-sm transition-all duration-200 shadow-[0_0_12px_rgba(0,255,156,0.1)]"
            >
              <Download className="w-4 h-4 text-[#00FF9C]" />
              <span>./download_cv</span>
            </a>

            {/* GitHub */}
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#090E13] text-[#6B8A7D] hover:text-[#00E5FF] border border-[#6B8A7D]/30 hover:border-[#00E5FF]/50 rounded-sm transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              <span>./github</span>
            </a>
          </div>

          {/* Quick stats banner */}
          <div className="pt-4 flex items-center gap-6 text-xs font-mono text-[#6B8A7D] border-t border-[#00FF9C]/10">
            <span>&gt; KALI LINUX VERIFIED</span>
            <span>&gt; OWASP TOP 10</span>
            <span>&gt; MITRE ATT&amp;CK MAPPED</span>
          </div>
        </div>

        {/* Right Column: Chethan's Photo in Cyber Cut-Corner Frame (Mobile order-2, Desktop lg:order-2) */}
        <div className="order-2 lg:order-2 lg:col-span-5 flex justify-center lg:justify-end">
          <div
            ref={photoCardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative transition-transform duration-200 ease-out perspective-1000"
            style={{
              transform: canTilt
                ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                : "none"
            }}
          >
            {/* Ambient neon back glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-2 bg-gradient-to-r from-[#00FF9C]/30 via-[#00E5FF]/20 to-[#FF3B6B]/20 blur-xl opacity-60 rounded-lg pointer-events-none"
            />

            {/* Cut-corner container card */}
            <div className="relative bg-[#090E13] p-2 sm:p-3 border border-[#00FF9C]/40 cut-corner-tr-bl shadow-[0_0_25px_rgba(0,255,156,0.2)]">
              {/* Photo Frame */}
              <div className="relative w-64 sm:w-72 md:w-80 h-80 sm:h-96 overflow-hidden bg-[#05080A] cut-corner-tr-bl">
                <Image
                  src={profile.photoPath}
                  alt="Chethan Kumar"
                  fill
                  priority
                  sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
                  className="object-cover object-top filter contrast-105 brightness-95"
                />

                {/* Cyber grid / HUD lines overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#05080A] via-transparent to-transparent opacity-60 pointer-events-none"
                />

                {/* Moving scanline */}
                <div
                  aria-hidden="true"
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00FF9C]/70 to-transparent shadow-[0_0_8px_#00FF9C] animate-scanline pointer-events-none"
                />

                {/* Corner reticle decorations */}
                <div className="absolute top-2 left-2 text-[10px] font-mono text-[#00FF9C] bg-[#05080A]/80 px-1.5 py-0.5 border border-[#00FF9C]/30">
                  SYS://KALI-01
                </div>

                <div className="absolute bottom-2 right-2 text-[10px] font-mono text-[#00E5FF] bg-[#05080A]/80 px-1.5 py-0.5 border border-[#00E5FF]/30">
                  FPS: 60 [STABLE]
                </div>
              </div>

              {/* ID Access granted banner */}
              <div className="mt-2.5 flex items-center justify-between px-2 py-1.5 bg-[#05080A] border-t border-[#00FF9C]/20 text-xs font-mono">
                <span className="text-[#00FF9C] font-semibold">[ID: CHETHAN]</span>
                <span className="inline-flex items-center gap-1 text-[#00FF9C] text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9C] animate-pulse" />
                  ACCESS: GRANTED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

