"use client";

import { GitCommit, Briefcase, GraduationCap, Award, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { experiences, education, certifications } from "@/data/experience";

export default function ExperienceTimeline() {
  return (
    <section
      id="experience"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
    >
      {/* Section Header */}
      <div className="mb-12 flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono text-xl sm:text-2xl font-bold text-[#00FF9C]">
          <GitCommit className="w-6 h-6 text-[#00FF9C]" />
          <span># git log --experience</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-[#00FF9C]/40 via-[#00FF9C]/10 to-transparent" />
      </div>

      <div className="relative border-l-2 border-[#00FF9C]/20 ml-3 sm:ml-6 space-y-10">
        {/* Experience Items */}
        {experiences.map((exp) => (
          <div key={exp.id} className="relative pl-6 sm:pl-10 group">
            {/* Timeline node */}
            <div
              className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                exp.isCurrent
                  ? "bg-[#FF9F1C] border-[#FF9F1C] shadow-[0_0_10px_#FF9F1C]"
                  : "bg-[#05080A] border-[#6B8A7D] group-hover:border-[#00FF9C]"
              }`}
            />

            {/* Card */}
            <div className="p-6 sm:p-7 border bg-[#090E13]/85 border-[#00FF9C]/25 hover:border-[#00FF9C]/50 hover:bg-[#090E13] transition-all duration-300 cut-corner-tl-br">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg sm:text-xl font-bold text-[#D7FFE9] font-mono">
                    {exp.role}
                  </h3>
                  {exp.isCurrent && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono font-bold bg-[#FF9F1C] text-[#05080A] rounded-sm shadow-[0_0_14px_rgba(255,159,28,0.7)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#05080A] animate-ping" />
                      CURRENT
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-[#6B8A7D]">
                  <span className="flex items-center gap-1 text-[#00E5FF]">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {exp.location}
                  </span>
                </div>
              </div>

              {/* Organization & Dept */}
              <div className="text-sm font-mono text-[#00FF9C] mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#00FF9C]" />
                <span className="font-semibold">{exp.organization}</span>
                {exp.department && (
                  <span className="text-[#6B8A7D]">
                    {" // "}
                    {exp.department}
                  </span>
                )}
                <span className="text-xs text-[#6B8A7D]">({exp.type})</span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#D7FFE9]/85 mb-4 leading-relaxed font-sans">
                {exp.description}
              </p>

              {/* Bullets */}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="space-y-2 mb-5">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="text-xs sm:text-sm text-[#D7FFE9]/80 flex items-start gap-2.5 font-sans"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#00FF9C] shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#00FF9C]/10">
                {exp.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 text-xs font-mono bg-[#05080A] text-[#00FF9C] border border-[#00FF9C]/25 rounded-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Education Timeline Node */}
        <div className="relative pl-6 sm:pl-10 group">
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-[#05080A] border-[#00E5FF] group-hover:shadow-[0_0_12px_#00E5FF]" />

          <div className="p-6 sm:p-7 bg-[#090E13]/80 border border-[#00E5FF]/30 cut-corner-tl-br">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#00E5FF]" />
                <h3 className="text-lg sm:text-xl font-bold text-[#D7FFE9] font-mono">
                  {education.degree}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-[#6B8A7D]">
                <span className="text-[#00E5FF]">{education.period}</span>
                <span>{education.location}</span>
              </div>
            </div>

            <div className="text-sm font-mono text-[#00E5FF] mb-2">
              {education.institution} — {education.university}
            </div>

            <div className="inline-block px-2.5 py-0.5 text-xs font-mono bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 rounded-sm mb-3">
              Grade: {education.grade}
            </div>

            <p className="text-xs sm:text-sm text-[#D7FFE9]/80 font-sans leading-relaxed">
              {education.description}
            </p>
          </div>
        </div>

        {/* Certifications Node */}
        <div className="relative pl-6 sm:pl-10 group">
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-[#05080A] border-[#FF3B6B] group-hover:shadow-[0_0_12px_#FF3B6B]" />

          <div className="p-6 sm:p-7 bg-[#090E13]/80 border border-[#FF3B6B]/30 cut-corner-tl-br">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-[#FF3B6B]" />
              <h3 className="text-lg font-bold text-[#D7FFE9] font-mono">
                Certifications &amp; Verified Badges
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {certifications.map((cert, cIdx) => (
                <div
                  key={cIdx}
                  className="bg-[#05080A] p-3.5 border border-[#FF3B6B]/20 rounded-sm flex flex-col justify-between"
                >
                  <span className="text-xs sm:text-sm font-semibold text-[#D7FFE9] font-sans">
                    {cert.name}
                  </span>
                  <span className="text-xs font-mono text-[#6B8A7D] mt-1">
                    {cert.issuer} {cert.platform && `(${cert.platform})`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

