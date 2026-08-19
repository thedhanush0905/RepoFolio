"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Terminal, Sun, Moon } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  githubConnected: boolean;
  githubUsername?: string;
}

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (newTheme === "light") {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const handleLogout = async (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const handleDisconnectGitHub = async (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      const res = await fetch("/api/auth/github/disconnect", { method: "POST" });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Disconnect GitHub error", err);
    }
  };

  const handleScroll = (id: string) => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    if (window.location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${id}`);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "RP";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#101820]/90 backdrop-blur-md border-b border-[#17212B] select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Wordmark */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-mono text-lg font-bold tracking-tight text-[#F3F0E8] flex items-center gap-1.5">
              <Terminal className="w-5 h-5 text-[#E5A84B]" />
              REPOfolio
            </span>
            <span className="font-mono text-[9px] bg-[#17212B] text-[#A8AAA4] px-1.5 py-0.5 rounded border border-[#2b3b4d]/40">
              v0.1.0
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleScroll("how-it-works")}
              className="text-[#A8AAA4] hover:text-[#F3F0E8] transition-colors text-sm font-mono cursor-pointer bg-transparent border-0"
            >
              How it works
            </button>
            <button
              onClick={() => handleScroll("preview")}
              className="text-[#A8AAA4] hover:text-[#F3F0E8] transition-colors text-sm font-mono cursor-pointer bg-transparent border-0"
            >
              Preview
            </button>
            {user && (
              <button
                onClick={() => handleScroll("saved-drafts")}
                className="text-[#A8AAA4] hover:text-[#F3F0E8] transition-colors text-sm font-mono cursor-pointer bg-transparent border-0"
              >
                Saved Drafts
              </button>
            )}

            <span className="h-4 w-[1px] bg-[#17212B]" />

            <button
              onClick={toggleTheme}
              className="text-[#A8AAA4] hover:text-[#F3F0E8] transition-colors p-2 bg-transparent border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#E5A84B]/40 rounded-sm"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-[#E5A84B]" /> : <Moon className="w-4 h-4 text-[#E5A84B]" />}
            </button>

            <span className="h-4 w-[1px] bg-[#17212B]" />

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-[#A8AAA4] hover:text-[#F3F0E8] transition-colors text-sm font-mono cursor-pointer bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-[#E5A84B]/40 px-1 py-1 rounded-sm"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-[#2b3b4d]/40"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#17212B] border border-[#2b3b4d]/40 flex items-center justify-center text-[10px] font-bold text-[#E5A84B] font-mono">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <span className="max-w-[120px] truncate hidden lg:inline">{user.name}</span>
                  <span className="text-[10px] text-gray-500">▼</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-sm bg-[#0B1117] border border-[#17212B] shadow-xl z-50 py-2 divide-y divide-[#17212B]/60 animate-in fade-in slide-in-from-top-1 duration-100">
                    <div className="px-4 py-2.5 flex items-center gap-3">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border border-[#2b3b4d]/20"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#17212B] border border-[#2b3b4d]/20 flex items-center justify-center text-xs font-bold text-[#E5A84B] font-mono">
                          {getInitials(user.name)}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[#F3F0E8] truncate font-mono">{user.name}</span>
                        <span className="text-[10px] text-gray-500 truncate font-mono">{user.email}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      {user.githubConnected ? (
                        <div className="px-4 py-2 flex flex-col gap-1 min-w-0">
                          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">GitHub Connected</span>
                          <span className="text-xs font-mono text-[#E5A84B] truncate">@{user.githubUsername}</span>
                          <button
                            type="button"
                            onClick={handleDisconnectGitHub}
                            className="text-left text-[10px] font-mono text-red-400 hover:text-red-300 underline cursor-pointer mt-1 bg-transparent border-0 p-0 focus:outline-none"
                          >
                            Disconnect
                          </button>
                        </div>
                      ) : (
                        <a
                          href="/api/auth/github"
                          className="block px-4 py-2 text-xs font-mono text-[#A8AAA4] hover:text-[#F3F0E8] hover:bg-[#17212B]/40 transition-colors"
                        >
                          Connect GitHub
                        </a>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs font-mono text-gray-400 hover:text-red-400 hover:bg-[#17212B]/40 transition-colors cursor-pointer bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-red-400/20"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-[#A8AAA4] hover:text-[#F3F0E8] transition-colors text-sm font-mono"
              >
                Sign in
              </Link>
            )}
            <Link
              href="/create"
              className="bg-[#E5A84B] hover:bg-[#E5A84B]/90 text-[#0B1117] font-mono text-xs px-4 py-2 font-bold tracking-wide transition-all border border-transparent hover:border-[#E5A84B]/20 cursor-pointer"
            >
              Create portfolio
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-3">
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 text-[#A8AAA4] hover:text-[#F3F0E8] transition-colors text-sm font-mono cursor-pointer bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-[#E5A84B]/40 p-1 rounded-sm"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-[#2b3b4d]/40"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#17212B] border border-[#2b3b4d]/40 flex items-center justify-center text-[10px] font-bold text-[#E5A84B] font-mono">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <span className="text-[10px] text-gray-500">▼</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-sm bg-[#0B1117] border border-[#17212B] shadow-xl z-50 py-2 divide-y divide-[#17212B]/60 animate-in fade-in slide-in-from-top-1 duration-100">
                    <div className="px-4 py-2 flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#F3F0E8] truncate font-mono">{user.name}</span>
                      <span className="text-[10px] text-gray-500 truncate font-mono">{user.email}</span>
                    </div>

                    <div className="py-1">
                      {user.githubConnected ? (
                        <div className="px-4 py-2 flex flex-col gap-1 min-w-0">
                          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">GitHub Connected</span>
                          <span className="text-xs font-mono text-[#E5A84B] truncate">@{user.githubUsername}</span>
                          <button
                            type="button"
                            onClick={handleDisconnectGitHub}
                            className="text-left text-[10px] font-mono text-red-400 hover:text-red-300 underline cursor-pointer mt-1 bg-transparent border-0 p-0 focus:outline-none"
                          >
                            Disconnect
                          </button>
                        </div>
                      ) : (
                        <a
                          href="/api/auth/github"
                          className="block px-4 py-2 text-xs font-mono text-[#A8AAA4] hover:text-[#F3F0E8] hover:bg-[#17212B]/40 transition-colors"
                        >
                          Connect GitHub
                        </a>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs font-mono text-gray-400 hover:text-red-400 hover:bg-[#17212B]/40 transition-colors cursor-pointer bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-red-400/20"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={toggleTheme}
              className="text-[#A8AAA4] hover:text-[#F3F0E8] p-2 bg-transparent border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#E5A84B]/40 rounded-sm"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5 text-[#E5A84B]" /> : <Moon className="w-4.5 h-4.5 text-[#E5A84B]" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#A8AAA4] hover:text-[#F3F0E8] p-2 bg-transparent border-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-[#101820] border-t border-[#17212B] flex flex-col p-6 space-y-6 md:hidden">
          <button
            onClick={() => handleScroll("how-it-works")}
            className="text-left text-lg font-mono text-[#A8AAA4] hover:text-[#F3F0E8] bg-transparent border-0"
          >
            How it works
          </button>
          <button
            onClick={() => handleScroll("preview")}
            className="text-left text-lg font-mono text-[#A8AAA4] hover:text-[#F3F0E8] bg-transparent border-0"
          >
            Preview
          </button>
          {user && (
            <button
              onClick={() => handleScroll("saved-drafts")}
              className="text-left text-lg font-mono text-[#A8AAA4] hover:text-[#F3F0E8] bg-transparent border-0"
            >
              Saved Drafts
            </button>
          )}
          <hr className="border-[#17212B]" />
          {!user && (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left text-lg font-mono text-[#A8AAA4] hover:text-[#F3F0E8]"
            >
              Sign in
            </Link>
          )}
          <Link
            href="/create"
            onClick={() => setMobileMenuOpen(false)}
            className="bg-[#E5A84B] hover:bg-[#E5A84B]/90 text-[#0B1117] font-mono text-center font-bold py-3 tracking-wide"
          >
            Create portfolio
          </Link>
        </div>
      )}
    </>
  );
}
