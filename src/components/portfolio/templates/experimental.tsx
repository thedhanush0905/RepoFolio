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

export default function ExperimentalTemplate({ data, previewMode = "desktop" }: TemplateProps) {
  const { personal, skills, projects, experience, services, stats } = data;
  const sortedProjects = [...(projects || [])].sort((a, b) => (a.order || 99) - (b.order || 99));
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const isMobile = previewMode === "mobile";

  return (
    <div className="bg-[#050505] text-[#FFFFFF] font-sans min-h-full flex flex-col justify-between overflow-x-hidden selection:bg-[#E5A84B] selection:text-[#050505] relative p-6 sm:p-10">
      
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#E5A84B]/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">
        
        {/* Navigation header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-12">
          <span className="font-mono text-xs font-bold tracking-widest text-[#E5A84B]">{personal.name.toUpperCase()}</span>
          {personal.availability && (
            <span className="text-[9px] border border-white/20 px-2 py-0.5 font-mono uppercase">
              {personal.availability}
            </span>
          )}
        </div>

        {/* Hero Section */}
        <div className="py-12 max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-6 max-w-xl order-2 md:order-1">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white leading-none break-words">
              HELLO, I&apos;M <span className="text-[#E5A84B]">{personal.name ? personal.name.toUpperCase() : "CREATOR"}</span>.
            </h1>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{personal.role} // {personal.location}</p>
            <p className="text-sm text-gray-300 leading-relaxed font-light italic">
              &ldquo;{personal.bio}&rdquo;
            </p>
          </div>

          <div className="order-1 md:order-2">
            {personal.profileImage ? (
              <img 
                src={personal.profileImage} 
                alt={personal.name} 
                className="w-32 h-32 sm:w-36 sm:h-36 object-cover border border-[#E5A84B]/40"
              />
            ) : (
              <div className="w-32 h-32 sm:w-36 sm:h-36 bg-[#121212] border border-white/10 flex items-center justify-center font-mono text-xs text-gray-500">
                [ Portrait ]
              </div>
            )}
          </div>
        </div>

        {/* Optional stats */}
        {stats && stats.length > 0 && (
          <div className="border-t border-b border-white/10 py-8 my-12 font-mono">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="border-l border-[#E5A84B] pl-3">
                  <div className="text-[#E5A84B] text-xl font-bold">{s.value}</div>
                  <div className="text-[9px] text-gray-500 uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services & Capabilities */}
        {services && services.length > 0 && (
          <div className="py-12 max-w-5xl mx-auto">
            <h2 className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-8 border-b border-white/10 pb-2">
              Capabilities
            </h2>
            <div className="grid gap-6">
              {services.map((ser, idx) => (
                <div key={idx} className="bg-[#121212] p-6 border border-white/5 space-y-1">
                  <h3 className="font-bold text-white uppercase tracking-wider text-xs">{ser.title}</h3>
                  <p className="text-gray-400 font-light leading-relaxed text-xs">{ser.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Work horizontal visual pipeline */}
        {sortedProjects && sortedProjects.length > 0 && (
          <div className="py-12">
            <h2 className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-8 border-b border-white/10 pb-2">
              Project Pipeline →
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 overflow-x-auto pb-4 scrollbar-thin">
              {sortedProjects.map((proj, idx) => {
                const media = getProjectMedia(proj);
                return (
                  <div 
                    key={idx} 
                    className={`bg-[#121212] border p-6 min-w-[280px] sm:min-w-[340px] flex-shrink-0 transition-colors ${
                      proj.featured ? "border-[#E5A84B]" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-4 text-[9px] font-mono text-gray-500">
                      <span>0{idx + 1} {proj.featured && "★"}</span>
                      <span>{proj.year || "2026"}</span>
                    </div>

                    <div 
                      className="mb-4 overflow-hidden border border-white/10 cursor-pointer"
                      onClick={() => setSelectedProject(proj)}
                    >
                      {media.cover ? (
                        <img 
                          src={media.cover} 
                          alt={proj.title} 
                          className="w-full object-cover max-h-48"
                        />
                      ) : (
                        <TypographicFallback project={proj} index={idx + 1} dark={true} />
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">{proj.title}</h3>
                    <p className="text-xs text-gray-400 font-light leading-relaxed mb-4">{proj.description}</p>

                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-[#E5A84B]">{proj.tech.slice(0, 3).join(" · ")}</span>
                      <button 
                        onClick={() => setSelectedProject(proj)}
                        className="text-white underline cursor-pointer"
                      >
                        Explore →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Experience log Timeline */}
        {experience && experience.length > 0 && (
          <div className="py-12 max-w-5xl mx-auto border-t border-white/10">
            <h2 className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-8">
              History Matrix
            </h2>
            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx} className="bg-[#121212]/30 border border-white/5 p-6 space-y-1">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-white">{exp.role}</span>
                    <span className="text-[10px] text-[#E5A84B] font-mono">{exp.duration}</span>
                  </div>
                  <p className="text-gray-500 font-mono text-[10px]">{exp.company}</p>
                  <p className="text-xs text-gray-400 font-light leading-relaxed pt-1.5">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toolkit skills */}
        {skills && skills.length > 0 && (
          <div className="py-12 max-w-5xl mx-auto border-t border-white/10">
            <div className="text-xs text-gray-500 font-mono flex flex-wrap gap-y-2 gap-x-4">
              <span>SKILLS:</span>
              <span className="text-white font-sans">{skills.join(" · ")}</span>
            </div>
          </div>
        )}

      </div>

      {/* Footer contacts */}
      <div className="border-t border-white/10 pt-6 mt-12 flex justify-between items-center text-[10px] font-mono text-gray-500">
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
        <span>EXP_BUILD_03</span>
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
