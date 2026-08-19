"use client";

import React, { useState, useEffect } from "react";
import { Project } from "@/lib/constants";
import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { getProjectMedia } from "@/lib/project-media";

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  dark?: boolean;
}

export default function ProjectDetailModal({ project, onClose, dark = true }: ProjectDetailModalProps) {
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState<number | null>(null);

  // Esc key closure
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (fullscreenImageIndex !== null) {
          setFullscreenImageIndex(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenImageIndex, onClose]);

  const bgClass = dark ? "bg-[#0B1117] text-[#A8AAA4]" : "bg-[#FAF9F6] text-[#111111]";
  const headerClass = dark ? "text-white border-white/10" : "text-[#111111] border-black/10";
  const sectionTitleClass = dark ? "text-white border-white/10" : "text-[#111111] border-black/10";
  const descClass = dark ? "text-[#A8AAA4]" : "text-gray-700";
  const metaLabelStyle = dark ? "text-gray-500" : "text-gray-400";
  const metaValStyle = dark ? "text-white" : "text-[#111111]";

  const media = getProjectMedia(project);
  const allImages = [media.cover, ...media.gallery].filter(Boolean) as string[];

  // Image viewer navigation
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fullscreenImageIndex === null) return;
    setFullscreenImageIndex((fullscreenImageIndex + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fullscreenImageIndex === null) return;
    setFullscreenImageIndex((fullscreenImageIndex - 1 + allImages.length) % allImages.length);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Case study: ${project.title}`}
    >
      {/* Backdrop Close Click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main container */}
      <div className={`w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-4xl overflow-y-auto sm:rounded-sm border p-6 md:p-10 space-y-8 relative z-10 shadow-2xl ${bgClass} border-current/15`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          aria-label="Close case study modal"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-current/10 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Block */}
        <div className={`border-b pb-6 ${headerClass}`}>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">{project.title}</h2>
          <div className="flex flex-wrap gap-4 text-xs font-mono opacity-80">
            {project.category && <span>{project.category.toUpperCase()}</span>}
            {project.year && <span>{project.year}</span>}
          </div>
        </div>

        {/* Hero Cover Image */}
        {media.cover && (
          <div 
            className="w-full overflow-hidden border border-current/10 rounded-sm cursor-zoom-in"
            onClick={() => setFullscreenImageIndex(0)}
          >
            <img 
              src={media.cover} 
              alt={`${project.title} cover`} 
              className="w-full object-cover max-h-[380px] hover:scale-[1.01] transition-transform duration-300"
            />
          </div>
        )}

        {/* Text Body & Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Story Content */}
          <div className="md:col-span-8 space-y-6">
            <div className="space-y-2">
              <h3 className={`text-xs font-mono uppercase tracking-widest ${metaLabelStyle}`}>Overview</h3>
              <p className={`text-sm sm:text-base leading-relaxed font-light ${descClass}`}>
                {project.description}
              </p>
            </div>

            {/* Optional Challenge */}
            {project.challenge && (
              <div className="space-y-2">
                <h3 className={`text-xs font-mono uppercase tracking-widest ${metaLabelStyle}`}>The Challenge</h3>
                <p className={`text-sm leading-relaxed font-light ${descClass}`}>{project.challenge}</p>
              </div>
            )}

            {/* Optional Solution */}
            {project.solution && (
              <div className="space-y-2">
                <h3 className={`text-xs font-mono uppercase tracking-widest ${metaLabelStyle}`}>The Solution</h3>
                <p className={`text-sm leading-relaxed font-light ${descClass}`}>{project.solution}</p>
              </div>
            )}

            {/* Optional Outcome */}
            {project.outcome && (
              <div className="space-y-2">
                <h3 className={`text-xs font-mono uppercase tracking-widest ${metaLabelStyle}`}>The Outcome</h3>
                <p className={`text-sm leading-relaxed font-light ${descClass}`}>{project.outcome}</p>
              </div>
            )}
          </div>

          {/* Sidebar Metadata (only rendering non-empty details) */}
          <div className="md:col-span-4 space-y-6 md:border-l md:border-current/10 md:pl-6">
            {project.role && (
              <div>
                <span className={`block text-[10px] font-mono uppercase tracking-wider ${metaLabelStyle}`}>Role</span>
                <span className={`text-xs font-medium ${metaValStyle}`}>{project.role}</span>
              </div>
            )}
            {project.duration && (
              <div>
                <span className={`block text-[10px] font-mono uppercase tracking-wider ${metaLabelStyle}`}>Duration</span>
                <span className={`text-xs font-medium ${metaValStyle}`}>{project.duration}</span>
              </div>
            )}
            {project.tech && project.tech.length > 0 && (
              <div>
                <span className={`block text-[10px] font-mono uppercase tracking-wider ${metaLabelStyle}`}>Technologies</span>
                <div className={`text-xs font-mono ${metaValStyle}`}>{project.tech.join(" · ")}</div>
              </div>
            )}
            {project.year && (
              <div>
                <span className={`block text-[10px] font-mono uppercase tracking-wider ${metaLabelStyle}`}>Year</span>
                <span className={`text-xs font-medium ${metaValStyle}`}>{project.year}</span>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Screens Gallery */}
        {media.gallery.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-current/10">
            <h3 className={`text-xs font-mono uppercase tracking-widest mb-4 ${metaLabelStyle}`}>Visuals</h3>
            
            {/* Gallery rendering based on quantity */}
            {media.gallery.length === 1 ? (
              <div 
                className="border border-current/10 overflow-hidden rounded-sm cursor-zoom-in"
                onClick={() => setFullscreenImageIndex(1)}
              >
                <img src={media.gallery[0]} alt="Screenshot 1" className="w-full object-cover max-h-96" />
              </div>
            ) : media.gallery.length === 2 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {media.gallery.map((img, i) => (
                  <div 
                    key={i} 
                    className="border border-current/10 overflow-hidden rounded-sm cursor-zoom-in"
                    onClick={() => setFullscreenImageIndex(i + 1)}
                  >
                    <img src={img} alt={`Screenshot ${i + 1}`} className="w-full object-cover max-h-72" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {media.gallery.map((img, i) => (
                  <div 
                    key={i} 
                    className="border border-current/10 overflow-hidden rounded-sm cursor-zoom-in"
                    onClick={() => setFullscreenImageIndex(i + 1)}
                  >
                    <img src={img} alt={`Screenshot ${i + 1}`} className="w-full object-cover max-h-48" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CTA Launch links */}
        {(project.link || project.github) && (
          <div className="flex flex-wrap gap-4 pt-6 border-t border-current/10">
            {project.link && (
              <a 
                href={`https://${project.link}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#E5A84B] hover:bg-[#E5A84B]/90 text-[#0B1117] font-mono font-bold px-4 py-2 text-xs transition-all"
              >
                <span>Launch Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.github && (
              <a 
                href={`https://github.com/${project.github}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-current/30 hover:bg-current/10 px-4 py-2 text-xs font-mono transition-all"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Repository</span>
              </a>
            )}
          </div>
        )}

      </div>

      {/* Fullscreen lightroom image viewer */}
      {fullscreenImageIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-4 select-none"
          onClick={() => setFullscreenImageIndex(null)}
        >
          {/* Top Bar controls */}
          <div className="flex justify-between items-center text-xs font-mono text-gray-400 z-10">
            <span>{fullscreenImageIndex + 1} / {allImages.length}</span>
            <button 
              onClick={() => setFullscreenImageIndex(null)} 
              className="text-white hover:text-gray-300 p-2 cursor-pointer"
            >
              CLOSE (ESC)
            </button>
          </div>

          {/* Centered Image */}
          <div className="flex-1 flex items-center justify-center relative">
            
            {allImages.length > 1 && (
              <button 
                onClick={prevImage} 
                className="absolute left-2 p-3 bg-black/40 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img 
              src={allImages[fullscreenImageIndex]} 
              alt={`Fullscreen Visual representation ${fullscreenImageIndex + 1}`} 
              className="max-w-full max-h-[80vh] object-contain" 
            />

            {allImages.length > 1 && (
              <button 
                onClick={nextImage} 
                className="absolute right-2 p-3 bg-black/40 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

          </div>

          <div className="h-6" />
        </div>
      )}

    </div>
  );
}
