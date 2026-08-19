"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Terminal as TerminalIcon } from "lucide-react";

export function CTASection() {
  const [termOutput, setTermOutput] = useState<string[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || animated) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

      if (isVisible) {
        setAnimated(true);
        const lines = [
          "$ repofolio init",
          "initializing database compilation...",
          "bundling client templates...",
          "establishing remote handshake...",
          "ready."
        ];

        let idx = 0;
        const interval = setInterval(() => {
          if (idx < lines.length) {
            setTermOutput((prev) => [...prev, lines[idx]]);
            idx++;
          } else {
            clearInterval(interval);
          }
        }, 400);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [animated]);

  return (
    <section ref={sectionRef} className="py-24 border-t border-[#17212B] bg-[#0B1117] select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h2 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-[#F3F0E8] leading-tight mb-4">
          Ready to ship your portfolio?
        </h2>
        
        <p className="text-[#A8AAA4] font-sans font-light mb-8 max-w-md mx-auto text-sm sm:text-base">
          Start with your story. Leave with a clean repository you completely own.
        </p>

        <div className="mb-10">
          <Link
            href="/create"
            className="inline-block bg-[#E5A84B] hover:bg-[#E5A84B]/90 text-[#0B1117] font-mono font-bold px-10 py-4 transition-all tracking-wide text-sm"
          >
            Create yours →
          </Link>
        </div>

        {/* Animated Terminal */}
        <div className="max-w-md mx-auto bg-[#101820] border border-[#2b3b4d]/40 rounded-sm p-4 font-mono text-xs text-left h-36 flex flex-col justify-between">
          <div className="space-y-1 overflow-y-auto">
            {termOutput.map((line, i) => {
              if (!line) return null;
              return (
                <div 
                  key={i} 
                  className={
                    line.startsWith("$") 
                      ? "text-[#F3F0E8]" 
                      : line === "ready." 
                      ? "text-[#E5A84B] font-bold" 
                      : "text-gray-500"
                  }
                >
                  {line}
                </div>
              );
            })}
          </div>
          <div className="text-[9px] text-gray-600 border-t border-[#2b3b4d]/20 pt-1.5 flex justify-between">
            <span>TERMINAL INITIALIZATION</span>
            <span>v0.1.0</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#101820] border-t border-[#17212B] py-12 select-none text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          
          <div className="md:col-span-6 text-left">
            <span className="text-sm font-bold text-[#F3F0E8] flex items-center gap-1.5 mb-2">
              <TerminalIcon className="w-4 h-4 text-[#E5A84B]" />
              REPOfolio
            </span>
            <span className="text-[#A8AAA4] block text-[11px] font-light">
              Build. Own. Ship.
            </span>
          </div>

          <div className="md:col-span-6 flex flex-wrap gap-x-8 gap-y-2 md:justify-end text-[#A8AAA4]">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F3F0E8] transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-[#F3F0E8] transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-[#F3F0E8] transition-colors">
              Sign in
            </a>
          </div>

        </div>

        <div className="border-t border-[#17212B] pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-gray-500 text-[10px]">
          <span>© 2026 REPOfolio. All rights reserved.</span>
          <span>REP-001 / BUILD 01</span>
        </div>

      </div>
    </footer>
  );
}
