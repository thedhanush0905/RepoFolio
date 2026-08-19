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

export default function CreativeTemplate({ data, previewMode = "desktop" }: TemplateProps) {
  const { personal, skills, projects, experience, services, stats } = data;
  const sortedProjects = [...(projects || [])].sort((a, b) => (a.order || 99) - (b.order || 99));
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const isMobile = previewMode === "mobile";

  return (
    <div className="bg-[#121214] text-[#E4E4E7] font-sans min-h-full flex flex-col justify-between selection:bg-[#E5A84B] selection:text-[#121214]">
      <div>
        {/* Navigation header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-[#27272A]">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-white">{personal.name.toUpperCase()}</span>
          {personal.availability && (
            <span className="text-[9px] bg-[#E5A84B]/10 border border-[#E5A84B]/20 text-[#E5A84B] px-3 py-1 font-mono uppercase tracking-wider">
              {personal.availability}
            </span>
          )}
        </div>

        {/* Hero Section */}
        <div className={`px-8 py-16 md:py-24 max-w-5xl mx-auto grid gap-8 items-center ${isMobile ? "grid-cols-1 text-left" : "grid-cols-1 md:grid-cols-12"}`}>
          <div className={`${isMobile ? "order-2" : "md:col-span-8 order-2 md:order-1"} space-y-4`}>
            <h1 className={`font-extrabold tracking-tighter text-white leading-none break-words`}
                style={{ fontSize: isMobile ? "2.5rem" : "clamp(3.5rem, 8vw, 5rem)" }}
            >
              {personal.name.toUpperCase()}
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#E5A84B] font-mono">{personal.role}</p>
            <p className="text-base text-[#A1A1AA] leading-relaxed max-w-xl font-light">
              {personal.bio}
            </p>
          </div>

          <div className={`flex justify-center ${isMobile ? "order-1 justify-start" : "md:col-span-4 md:justify-end order-1 md:order-2"}`}>
            {personal.profileImage ? (
              <img 
                src={personal.profileImage} 
                alt={personal.name} 
                className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-cover border border-[#27272A] filter hover:brightness-110 transition-all duration-300 shadow-2xl"
              />
            ) : (
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-[#27272A] border border-[#27272A]/50 flex items-center justify-center font-mono text-xs uppercase tracking-widest text-gray-500">
                [ Portrait ]
              </div>
            )}
          </div>
        </div>

        {/* Optional stats */}
        {stats && stats.length > 0 && (
          <div className="border-t border-b border-[#27272A] py-8 px-8 bg-[#27272A]/10 font-mono">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="text-xs">
                  <span className="text-[#E5A84B] font-bold text-lg">{s.value}</span>
                  <span className="text-gray-500 ml-2 uppercase text-[9px]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services & Capabilities */}
        {services && services.length > 0 && (
          <div className="px-8 py-16 max-w-5xl mx-auto">
            <h2 className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-8 border-b border-[#27272A] pb-2">
              Capabilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
              {services.map((ser, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="font-bold text-white uppercase tracking-wider text-sm">{ser.title}</h3>
                  <p className="text-gray-400 font-light leading-relaxed">{ser.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Projects - Masonry visual flow */}
        {sortedProjects && sortedProjects.length > 0 && (
          <div className="px-8 py-16 bg-[#1A1A1E] border-t border-b border-[#27272A]">
            <div className="max-w-5xl mx-auto space-y-20">
              <h2 className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-8 border-b border-[#27272A]/40 pb-2">
                Selected Projects
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {sortedProjects.map((proj, idx) => {
                  const media = getProjectMedia(proj);
                  return (
                    <div key={idx} className="space-y-4 group">
                      <div 
                        className="overflow-hidden border border-[#27272A] relative cursor-pointer"
                        onClick={() => setSelectedProject(proj)}
                      >
                        {media.cover ? (
                          <img 
                            src={media.cover} 
                            alt={proj.title} 
                            className="w-full object-cover max-h-80 transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <TypographicFallback project={proj} index={idx + 1} dark={true} />
                        )}
                      </div>

                      <div className="flex justify-between items-baseline pt-2">
                        <h3 className="text-lg font-bold text-white">{proj.title}</h3>
                        <span className="font-mono text-[10px] text-gray-500">{proj.year || "2026"}</span>
                      </div>
                      
                      <p className="text-xs text-[#A1A1AA] leading-relaxed font-light">{proj.description}</p>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] font-mono text-[#E5A84B]">{proj.tech.join(" · ")}</span>
                        {proj.link && (
                          <a 
                            href={`https://${proj.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono uppercase tracking-wider text-white underline"
                          >
                            View Project →
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Experience log Timeline */}
        {experience && experience.length > 0 && (
          <div className="px-8 py-16 max-w-5xl mx-auto">
            <h2 className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-8 border-b border-[#27272A] pb-2">
              Experience Matrix
            </h2>
            <div className="space-y-8">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline font-bold text-white text-sm">
                    <span>{exp.role}</span>
                    <span className="text-[10px] text-[#E5A84B] font-mono font-normal">{exp.duration}</span>
                  </div>
                  <p className="text-gray-500 font-mono text-[11px]">{exp.company}</p>
                  <p className="text-xs text-[#A1A1AA] font-light leading-relaxed pt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core skills inline list */}
        {skills && skills.length > 0 && (
          <div className="px-8 py-12 max-w-5xl mx-auto border-t border-[#27272A]">
            <div className="text-xs text-gray-500 font-mono flex flex-wrap gap-y-2 gap-x-4">
              <span>TOOLKIT:</span>
              <span className="text-[#E4E4E7] font-sans">{skills.join(" · ")}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer contacts */}
      <div className="border-t border-[#27272A] px-8 py-8 mt-12">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-[10px] font-mono text-gray-500">
          <div className="flex gap-4">
            {personal.github && (
              <a href={`https://github.com/${personal.github}`} className="hover:text-white transition-colors">
                Github
              </a>
            )}
            {personal.linkedin && (
              <a href={`https://linkedin.com/in/${personal.linkedin}`} className="hover:text-white transition-colors">
                Linkedin
              </a>
            )}
            {personal.email && (
              <a href={`mailto:${personal.email}`} className="hover:text-white transition-colors">
                Email
              </a>
            )}
          </div>
          <span>CRT_BUILD_03</span>
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          dark={true}
        />
      )}
    </div>
  );
}
