"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Terminal } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch {}
  };

  const handleScroll = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A8AAA4] hover:text-[#F3F0E8] transition-colors text-sm font-mono"
            >
              GitHub
            </a>

            <span className="h-4 w-[1px] bg-[#17212B]" />

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-[#A8AAA4] hover:text-[#F3F0E8] transition-colors text-sm font-mono"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[#A8AAA4] hover:text-red-400 transition-colors text-sm font-mono cursor-pointer bg-transparent border-0"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-[#A8AAA4] hover:text-[#F3F0E8] transition-colors text-sm font-mono"
              >
                Sign in
              </Link>
            )}
            <Link
              href={user ? "/dashboard" : "/create"}
              className="bg-[#E5A84B] hover:bg-[#E5A84B]/90 text-[#0B1117] font-mono text-xs px-4 py-2 font-bold tracking-wide transition-all border border-transparent hover:border-[#E5A84B]/20 cursor-pointer"
            >
              Create portfolio
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
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
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-mono text-[#A8AAA4] hover:text-[#F3F0E8]"
          >
            GitHub
          </a>
          <hr className="border-[#17212B]" />
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left text-lg font-mono text-[#A8AAA4] hover:text-[#F3F0E8]"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-left text-lg font-mono text-[#A8AAA4] hover:text-red-400 bg-transparent border-0"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left text-lg font-mono text-[#A8AAA4] hover:text-[#F3F0E8]"
            >
              Sign in
            </Link>
          )}
          <Link
            href={user ? "/dashboard" : "/create"}
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
