"use client";

import { useEffect, useState } from "react";
import { Download, Menu, X, Terminal } from "lucide-react";
import { profile } from "@/data/profile";

const NAV_ITEMS = [
  { label: "./about", href: "#about", id: "about" },
  { label: "./experience", href: "#experience", id: "experience" },
  { label: "./projects", href: "#projects", id: "projects" },
  { label: "./skills", href: "#skills", id: "skills" },
  { label: "./connect", href: "#connect", id: "connect" }
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("about");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sectionIds = ["hero", "about", "experience", "projects", "skills", "connect"];
      const scrollPos = window.scrollY + 180;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i] === "hero" ? "about" : sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-mono ${
        scrolled
          ? "bg-[#05080A]/90 backdrop-blur-md border-b border-[#00FF9C]/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Terminal prompt logo */}
        <a
          href="#"
          className="flex items-center gap-2 group text-sm sm:text-base font-bold text-[#D7FFE9] focus:outline-none focus:ring-1 focus:ring-[#00FF9C]"
          aria-label="Back to top"
        >
          <Terminal className="w-4 h-4 text-[#00FF9C] group-hover:rotate-12 transition-transform duration-200" />
          <span className="text-[#00FF9C]">chethan</span>
          <span className="text-[#6B8A7D]">@</span>
          <span className="text-[#00E5FF]">kali</span>
          <span className="text-[#6B8A7D]">:</span>
          <span className="text-[#D7FFE9]">~$</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`px-3 py-1.5 text-xs lg:text-sm transition-all duration-200 rounded-sm relative ${
                  isActive
                    ? "text-[#00FF9C] bg-[#00FF9C]/10 border border-[#00FF9C]/40 shadow-[0_0_10px_rgba(0,255,156,0.2)]"
                    : "text-[#6B8A7D] hover:text-[#D7FFE9] hover:bg-[#00FF9C]/5"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#00FF9C] rounded-full shadow-[0_0_6px_#00FF9C]" />
                )}
              </a>
            );
          })}

          {/* Download CV Nav Link */}
          <a
            href={profile.cvPath}
            download="ChethanKumar.CV.pdf"
            className="ml-3 inline-flex items-center gap-1.5 px-3 py-1 text-xs text-[#00FF9C] border border-[#00FF9C]/40 hover:bg-[#00FF9C]/10 hover:border-[#00FF9C] transition-colors rounded-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CV.pdf</span>
          </a>
        </nav>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href={profile.cvPath}
            download="ChethanKumar.CV.pdf"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-[#00FF9C] border border-[#00FF9C]/40 rounded-sm"
            aria-label="Download CV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CV</span>
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#00FF9C] hover:bg-[#00FF9C]/10 rounded border border-[#00FF9C]/30 focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090E13] border-b border-[#00FF9C]/30 px-4 py-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm rounded ${
                activeSection === item.id
                  ? "text-[#00FF9C] bg-[#00FF9C]/10 border border-[#00FF9C]/30"
                  : "text-[#6B8A7D] hover:text-[#D7FFE9]"
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href={profile.cvPath}
            download="ChethanKumar.CV.pdf"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-[#00FF9C] bg-[#00FF9C]/5 border border-[#00FF9C]/30 rounded"
          >
            <Download className="w-4 h-4" />
            <span>./download_cv (PDF)</span>
          </a>
        </div>
      )}
    </header>
  );
}

