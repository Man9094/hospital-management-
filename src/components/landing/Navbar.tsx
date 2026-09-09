"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePortal, ROLES, RoleType } from "@/context/PortalContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import PatientAdmissionModal from "@/components/modals/PatientAdmissionModal";
import {
  Phone,
  Mail,
  Globe,
  Share2,
  MessageCircle,
  Send,
  ChevronDown,
  User,
  Sparkles,
  Menu,
  X,
  Bed,
  Cross
} from "lucide-react";

export default function Navbar() {
  const { openAuthModal, activeRole, setActiveRole } = usePortal();
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Medinova Topbar */}
      <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 py-2 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Phone & Email */}
          <div className="flex items-center gap-6">
            <a href="tel:+9118006332673" className="flex items-center gap-1.5 hover:text-[#13C5DD] transition-colors font-medium">
              <Phone className="w-3.5 h-3.5 text-[#13C5DD]" />
              <span>+91 1800-MEDCORE (6332673)</span>
            </a>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <a href="mailto:info@medcore.in" className="flex items-center gap-1.5 hover:text-[#13C5DD] transition-colors font-medium">
              <Mail className="w-3.5 h-3.5 text-[#13C5DD]" />
              <span>support@medcore.in</span>
            </a>
          </div>

          {/* Socials & Language */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-slate-500">
              <a href="#" className="hover:text-[#13C5DD] transition-colors"><Globe className="w-3.5 h-3.5" /></a>
              <a href="#" className="hover:text-[#13C5DD] transition-colors"><MessageCircle className="w-3.5 h-3.5" /></a>
              <a href="#" className="hover:text-[#13C5DD] transition-colors"><Share2 className="w-3.5 h-3.5" /></a>
              <a href="#" className="hover:text-[#13C5DD] transition-colors"><Send className="w-3.5 h-3.5" /></a>
            </div>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <LanguageToggle />
          </div>

        </div>
      </div>

      {/* Sticky Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-[#1D2A4D]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-md py-3"
            : "bg-white dark:bg-[#1D2A4D] border-b border-slate-200 dark:border-slate-800 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Medinova Style Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-[#13C5DD] flex items-center justify-center text-white shadow-md">
                <Cross className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="font-poppins font-extrabold text-2xl tracking-wider uppercase text-[#1D2A4D] dark:text-white flex items-center gap-1">
                  MEDINNOVA <span className="text-[#13C5DD] text-xs lowercase font-semibold">care</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                  {t.brandTag}
                </p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
              <a href="#" className="hover:text-[#13C5DD] transition-colors text-[#13C5DD]">
                Home
              </a>
              <a href="#doctors" className="hover:text-[#13C5DD] transition-colors">
                {t.navDoctors}
              </a>
              <a href="#features" className="hover:text-[#13C5DD] transition-colors">
                {t.navFeatures}
              </a>
              <a href="#workflow" className="hover:text-[#13C5DD] transition-colors">
                {t.navWorkflow}
              </a>
              <a href="#security" className="hover:text-[#13C5DD] transition-colors">
                {t.navTrust}
              </a>
            </nav>

            {/* Right Actions */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Role Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#13C5DD] transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#13C5DD]" />
                  <span>{ROLES[activeRole].name.split(" ")[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      પોર્ટલ રોલ પસંદ કરો
                    </div>
                    {Object.values(ROLES).map((role) => (
                      <button
                        key={role.id}
                        onClick={() => {
                          setActiveRole(role.id as RoleType);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                          activeRole === role.id
                            ? "bg-[#13C5DD] text-white font-bold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <div>
                          <div className="font-bold">{role.name}</div>
                          <div className="text-[10px] opacity-70">{role.badge}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <ThemeToggle />

              {isAuthenticated && user ? (
                <Link
                  href="/app"
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase text-slate-700 dark:text-slate-200 hover:text-[#13C5DD] transition-colors"
                >
                  <span className="text-[#13C5DD]">{user.name.split(' ')[0]}</span>
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-bold uppercase text-slate-700 dark:text-slate-200 hover:text-[#13C5DD] transition-colors"
                >
                  {t.signIn}
                </Link>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsAdmissionModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-[#13C5DD] hover:bg-[#10b1c7] text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-all"
              >
                <Bed className="w-4 h-4" />
                {t.admitHome}
              </motion.button>
            </div>

            {/* Mobile Toggler */}
            <div className="flex sm:hidden items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-[#1D2A4D] border-b border-slate-200 dark:border-slate-800 px-6 py-4 space-y-3 shadow-xl">
            <a href="#doctors" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase py-1">
              {t.navDoctors}
            </a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase py-1">
              {t.navFeatures}
            </a>
            <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold uppercase py-1">
              {t.navWorkflow}
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdmissionModalOpen(true);
                }}
                className="w-full py-2.5 text-center rounded-full bg-[#13C5DD] text-white text-sm font-bold uppercase"
              >
                {t.admitHome}
              </button>
            </div>
          </div>
        )}
      </header>

      <PatientAdmissionModal isOpen={isAdmissionModalOpen} onClose={() => setIsAdmissionModalOpen(false)} />
    </>
  );
}
