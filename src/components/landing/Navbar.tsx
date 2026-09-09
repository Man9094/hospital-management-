"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePortal } from "@/context/PortalContext";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import {
  Cross,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Lock,
  PhoneCall
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openAuthModal } = usePortal();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { label: "Core Modules", href: "#modules" },
    { label: "Patient Journey", href: "#workflow" },
    { label: "Clinical EMR", href: "#clinical" },
    { label: "Bed Management", href: "#beds" },
    { label: "Security & ABDM", href: "#security" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-[#0B0F17]/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F6CBD] to-[#13C5DD] flex items-center justify-center text-white shadow-lg shadow-[#13C5DD]/20">
            <Cross className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-poppins font-black text-xl tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
              MEDCORE <span className="text-[#13C5DD] text-xs font-black px-1.5 py-0.5 rounded-md bg-[#13C5DD]/10 lowercase">hms</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
              Indian Hospital Operating System
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-extrabold tracking-wider uppercase text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#13C5DD] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <Link
              href="/app"
              className="px-5 py-2.5 rounded-2xl bg-[#13C5DD] text-[#1D2A4D] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#13C5DD]/25 hover:shadow-[#13C5DD]/40 hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>Hospital Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <button
                onClick={() => openAuthModal("login")}
                className="px-4 py-2.5 rounded-2xl text-xs font-black uppercase text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-[#13C5DD]" /> Staff Login
              </button>
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#13C5DD] to-[#0F6CBD] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#13C5DD]/25 hover:opacity-95 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <span>Request Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden p-6 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 space-y-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#13C5DD]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <Link
              href="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-[#13C5DD] text-[#1D2A4D] font-black text-xs uppercase text-center shadow-md"
            >
              Open Hospital Workspace
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
