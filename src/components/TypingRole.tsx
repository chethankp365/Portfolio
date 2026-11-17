"use client";

import { useEffect, useState } from "react";

export default function TypingRole({ roles }: { roles: string[] }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setIsReducedMotion(true);
      setText(roles[0]);
    }
  }, [roles]);

  useEffect(() => {
    if (isReducedMotion) return;

    const currentRole = roles[roleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (text.length < currentRole.length) {
        timeout = setTimeout(() => {
          setText(currentRole.slice(0, text.length + 1));
        }, 70);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(currentRole.slice(0, text.length - 1));
        }, 35);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex, roles, isReducedMotion]);

  return (
    <div className="flex items-center text-sm sm:text-lg md:text-xl font-mono text-[#00E5FF]">
      <span className="text-[#6B8A7D] mr-2">&gt;</span>
      <span>{text}</span>
      <span className="inline-block w-2.5 h-5 ml-1 bg-[#00FF9C] animate-pulse" />
    </div>
  );
}

