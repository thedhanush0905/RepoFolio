"use client";

import React, { useState } from "react";
import { PortfolioData, Project } from "@/lib/constants";
import { getProjectMedia } from "@/lib/project-media";
import { Github, Linkedin, Mail } from "lucide-react";
import TypographicFallback from "../shared/typographic-fallback";
import ProjectDetailModal from "../shared/project-detail-modal";

import { PreviewMode } from "../portfolio-renderer";

interface TemplateProps {
  data: PortfolioData;
  previewMode?: PreviewMode;
}

export default function CorporateTemplate({ data, previewMode = "desktop" }: TemplateProps) {
  const { personal, skills, projects, experience, services, stats } = data;
  const sortedProjects = [...(projects || [])].sort((a, b) => (a.order || 99) - (b.order || 99));
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const isMobile = previewMode === "mobile";

  return (
    <div className="bg-[#FFFFFF] text-[#2C3E50] font-sans min-h-full flex flex-col justify-between selection:bg-[#34495E] selection:text-white">
      <div>
        {/* Navigation header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-200">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#2C3E50]">{personal.name.toUpperCase()}</span>
          {personal.availability && (
            <span className="text-[9px] bg-gray-100 border border-gray-200 text-[#7F8C8D] px-2.5 py-1 font-mono uppercase tracking-wider">
              {personal.availability}
            </span>
          )}
        </div>

        {/* Hero Section */}
        <div className={`px-8 py-16 md:py-24 max-w-5xl mx-auto grid gap-8 items-center ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-12"}`}>
          <div className={`${isMobile ? "order-2" : "md:col-span-8 order-2 md:order-1"} space-y-4`}>
            <h1 className={`font-extrabold tracking-tight text-[#2C3E50] leading-tight break-words`}
                style={{ fontSize: isMobile ? "2.25rem" : "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              {personal.name}
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-[#7F8C8D] font-mono">{personal.role}</p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl font-light">
              {personal.bio}
            </p>
          </div>

          <div className={`flex justify-center ${isMobile ? "order-1 justify-start" : "md:col-span-4 md:justify-end order-1 md:order-2"}`}>
            {personal.profileImage ? (
              <img 
                src={personal.profileImage} 
                alt={personal.name} 
                className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-cover border border-gray-300 shadow-lg"
              />
            ) : (
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-gray-50 border border-gray-200 flex items-center justify-center font-mono text-xs text-gray-400">
                [ Portrait ]
              </div>
            )}
          </div>
        </div>

        {/* Optional stats */}
        {stats && stats.length > 0 && (
          <div className="border-t border-b border-gray-200 py-8 px-8 bg-gray-50/50 font-mono">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="text-xs">
                  <span className="font-bold text-[#2C3E50] text-lg block">{s.value}</span>
                  <span className="text-gray-500 uppercase text-[9px]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Capabilities Services */}
        {services && services.length > 0 && (
          <div className="px-8 py-16 max-w-5xl mx-auto">
            <h2 className="text-[10px] text-[#34495E] font-bold uppercase tracking-wider mb-8 border-b border-gray-100 pb-2">
              Capabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
              {services.map((ser, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="font-bold text-[#2C3E50] text-sm">{ser.title}</h3>
                  <p className="text-gray-600 font-light leading-relaxed">{ser.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Initiatives / Case Studies */}
        {sortedProjects && sortedProjects.length > 0 && (
          <div className="px-8 py-16 bg-gray-50/60 border-t border-b border-gray-200">
            <div className="max-w-5xl mx-auto space-y-20">
              <h2 className="text-[10px] text-[#34495E] font-bold uppercase tracking-wider mb-8 border-b border-gray-200/50 pb-2">
                Selected Projects
              </h2>

              <div className="space-y-16">
                {sortedProjects.map((proj, idx) => {
                  const media = getProjectMedia(proj);
                  return (
                    <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      <div className="lg:col-span-6">
                        <div className="overflow-hidden border border-gray-200 shadow-sm rounded-sm">
                          {media.cover ? (
                            <img 
                              src={media.cover} 
                              alt={proj.title} 
                              className="w-full object-cover max-h-80"
                            />
                          ) : (
                            <TypographicFallback project={proj} index={idx + 1} dark={false} />
                          )}
                        </div>
                      </div>

                      <div className="lg:col-span-6 space-y-4">
                        <div className="flex justify-between items-baseline font-mono text-[10px] text-[#7F8C8D]">
                          <span>0{idx + 1} / CASE STUDY</span>
                          <span>{proj.year || "2026"}</span>
                        </div>

                        <h3 className="text-xl font-bold text-[#2C3E50]">{proj.title}</h3>
                        <p className="text-xs uppercase tracking-widest text-[#7F8C8D] font-mono">{proj.category}</p>
                        <p className="text-sm text-gray-600 leading-relaxed font-light">{proj.description}</p>
                        
                        <div className="font-mono text-xs text-[#2C3E50] pt-2">
                          {proj.tech.join(" · ")}
                        </div>

                        {proj.link && (
                          <div className="pt-2">
                            <button 
                              onClick={() => setSelectedProject(proj)}
                              className="font-mono text-xs uppercase tracking-wider underline text-[#2C3E50] cursor-pointer text-left"
                            >
                              View case study
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Professional Experience */}
        {experience && experience.length > 0 && (
          <div className="px-8 py-16 max-w-5xl mx-auto">
            <h2 className="text-[10px] text-[#34495E] font-bold uppercase tracking-wider mb-8 border-b border-gray-100 pb-2">
              Professional Experience
            </h2>
            <div className="space-y-8">
              {experience.map((exp, idx) => (
                <div key={idx} className="flex flex-col md:flex-row justify-between items-start gap-4 text-xs">
                  <div className="md:w-1/3">
                    <span className="font-mono text-[#7F8C8D]">{exp.duration}</span>
                  </div>
                  <div className="md:w-2/3 space-y-1.5">
                    <h3 className="font-bold text-[#2C3E50] text-sm">{exp.role}</h3>
                    <p className="text-gray-500 font-mono text-[10px]">{exp.company}</p>
                    <p className="text-gray-600 font-light leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiet inline skills list */}
        {skills && skills.length > 0 && (
          <div className="px-8 py-12 max-w-5xl mx-auto border-t border-gray-200">
            <div className="text-xs text-gray-400 font-mono flex flex-wrap gap-y-2 gap-x-4">
              <span>EXPERTISE:</span>
              <span className="text-[#2C3E50] font-sans">{skills.join(" · ")}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer contacts */}
      <div className="border-t border-gray-200 px-8 py-8 mt-12">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-[10px] font-mono text-[#7F8C8D]">
          <div className="flex gap-4">
            {personal.github && (
              <a href={`https://github.com/${personal.github}`} className="hover:text-[#2C3E50]">
                Github
              </a>
            )}
            {personal.linkedin && (
              <a href={`https://linkedin.com/in/${personal.linkedin}`} className="hover:text-[#2C3E50]">
                Linkedin
              </a>
            )}
            {personal.email && (
              <a href={`mailto:${personal.email}`} className="hover:text-[#2C3E50]">
                Email
              </a>
            )}
          </div>
          <span>CORP_BUILD_03</span>
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
