"use client";

import { FileCode, Terminal, Shield, Cpu, Database, Wrench } from "lucide-react";
import { skillCategories } from "@/data/skills";

const ICONS: Record<string, React.ReactNode> = {
  "Cybersecurity & Offensive": <Shield className="w-5 h-5 text-[#00FF9C]" />,
  Languages: <Terminal className="w-5 h-5 text-[#00E5FF]" />,
  "Web & Backend": <FileCode className="w-5 h-5 text-[#FF3B6B]" />,
  "AI & ML": <Cpu className="w-5 h-5 text-[#00FF9C]" />,
  "Data & Storage": <Database className="w-5 h-5 text-[#00E5FF]" />,
  "Tools & Infrastructure": <Wrench className="w-5 h-5 text-[#FF3B6B]" />
};

export default function SkillsGrid() {
  return (
    <section
      id="skills"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
    >
      {/* Section Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xl sm:text-2xl font-bold text-[#00FF9C]">
            <Terminal className="w-6 h-6 text-[#00FF9C]" />
            <span># cat skills.txt</span>
          </div>
          <span className="text-xs font-mono text-[#6B8A7D]">
            6 categories // loaded into memory
          </span>
        </div>
        <div className="hidden sm:block h-px flex-1 ml-6 bg-gradient-to-r from-[#00FF9C]/40 via-[#00FF9C]/10 to-transparent" />
      </div>

      {/* Grid of skill categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((group, idx) => (
          <div
            key={idx}
            className="p-6 bg-[#090E13]/85 border border-[#00FF9C]/20 hover:border-[#00FF9C]/60 hover:box-glow-green transition-all duration-300 cut-corner-sm flex flex-col justify-between group"
          >
            <div>
              {/* Category Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#00FF9C]/15">
                <div className="flex items-center gap-2.5">
                  {ICONS[group.category] || <Terminal className="w-5 h-5 text-[#00FF9C]" />}
                  <h3 className="font-mono text-sm sm:text-base font-bold text-[#D7FFE9]">
                    {group.category}
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#6B8A7D]">0{idx + 1}</span>
              </div>

              {/* Command line preview */}
              <div className="text-[11px] font-mono text-[#00E5FF]/80 bg-[#05080A] px-2.5 py-1.5 rounded-sm border border-[#00E5FF]/20 mb-3 truncate">
                $ {group.command}
              </div>

              {/* Description */}
              <p className="text-xs text-[#D7FFE9]/75 font-sans mb-4 leading-relaxed">
                {group.description}
              </p>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#00FF9C]/10">
              {group.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-0.5 text-xs font-mono bg-[#05080A] text-[#00FF9C] border border-[#00FF9C]/20 rounded-sm group-hover:border-[#00FF9C]/40 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

