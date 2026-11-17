"use client";

import { useState, useEffect } from "react";
import { FolderGit2, ExternalLink, ChevronDown, ChevronUp, Star, ShieldCheck, Smartphone } from "lucide-react";
import { GithubIcon } from "./SocialIcons";
import { projects } from "@/data/projects";

export default function ProjectsList() {
  const [showAll, setShowAll] = useState(false);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);

  const visibleProjects = showAll ? projects : projects.slice(0, 4);

  // Listen for custom event from ZER0 to open/highlight a specific project
  useEffect(() => {
    const handleOpenProject = (e: CustomEvent<{ slug: string }>) => {
      const slug = e.detail?.slug;
      if (!slug) return;

      setShowAll(true);
      setHighlightedSlug(slug);

      setTimeout(() => {
        const el = document.getElementById(`project-${slug}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);

      const timer = setTimeout(() => {
        setHighlightedSlug(null);
      }, 3500);

      return () => clearTimeout(timer);
    };

    window.addEventListener("zero:open-project" as any, handleOpenProject);
    return () => window.removeEventListener("zero:open-project" as any, handleOpenProject);
  }, []);

  return (
    <section
      id="projects"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
    >
      {/* Section Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xl sm:text-2xl font-bold text-[#00FF9C]">
            <FolderGit2 className="w-6 h-6 text-[#00FF9C]" />
            <span># ls ./projects</span>
          </div>
          <span className="text-xs font-mono text-[#6B8A7D]">
            total {projects.length} repositories
          </span>
        </div>
        <div className="hidden sm:block h-px flex-1 ml-6 bg-gradient-to-r from-[#00FF9C]/40 via-[#00FF9C]/10 to-transparent" />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {visibleProjects.map((project, idx) => {
          const isFeatured = project.featured;
          const isHighlighted = highlightedSlug === project.slug;

          return (
            <div
              key={project.slug}
              id={`project-${project.slug}`}
              className={`transition-all duration-500 flex flex-col justify-between ${
                isFeatured ? "md:col-span-2" : "col-span-1"
              } ${
                isHighlighted
                  ? "ring-2 ring-[#00FF9C] shadow-[0_0_35px_rgba(0,255,156,0.4)] scale-[1.01]"
                  : ""
              }`}
            >
              <div
                className={`h-full p-6 sm:p-8 flex flex-col justify-between border transition-all duration-300 cut-corner-tr-bl ${
                  isFeatured
                    ? "bg-[#090E13] border-[#FF3B6B] shadow-[0_0_30px_rgba(255,59,107,0.22)] hover:border-[#FF2A5B] hover:shadow-[0_0_40px_rgba(255,59,107,0.35)]"
                    : "bg-[#090E13]/80 border-[#00FF9C]/20 hover:border-[#00FF9C]/50 hover:bg-[#090E13]"
                }`}
              >
                <div>
                  {/* Card Top Meta */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#00FF9C]/15">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#6B8A7D]">
                        {`0${idx + 1} //`}
                      </span>
                      {isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-mono font-bold bg-[#FF3B6B]/15 text-[#FF3B6B] border border-[#FF3B6B]/50 rounded-sm shadow-[0_0_10px_rgba(255,59,107,0.35)]">
                          <Star className="w-3 h-3 fill-[#FF3B6B]" />
                          FLAGSHIP RANGE
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-[#00E5FF]">
                      .{project.slug}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3
                    className={`font-mono font-bold text-[#D7FFE9] mb-1.5 ${
                      isFeatured ? "text-2xl sm:text-3xl text-glow-green" : "text-xl sm:text-2xl"
                    }`}
                  >
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-[#00E5FF] mb-4">
                    {project.tagline}
                  </p>

                  {/* Bullets */}
                  <ul className="space-y-2 mb-6 text-xs sm:text-sm text-[#D7FFE9]/85 font-sans leading-relaxed">
                    {project.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <span className="text-[#00FF9C] font-mono mt-0.5">&gt;</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 pt-4 border-t border-[#00FF9C]/10">
                    {project.stack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 text-[11px] font-mono bg-[#05080A] text-[#D7FFE9]/90 border border-[#00FF9C]/20 rounded-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons: Live Demo, GitHub, and Extra Links */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 font-mono text-xs">
                    {project.slug === "udyogasethu" ? (
                      <>
                        {/* 1. Admin Live (only for udyoga sthu: Admin Live) */}
                        {project.liveUrl && project.liveUrl.trim() !== "" && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00FF9C] text-[#05080A] font-bold rounded-sm hover:bg-[#00E5FF] transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Admin Live</span>
                          </a>
                        )}

                        {/* 2. Admin GitHub (green: text-[#00FF9C]) */}
                        <a
                          href="https://github.com/chethankp365/UdyogaSethu-Admin"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#05080A] text-[#00FF9C] border border-[#00FF9C]/40 hover:border-[#00FF9C] rounded-sm transition-colors"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>Admin GitHub</span>
                        </a>

                        {/* 3. Mobile APK (then after the apk) */}
                        <a
                          href="https://drive.google.com/file/d/1f6fvaAMZZhQ-E97YEeMnLMw5GF81H0Qy/view"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00E5FF] text-[#05080A] font-bold hover:bg-[#00FF9C] rounded-sm transition-colors"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Mobile APK</span>
                        </a>

                        {/* 4. App GitHub (blue: text-[#00E5FF]) */}
                        {project.githubUrl && project.githubUrl.trim() !== "" && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#05080A] text-[#00E5FF] border border-[#00E5FF]/40 hover:border-[#00E5FF] rounded-sm transition-colors"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                            <span>App GitHub</span>
                          </a>
                        )}
                      </>
                    ) : (
                      <>
                        {project.liveUrl && project.liveUrl.trim() !== "" && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00FF9C] text-[#05080A] font-bold rounded-sm hover:bg-[#00E5FF] transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Live</span>
                          </a>
                        )}

                        {project.githubUrl && project.githubUrl.trim() !== "" && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#05080A] text-[#00FF9C] border border-[#00FF9C]/40 hover:border-[#00FF9C] rounded-sm transition-colors"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                            <span>GitHub</span>
                          </a>
                        )}

                        {project.extraLinks &&
                          project.extraLinks.map((extra, eIdx) => (
                            <a
                              key={eIdx}
                              href={extra.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm transition-colors ${
                                extra.type === "apk"
                                  ? "bg-[#00E5FF] text-[#05080A] font-bold hover:bg-[#00FF9C]"
                                  : "bg-[#05080A] text-[#00E5FF] border border-[#00E5FF]/40 hover:border-[#00E5FF]"
                              }`}
                            >
                              {extra.type === "apk" ? (
                                <Smartphone className="w-3.5 h-3.5" />
                              ) : extra.type === "github" ? (
                                <GithubIcon className="w-3.5 h-3.5" />
                              ) : (
                                <ExternalLink className="w-3.5 h-3.5" />
                              )}
                              <span>{extra.label}</span>
                            </a>
                          ))}

                        {(!project.liveUrl || project.liveUrl.trim() === "") &&
                          (!project.githubUrl || project.githubUrl.trim() === "") && (
                            <div className="inline-flex items-center gap-1.5 text-xs text-[#6B8A7D]">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#00FF9C]/60" />
                              <span>Code &amp; evaluation links under security audit</span>
                            </div>
                          )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More / Show Less Button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="inline-flex items-center gap-2 px-5 py-3 font-mono text-xs sm:text-sm bg-[#090E13] text-[#00FF9C] border border-[#00FF9C]/50 hover:border-[#00FF9C] hover:bg-[#00FF9C]/10 rounded-sm shadow-[0_0_15px_rgba(0,255,156,0.15)] transition-all duration-200 cursor-pointer"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>./collapse_view --show 4 flagship</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span>./load_more --4 remaining</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}

