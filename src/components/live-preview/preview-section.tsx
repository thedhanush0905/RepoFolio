"use client";

import React, { useState } from "react";
import { DHANUSH_MOCK_DATA } from "@/lib/constants";
import PortfolioPreview from "@/components/ui/portfolio-preview";
import { Laptop, Tablet as TabletIcon, Smartphone } from "lucide-react";

export default function PreviewSection() {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
  // Custom states inside editable live preview
  const [name, setName] = useState(DHANUSH_MOCK_DATA.personal.name);
  const [role, setRole] = useState(DHANUSH_MOCK_DATA.personal.role);
  const [bio, setBio] = useState(DHANUSH_MOCK_DATA.personal.bio);

  const modifiedData = {
    ...DHANUSH_MOCK_DATA,
    personal: {
      ...DHANUSH_MOCK_DATA.personal,
      name,
      role,
      bio,
    }
  };

  const getViewportWidth = () => {
    switch (viewport) {
      case "mobile":
        return "max-w-[390px]";
      case "tablet":
        return "max-w-[768px]";
      default:
        return "max-w-full";
    }
  };

  return (
    <section id="preview" className="py-24 border-t border-[#17212B] bg-[#0B1117] select-none scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout Heading Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-6 text-left">
            <span className="font-mono text-xs text-[#E5A84B] uppercase tracking-wider block mb-3">
              {/* rendering engine */}
              rendering engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-[#F3F0E8] leading-tight">
              See it before <br />
              you ship it.
            </h2>
          </div>
          
          <div className="lg:col-span-6 text-left lg:text-right">
            <p className="text-sm sm:text-base text-[#A8AAA4] font-sans font-light max-w-md lg:ml-auto leading-relaxed">
              Change your information below and see how the generated portfolio responds in real-time. Toggle screen sizes to test responsiveness.
            </p>
          </div>
        </div>

        {/* Small live inputs to prove local state reactive changes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-[#101820] p-4 border border-[#2b3b4d]/40 rounded-sm font-mono text-xs">
          <div>
            <label className="block text-gray-500 mb-1.5 uppercase text-[10px]">Edit Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0B1117] border border-[#2b3b4d]/40 px-3 py-2 text-[#F3F0E8] focus:border-[#E5A84B] outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-500 mb-1.5 uppercase text-[10px]">Edit Role</label>
            <input 
              type="text" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#0B1117] border border-[#2b3b4d]/40 px-3 py-2 text-[#F3F0E8] focus:border-[#E5A84B] outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-500 mb-1.5 uppercase text-[10px]">Edit Biography</label>
            <input 
              type="text" 
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#0B1117] border border-[#2b3b4d]/40 px-3 py-2 text-[#F3F0E8] focus:border-[#E5A84B] outline-none"
            />
          </div>
        </div>

        {/* Browser Frame Mock */}
        <div className="bg-[#17212B] border border-[#2b3b4d]/60 rounded-sm overflow-hidden flex flex-col h-[560px]">
          
          {/* Browser Header Bar */}
          <div className="bg-[#0B1117] px-4 py-3 border-b border-[#2b3b4d]/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2b3b4d]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#2b3b4d]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#2b3b4d]" />
              </div>
              <span className="h-4 w-[1px] bg-[#2b3b4d]/60" />
              <div className="bg-[#101820] text-[10px] text-[#A8AAA4] font-mono px-3 py-1 rounded border border-[#2b3b4d]/30 max-w-xs truncate">
                http://localhost:3000
              </div>
            </div>

            {/* Viewport Control Toggles */}
            <div className="flex gap-1 bg-[#101820] p-1 border border-[#2b3b4d]/40 rounded-sm">
              <button
                onClick={() => setViewport("desktop")}
                className={`p-1.5 rounded-sm transition-all cursor-pointer ${
                  viewport === "desktop" ? "bg-[#E5A84B] text-[#0B1117]" : "text-[#A8AAA4] hover:text-[#F3F0E8]"
                }`}
                title="Desktop Viewport"
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport("tablet")}
                className={`p-1.5 rounded-sm transition-all cursor-pointer ${
                  viewport === "tablet" ? "bg-[#E5A84B] text-[#0B1117]" : "text-[#A8AAA4] hover:text-[#F3F0E8]"
                }`}
                title="Tablet Viewport"
              >
                <TabletIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport("mobile")}
                className={`p-1.5 rounded-sm transition-all cursor-pointer ${
                  viewport === "mobile" ? "bg-[#E5A84B] text-[#0B1117]" : "text-[#A8AAA4] hover:text-[#F3F0E8]"
                }`}
                title="Mobile Viewport"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Browser Workspace containing local React Component */}
          <div className="flex-1 overflow-y-auto bg-[#101820] p-4 flex justify-center items-start">
            <div 
              className={`w-full ${getViewportWidth()} transition-all duration-300 border border-[#2b3b4d]/20 shadow-xl overflow-hidden min-h-[480px] bg-[#17212B]`}
            >
              <PortfolioPreview data={modifiedData} theme="technical" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
