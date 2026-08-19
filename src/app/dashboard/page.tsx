"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Terminal, 
  Plus, 
  Trash2, 
  Github, 
  LogOut, 
  FolderGit2, 
  ExternalLink,
  Loader2,
  AlertCircle,
  FileCode
} from "lucide-react";
import PortfolioCard from "@/components/portfolio/portfolio-card";

interface Portfolio {
  _id: string;
  name: string;
  template: string;
  status: "draft" | "generating" | "published" | "failed";
  repoUrl?: string;
  repoFullName?: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; githubConnected: boolean; githubUsername?: string } | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // 1. Fetch user profile
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      
      if (!meRes.ok || !meData.authenticated) {
        router.push("/login");
        return;
      }
      
      setUser(meData.user);

      // 2. Fetch portfolios
      const portRes = await fetch("/api/portfolios");
      const portData = await portRes.json();
      if (portRes.ok && portData.success) {
        setPortfolios(portData.portfolios);
      }
    } catch (err: any) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {}
  };

  const handleDisconnectGitHub = async () => {
    if (!confirm("Are you sure you want to disconnect your GitHub integration?")) return;
    setActionLoading("github");
    try {
      const res = await fetch("/api/auth/github/disconnect", { method: "POST" });
      if (res.ok) {
        setUser((prev) => prev ? { ...prev, githubConnected: false, githubUsername: undefined } : null);
      }
    } catch {
      alert("Failed to disconnect GitHub.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConnectGitHub = () => {
    window.location.href = "/api/auth/github";
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio? This action cannot be undone.")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/portfolios/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPortfolios((prev) => prev.filter((p) => p._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete portfolio.");
      }
    } catch {
      alert("An error occurred while deleting portfolio.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101820] text-[#A8AAA4] flex flex-col items-center justify-center font-mono">
        <Loader2 className="w-8 h-8 text-[#E5A84B] animate-spin mb-4" />
        <span>Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101820] text-[#A8AAA4] flex flex-col select-none font-sans">
      
      {/* Navbar */}
      <header className="h-16 border-b border-[#17212B] bg-[#0B1117] px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono text-base font-bold tracking-tight text-[#F3F0E8] flex items-center gap-1.5">
            <Terminal className="w-5 h-5 text-[#E5A84B]" />
            REPOfolio
          </span>
        </Link>
        <div className="flex items-center gap-6 text-xs font-mono">
          <span className="text-[#F3F0E8]">Welcome, {user?.name}</span>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-[#17212B] hover:bg-red-950/40 border border-[#2b3b4d]/40 text-[#A8AAA4] hover:text-[#F3F0E8] px-3 py-1.5 rounded-sm transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        
        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/40 border border-red-900/50 text-red-400 p-4 text-xs rounded-sm flex items-start gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Top Info & Integrations Card */}
        <section className="bg-[#0B1117] border border-[#17212B] p-6 rounded-sm grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-[#F3F0E8] font-bold font-mono text-sm uppercase tracking-wider mb-1">
              Account Integration
            </h2>
            <p className="text-xs text-gray-500 font-mono">
              Link your GitHub profile to deploy generated code repositories.
            </p>
          </div>
          <div className="flex justify-start md:justify-end">
            {user?.githubConnected ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#E5A84B] border border-[#E5A84B]/30 bg-[#E5A84B]/5 px-3 py-1.5 rounded-sm">
                  <Github className="w-4 h-4" />
                  <span>CONNECTED AS @{user.githubUsername}</span>
                </div>
                <button
                  disabled={actionLoading === "github"}
                  onClick={handleDisconnectGitHub}
                  className="bg-[#17212B] hover:bg-red-950/40 border border-[#2b3b4d]/40 text-gray-400 hover:text-white px-3 py-1.5 text-xs font-mono rounded-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === "github" ? "Disconnecting..." : "Disconnect"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectGitHub}
                className="bg-[#E5A84B] hover:bg-[#E5A84B]/95 text-[#0B1117] font-mono text-xs px-4 py-2.5 font-bold tracking-wider rounded-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Github className="w-4 h-4" />
                CONNECT GITHUB
              </button>
            )}
          </div>
        </section>

        {/* Portfolios list Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-baseline border-b border-[#17212B] pb-4">
            <h2 className="text-[#F3F0E8] text-sm font-mono font-bold uppercase tracking-widest">
              My Portfolios
            </h2>
            <Link
              href="/create"
              className="bg-[#E5A84B] hover:bg-[#E5A84B]/90 text-[#0B1117] font-mono text-xs px-4 py-2 font-bold tracking-wide transition-all rounded-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Portfolio</span>
            </Link>
          </div>

          {portfolios.length === 0 ? (
            <div className="bg-[#0B1117] border border-[#17212B] rounded-sm py-16 px-6 text-center space-y-4">
              <FolderGit2 className="w-12 h-12 text-gray-600 mx-auto" />
              <div className="space-y-1 max-w-sm mx-auto">
                <p className="text-[#F3F0E8] text-sm font-mono uppercase tracking-wider font-bold">No portfolios found</p>
                <p className="text-xs text-gray-500 font-mono">You haven&apos;t created a portfolio yet. Build your first site now.</p>
              </div>
              <Link
                href="/create"
                className="inline-block bg-[#E5A84B] hover:bg-[#E5A84B]/90 text-[#0B1117] font-mono text-xs px-6 py-2.5 font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer"
              >
                Create your first portfolio
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolios.map((port) => (
                <PortfolioCard 
                  key={port._id}
                  portfolio={port}
                  onDelete={handleDeletePortfolio}
                  isDeleting={actionLoading === port._id}
                />
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
