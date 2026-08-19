"use client";

import React, { useState, useEffect, useRef } from "react";

export default function ManifestoSection() {
  const [chainStep, setChainStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      
      if (isVisible) {
        // Animate step 0 -> 1 -> 2 -> 3 -> 4
        const interval = setInterval(() => {
          setChainStep((prev) => {
            if (prev >= 4) {
              clearInterval(interval);
              return 4;
            }
            return prev + 1;
          });
        }, 500);
        
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="py-24 border-t border-[#17212B] bg-[#101820] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Editorial Typography block */}
          <div className="lg:col-span-7 text-left">
            <h2 className="text-4xl sm:text-5xl font-bold font-sans tracking-tight text-[#A8AAA4] leading-tight mb-8">
              YOUR NAME.<br />
              YOUR SITE.<br />
              <span className="text-[#E5A84B]">YOUR CODE.</span>
            </h2>

            <div className="space-y-4 max-w-lg font-sans text-sm sm:text-base text-[#A8AAA4] font-light leading-relaxed">
              <p>
                No platform lock-in. No proprietary portfolio format. Your portfolio becomes source code you can inspect, modify, and own.
              </p>
              <p className="text-[#F3F0E8] font-normal">
                Build your portfolio, save your work, and ship the source to a GitHub repository you control.
              </p>
            </div>
          </div>

          {/* Right Side: Chain Diagram Grid */}
          <div className="lg:col-span-5 bg-[#0B1117] border border-[#2b3b4d]/40 p-8 rounded-sm font-mono text-xs text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">
              Deployment pipeline
            </div>

            <div className="flex flex-col items-center gap-4 w-full max-w-[200px]">
              
              {/* YOU */}
              <div 
                className={`w-full py-2.5 border transition-all duration-300 ${
                  chainStep >= 0 
                    ? "border-[#E5A84B] bg-[#E5A84B]/5 text-[#E5A84B] font-bold" 
                    : "border-[#2b3b4d]/40 text-gray-600"
                }`}
              >
                YOU
              </div>
              <div className={`text-xs transition-colors ${chainStep >= 1 ? "text-[#E5A84B]" : "text-gray-700"}`}>
                ↓
              </div>

              {/* PORTFOLIO */}
              <div 
                className={`w-full py-2.5 border transition-all duration-300 ${
                  chainStep >= 1 
                    ? "border-[#E5A84B] bg-[#E5A84B]/5 text-[#E5A84B] font-bold" 
                    : "border-[#2b3b4d]/40 text-gray-600"
                }`}
              >
                PORTFOLIO
              </div>
              <div className={`text-xs transition-colors ${chainStep >= 2 ? "text-[#E5A84B]" : "text-gray-700"}`}>
                ↓
              </div>

              {/* SOURCE CODE */}
              <div 
                className={`w-full py-2.5 border transition-all duration-300 ${
                  chainStep >= 2 
                    ? "border-[#E5A84B] bg-[#E5A84B]/5 text-[#E5A84B] font-bold" 
                    : "border-[#2b3b4d]/40 text-gray-600"
                }`}
              >
                SOURCE CODE
              </div>
              <div className={`text-xs transition-colors ${chainStep >= 3 ? "text-[#E5A84B]" : "text-gray-700"}`}>
                ↓
              </div>

              {/* GITHUB */}
              <div 
                className={`w-full py-2.5 border transition-all duration-300 ${
                  chainStep >= 3 
                    ? "border-[#E5A84B] bg-[#E5A84B]/5 text-[#E5A84B] font-bold" 
                    : "border-[#2b3b4d]/40 text-gray-600"
                }`}
              >
                GITHUB
              </div>
              <div className={`text-xs transition-colors ${chainStep >= 4 ? "text-[#E5A84B]" : "text-gray-700"}`}>
                ↓
              </div>

              {/* DEPLOY */}
              <div 
                className={`w-full py-2.5 border transition-all duration-300 ${
                  chainStep >= 4 
                    ? "border-[#E5A84B] bg-[#E5A84B]/5 text-[#E5A84B] font-bold" 
                    : "border-[#2b3b4d]/40 text-gray-600"
                }`}
              >
                DEPLOY
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
