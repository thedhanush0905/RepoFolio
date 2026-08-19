"use client";

import React, { useState, useEffect, useRef } from "react";

interface Step {
  num: string;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  {
    num: "01",
    title: "Tell us about you",
    desc: "Enter your experience, project repositories, framework toolkit, and contact links into our structured form parser."
  },
  {
    num: "02",
    title: "Shape the site",
    desc: "Choose between Editorial, Minimal, or Technical designs and watch the live preview container compile instantly."
  },
  {
    num: "03",
    title: "Get your repo",
    desc: "REPOfolio compiles a clean React codebase and exports it directly to a clean GitHub repository under your ownership."
  },
  {
    num: "04",
    title: "Deploy it",
    desc: "Host the resulting repository on Vercel, Netlify, or your preferred hosting pipeline. Zero lock-in, all your code."
  }
];

export default function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRepoStepInteraction = () => {
    setShowDiagnostics(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      
      // Calculate how far down the section the user has scrolled
      const progress = Math.min(Math.max((viewHeight - rect.top) / (rect.height + viewHeight * 0.2), 0), 1);
      
      // Map progress to steps index 0-3
      const stepIdx = Math.min(Math.floor(progress * 4), 3);
      setActiveStep(stepIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once initially
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section 
      id="how-it-works" 
      ref={containerRef}
      className="py-24 border-t border-[#17212B] bg-[#101820] select-none scroll-mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16 max-w-xl text-left">
          <span className="font-mono text-xs text-[#E5A84B] uppercase tracking-wider block mb-3">
            {/* the pipeline */}
            the pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-[#F3F0E8] leading-tight">
            From blank page <br />
            to repository.
          </h2>
        </div>

        {/* Steps container */}
        <div className="relative">
          
          {/* Horizontal / Vertical connecting line */}
          <div className="absolute top-12 left-6 right-6 h-[1px] bg-[#2b3b4d]/40 hidden md:block z-0">
            {/* Draw active line */}
            <div 
              className="h-full bg-[#E5A84B] transition-all duration-500 ease-out"
              style={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {STEPS.map((step, idx) => {
              const isActive = idx <= activeStep;
              const isRepoStep = idx === 2;
              return (
                <div 
                  key={idx} 
                  className={`flex flex-col text-left group outline-none rounded-sm ${
                    isRepoStep ? "focus-visible:ring-1 focus-visible:ring-[#E5A84B] cursor-pointer" : ""
                  }`}
                  tabIndex={isRepoStep ? 0 : undefined}
                  onDoubleClick={isRepoStep ? handleRepoStepInteraction : undefined}
                  onKeyDown={isRepoStep ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleRepoStepInteraction();
                    }
                  } : undefined}
                >
                  {/* Step Number Indicator */}
                  <div className="mb-6 flex items-center gap-4 md:flex-col md:items-start">
                    <div 
                      className={`w-12 h-12 flex items-center justify-center font-mono text-sm font-bold border transition-all duration-300 ${
                        isActive 
                          ? "bg-[#E5A84B] border-[#E5A84B] text-[#0B1117]" 
                          : "bg-[#0B1117] border-[#2b3b4d]/40 text-[#A8AAA4]"
                      }`}
                    >
                      {step.num}
                    </div>
                    {/* Vertical connecting line for mobile devices */}
                    <div className="h-[1px] flex-1 bg-[#2b3b4d]/20 md:hidden" />
                  </div>

                  <h3 className={`text-lg font-bold font-sans mb-3 transition-colors duration-300 ${
                    isActive ? "text-[#F3F0E8]" : "text-[#A8AAA4]/60"
                  }`}>
                    {step.title}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed font-sans font-light transition-colors duration-300 ${
                    isActive ? "text-[#A8AAA4]" : "text-[#A8AAA4]/30"
                  }`}>
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <DiagnosticOverlay isOpen={showDiagnostics} onClose={() => setShowDiagnostics(false)} />
    </section>
  );
}

interface DiagnosticOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function DiagnosticOverlay({ isOpen, onClose }: DiagnosticOverlayProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [activeLine, setActiveLine] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const script = [
    "REPOFOLIO SHELL v0.1.0",
    "",
    "$ repofolio status",
    "PORTFOLIO .......... READY",
    "SOURCE CODE ........ GENERATED",
    "REPOSITORY ......... CONNECTED",
    "OWNERSHIP .......... YOURS",
    "DEPLOYMENT ......... LIVE",
    "",
    "$ git status",
    "✓ nothing to commit",
    "",
    "$ ship",
    "",
    "> your portfolio escaped localhost."
  ];

  useEffect(() => {
    if (!isOpen) return;

    modalRef.current?.focus();
    
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let scriptIdx = 0;
    let charIdx = 0;
    let currentLine = "";
    const typedLines: string[] = [];

    const typeNextChar = () => {
      if (scriptIdx >= script.length) {
        return;
      }

      const targetText = script[scriptIdx];
      if (charIdx < targetText.length) {
        currentLine += targetText[charIdx];
        setActiveLine(currentLine);
        charIdx++;
        setTimeout(typeNextChar, 25);
      } else {
        typedLines.push(currentLine);
        setLines([...typedLines]);
        setActiveLine("");
        currentLine = "";
        charIdx = 0;
        scriptIdx++;
        const delay = targetText.startsWith("$") || targetText.length === 0 ? 300 : 100;
        setTimeout(typeNextChar, delay);
      }
    };

    setLines([]);
    setActiveLine("");
    const timeoutId = setTimeout(typeNextChar, 400);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = origOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="diagnostic-title"
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="w-full max-w-lg bg-[#0B1117] border border-[#2b3b4d]/60 rounded-sm shadow-2xl p-6 font-mono text-xs text-[#A8AAA4] relative flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header Bar */}
        <div className="flex justify-between items-center border-b border-[#2b3b4d]/40 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[10px] text-gray-500 uppercase ml-2" id="diagnostic-title">
              REPOFOLIO SHELL v0.1.0
            </span>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors cursor-pointer text-[10px] uppercase font-bold focus:outline-none focus:ring-1 focus:ring-[#E5A84B]"
            aria-label="Close diagnostic dialog"
          >
            [CLOSE]
          </button>
        </div>

        {/* Terminal Text Screen */}
        <div className="flex-1 min-h-[180px] space-y-1.5 overflow-y-auto leading-relaxed select-text text-left">
          {lines.map((l, i) => (
            <div 
              key={i} 
              className={
                l.startsWith("$") 
                  ? "text-[#F3F0E8] font-bold" 
                  : l.startsWith(">") 
                  ? "text-[#E5A84B]" 
                  : l.startsWith("✓") 
                  ? "text-green-400" 
                  : i === 0 
                  ? "text-[#F3F0E8] font-semibold text-sm mb-2" 
                  : "text-gray-500"
              }
            >
              {l}
            </div>
          ))}
          {activeLine && (
            <div 
              className={
                activeLine.startsWith("$") 
                  ? "text-[#F3F0E8] font-bold" 
                  : activeLine.startsWith(">") 
                  ? "text-[#E5A84B]" 
                  : activeLine.startsWith("✓") 
                  ? "text-green-400" 
                  : lines.length === 0 
                  ? "text-[#F3F0E8] font-semibold text-sm mb-2" 
                  : "text-gray-500"
              }
            >
              {activeLine}
              <span className="w-1.5 h-3 bg-[#E5A84B] ml-0.5 animate-pulse inline-block" />
            </div>
          )}
          {!activeLine && lines.length < script.length && (
            <span className="w-1.5 h-3 bg-[#E5A84B] animate-pulse inline-block" />
          )}
        </div>
      </div>
    </div>
  );
}
