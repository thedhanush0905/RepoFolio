"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon } from "lucide-react";

export default function RepositorySection() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || hasAnimated) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      
      if (isVisible) {
        setHasAnimated(true);
        const commands = [
          "$ git clone https://github.com/dhanush/portfolio",
          "Cloning into 'portfolio'...",
          "remote: Enumerating objects: 42, done.",
          "remote: Counting objects: 100% (42/42), done.",
          "Receiving objects: 100% (42/42), 34.12 KiB | 2.13 MiB/s, done.",
          "Resolving deltas: 100% (12/12), done.",
          "$ cd portfolio",
          "$ npm install",
          "added 342 packages in 4.2s",
          "$ npm run dev",
          "  ▲ Next.js 16.3.1 (development)",
          "  Local: http://localhost:3000"
        ];

        let idx = 0;
        const interval = setInterval(() => {
          if (idx < commands.length) {
            setTerminalLines((prev) => [...prev, commands[idx]]);
            idx++;
          } else {
            clearInterval(interval);
          }
        }, 300);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check immediately
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="py-24 border-t border-[#17212B] bg-[#101820] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Headline */}
        <div className="mb-16 max-w-xl text-left">
          <span className="font-mono text-xs text-[#E5A84B] uppercase tracking-wider block mb-3">
            {/* ownership & control */}
            ownership & control
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-[#F3F0E8] leading-tight">
            Not a locked-in page. <br />
            A codebase you own.
          </h2>
        </div>

        {/* Contents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: File tree structure representation */}
          <div className="lg:col-span-5 bg-[#0B1117] border border-[#2b3b4d]/40 p-6 rounded-sm font-mono text-xs text-[#A8AAA4]">
            <div className="text-[10px] text-[#E5A84B] border-b border-[#2b3b4d]/30 pb-2 mb-4 uppercase tracking-wider">
              📁 github.com/dhanush/portfolio
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-blue-400">📁</span>
                <span className="text-[#F3F0E8] font-bold">src/</span>
              </div>
              <div className="pl-6 flex items-center gap-2 border-l border-[#2b3b4d]/30">
                <span className="text-blue-400">📁</span>
                <span className="text-[#F3F0E8]">app/</span>
              </div>
              <div className="pl-12 flex items-center gap-2 border-l border-[#2b3b4d]/30">
                <span className="text-gray-500">📄</span>
                <span>layout.tsx</span>
              </div>
              <div className="pl-12 flex items-center gap-2 border-l border-[#2b3b4d]/30">
                <span className="text-gray-500">📄</span>
                <span>page.tsx</span>
              </div>
              <div className="pl-6 flex items-center gap-2 border-l border-[#2b3b4d]/30">
                <span className="text-blue-400">📁</span>
                <span className="text-[#F3F0E8]">components/</span>
              </div>
              <div className="pl-6 flex items-center gap-2 border-l border-[#2b3b4d]/30">
                <span className="text-gray-500">📄</span>
                <span>globals.css</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📄</span>
                <span>package.json</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📄</span>
                <span>README.md</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📄</span>
                <span>vite.config.ts</span>
              </div>
            </div>
          </div>

          {/* Right panel: Terminal clone actions */}
          <div className="lg:col-span-7 bg-[#0B1117] border border-[#2b3b4d]/40 p-6 rounded-sm font-mono text-xs flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="text-[10px] text-[#A8AAA4] border-b border-[#2b3b4d]/30 pb-2 mb-4 flex items-center justify-between uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <TerminalIcon className="w-3.5 h-3.5 text-[#E5A84B]" />
                  Local Terminal Mock
                </span>
                <span className="text-gray-600">bash</span>
              </div>
              
              <div className="space-y-1.5 overflow-y-auto max-h-[220px]">
                {terminalLines.map((line, i) => {
                  if (!line) return null;
                  return (
                    <div 
                      key={i} 
                      className={
                        line.startsWith("$") 
                          ? "text-[#F3F0E8]" 
                          : line.includes("Next.js") || line.includes("Local:")
                          ? "text-[#E5A84B]"
                          : "text-gray-500"
                      }
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-[9px] text-gray-600 mt-6 border-t border-[#2b3b4d]/20 pt-2 flex justify-between items-center">
              <span>PORTFOLIO → GITHUB REPOSITORY → YOUR DEPLOYMENT</span>
              <span>100% OWNED</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
