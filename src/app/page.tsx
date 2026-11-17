"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Whoami from "@/components/Whoami";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ProjectsList from "@/components/ProjectsList";
import SkillsGrid from "@/components/SkillsGrid";
import Footer from "@/components/Footer";
import BootLoader from "@/components/BootLoader";

// Lazy-load ZER0 AI Assistant for performance and Lighthouse optimization
const ZeroAssistant = dynamic(() => import("@/components/ZeroAssistant"), {
  ssr: false
});

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      {/* Terminal Boot Sequence (runs once per session or skippable) */}
      {!booted && <BootLoader onComplete={() => setBooted(true)} />}

      <div
        className={`min-h-screen flex flex-col transition-opacity duration-700 ${
          booted ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Sticky Terminal Navbar */}
        <Navbar />

        {/* Main Content Flow */}
        <main className="flex-1">
          {/* Hero Section */}
          <Hero />

          {/* Whoami + Metrics Section */}
          <Whoami />

          {/* Experience Timeline */}
          <ExperienceTimeline />

          {/* Projects Grid */}
          <ProjectsList />

          {/* Skills Grid */}
          <SkillsGrid />
        </main>

        {/* Connect & Footer */}
        <Footer />

        {/* ZER0 AI Companion */}
        <ZeroAssistant />
      </div>
    </>
  );
}
