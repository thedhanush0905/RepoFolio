"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { DHANUSH_MOCK_DATA, PortfolioData } from "@/lib/constants";
import PortfolioRenderer, { PortfolioTemplate } from "@/components/portfolio/portfolio-renderer";
import { Terminal as TerminalIcon, RefreshCw } from "lucide-react";

export default function HeroSection() {
  // Animation state loop
  // 'typing' | 'generating' | 'previewReady' | 'repositoryBuilding' | 'repositoryReady' | 'deployed'
  const [demoState, setDemoState] = useState<
    "typing" | "generating" | "previewReady" | "repositoryBuilding" | "repositoryReady" | "deployed"
  >("typing");

  const [activeTemplate, setActiveTemplate] = useState<PortfolioTemplate>("developer");

  // Local interactive typing states for Dhanush Maddila
  const [typedName, setTypedName] = useState("");
  const [typedRole, setTypedRole] = useState("");
  const [typedSkills, setTypedSkills] = useState<string[]>([]);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  
  // Custom Portfolio Data consumed dynamically
  const [currentPortfolio, setCurrentPortfolio] = useState<PortfolioData>({
    personal: {
      name: "",
      role: "",
      bio: "Describe yourself once. Get a portfolio, a codebase, and a repo you control.",
      location: "San Francisco, CA",
      github: "dhanush",
      linkedin: "dhanush-maddila",
      email: "dhanush@maddila.dev",
      profileImage: ""
    },
    skills: [],
    projects: [],
    experience: [],
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Restart loop
  const restartDemo = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDemoState("typing");
    setTypedName("");
    setTypedRole("");
    setTypedSkills([]);
    setTerminalLines([]);
    setActiveTemplate("developer");
    setCurrentPortfolio({
      personal: {
        name: "",
        role: "",
        bio: "Describe yourself once. Get a portfolio, a codebase, and a repo you control.",
        location: "San Francisco, CA",
        github: "dhanush",
        linkedin: "dhanush-maddila",
        email: "dhanush@maddila.dev",
        profileImage: ""
      },
      skills: [],
      projects: [],
      experience: [],
    });
  };

  useEffect(() => {
    if (demoState === "typing") {
      let nameIndex = 0;
      const targetName = "Dhanush Maddila";
      
      const typeNameInterval = setInterval(() => {
        if (nameIndex < targetName.length) {
          const nextName = targetName.slice(0, nameIndex + 1);
          setTypedName(nextName);
          setCurrentPortfolio((prev) => ({
            ...prev,
            personal: { ...prev.personal, name: nextName },
          }));
          nameIndex++;
        } else {
          clearInterval(typeNameInterval);
          
          // Next: Role typing
          setTimeout(() => {
            let roleIndex = 0;
            const targetRole = "Software Engineer";
            const typeRoleInterval = setInterval(() => {
              if (roleIndex < targetRole.length) {
                const nextRole = targetRole.slice(0, roleIndex + 1);
                setTypedRole(nextRole);
                setCurrentPortfolio((prev) => ({
                  ...prev,
                  personal: { ...prev.personal, role: nextRole },
                }));
                roleIndex++;
              } else {
                clearInterval(typeRoleInterval);
                
                // Next: Skills add
                setTimeout(() => {
                  const targetSkills = ["Java", "React", "Node.js", "TypeScript"];
                  let skillIdx = 0;
                  
                  const skillInterval = setInterval(() => {
                    if (skillIdx < targetSkills.length) {
                      const nextSkill = targetSkills[skillIdx];
                      setTypedSkills((prev) => [...prev, nextSkill]);
                      setCurrentPortfolio((prev) => ({
                        ...prev,
                        skills: [...prev.skills, nextSkill],
                      }));
                      skillIdx++;
                    } else {
                      clearInterval(skillInterval);
                      
                      // Phase 2: Generating
                      setTimeout(() => {
                        setDemoState("generating");
                      }, 800);
                    }
                  }, 300);
                }, 500);
              }
            }, 40);
          }, 500);
        }
      }, 50);

      return () => clearInterval(typeNameInterval);
    }

    if (demoState === "generating") {
      // Respond to generate action, fade in projects, toggle visual layouts templates
      const timer = setTimeout(() => {
        setCurrentPortfolio((prev) => ({
          ...prev,
          projects: DHANUSH_MOCK_DATA.projects,
        }));
        
        // Visual template selector toggle demonstration
        setActiveTemplate("editorial");
        setTimeout(() => {
          setActiveTemplate("minimal");
          setTimeout(() => {
            setActiveTemplate("developer");
            setDemoState("previewReady");
          }, 1000);
        }, 1000);

      }, 1000);
      return () => clearTimeout(timer);
    }

    if (demoState === "previewReady") {
      const timer = setTimeout(() => {
        setDemoState("repositoryBuilding");
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (demoState === "repositoryBuilding") {
      const commands = [
        "$ git init",
        "Initialized empty Git repository in /portfolio/.git/",
        "$ git add .",
        "$ git commit -m \"initial portfolio\"",
        "[main (root-commit) 8c4fa03] initial portfolio",
        " 12 files changed, 284 insertions(+)",
        "$ git branch -M main",
        "$ git push origin main",
        "Enumerating objects: 15, done.",
        "Counting objects: 100% (15/15), done.",
        "Writing objects: 100% (15/15), 18.25 KiB, done.",
        "To github.com/dhanush/portfolio.git",
        " * [new branch]      main -> main",
        "✓ Repository synchronized."
      ];

      let lineIdx = 0;
      const termInterval = setInterval(() => {
        if (lineIdx < commands.length) {
          setTerminalLines((prev) => [...prev, commands[lineIdx]]);
          lineIdx++;
        } else {
          clearInterval(termInterval);
          setTimeout(() => {
            setDemoState("repositoryReady");
          }, 800);
        }
      }, 250);

      return () => clearInterval(termInterval);
    }

    if (demoState === "repositoryReady") {
      const timer = setTimeout(() => {
        setDemoState("deployed");
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (demoState === "deployed") {
      const timer = setTimeout(() => {
        restartDemo();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [demoState]);

  const handleScrollToWorkflow = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen pt-24 pb-16 flex items-center justify-center grid-bg select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Editorial Headline Column */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#17212B] border border-[#2b3b4d]/50 text-xs font-mono text-[#A8AAA4] w-fit mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5A84B] animate-pulse" />
              <span>STABLE RELEASE / v0.1.0</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold font-sans tracking-tight text-[#F3F0E8] leading-[1.08] mb-6">
              Your portfolio <br />
              should ship <br />
              with <span className="text-[#E5A84B]">its source <br />code.</span>
            </h1>
            
            <p className="text-base sm:text-lg text-[#A8AAA4] font-sans font-light max-w-md leading-relaxed mb-8">
              Describe yourself once. Get a high-fidelity portfolio, a clean React codebase, and a GitHub repository you fully control.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <Link
                href="/create"
                className="bg-[#E5A84B] hover:bg-[#E5A84B]/90 text-[#0B1117] font-mono text-center font-bold px-8 py-4 transition-all tracking-wide border border-transparent hover:border-[#E5A84B]/20"
              >
                Start building
              </Link>
              <a
                href="#how-it-works"
                onClick={handleScrollToWorkflow}
                className="flex items-center justify-center gap-2 text-[#F3F0E8] hover:text-[#E5A84B] font-mono text-sm transition-colors py-3"
              >
                See how it works <span className="text-[#E5A84B] font-sans">↓</span>
              </a>
            </div>
          </div>

          {/* Right: Interactive Product Demonstration */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-[#17212B] border border-[#2b3b4d]/60 rounded-sm overflow-hidden flex flex-col h-[520px]">
              
              {/* Header bar */}
              <div className="bg-[#0B1117] px-4 py-3 border-b border-[#2b3b4d]/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2b3b4d]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2b3b4d]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2b3b4d]" />
                  </div>
                  <span className="h-4 w-[1px] bg-[#2b3b4d]/60" />
                  <span className="text-[10px] font-mono text-[#A8AAA4] tracking-wider uppercase">
                    REP-001 / PORTFOLIO GENERATOR
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#E5A84B] bg-[#E5A84B]/10 px-2 py-0.5 border border-[#E5A84B]/20 uppercase tracking-widest">
                    {demoState.toUpperCase()}
                  </span>
                  <button 
                    onClick={restartDemo}
                    className="p-1 hover:bg-[#17212B] text-[#A8AAA4] hover:text-[#F3F0E8] transition-colors rounded"
                    title="Restart Demo"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Workspace Contents */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-[#101820]">
                
                {/* Left col: Form Builder mock */}
                <div className="md:col-span-5 border-r border-[#2b3b4d]/40 p-4 font-mono text-xs flex flex-col justify-between overflow-y-auto">
                  <div>
                    <div className="text-[10px] text-[#A8AAA4] uppercase tracking-wider mb-4 font-bold">
                      [PORTFOLIO BUILDER]
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] text-gray-500 mb-1">NAME</div>
                        <div className="h-8 px-2.5 bg-[#0B1117] border border-[#2b3b4d]/40 flex items-center text-[#F3F0E8] relative">
                          {typedName}
                          {demoState === "typing" && typedName.length < "Dhanush Maddila".length && (
                            <span className="w-1.5 h-4 bg-[#E5A84B] ml-1 animate-pulse" />
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-gray-500 mb-1">ROLE</div>
                        <div className="h-8 px-2.5 bg-[#0B1117] border border-[#2b3b4d]/40 flex items-center text-[#F3F0E8]">
                          {typedRole}
                          {demoState === "typing" && typedName.length === "Dhanush Maddila".length && typedRole.length < "Software Engineer".length && (
                            <span className="w-1.5 h-4 bg-[#E5A84B] ml-1 animate-pulse" />
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-gray-500 mb-1">SKILLS</div>
                        <div className="flex flex-wrap gap-1 p-2 bg-[#0B1117] border border-[#2b3b4d]/40 min-h-[50px]">
                          {typedSkills.map((s, i) => (
                            <span key={i} className="bg-[#17212B] px-1.5 py-0.5 border border-[#2b3b4d]/30 text-[10px] text-[#E5A84B]">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[9px] text-gray-600 mt-4 border-t border-[#2b3b4d]/20 pt-2 font-mono">
                    DEMO — repository creation simulated
                  </div>
                </div>

                {/* Right col: Dynamic Workspace Outputs */}
                <div className="md:col-span-7 flex flex-col overflow-hidden relative">
                  
                  {/* Preview State Output */}
                  {(demoState === "typing" || demoState === "generating" || demoState === "previewReady") && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="bg-[#0B1117] px-3 py-1.5 border-b border-[#2b3b4d]/30 text-[10px] font-mono text-[#A8AAA4] flex justify-between items-center">
                        <span className="uppercase text-[9px] text-gray-500">STYLE: {activeTemplate.toUpperCase()}</span>
                        {demoState === "generating" && <span className="text-[#E5A84B] animate-pulse">GENERATING STYLE...</span>}
                      </div>
                      <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                        <PortfolioRenderer template={activeTemplate} data={currentPortfolio} />
                      </div>
                    </div>
                  )}

                  {/* Terminal State Output */}
                  {demoState === "repositoryBuilding" && (
                    <div className="flex-1 bg-[#0B1117] p-4 font-mono text-[11px] text-[#A8AAA4] overflow-y-auto space-y-1">
                      <div className="text-[10px] text-[#E5A84B] mb-2 uppercase tracking-widest border-b border-[#2b3b4d]/30 pb-1 flex items-center gap-1.5">
                        <TerminalIcon className="w-3.5 h-3.5" /> Terminal Execution
                      </div>
                      {terminalLines.map((line, i) => {
                        if (!line) return null;
                        return (
                          <div
                            key={i}
                            className={
                              line.startsWith("$")
                                ? "text-[#F3F0E8]"
                                : line.startsWith("✓")
                                ? "text-[#E5A84B]"
                                : "text-gray-500"
                            }
                          >
                            {line}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Git Directory / Repository Ready state */}
                  {demoState === "repositoryReady" && (
                    <div className="flex-1 bg-[#0B1117] p-4 font-mono text-xs text-[#A8AAA4] flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] text-[#E5A84B] border-b border-[#2b3b4d]/40 pb-2 mb-4 flex items-center justify-between">
                          <span>✓ REPOSITORY SYNCED</span>
                          <span>github.com/dhanush/portfolio</span>
                        </div>
                        <div className="space-y-2.5">
                          <div className="text-blue-400">📁 src/</div>
                          <div className="text-blue-400">📁 components/</div>
                          <div className="text-blue-400">📁 public/</div>
                          <div className="text-[#F3F0E8]">📄 package.json</div>
                          <div className="text-[#F3F0E8]">📄 README.md</div>
                          <div className="text-[#F3F0E8]">📄 next.config.ts</div>
                        </div>
                      </div>
                      <div className="bg-[#17212B] p-2.5 border border-[#2b3b4d]/40 text-[10px] text-[#A8AAA4]">
                        Repository compilation completed successfully. Pre-configured and ready to host.
                      </div>
                    </div>
                  )}

                  {/* Deployed State */}
                  {demoState === "deployed" && (
                    <div className="flex-1 bg-[#0B1117] p-6 flex flex-col justify-center items-center font-mono select-none">
                      <div className="w-12 h-12 rounded-full border-2 border-[#E5A84B] flex items-center justify-center text-[#E5A84B] mb-4">
                        ✓
                      </div>
                      <h3 className="text-[#F3F0E8] text-sm font-semibold mb-2">DEPLOYMENT COMPLETE</h3>
                      <p className="text-xs text-[#A8AAA4] mb-4 text-center max-w-xs">
                        Your custom developer portfolio is live at the staging URL below:
                      </p>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="text-xs text-[#E5A84B] underline border border-[#E5A84B]/20 bg-[#E5A84B]/5 px-4 py-2 hover:bg-[#E5A84B]/10 transition-colors"
                      >
                        dhanush.vercel.app
                      </a>
                    </div>
                  )}

                </div>
              </div>

              {/* Status footer bar */}
              <div className="bg-[#0B1117] px-4 py-2.5 border-t border-[#2b3b4d]/60 flex justify-between items-center text-[10px] font-mono text-gray-500">
                <div className="flex items-center gap-4">
                  <span className={demoState === "typing" || demoState === "generating" ? "text-[#E5A84B]" : ""}>
                    ● BUILD
                  </span>
                  <span className={demoState === "previewReady" ? "text-[#E5A84B]" : ""}>
                    ● PREVIEW
                  </span>
                  <span className={demoState === "repositoryBuilding" || demoState === "repositoryReady" ? "text-[#E5A84B]" : ""}>
                    ● REPOSITORY
                  </span>
                  <span className={demoState === "deployed" ? "text-[#E5A84B]" : ""}>
                    ● DEPLOYED
                  </span>
                </div>
                <span>100% CLIENT SIDE</span>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
