"use client";

import React, { useState } from "react";
import { 
  DHANUSH_MOCK_DATA, 
  MAYA_CHEN_DATA, 
  ARJUN_RAO_DATA, 
  PortfolioData 
} from "@/lib/constants";
import PortfolioRenderer, { PortfolioTemplate } from "@/components/portfolio/portfolio-renderer";
import Link from "next/link";

interface Template {
  id: PortfolioTemplate;
  name: string;
  data: PortfolioData;
}

const TEMPLATES: Template[] = [
  {
    id: "editorial",
    name: "Editorial",
    data: MAYA_CHEN_DATA
  },
  {
    id: "developer",
    name: "Developer",
    data: DHANUSH_MOCK_DATA
  },
  {
    id: "minimal",
    name: "Minimal",
    data: ARJUN_RAO_DATA
  }
];

export default function GallerySection() {
  const [activeTemplate, setActiveTemplate] = useState<PortfolioTemplate>("developer");

  const activeData = TEMPLATES.find((t) => t.id === activeTemplate) || TEMPLATES[1];

  return (
    <section className="py-24 border-t border-[#17212B] bg-[#0B1117] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Header */}
        <div className="mb-12 max-w-xl text-left">
          <span className="font-mono text-xs text-[#E5A84B] uppercase tracking-wider block mb-3">
            {/* engine styles */}
            engine styles
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-[#F3F0E8] leading-tight">
            One engine. <br />
            Your design.
          </h2>
        </div>

        {/* Tab Controllers */}
        <div className="flex gap-2 border-b border-[#2b3b4d]/30 pb-4 mb-8 font-mono text-xs">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTemplate(t.id)}
              className={`px-4 py-2 border transition-all cursor-pointer ${
                activeTemplate === t.id
                  ? "bg-[#E5A84B] border-[#E5A84B] text-[#0B1117] font-bold"
                  : "bg-[#101820] border-[#2b3b4d]/40 text-[#A8AAA4] hover:text-[#F3F0E8]"
              }`}
            >
              {t.name.toUpperCase()} PREVIEW
            </button>
          ))}
        </div>

        {/* Dynamic Display Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Info about the design preset */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-[#101820] border border-[#2b3b4d]/40 p-6 rounded-sm">
            <div>
              <span className="font-mono text-[10px] text-[#E5A84B] uppercase tracking-widest block mb-2">
                Template Profile
              </span>
              <h3 className="text-xl font-bold font-sans text-[#F3F0E8] mb-3">
                {activeData.name} Preset
              </h3>
              <p className="text-xs sm:text-sm text-[#A8AAA4] leading-relaxed font-sans font-light">
                {activeData.id === "editorial" && "Features high-contrast serif typography, generous structural margins, asymmetric columns, and raw publication editorial grids."}
                {activeData.id === "developer" && "Optimized for software engineers with technical cards, dark terminal themes, modular toolkit grids, and strict layouts."}
                {activeData.id === "minimal" && "Ultra-clean minimalist portfolio omitting decorative borders, showcasing flat type structures, and focused telemetry stats."}
              </p>
            </div>

            <div className="mt-8">
              <Link
                href={{ pathname: "/create", query: { template: activeData.id } }}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#E5A84B] hover:underline"
              >
                CUSTOMIZE THIS DESIGN →
              </Link>
            </div>
          </div>

          {/* Right panel: Unified Portfolio Preview container */}
          <div className="lg:col-span-8 bg-[#101820] border border-[#2b3b4d]/50 p-1 relative group overflow-hidden h-[420px] rounded-sm">
            <div className="w-full h-full overflow-y-auto">
              <PortfolioRenderer template={activeData.id} data={activeData.data} />
            </div>

            {/* Subtle Hover Action Overlay */}
            <div className="absolute inset-0 bg-[#0B1117]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <span className="font-mono text-xs text-[#E5A84B] border border-[#E5A84B]/30 bg-[#E5A84B]/5 px-4 py-2 uppercase tracking-widest">
                {activeData.name.toUpperCase()} / OPEN PREVIEW →
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
