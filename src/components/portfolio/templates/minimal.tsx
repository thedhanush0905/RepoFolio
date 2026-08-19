"use client";

import React, { useState } from "react";
import { PortfolioData, Project } from "@/lib/constants";
import { getProjectMedia } from "@/lib/project-media";
import { ChevronDown, ChevronUp } from "lucide-react";
import TypographicFallback from "../shared/typographic-fallback";
import ProjectDetailModal from "../shared/project-detail-modal";

import { PreviewMode } from "../portfolio-renderer";

interface TemplateProps {
  data: PortfolioData;
  previewMode?: PreviewMode;
}

export default function MinimalTemplate({ data, previewMode = "desktop" }: TemplateProps) {
  const { personal, skills, projects, experience, services, stats } = data;
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const toggleProject = (idx: number) => {
    setExpandedProject(expandedProject === idx ? null : idx);
  };

  const sortedProjects = [...(projects || [])].sort((a, b) => (a.order || 99) - (b.order || 99));
  const isMobile = previewMode === "mobile";

  return (
    <div className="bg-[#FAF9F6] text-[#111111] font-sans min-h-full flex flex-col justify-between selection:bg-[#111111] selection:text-[#FAF9F6]">
      <div>
        {/* Navigation header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-[#111111]/10">
          <span className="font-mono text-xs font-bold uppercase tracking-widest">{personal.name}</span>
          {personal.availability && (
            <span className="text-[9px] border border-[#111111]/30 px-2 py-0.5 font-mono uppercase">
              {personal.availability}
            </span>
          )}
        </div>

        {/* Hero Section */}
        <div className={`px-8 py-16 md:py-24 max-w-4xl mx-auto flex gap-8 ${isMobile ? "flex-col" : "flex-col md:flex-row justify-between items-start"}`}>
          <div className="space-y-4 max-w-xl order-2 md:order-1">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111111] leading-tight break-words">
              {personal.name}
            </h1>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-mono">{personal.role} // {personal.location}</p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-light">
              {personal.bio}
            </p>
          </div>

          <div className={`flex ${isMobile ? "order-1 justify-start" : "order-1 md:order-2 justify-end"}`}>
            {personal.profileImage ? (
              <img 
                src={personal.profileImage} 
                alt={personal.name} 
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#111111]/5 border border-[#111111]/10 flex items-center justify-center font-mono text-xs text-gray-400">
                [ Portrait ]
              </div>
            )}
          </div>
        </div>

        {/* Optional stats */}
        {stats && stats.length > 0 && (
          <div className="border-t border-b border-[#111111]/10 py-8 px-8 bg-gray-50/50">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
              {stats.map((s, i) => (
                <div key={i} className="text-xs">
                  <span className="font-bold text-[#111111]">{s.value}</span>
                  <span className="text-gray-500 ml-2 uppercase text-[9px]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services capabilities */}
        {services && services.length > 0 && (
          <div className="px-8 py-16 max-w-4xl mx-auto">
            <h2 className="text-[10px] uppercase tracking-widest text-[#111111] font-mono mb-8 border-b border-[#111111]/10 pb-2">
              Capabilities
            </h2>
            <div className="space-y-6">
              {services.map((ser, idx) => (
                <div key={idx} className="text-xs max-w-xl">
                  <h3 className="font-semibold text-sm mb-1">{ser.title}</h3>
                  <p className="text-gray-500 font-light leading-relaxed">{ser.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Work Expandables */}
        {sortedProjects && sortedProjects.length > 0 && (
          <div className="px-8 py-16 border-t border-b border-[#111111]/10 bg-gray-50/40">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-[10px] uppercase tracking-widest text-[#111111] font-mono mb-8 border-b border-[#111111]/10 pb-2">
                Selected Work
              </h2>

              <div className="space-y-4">
                {sortedProjects.map((proj, idx) => {
                  const isExpanded = expandedProject === idx;
                  const media = getProjectMedia(proj);
                  return (
                    <div key={idx} className="border-b border-[#111111]/5 pb-4">
                      <div className="flex justify-between items-baseline py-2">
                        <button
                          onClick={() => toggleProject(idx)}
                          className="flex-1 flex justify-between items-baseline text-left text-xs cursor-pointer hover:opacity-75 transition-opacity"
                        >
                          <div>
                            <span className="font-mono text-gray-500 mr-4">0{idx + 1}</span>
                            <span className="font-semibold text-[#111111] text-sm">{proj.title}</span>
                            <span className="text-gray-400 font-light ml-2 font-mono text-[10px]">({proj.category})</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-[10px] text-gray-500">
                            <span>{proj.year || "2026"}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </div>
                        </button>
                        <button 
                          onClick={() => setSelectedProject(proj)}
                          className="ml-4 text-xs text-gray-500 hover:text-black font-mono cursor-pointer"
                        >
                          →
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 space-y-6 animate-fade-in max-w-2xl">
                          <div className="border border-[#111111]/15 overflow-hidden rounded-sm">
                            {media.cover ? (
                              <img 
                                src={media.cover} 
                                alt={proj.title} 
                                className="w-full object-cover max-h-[340px]"
                              />
                            ) : (
                              <TypographicFallback project={proj} index={idx + 1} dark={false} />
                            )}
                          </div>

                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">{proj.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {proj.tech.map((t, i) => (
                              <span key={i} className="bg-[#111111]/5 text-[9px] px-2.5 py-1 font-mono rounded-sm text-gray-600 border border-[#111111]/5">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Experience Matrix */}
        {experience && experience.length > 0 && (
          <div className="px-8 py-16 max-w-4xl mx-auto">
            <h2 className="text-[10px] uppercase tracking-widest text-[#111111] font-mono mb-8 border-b border-[#111111]/10 pb-2">
              Experience
            </h2>
            <div className="space-y-8">
              {experience.map((exp, idx) => (
                <div key={idx} className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="md:w-1/3">
                    <span className="font-mono text-xs text-gray-500">{exp.duration}</span>
                  </div>
                  <div className="md:w-2/3 space-y-1.5">
                    <h3 className="text-sm font-semibold text-[#111111]">{exp.role}</h3>
                    <p className="text-xs text-gray-500 font-mono">{exp.company}</p>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiet inline skills list */}
        {skills && skills.length > 0 && (
          <div className="px-8 py-12 max-w-4xl mx-auto border-t border-[#111111]/10">
            <div className="text-xs text-gray-400 font-mono flex flex-wrap gap-y-2 gap-x-4">
              <span>TOOLKIT:</span>
              <span className="text-[#111111] font-sans">{skills.join(" · ")}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer contacts */}
      <div className="border-t border-[#111111]/10 px-8 py-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-gray-500">
          <div className="flex gap-4">
            {personal.github && (
              <a href={`https://github.com/${personal.github}`} className="hover:text-[#111111] underline">
                Github
              </a>
            )}
            {personal.linkedin && (
              <a href={`https://linkedin.com/in/${personal.linkedin}`} className="hover:text-[#111111] underline">
                Linkedin
              </a>
            )}
            {personal.email && (
              <a href={`mailto:${personal.email}`} className="hover:text-[#111111] underline">
                Email
              </a>
            )}
          </div>
          <span>MNML_BUILD_03</span>
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          dark={false}
        />
      )}
    </div>
  );
}
