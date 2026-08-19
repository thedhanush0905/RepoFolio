"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PortfolioData, DHANUSH_MOCK_DATA, MAYA_CHEN_DATA, ARJUN_RAO_DATA, SARAH_WILLIAMS_DATA, NOAH_KIM_DATA } from "@/lib/constants";
import PortfolioRenderer, { PortfolioTemplate } from "@/components/portfolio/portfolio-renderer";
import { 
  Laptop, 
  Tablet as TabletIcon, 
  Smartphone, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Terminal, 
  Globe, 
  FolderGit2, 
  Github, 
  Check,
  RefreshCw,
  Upload,
  Save
} from "lucide-react";

interface PersonaConfig {
  name: string;
  data: PortfolioData;
}

const PERSONAS: PersonaConfig[] = [
  { name: "Software Engineer", data: DHANUSH_MOCK_DATA },
  { name: "Product Designer", data: MAYA_CHEN_DATA },
  { name: "Photographer", data: ARJUN_RAO_DATA },
  { name: "Strategy Consultant", data: SARAH_WILLIAMS_DATA },
  { name: "Creative Tech", data: NOAH_KIM_DATA }
];

const TEMPLATES_LIST: { id: PortfolioTemplate; name: string }[] = [
  { id: "developer", name: "Developer" },
  { id: "editorial", name: "Editorial" },
  { id: "minimal", name: "Minimal" },
  { id: "creative", name: "Creative" },
  { id: "corporate", name: "Corporate" },
  { id: "experimental", name: "Experimental" }
];

export default function CreatePortfolioPage() {
  const router = useRouter();
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [selectedTemplate, setSelectedTemplate] = useState<PortfolioTemplate>("developer");

  // State Machine for Builder:
  // 'idle' | 'generating' | 'previewReady' | 'repositoryBuilding' | 'repositoryReady' | 'deployed' | 'error'
  const [buildState, setBuildState] = useState<
    "idle" | "generating" | "previewReady" | "repositoryBuilding" | "repositoryReady" | "deployed" | "error"
  >("idle");

  const [errorMessage, setErrorMessage] = useState("");
  const [generatedRepoUrl, setGeneratedRepoUrl] = useState("");
  const [generatedRepoFullName, setGeneratedRepoFullName] = useState("");
  const [isUpdateState, setIsUpdateState] = useState(false);

  // Typed PortfolioData as single source of truth
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(DHANUSH_MOCK_DATA);

  // Authenticated GitHub user session states
  const [githubUser, setGithubUser] = useState<{ login: string; avatarUrl?: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Persistence states
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const [portfolioName, setPortfolioName] = useState("My Portfolio");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch authentication status and portfolio data on component mount
  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          if (data.user.githubConnected) {
            setGithubUser({
              login: data.user.githubUsername || "",
              avatarUrl: data.user.avatarUrl || undefined,
            });
          }
        } else {
          router.push("/login");
        }
      })
      .catch(() => {})
      .finally(() => setCheckingAuth(false));

    // Check query params for existing portfolio ID
    const queryId = new URLSearchParams(window.location.search).get("id");
    if (queryId) {
      setPortfolioId(queryId);
      fetch(`/api/portfolios/${queryId}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.success && result.portfolio) {
            setPortfolioData(result.portfolio.data);
            setSelectedTemplate(result.portfolio.template);
            setPortfolioName(result.portfolio.name);
            if (result.portfolio.repoUrl) {
              setGeneratedRepoUrl(result.portfolio.repoUrl);
              setGeneratedRepoFullName(result.portfolio.repoFullName || "");
              setBuildState("deployed");
            }
          }
        })
        .catch(() => {});
    }
  }, [router]);

  const handleDisconnectGitHub = async () => {
    try {
      await fetch("/api/auth/github/disconnect", { method: "POST" });
      setGithubUser(null);
    } catch {}
  };

  const [skillInput, setSkillInput] = useState("");

  // Project item local forms
  const [newProj, setNewProj] = useState({ 
    title: "", 
    description: "", 
    techString: "", 
    year: "", 
    category: "", 
    featured: false, 
    order: 0,
    image: "" 
  });
  // Experience local forms
  const [newExp, setNewExp] = useState({ role: "", company: "", duration: "", description: "" });
  // Services local forms
  const [newService, setNewService] = useState({ title: "", description: "" });

  const loadPersona = (data: PortfolioData) => {
    setPortfolioData({ ...data });
  };

  // Profile picture uploader
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPortfolioData((prev) => ({
          ...prev,
          personal: { ...prev.personal, profileImage: base64String }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setPortfolioData((prev) => ({
      ...prev,
      personal: { ...prev.personal, profileImage: "" }
    }));
  };

  // Project cover image uploader
  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setNewProj((prev) => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setPortfolioData((prev) => ({
      ...prev,
      skills: [...prev.skills, skillInput.trim()]
    }));
    setSkillInput("");
  };

  const removeSkill = (index: number) => {
    setPortfolioData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    if (!newProj.title.trim()) return;
    setPortfolioData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: newProj.title.trim(),
          description: newProj.description.trim(),
          tech: newProj.techString.split(",").map((s) => s.trim()).filter(Boolean),
          year: newProj.year.trim() || "2026",
          category: newProj.category.trim() || "Project",
          featured: newProj.featured,
          order: Number(newProj.order) || prev.projects.length + 1,
          image: newProj.image
        }
      ]
    }));
    setNewProj({ title: "", description: "", techString: "", year: "", category: "", featured: false, order: 0, image: "" });
  };

  const removeProject = (index: number) => {
    const proj = portfolioData.projects[index];
    if (proj.image?.startsWith("blob:")) {
      URL.revokeObjectURL(proj.image);
    }
    setPortfolioData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    if (!newExp.role.trim() || !newExp.company.trim()) return;
    setPortfolioData((prev) => ({
      ...prev,
      experience: [...prev.experience, { ...newExp }]
    }));
    setNewExp({ role: "", company: "", duration: "", description: "" });
  };

  const removeExperience = (index: number) => {
    setPortfolioData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Services logic
  const addService = () => {
    if (!newService.title.trim()) return;
    setPortfolioData((prev) => ({
      ...prev,
      services: [...(prev.services || []), { ...newService }]
    }));
    setNewService({ title: "", description: "" });
  };

  const removeService = (index: number) => {
    setPortfolioData((prev) => ({
      ...prev,
      services: (prev.services || []).filter((_, i) => i !== index)
    }));
  };

  const handleSaveDraft = async () => {
    try {
      setActionLoading("save-draft");
      let currentId = portfolioId;
      const saveRes = await fetch(currentId ? `/api/portfolios/${currentId}` : "/api/portfolios", {
        method: currentId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: portfolioName,
          template: selectedTemplate,
          data: portfolioData,
          status: "draft",
        }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) {
        throw new Error(saveData.error || "Failed to save draft.");
      }

      if (!currentId && saveData.portfolio) {
        currentId = saveData.portfolio._id;
        setPortfolioId(currentId);
        const newUrl = `${window.location.pathname}?id=${currentId}`;
        window.history.replaceState({ path: newUrl }, "", newUrl);
      }
      alert("Draft saved successfully!");
    } catch (err: any) {
      alert("Error saving draft: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // State-driven Simulation runner with database persistence integration
  const handleGenerate = async () => {
    if (!githubUser || !githubUser.login) {
      setBuildState("error");
      setErrorMessage("Please connect your GitHub account before generating a repository.");
      return;
    }

    setBuildState("generating");
    setErrorMessage("");

    try {
      // 1. Save or update the portfolio in the database with "generating" status
      let currentId = portfolioId;
      const saveRes = await fetch(currentId ? `/api/portfolios/${currentId}` : "/api/portfolios", {
        method: currentId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: portfolioName,
          template: selectedTemplate,
          data: portfolioData,
          status: "generating",
        }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) {
        throw new Error(saveData.error || "Failed to save portfolio state.");
      }

      if (!currentId && saveData.portfolio) {
        currentId = saveData.portfolio._id;
        setPortfolioId(currentId);
        const newUrl = `${window.location.pathname}?id=${currentId}`;
        window.history.replaceState({ path: newUrl }, "", newUrl);
      }

      // Simulate layout setup step first
      await new Promise((resolve) => setTimeout(resolve, 800));
      setBuildState("repositoryBuilding");

      // 2. Build repository
      const response = await fetch("/api/github/repository", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template: selectedTemplate,
          data: portfolioData,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // Update portfolio status to failed in database
        await fetch(`/api/portfolios/${currentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "failed" }),
        }).catch(() => {});
        
        setBuildState("error");
        setErrorMessage(result.error || "Failed to generate repository.");
        return;
      }

      // 3. Update portfolio status to published and save repo info
      await fetch(`/api/portfolios/${currentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "published",
          repoUrl: result.repository.htmlUrl,
          repoFullName: `${result.repository.owner}/${result.repository.name}`,
        }),
      }).catch(() => {});

      setGeneratedRepoUrl(result.repository.htmlUrl);
      setGeneratedRepoFullName(`${result.repository.owner}/${result.repository.name}`);
      setIsUpdateState(!!result.isUpdate);
      setBuildState("deployed");
    } catch (err: any) {
      if (portfolioId) {
        await fetch(`/api/portfolios/${portfolioId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "failed" }),
        }).catch(() => {});
      }
      setBuildState("error");
      setErrorMessage(err.message || "An unexpected error occurred during generation.");
    }
  };

  const getViewportWidth = () => {
    switch (viewport) {
      case "mobile":
        return "max-w-[370px]";
      case "tablet":
        return "max-w-[680px]";
      default:
        return "max-w-full";
    }
  };

  return (
    <div className="min-h-screen bg-[#101820] flex flex-col font-sans select-none">
      
      {/* Mini top banner header */}
      <header className="h-14 border-b border-[#17212B] bg-[#0B1117] px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xs font-mono text-[#A8AAA4] hover:text-[#F3F0E8]">
          <ArrowLeft className="w-4 h-4 text-[#E5A84B]" />
          <span>BACK TO HOME</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#F3F0E8] font-bold hidden sm:inline">
            REPOfolio Creator:
          </span>
          <input
            type="text"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            className="bg-[#101820] border border-[#2b3b4d]/40 text-[#F3F0E8] font-mono text-xs px-2 py-1 rounded-sm focus:outline-none focus:border-[#E5A84B] max-w-[150px]"
            placeholder="Portfolio Name"
          />
          <button
            onClick={handleSaveDraft}
            disabled={actionLoading === "save-draft"}
            className="flex items-center gap-1 bg-[#17212B] hover:bg-[#1e2a36] border border-[#2b3b4d]/40 text-gray-300 hover:text-white px-2.5 py-1 text-[9px] uppercase font-bold cursor-pointer rounded-sm transition-all disabled:opacity-50"
          >
            <Save className="w-3 h-3 text-[#E5A84B]" />
            <span>Save Draft</span>
          </button>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#A8AAA4]">
          {!checkingAuth && (
            <>
              {githubUser ? (
                <div className="flex items-center gap-3">
                  <span className="text-[#E5A84B] text-[10px] uppercase font-bold tracking-wider">
                    GITHUB CONNECTED: @{githubUser.login}
                  </span>
                  <button
                    onClick={handleDisconnectGitHub}
                    className="bg-[#17212B] hover:bg-red-900/40 border border-[#2b3b4d]/40 text-gray-300 hover:text-white px-2.5 py-1 text-[9px] uppercase font-bold cursor-pointer rounded-sm transition-all"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <a
                  href="/api/auth/github"
                  className="bg-[#E5A84B] hover:bg-[#E5A84B]/90 text-[#0B1117] px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm transition-all"
                >
                  Connect GitHub
                </a>
              )}
            </>
          )}
          <span className="text-[10px] text-gray-500 uppercase">BUILD MODE</span>
        </div>
      </header>

      {/* Visual Template Selector Thumbnails Area */}
      <section className="bg-[#0B1117] p-6 border-b border-[#17212B]">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-4">
            <h2 className="text-sm font-bold font-mono text-[#F3F0E8] tracking-wider uppercase mb-1">
              Choose your style.
            </h2>
            <p className="text-[11px] font-mono text-[#A8AAA4]">
              Your content stays yours. The design changes around it.
            </p>
          </div>
          
          {/* Miniature live preview selector blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {TEMPLATES_LIST.map((t) => {
              const isActive = selectedTemplate === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`border text-left relative flex flex-col justify-between overflow-hidden cursor-pointer h-24 p-2 transition-all ${
                    isActive 
                      ? "border-[#E5A84B] bg-[#E5A84B]/5" 
                      : "border-[#2b3b4d]/40 bg-[#101820] hover:border-gray-500"
                  }`}
                >
                  {/* Miniature rendered output utilizing scaled rendering */}
                  <div className="absolute inset-0 origin-top-left scale-[0.25] w-[400%] h-[400%] pointer-events-none opacity-40 select-none overflow-hidden">
                    <PortfolioRenderer template={t.id} data={portfolioData} />
                  </div>
                  <div className="relative z-10 font-mono text-[9px] text-[#A8AAA4] uppercase bg-black/60 px-1.5 py-0.5 rounded-sm w-fit border border-white/5">
                    {t.name}
                  </div>
                  {isActive && (
                    <span className="absolute bottom-2 right-2 text-[#E5A84B] text-[10px] font-bold">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Workspace split panel */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Column: Form Settings config */}
        <div className="w-full lg:w-[460px] border-r border-[#17212B] bg-[#070c11] p-6 overflow-y-auto max-h-[calc(100vh-10rem)] text-xs font-sans no-scrollbar">
          
          {/* Persona selector seeds */}
          <div className="mb-6 bg-[#0B1117] p-3 border border-[#2b3b4d]/30 rounded-sm">
            <span className="text-[10px] text-[#A8AAA4] uppercase tracking-wider block mb-2 font-mono">
              Seed Profile Template
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PERSONAS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => loadPersona(p.data)}
                  className="bg-[#101820] hover:bg-[#17212B] border border-[#2b3b4d]/30 px-2.5 py-1 text-[10px] text-gray-300 transition-colors cursor-pointer rounded-sm"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 border-b border-[#2b3b4d]/30 pb-3">
            <span className="text-xs font-mono font-bold tracking-widest text-[#F3F0E8] uppercase">Portfolio Configuration</span>
          </div>

          <div className="space-y-6">
            
            {/* Personal Details */}
            <div className="space-y-4">
              <span className="text-[#E5A84B] text-[10px] uppercase font-mono tracking-widest block border-b border-[#2b3b4d]/10 pb-1">
                Personal Details
              </span>
              
              {/* Photo Uploader */}
              <div className="space-y-1.5">
                <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">Profile Photo</label>
                {portfolioData.personal.profileImage ? (
                  <div className="flex items-center justify-between bg-[#0B1117] p-2 border border-[#2b3b4d]/30 rounded-sm">
                    <div className="flex items-center gap-3">
                      <img 
                        src={portfolioData.personal.profileImage} 
                        alt="Profile" 
                        className="w-9 h-9 object-cover rounded-sm border border-[#2b3b4d]/30"
                      />
                      <span className="text-[10px] text-gray-400 font-mono">Portrait active</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={removeProfileImage}
                      className="text-red-400 hover:text-red-300 font-mono text-[10px] uppercase cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="border border-dashed border-[#2b3b4d]/50 bg-[#0B1117] hover:bg-[#0B1117]/80 p-5 text-center relative hover:border-[#E5A84B]/40 transition-all rounded-sm group cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleProfileImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-4 h-4 mx-auto text-gray-500 mb-1 group-hover:text-[#E5A84B] transition-colors" />
                    <span className="text-[10px] text-gray-400 font-mono">Add portrait (JPG / PNG)</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={portfolioData.personal.name}
                  onChange={(e) => setPortfolioData({
                    ...portfolioData,
                    personal: { ...portfolioData.personal, name: e.target.value }
                  })}
                  className="w-full bg-[#0B1117] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">Professional Role</label>
                <input
                  type="text"
                  value={portfolioData.personal.role}
                  onChange={(e) => setPortfolioData({
                    ...portfolioData,
                    personal: { ...portfolioData.personal, role: e.target.value }
                  })}
                  className="w-full bg-[#0B1117] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">Availability</label>
                <div className="relative">
                  <select
                    value={portfolioData.personal.availability || ""}
                    onChange={(e) => setPortfolioData({
                      ...portfolioData,
                      personal: { ...portfolioData.personal, availability: e.target.value }
                    })}
                    className="w-full bg-[#0B1117] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">None</option>
                    <option value="Available for work">Available for work</option>
                    <option value="Open to opportunities">Open to opportunities</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Not currently available">Not currently available</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500 font-mono text-[8px]">
                    ▼
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">Location</label>
                <input
                  type="text"
                  value={portfolioData.personal.location}
                  onChange={(e) => setPortfolioData({
                    ...portfolioData,
                    personal: { ...portfolioData.personal, location: e.target.value }
                  })}
                  className="w-full bg-[#0B1117] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">GitHub Username</label>
                <input
                  type="text"
                  value={portfolioData.personal.github}
                  onChange={(e) => setPortfolioData({
                    ...portfolioData,
                    personal: { ...portfolioData.personal, github: e.target.value }
                  })}
                  className="w-full bg-[#0B1117] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">LinkedIn Profile</label>
                <input
                  type="text"
                  value={portfolioData.personal.linkedin}
                  onChange={(e) => setPortfolioData({
                    ...portfolioData,
                    personal: { ...portfolioData.personal, linkedin: e.target.value }
                  })}
                  className="w-full bg-[#0B1117] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">Email Address</label>
                <input
                  type="text"
                  value={portfolioData.personal.email || ""}
                  onChange={(e) => setPortfolioData({
                    ...portfolioData,
                    personal: { ...portfolioData.personal, email: e.target.value }
                  })}
                  className="w-full bg-[#0B1117] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">Short Biography</label>
                <textarea
                  rows={2}
                  value={portfolioData.personal.bio}
                  onChange={(e) => setPortfolioData({
                    ...portfolioData,
                    personal: { ...portfolioData.personal, bio: e.target.value }
                  })}
                  className="w-full bg-[#0B1117] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors resize-none"
                />
              </div>
            </div>

            {/* Services Offering section */}
            <div className="space-y-4 pt-4 border-t border-[#2b3b4d]/20">
              <span className="text-[#E5A84B] text-[10px] uppercase font-mono tracking-widest block">
                Services & Capabilities
              </span>
              <div className="bg-[#0B1117] p-3 border border-[#2b3b4d]/30 rounded-sm space-y-2.5">
                <input 
                  type="text" 
                  placeholder="Service Title (e.g. UI/UX)" 
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  className="w-full bg-[#101820] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                />
                <input 
                  type="text" 
                  placeholder="Short Description" 
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full bg-[#101820] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                />
                <button
                  type="button"
                  onClick={addService}
                  className="w-full bg-[#17212B] hover:bg-[#2b3b4d] border border-[#2b3b4d]/40 py-1.5 rounded-sm font-mono text-[10px] tracking-wider text-[#F3F0E8] cursor-pointer transition-colors"
                >
                  ADD SERVICE
                </button>
              </div>
              <div className="space-y-1.5">
                {(portfolioData.services || []).map((ser, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#0B1117] p-2 border border-[#2b3b4d]/20 rounded-sm">
                    <div>
                      <div className="font-bold text-[#F3F0E8] text-[11px]">{ser.title}</div>
                      <div className="text-[9px] text-gray-500 truncate max-w-[280px]">{ser.description}</div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeService(i)}
                      className="text-gray-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Toolkit */}
            <div className="space-y-4 pt-4 border-t border-[#2b3b4d]/20">
              <span className="text-[#E5A84B] text-[10px] uppercase font-mono tracking-widest block">
                Skills Toolkit
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Next.js"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  className="flex-1 bg-[#0B1117] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-[#17212B] hover:bg-[#2b3b4d] border border-[#2b3b4d]/40 px-3 rounded-sm text-[#F3F0E8] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {portfolioData.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-[#0B1117] border border-[#2b3b4d]/20 text-[#A8AAA4] px-2 py-0.5 rounded-sm flex items-center gap-1.5 text-[10px]"
                  >
                    <span>{skill}</span>
                    <button 
                      type="button" 
                      onClick={() => removeSkill(index)}
                      className="text-gray-500 hover:text-red-400 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Projects list builder */}
            <div className="space-y-4 pt-4 border-t border-[#2b3b4d]/20">
              <span className="text-[#E5A84B] text-[10px] uppercase font-mono tracking-widest block">
                Projects
              </span>
              
              <div className="bg-[#0B1117] p-3 border border-[#2b3b4d]/30 rounded-sm space-y-2.5">
                
                {/* Cover upload */}
                <div className="space-y-1">
                  <label className="block text-gray-400 text-[9px] font-mono uppercase tracking-wider">Cover Image</label>
                  {newProj.image ? (
                    <div className="flex items-center justify-between bg-[#101820] p-2 border border-[#2b3b4d]/30 rounded-sm">
                      <span className="text-[10px] text-[#E5A84B] font-mono truncate max-w-[200px]">Cover Loaded</span>
                      <button 
                        type="button" 
                        onClick={() => setNewProj((prev) => ({ ...prev, image: "" }))}
                        className="text-red-400 font-mono text-[9px] uppercase cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="border border-dashed border-[#2b3b4d]/50 bg-[#101820] hover:bg-[#101820]/80 p-2.5 text-center relative hover:border-[#E5A84B]/40 transition-all rounded-sm group cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleProjectImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <span className="text-[9px] text-[#A8AAA4] font-mono group-hover:text-[#E5A84B] transition-colors">+ Select Cover</span>
                    </div>
                  )}
                </div>

                <input 
                  type="text" 
                  placeholder="Project Name" 
                  value={newProj.title}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                  className="w-full bg-[#101820] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                />
                <input 
                  type="text" 
                  placeholder="Description" 
                  value={newProj.description}
                  onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                  className="w-full bg-[#101820] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                />
                <input 
                  type="text" 
                  placeholder="Tech (comma separated)" 
                  value={newProj.techString}
                  onChange={(e) => setNewProj({ ...newProj, techString: e.target.value })}
                  className="w-full bg-[#101820] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Year (e.g. 2026)" 
                    value={newProj.year}
                    onChange={(e) => setNewProj({ ...newProj, year: e.target.value })}
                    className="w-full bg-[#101820] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                  />
                  <input 
                    type="text" 
                    placeholder="Category" 
                    value={newProj.category}
                    onChange={(e) => setNewProj({ ...newProj, category: e.target.value })}
                    className="w-full bg-[#101820] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 items-center">
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="checkbox" 
                      id="featured-check"
                      checked={newProj.featured}
                      onChange={(e) => setNewProj({ ...newProj, featured: e.target.checked })}
                      className="accent-[#E5A84B]"
                    />
                    <label htmlFor="featured-check" className="text-[10px] text-gray-400 font-mono">Featured?</label>
                  </div>
                  <input 
                    type="number" 
                    placeholder="Order (e.g. 1)" 
                    value={newProj.order || ""}
                    onChange={(e) => setNewProj({ ...newProj, order: Number(e.target.value) })}
                    className="w-full bg-[#101820] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={addProject}
                  className="w-full bg-[#17212B] hover:bg-[#2b3b4d] border border-[#2b3b4d]/40 py-1.5 rounded-sm font-mono text-[10px] tracking-wider text-[#F3F0E8] cursor-pointer transition-colors"
                >
                  ADD PROJECT
                </button>
              </div>

              <div className="space-y-1.5">
                {portfolioData.projects.map((p, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#0B1117] p-2 border border-[#2b3b4d]/20 rounded-sm">
                    <div>
                      <div className="font-bold text-[#F3F0E8] text-[11px]">
                        {p.title} {p.featured && <span className="text-[#E5A84B] text-[9px] font-mono">★</span>}
                      </div>
                      <div className="text-[9px] text-gray-500">Order: {p.order || i + 1} // {p.category}</div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeProject(i)}
                      className="text-gray-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience list builder */}
            <div className="space-y-4 pt-4 border-t border-[#2b3b4d]/20 mb-8">
              <span className="text-[#E5A84B] text-[10px] uppercase font-mono tracking-widest block">
                Work Experience
              </span>
              
              <div className="bg-[#0B1117] p-3 border border-[#2b3b4d]/30 rounded-sm space-y-2.5">
                <input 
                  type="text" 
                  placeholder="Role Title" 
                  value={newExp.role}
                  onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                  className="w-full bg-[#101820] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                />
                <input 
                  type="text" 
                  placeholder="Company / Inst." 
                  value={newExp.company}
                  onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                  className="w-full bg-[#101820] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                />
                <input 
                  type="text" 
                  placeholder="Duration (e.g. 2024 - Present)" 
                  value={newExp.duration}
                  onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                  className="w-full bg-[#101820] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors"
                />
                <textarea 
                  rows={2}
                  placeholder="Duties description" 
                  value={newExp.description}
                  onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                  className="w-full bg-[#101820] border border-[#2b3b4d]/30 rounded-sm px-3 py-1.5 text-xs text-[#F3F0E8] outline-none focus:border-[#E5A84B] transition-colors resize-none"
                />
                <button
                  type="button"
                  onClick={addExperience}
                  className="w-full bg-[#17212B] hover:bg-[#2b3b4d] border border-[#2b3b4d]/40 py-1.5 rounded-sm font-mono text-[10px] tracking-wider text-[#F3F0E8] cursor-pointer transition-colors"
                >
                  ADD EXPERIENCE
                </button>
              </div>

              <div className="space-y-1.5">
                {portfolioData.experience.map((exp, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#0B1117] p-2 border border-[#2b3b4d]/20 rounded-sm">
                    <div>
                      <div className="font-bold text-[#F3F0E8] text-[11px]">{exp.role} @ {exp.company}</div>
                      <div className="text-[10px] text-gray-500">{exp.duration}</div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeExperience(i)}
                      className="text-gray-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <div className="pt-4 border-t border-[#2b3b4d]/20">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={buildState !== "idle" && buildState !== "error"}
                className={`w-full py-3.5 font-mono font-bold text-center text-xs tracking-wider transition-all border cursor-pointer rounded-sm ${
                  buildState === "idle" || buildState === "error"
                    ? "bg-[#E5A84B] hover:bg-[#E5A84B]/95 text-[#0B1117] border-transparent"
                    : "bg-[#17212B] border-[#2b3b4d]/30 text-[#A8AAA4] cursor-not-allowed"
                }`}
              >
                {buildState === "idle" || buildState === "error"
                  ? (isUpdateState ? "UPDATE PORTFOLIO →" : "GENERATE PORTFOLIO →")
                  : "BUILD IN PROGRESS..."}
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Live responsive Preview mockup container */}
        <div className="flex-1 bg-[#101820] p-6 flex flex-col justify-between overflow-hidden relative">
          
          {/* Viewport & status dashboard */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 select-none">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#A8AAA4] uppercase">2. Render Preview</span>
              <span className="h-3 w-[1px] bg-[#17212B]" />
              <span className="font-mono text-[10px] text-gray-500 uppercase">
                layout style: {selectedTemplate}
              </span>
            </div>

            {/* Viewport controllers */}
            <div className="flex gap-1 bg-[#0B1117] p-1 border border-[#2b3b4d]/40 rounded-sm select-none">
              <button
                onClick={() => setViewport("desktop")}
                className={`p-1.5 rounded-sm transition-all cursor-pointer ${
                  viewport === "desktop" ? "bg-[#E5A84B] text-[#0B1117]" : "text-[#A8AAA4] hover:text-[#F3F0E8]"
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport("tablet")}
                className={`p-1.5 rounded-sm transition-all cursor-pointer ${
                  viewport === "tablet" ? "bg-[#E5A84B] text-[#0B1117]" : "text-[#A8AAA4] hover:text-[#F3F0E8]"
                }`}
              >
                <TabletIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport("mobile")}
                className={`p-1.5 rounded-sm transition-all cursor-pointer ${
                  viewport === "mobile" ? "bg-[#E5A84B] text-[#0B1117]" : "text-[#A8AAA4] hover:text-[#F3F0E8]"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Browser simulation container */}
          <div className="flex-1 bg-[#0B1117] border border-[#2b3b4d]/60 rounded-sm overflow-hidden flex flex-col relative min-h-[400px]">
            
            {/* Browser URL Header */}
            <div className="bg-[#0B1117] px-4 py-2 border-b border-[#2b3b4d]/40 flex items-center justify-between text-[10px] font-mono text-[#A8AAA4]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500/60" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <span className="w-2 h-2 rounded-full bg-green-500/60" />
                <span className="h-3 w-[1px] bg-[#2b3b4d]/40 ml-2" />
                <span className="bg-[#101820] border border-[#2b3b4d]/40 px-2.5 py-0.5 rounded text-[9px] text-gray-500">
                  {buildState === "deployed" ? `${portfolioData.personal.github || "user"}.vercel.app` : "localhost:3000"}
                </span>
              </div>
              <span className="text-[9px] text-gray-600">DEMO — repository creation simulated</span>
            </div>

            {/* Workspace dynamic contents */}
            <div className="flex-grow overflow-y-auto p-4 flex justify-center items-start relative bg-[#101820]">
              <div className={`w-full ${getViewportWidth()} transition-all duration-300 min-h-[360px] border border-[#2b3b4d]/20 bg-[#17212B]`}>
                <PortfolioRenderer template={selectedTemplate} data={portfolioData} previewMode={viewport} />
              </div>

              {/* Simulation status overlays */}
              {buildState !== "idle" && buildState !== "deployed" && (
                <div className="absolute inset-0 bg-[#0B1117]/90 flex flex-col justify-center items-center p-6 text-center font-mono">
                  
                  {/* GENERATING state */}
                  {buildState === "generating" && (
                    <div className="space-y-4 max-w-xs">
                      <div className="w-10 h-10 border-2 border-t-[#E5A84B] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
                      <h3 className="text-[#F3F0E8] text-xs font-semibold uppercase tracking-wider">Generating portfolio...</h3>
                      <p className="text-[10px] text-[#A8AAA4] leading-relaxed">Parsing structured data properties, evaluating assets, compiling layouts...</p>
                    </div>
                  )}

                  {/* PREVIEW READY state */}
                  {buildState === "previewReady" && (
                    <div className="space-y-3 max-w-xs">
                      <div className="w-8 h-8 rounded-full bg-[#E5A84B]/10 border border-[#E5A84B] flex items-center justify-center text-[#E5A84B] mx-auto">
                        <Check className="w-4 h-4" />
                      </div>
                      <h3 className="text-[#F3F0E8] text-xs font-semibold uppercase tracking-wider">Preview generated</h3>
                      <p className="text-[10px] text-[#A8AAA4] leading-relaxed">Instantiating Next.js layouts, exporting route directory maps...</p>
                    </div>
                  )}

                  {/* REPO BUILDING state */}
                  {buildState === "repositoryBuilding" && (
                    <div className="space-y-4 w-full max-w-md text-left bg-[#101820] border border-[#2b3b4d]/40 p-4 font-mono text-[10px] text-[#A8AAA4] max-h-[220px] overflow-y-auto rounded-sm">
                      <div className="text-[9px] text-[#E5A84B] uppercase tracking-wider mb-2 border-b border-[#2b3b4d]/40 pb-1 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" /> Repository Deployment
                      </div>
                      <div className="space-y-1">
                        <div>$ GET /user (identifying OAuth login profile)</div>
                        <div className="text-gray-500">Authenticated user retrieved successfully.</div>
                        <div>$ POST /user/repos (creating repository on GitHub)</div>
                        <div className="text-gray-500">Repository created. Pushing code objects...</div>
                        <div className="text-[#E5A84B] animate-pulse">Synchronizing project contents...</div>
                      </div>
                    </div>
                  )}

                  {/* ERROR state */}
                  {buildState === "error" && (
                    <div className="space-y-4 max-w-sm font-mono text-center">
                      <div className="w-8 h-8 rounded-full bg-red-900/10 border border-red-500 flex items-center justify-center text-red-500 mx-auto">
                        ×
                      </div>
                      <h3 className="text-red-500 text-xs font-semibold uppercase tracking-wider">Repository Generation Failed</h3>
                      <p className="text-[10px] text-[#A8AAA4] leading-relaxed">
                        {errorMessage || "Verification check failed. Your existing repositories were not modified."}
                      </p>
                      <button
                        onClick={() => setBuildState("idle")}
                        className="bg-[#17212B] hover:bg-[#2b3b4d] border border-[#2b3b4d]/40 px-3 py-1.5 text-[10px] text-gray-300 rounded-sm cursor-pointer"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* Final Deployed state overlay dashboard */}
              {buildState === "deployed" && (
                <div className="absolute top-4 right-4 bg-[#0B1117]/95 border border-[#E5A84B]/40 p-4 max-w-xs font-mono text-[11px] text-[#A8AAA4] rounded-sm shadow-xl z-10">
                  <div className="flex items-center gap-2 mb-2 text-[#E5A84B] font-bold">
                    <Globe className="w-4 h-4" />
                    <span>{isUpdateState ? "✓ PORTFOLIO UPDATED" : "✓ PORTFOLIO GENERATED"}</span>
                  </div>
                  <p className="text-[10px] mb-2 leading-relaxed">
                    {isUpdateState
                      ? "Standalone files updated in your existing GitHub repository."
                      : "Repository created in your GitHub account and pushed successfully."}
                  </p>
                  <div className="bg-[#101820] p-2 border border-[#2b3b4d]/30 text-[9px] text-[#A8AAA4] mb-3 space-y-1">
                    <div className="text-white font-bold truncate">{generatedRepoFullName}</div>
                    <div className="text-gray-500">Clone and deploy to Vercel, Netlify, or GitHub Pages. Run &ldquo;vercel&rdquo; inside the repository directory.</div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={generatedRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#17212B] hover:bg-[#2b3b4d] border border-[#2b3b4d]/40 px-2 py-1 flex items-center gap-1.5 text-gray-300 hover:text-white rounded-sm text-[10px] uppercase font-bold transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Open GitHub Repo</span>
                    </a>
                    <button
                      onClick={() => setBuildState("idle")}
                      className="bg-[#E5A84B]/10 hover:bg-[#E5A84B]/20 text-[#E5A84B] border border-[#E5A84B]/30 px-2.5 py-1 cursor-pointer rounded-sm text-[10px] uppercase font-bold transition-colors"
                    >
                      Re-config
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </main>

    </div>
  );
}
