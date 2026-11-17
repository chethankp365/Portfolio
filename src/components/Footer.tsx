"use client";

import { useState } from "react";
import { Mail, Copy, Check, Download, Terminal, Shield } from "lucide-react";
import { GithubIcon, LinkedinIcon, YoutubeIcon, InstagramIcon } from "./SocialIcons";
import { profile } from "@/data/profile";

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <footer
      id="connect"
      className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[#00FF9C]/20 bg-[#05080A] relative scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xl sm:text-2xl font-bold text-[#00FF9C]">
            <Terminal className="w-6 h-6 text-[#00FF9C]" />
            <span># connect --secure</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-[#00FF9C]/40 via-[#00FF9C]/10 to-transparent" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Email and Pitch */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-mono text-xl font-bold text-[#D7FFE9]">
              Let&apos;s talk offensive security &amp; defensive architecture.
            </h3>
            <p className="text-sm text-[#D7FFE9]/80 max-w-xl font-sans leading-relaxed">
              Actively seeking cybersecurity, red teaming, and threat detection opportunities. 
              Reach out via encrypted email or connect across networks.
            </p>

            {/* Email Box with Click to Copy */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#090E13] border border-[#00FF9C]/40 hover:border-[#00FF9C] text-[#00FF9C] font-mono text-xs sm:text-sm rounded-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-[#05080A] border border-[#00FF9C]/30 hover:border-[#00FF9C] text-xs font-mono text-[#D7FFE9] rounded-sm transition-colors cursor-pointer"
                title="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#00FF9C]" />
                    <span className="text-[#00FF9C]">Copied to clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#6B8A7D]" />
                    <span>Copy email</span>
                  </>
                )}
              </button>

              <a
                href={profile.cvPath}
                download="Chethan_Kumar.CV.pdf"
                className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-[#05080A] border border-[#00E5FF]/40 hover:border-[#00E5FF] text-xs font-mono text-[#00E5FF] rounded-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download CV</span>
              </a>
            </div>
          </div>

          {/* Social Links & Cryptographic verification badge */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#6B8A7D] uppercase tracking-wider block">
                Network Links // Verified Profiles
              </span>
              <div className="flex flex-wrap gap-3">
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#090E13] border border-[#00FF9C]/20 hover:border-[#00FF9C] hover:text-[#00FF9C] rounded-sm transition-all duration-200 text-[#D7FFE9]"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#090E13] border border-[#00FF9C]/20 hover:border-[#00E5FF] hover:text-[#00E5FF] rounded-sm transition-all duration-200 text-[#D7FFE9]"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <a
                  href={profile.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#090E13] border border-[#00FF9C]/20 hover:border-[#FF3B6B] hover:text-[#FF3B6B] rounded-sm transition-all duration-200 text-[#D7FFE9]"
                  aria-label="YouTube Channel"
                >
                  <YoutubeIcon className="w-5 h-5" />
                </a>
                <a
                  href={profile.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#090E13] border border-[#00FF9C]/20 hover:border-[#00FF9C] hover:text-[#00FF9C] rounded-sm transition-all duration-200 text-[#D7FFE9]"
                  aria-label="Instagram Profile"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="p-3 bg-[#090E13] border border-[#00FF9C]/15 rounded-sm text-xs font-mono text-[#6B8A7D] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00FF9C] shrink-0" />
              <span>PGP / Fingerprint available on verified request.</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-[#00FF9C]/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#6B8A7D] gap-4">
          <div>{profile.copyright}</div>
          <div className="flex items-center gap-4">
            <span className="text-[#00FF9C]">&gt; KALI 6.6</span>
            <span>NEXT.JS APP ROUTER</span>
            <span className="text-[#00E5FF]">PRODUCTION READY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

