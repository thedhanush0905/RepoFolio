"use client";

import React from "react";
import { Project } from "@/lib/constants";

interface TypographicFallbackProps {
  project: Project;
  index: number;
  dark?: boolean;
}

export default function TypographicFallback({ project, index, dark = true }: TypographicFallbackProps) {
  const bgStyle = dark ? "bg-[#101820] border-white/10" : "bg-[#FAF9F6] border-black/15";
  const titleStyle = dark ? "text-white" : "text-[#111111]";
  const subStyle = dark ? "text-gray-400" : "text-gray-600";
  const numStyle = dark ? "text-[#E5A84B]" : "text-gray-400 font-mono";

  return (
    <div className={`w-full p-8 md:p-12 border rounded-sm flex flex-col justify-between min-h-[220px] select-none ${bgStyle}`}>
      <div className="flex justify-between items-start">
        <span className={`text-[10px] font-mono tracking-widest uppercase ${numStyle}`}>0{index}</span>
        {project.year && <span className={`text-[10px] font-mono ${subStyle}`}>{project.year}</span>}
      </div>
      
      <div className="my-6">
        <h4 className={`text-xl font-light uppercase tracking-wider ${titleStyle}`}>{project.title}</h4>
        <span className={`text-xs uppercase tracking-widest block mt-1 ${subStyle}`}>
          {project.category || "Case Study"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-current/10 opacity-70">
        {project.tech && project.tech.map((t, i) => (
          <span key={i} className={`text-[9px] font-mono uppercase tracking-wider ${subStyle}`}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
