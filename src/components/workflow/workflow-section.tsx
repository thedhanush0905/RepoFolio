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
  const containerRef = useRef<HTMLDivElement>(null);

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
              return (
                <div 
                  key={idx} 
                  className="flex flex-col text-left group"
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
    </section>
  );
}
