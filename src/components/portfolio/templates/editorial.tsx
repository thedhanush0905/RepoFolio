"use client";

import React, { useState } from "react";
import { PortfolioData, Project } from "@/lib/constants";
import { getProjectMedia } from "@/lib/project-media";
import TypographicFallback from "../shared/typographic-fallback";
import ProjectDetailModal from "../shared/project-detail-modal";

import { PreviewMode } from "../portfolio-renderer";

interface TemplateProps {
  data: PortfolioData;
  previewMode?: PreviewMode;
}

export default function EditorialTemplate({ data, previewMode = "desktop" }: TemplateProps) {
  const { personal, skills, projects, experience, services, stats } = data;
  const sortedProjects = [...(projects || [])].sort((a, b) => (a.order || 99) - (b.order || 99));
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const isMobile = previewMode === "mobile";

  return (
    <div className="bg-[#E8E2D5] text-[#1A1C18] font-serif min-h-full flex flex-col justify-between selection:bg-[#1A1C18] selection:text-[#E8E2D5]">
      <div>
        {/* Header bar */}
        <div className="px-8 py-6 flex justify-between items-baseline font-mono text-[9px] uppercase tracking-widest text-[#4A4C45] border-b border-[#1A1C18]/10">
          <span>{personal.role} {personal.availability && `// ${personal.availability.toUpperCase()}`}</span>
          <span>{personal.location || "Earth"}</span>
        </div>

        {/* Hero Section with portrait grid split */}
        <div className={`px-8 py-16 md:py-24 max-w-5xl mx-auto grid gap-12 items-center ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-12"}`}>
          <div className={`${isMobile ? "order-2" : "md:col-span-8 order-2 md:order-1"} space-y-6`}>
            <h1 className={`font-light tracking-tight text-[#1A1C18] leading-none animate-fade-in`}
                style={{ fontSize: isMobile ? "2.5rem" : "clamp(3rem, 7vw, 4.5rem)" }}
            >
              {personal.name}
            </h1>
            <p className="text-lg sm:text-xl text-[#3A3C37] leading-relaxed max-w-xl font-light">
              {personal.bio}
            </p>
          </div>
          
          <div className={`flex justify-center ${isMobile ? "order-1" : "md:col-span-4 md:justify-end order-1 md:order-2"}`}>
            {personal.profileImage ? (
              <img 
                src={personal.profileImage} 
                alt={personal.name} 
                className="w-48 h-64 object-cover border border-[#1A1C18]/20 shadow-sm"
              />
            ) : (
              <div className="w-48 h-64 bg-[#1A1C18]/5 border border-[#1A1C18]/15 flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[#4A4C45]">
                [ Portrait ]
              </div>
            )}
          </div>
        </div>

        {/* Optional stats segment */}
        {stats && stats.length > 0 && (
          <div className="border-t border-b border-[#1A1C18]/10 py-8 px-8 bg-[#1A1C18]/5 font-mono">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="text-left">
                  <div className="text-[#1A1C18] text-2xl font-bold">{s.value}</div>
                  <div className="text-[9px] text-[#4A4C45] uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services / Capabilities list */}
        {services && services.length > 0 && (
          <div className="px-8 py-16 max-w-5xl mx-auto">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#4A4C45] border-b border-[#1A1C18]/10 pb-2 mb-8">
              Capabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
              {services.map((ser, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-sm font-bold text-[#1A1C18] uppercase tracking-wider">{ser.title}</h3>
                  <p className="text-xs text-[#4A4C45] leading-relaxed font-light">{ser.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Work - Editorial asymmetric grid */}
        {sortedProjects && sortedProjects.length > 0 && (
          <div className="px-8 py-16 bg-[#1A1C18]/5 border-t border-b border-[#1A1C18]/10">
            <div className="max-w-5xl mx-auto space-y-24">
              <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#4A4C45] border-b border-[#1A1C18]/15 pb-2">
                Selected Work
              </h2>

              {sortedProjects.map((proj, idx) => {
                const media = getProjectMedia(proj);
                return (
                  <div key={idx} className="space-y-8">
                    <div className="flex justify-between items-baseline font-mono text-[10px] text-[#4A4C45]">
                      <span>0{idx + 1} / {proj.year || "2026"}</span>
                      <span>{proj.category?.toUpperCase()}</span>
                    </div>

                    {/* Asymmetric wide project image */}
                    <div className="w-full overflow-hidden border border-[#1A1C18]/10">
                      {media.cover ? (
                        <img 
                          src={media.cover} 
                          alt={proj.title} 
                          className="w-full object-cover max-h-[420px] transition-transform duration-500 hover:scale-[1.02]"
                        />
                      ) : (
                        <TypographicFallback project={proj} index={idx + 1} dark={false} />
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      <div className="md:col-span-8">
                        <h3 className="text-2xl font-light tracking-tight text-[#1A1C18] mb-4">
                          {proj.title}
                        </h3>
                        <p className="text-sm text-[#3A3C37] font-light leading-relaxed mb-6 max-w-xl">
                          {proj.description}
                        </p>
                      </div>

                      <div className="md:col-span-4 md:text-right space-y-4">
                        <div className="font-mono text-[10px] text-[#4A4C45] flex flex-wrap gap-2 md:justify-end">
                          {proj.tech.join(" · ")}
                        </div>
                        <div>
                          <button 
                            onClick={() => setSelectedProject(proj)}
                            className="font-mono text-xs uppercase tracking-wider underline text-[#1A1C18] cursor-pointer"
                          >
                            Explore case study
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Experience Timeline */}
        {experience && experience.length > 0 && (
          <div className="px-8 py-16 max-w-5xl mx-auto">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#4A4C45] border-b border-[#1A1C18]/10 pb-2 mb-8">
              Experience
            </h2>
            <div className="space-y-12">
              {experience.map((exp, idx) => (
                <div key={idx} className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="md:w-1/3">
                    <span className="font-mono text-xs text-gray-500">{exp.duration}</span>
                  </div>
                  <div className="md:w-2/3 space-y-2">
                    <h3 className="text-base font-semibold text-[#1A1C18]">{exp.role}</h3>
                    <p className="text-xs font-mono text-[#4A4C45]">{exp.company}</p>
                    <p className="text-sm text-[#3A3C37] font-light leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Capabilities Skills list */}
        {skills && skills.length > 0 && (
          <div className="px-8 py-12 max-w-5xl mx-auto border-t border-[#1A1C18]/10">
            <div className="text-xs text-gray-500 font-mono flex flex-wrap gap-y-2 gap-x-4">
              <span>SKILL toolkit:</span>
              <span className="text-[#3A3C37] font-sans">{skills.join(" · ")}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer contacts */}
      <div className="border-t border-[#1A1C18]/10 px-8 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] font-mono text-[#4A4C45]">
          <div className="flex gap-4">
            {personal.github && (
              <a href={`https://github.com/${personal.github}`} className="underline hover:text-[#1A1C18]">
                Github
              </a>
            )}
            {personal.linkedin && (
              <a href={`https://linkedin.com/in/${personal.linkedin}`} className="underline hover:text-[#1A1C18]">
                Linkedin
              </a>
            )}
            {personal.email && (
              <a href={`mailto:${personal.email}`} className="underline hover:text-[#1A1C18]">
                Email
              </a>
            )}
          </div>
          <span>© {new Date().getFullYear()}</span>
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
