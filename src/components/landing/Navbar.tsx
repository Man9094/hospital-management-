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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#F7F6F3]/90 dark:bg-[#18141C]/90 border-b border-[#E3DFDB] dark:border-[#3B3041] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4A1F2B] flex items-center justify-center text-white shadow-md shadow-[#4A1F2B]/20">
            <Cross className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-sans font-bold text-xl tracking-tight text-[#292727] dark:text-[#FEF8F7] uppercase flex items-center gap-1.5">
              MEDCORE <span className="text-[#4A1F2B] dark:text-[#C08491] text-xs font-black px-1.5 py-0.5 rounded-md bg-[#F3E9EB] dark:bg-[#32293D] lowercase">hms</span>
            </span>
            <span className="text-[10px] text-[#686563] dark:text-[#D5C2C5] font-semibold block uppercase tracking-wider">
              Warm Clinical Enterprise Hospital OS
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-wider uppercase text-[#686563] dark:text-[#D5C2C5]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#4A1F2B] dark:hover:text-[#C08491] transition-colors"
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
              className="px-5 py-2.5 rounded-lg bg-[#4A1F2B] hover:bg-[#70404B] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#4A1F2B]/20 hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>Hospital Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login?mode=patient"
                className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase text-[#4A1F2B] dark:text-[#C08491] bg-[#F3E9EB] dark:bg-[#32293D] hover:opacity-90 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#4A1F2B] dark:text-[#C08491]" /> Patient Portal (OTP)
              </Link>
              <Link
                href="/login?mode=staff"
                className="px-5 py-2.5 rounded-lg bg-[#4A1F2B] hover:bg-[#70404B] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#4A1F2B]/20 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Staff & Doctor Login</span>
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
        <div className="lg:hidden p-6 bg-[#F7F6F3] dark:bg-[#18141C] border-b border-[#E3DFDB] dark:border-[#3B3041] space-y-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-3 text-xs font-bold uppercase tracking-wider text-[#686563] dark:text-[#D5C2C5]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#4A1F2B] dark:hover:text-[#C08491]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E3DFDB] dark:border-[#3B3041] flex flex-col gap-2">
            <Link
              href="/login?mode=patient"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-lg bg-[#F3E9EB] dark:bg-[#32293D] text-[#4A1F2B] dark:text-[#C08491] font-bold text-xs uppercase text-center shadow-sm"
            >
              Patient Portal (OTP)
            </Link>
            <Link
              href="/login?mode=staff"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-lg bg-[#4A1F2B] text-white font-bold text-xs uppercase text-center shadow-md"
            >
              Staff & Doctor Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
