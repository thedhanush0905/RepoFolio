import React from "react";
import Link from "next/link";
import { ExternalLink, Trash2 } from "lucide-react";

export interface Portfolio {
  _id: string;
  name: string;
  template: string;
  status: "draft" | "generating" | "published" | "failed";
  repoUrl?: string;
  repoFullName?: string;
  updatedAt: string;
}

interface PortfolioCardProps {
  portfolio: Portfolio;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function PortfolioCard({ portfolio, onDelete, isDeleting }: PortfolioCardProps) {
  return (
    <div className="bg-[#0B1117] border border-[#17212B] p-6 rounded-sm flex flex-col justify-between space-y-6 hover:border-[#2b3b4d]/60 transition-colors">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-[#F3F0E8] font-bold text-base tracking-tight font-mono truncate max-w-[200px]" title={portfolio.name}>
            {portfolio.name}
          </h3>
          <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-sm border ${
            portfolio.status === "published" 
              ? "text-green-400 border-green-950 bg-green-950/20"
              : portfolio.status === "generating"
              ? "text-yellow-400 border-yellow-950 bg-yellow-950/20"
              : portfolio.status === "failed"
              ? "text-red-400 border-red-950 bg-red-950/20"
              : "text-gray-400 border-gray-950 bg-gray-950/20"
          }`}>
            {portfolio.status}
          </span>
        </div>
        <div className="text-[10px] text-gray-500 font-mono space-y-1">
          <div>TEMPLATE: <span className="text-[#A8AAA4] uppercase">{portfolio.template}</span></div>
          <div>LAST UPDATED: <span className="text-[#A8AAA4]">{new Date(portfolio.updatedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
          })}</span></div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#17212B] pt-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/create?id=${portfolio._id}`}
            className="bg-[#17212B] hover:bg-[#1e2a36] border border-[#2b3b4d]/40 text-[#F3F0E8] px-3.5 py-1.5 rounded-sm text-xs font-mono transition-colors"
          >
            Continue Editing
          </Link>
          {portfolio.repoUrl && (
            <a
              href={portfolio.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-mono text-[#E5A84B] hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Repo</span>
            </a>
          )}
        </div>
        <button
          disabled={isDeleting}
          onClick={() => onDelete(portfolio._id)}
          className="text-gray-500 hover:text-red-400 p-1.5 transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Delete portfolio"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
