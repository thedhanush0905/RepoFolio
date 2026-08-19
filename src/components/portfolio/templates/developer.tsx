"use client";

import React, { useState } from "react";
import { PortfolioData, Project } from "@/lib/constants";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import TypographicFallback from "../shared/typographic-fallback";
import ProjectDetailModal from "../shared/project-detail-modal";
import { PreviewMode } from "../portfolio-renderer";

interface TemplateProps {
  data: PortfolioData;
  previewMode?: PreviewMode;
}

export default function DeveloperTemplate({ data, previewMode = "desktop" }: TemplateProps) {
  const { personal, skills, projects, experience, services, stats } = data;
  const sortedProjects = [...(projects || [])].sort((a, b) => (a.order || 99) - (b.order || 99));
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const isMobile = previewMode === "mobile";

  return (
    <div className="bg-[#0B1117] text-[#A8AAA4] font-sans min-h-full flex flex-col justify-between selection:bg-[#E5A84B] selection:text-[#0B1117] p-4 sm:p-12 md:p-16">
      <div className="max-w-5xl mx-auto w-full space-y-12 sm:space-y-24">
        
        {/* Navigation & Header */}
        <header className="border-b border-[#2b3b4d]/20 pb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-2">
            <div>
              <div className="font-mono text-sm font-bold tracking-tight text-[#F3F0E8] uppercase">
                {personal.name}
              </div>
              <div className="text-[10px] text-gray-500 uppercase font-mono tracking-widest mt-1">
                {personal.role} {personal.location && `· ${personal.location}`}
              </div>
            </div>
            {personal.availability && (
              <div className="text-[9px] text-[#E5A84B] font-mono uppercase tracking-widest md:text-right mt-2 md:mt-0">
                {personal.availability}
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className={`grid gap-8 items-center pt-8 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-12"}`}>
          <div className={`space-y-6 ${isMobile ? "order-2" : "md:col-span-8 order-2 md:order-1"}`}>
            <h1 className={`font-extrabold tracking-tight text-[#F3F0E8] leading-tight select-none overflow-wrap-normal word-break-normal`}
                style={{ fontSize: isMobile ? "2rem" : "clamp(2.5rem, 5vw, 3.75rem)" }}
            >
              I build scalable systems & digital products for the web.
            </h1>
            <p className="text-sm sm:text-base text-[#A8AAA4] leading-relaxed max-w-xl font-light">
              {personal.bio}
            </p>
            {personal.location && (
              <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">Based in {personal.location}</p>
            )}
            
            {/* Quick links */}
            <div className="flex flex-wrap gap-4 pt-2 font-mono text-xs text-[#E5A84B]">
              {personal.github && (
                <a href={`https://github.com/${personal.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  GitHub
                </a>
              )}
              {personal.linkedin && (
                <a href={`https://linkedin.com/in/${personal.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  LinkedIn
                </a>
              )}
              {personal.email && (
                <a href={`mailto:${personal.email}`} className="hover:underline">
                  Email
                </a>
              )}
            </div>
          </div>

          <div className={`flex justify-center ${isMobile ? "order-1" : "md:col-span-4 md:justify-end order-1 md:order-2"}`}>
            {personal.profileImage ? (
              <img 
                src={personal.profileImage} 
                alt={personal.name} 
                className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 object-cover rounded-sm border border-[#2b3b4d]/40 shadow-xl"
              />
            ) : (
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-sm bg-[#17212B] border border-[#2b3b4d]/40 flex items-center justify-center text-[#E5A84B] font-mono text-sm">
                [ PORTRAIT ]
              </div>
            )}
          </div>
        </section>

        {/* Selected Work section */}
        {sortedProjects && sortedProjects.length > 0 && (
          <section className="space-y-16">
            <div className="border-b border-[#2b3b4d]/20 pb-4">
              <h2 className="text-xs font-mono text-[#E5A84B] uppercase tracking-widest">Selected Projects</h2>
            </div>

            <div className="space-y-24">
              {sortedProjects.map((proj, idx) => (
                <div key={idx} className="space-y-6">
                  
                  {/* Title metadata */}
                  <div className="flex justify-between items-baseline font-mono text-xs">
                    <span className="text-gray-500">0{idx + 1}</span>
                    <span>{proj.category?.toUpperCase() || "CASE STUDY"}</span>
                  </div>

                  {/* Huge visual representation cover */}
                  <div className="overflow-hidden border border-[#2b3b4d]/30 rounded-sm">
                    {proj.image ? (
                      <img 
                        src={proj.image} 
                        alt={proj.title} 
                        className="w-full object-cover max-h-[460px] transition-transform duration-500 hover:scale-[1.01]"
                      />
                    ) : (
                      <TypographicFallback project={proj} index={idx + 1} dark={true} />
                    )}
                  </div>

                  <div className={`flex gap-6 pt-2 ${isMobile ? "flex-col" : "flex-col md:flex-row"}`}>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{proj.title}</h3>
                      <p className="text-sm text-[#A8AAA4] leading-relaxed font-light">{proj.description}</p>
                    </div>

                    <div className={`flex flex-col gap-3 min-w-[200px] ${isMobile ? "text-left" : "md:text-right"}`}>
                      <div className={`font-mono text-xs text-[#E5A84B] flex flex-wrap gap-2 ${isMobile ? "justify-start" : "md:justify-end"}`}>
                        {proj.tech.join(" · ")}
                      </div>
                      <div>
                        <button 
                          onClick={() => setSelectedProject(proj)} 
                          className={`inline-block text-xs font-mono text-white underline hover:text-[#E5A84B] cursor-pointer text-left ${isMobile ? "text-left" : "md:text-right"}`}
                        >
                          View Project Case Study →
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience log Timeline */}
        {experience && experience.length > 0 && (
          <section className="space-y-12">
            <div className="border-b border-[#2b3b4d]/20 pb-4">
              <h2 className="text-xs font-mono text-[#E5A84B] uppercase tracking-widest">Experience</h2>
            </div>
            <div className="space-y-12">
              {experience.map((exp, idx) => (
                <div key={idx} className={`flex gap-4 ${isMobile ? "flex-col" : "flex-col md:flex-row justify-between items-start"}`}>
                  <div className={`${isMobile ? "w-full" : "md:w-1/3"}`}>
                    <span className="text-xs font-mono text-gray-500">{exp.duration}</span>
                  </div>
                  <div className={`${isMobile ? "w-full" : "md:w-2/3"} space-y-2`}>
                    <h3 className="text-base font-bold text-white">{exp.role}</h3>
                    <p className="text-xs font-mono text-[#E5A84B]">{exp.company}</p>
                    <p className="text-sm text-[#A8AAA4] leading-relaxed font-light">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Services capabilities list */}
        {services && services.length > 0 && (
          <section className="space-y-8">
            <div className="border-b border-[#2b3b4d]/20 pb-4">
              <h2 className="text-xs font-mono text-[#E5A84B] uppercase tracking-widest">Capabilities</h2>
            </div>
            <div className={`grid gap-8 text-xs font-mono ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
              {services.map((ser, idx) => (
                <div key={idx} className="space-y-2 break-words">
                  <h3 className="text-sm font-semibold text-white">{ser.title}</h3>
                  <p className="text-xs text-[#A8AAA4] leading-relaxed font-light">{ser.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Toolkit skills inline list */}
        {skills && skills.length > 0 && (
          <section className="space-y-4 pt-8 border-t border-[#2b3b4d]/20">
            <div className="text-xs text-gray-500 font-mono flex flex-wrap gap-y-2 gap-x-4">
              <span>TOOLKIT:</span>
              <span className="text-[#A8AAA4] font-sans">{skills.join(" · ")}</span>
            </div>
          </section>
        )}

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
