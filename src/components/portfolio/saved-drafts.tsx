"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FolderGit2, Plus, Loader2 } from "lucide-react";
import PortfolioCard, { Portfolio } from "./portfolio-card";

export default function SavedDrafts() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        
        if (meRes.ok && meData.authenticated) {
          setIsAuthenticated(true);
          
          const portRes = await fetch("/api/portfolios");
          const portData = await portRes.json();
          if (portRes.ok && portData.success) {
            setPortfolios(portData.portfolios);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Failed to load saved drafts data:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

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

  // If not loaded yet, or not authenticated, don't render anything to keep the marketing view clean
  if (loading) {
    return null; // Silent load
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section id="saved-drafts" className="bg-[#0B1117] py-16 px-4 border-b border-[#17212B] select-none scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#17212B] pb-6 mb-8 gap-4">
          <div>
            <h2 className="text-[#F3F0E8] text-lg font-mono font-bold uppercase tracking-widest mb-1.5">
              SAVED DRAFTS
            </h2>
            <p className="text-xs text-[#A8AAA4] font-mono">
              Continue building where you left off.
            </p>
          </div>
          <Link
            href="/create"
            className="bg-[#E5A84B] hover:bg-[#E5A84B]/90 text-[#0B1117] font-mono text-xs px-4 py-2 font-bold tracking-wide transition-all rounded-sm flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Portfolio</span>
          </Link>
        </div>

        {portfolios.length === 0 ? (
          <div className="border border-[#17212B] rounded-sm py-12 px-6 text-center space-y-4 max-w-xl mx-auto bg-[#101820]/40">
            <FolderGit2 className="w-10 h-10 text-gray-600 mx-auto" />
            <div className="space-y-1 max-w-sm mx-auto">
              <p className="text-[#F3F0E8] text-xs font-mono uppercase tracking-wider font-bold">Nothing here yet</p>
              <p className="text-[11px] text-gray-500 font-mono">Create your first portfolio and it will appear here.</p>
            </div>
            <Link
              href="/create"
              className="inline-block bg-[#E5A84B] hover:bg-[#E5A84B]/90 text-[#0B1117] font-mono text-xs px-5 py-2 font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer"
            >
              Create portfolio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </section>
  );
}
