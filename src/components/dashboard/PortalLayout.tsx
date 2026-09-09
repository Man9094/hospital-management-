"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePortal, ROLES, RoleType } from "@/context/PortalContext";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import {
  Activity,
  Users,
  Bed,
  Stethoscope,
  FlaskConical,
  Pill,
  ShieldCheck,
  Search,
  Bell,
  ChevronDown,
  Sparkles,
  LogOut,
  LayoutDashboard,
  Calendar,
  CreditCard,
  Settings,
  FileText,
  AlertTriangle,
  Menu,
  X,
  Cross,
  User,
  Loader2,
} from "lucide-react";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { activeRole, setActiveRole } = usePortal();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentHash, setCurrentHash] = useState<string>("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Sync activeRole with authenticated user's role
  useEffect(() => {
    if (isAuthenticated && user && user.role) {
      const validRole = user.role as RoleType;
      if (ROLES[validRole] && activeRole !== validRole) {
        setActiveRole(validRole);
      }
    }
  }, [isAuthenticated, user, activeRole, setActiveRole]);

  const roleMeta = ROLES[activeRole];

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || "");
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  const navItems = [
    { hash: "", label: "Command Dashboard", icon: LayoutDashboard },
    { hash: "#appointments", label: "Appointments Queue", icon: Calendar },
    { hash: "#patients", label: "Patient EHR Records", icon: Users },
    { hash: "#beds", label: "IPD Bed Status", icon: Bed },
    { hash: "#lab", label: "Lab Diagnostics", icon: FlaskConical },
    { hash: "#pharmacy", label: "Pharmacy POS", icon: Pill },
    { hash: "#billing", label: "Billing & Claims", icon: CreditCard },
    { hash: "#security", label: "HIPAA Security Logs", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F3F6F9] dark:bg-[#0B0F17] flex flex-col font-sans transition-colors duration-300">
      
      {/* Emergency Global Alert Broadcast Banner */}
      <div className="bg-[#1D2A4D] text-[#13C5DD] border-b border-slate-700 px-4 py-2 text-xs font-extrabold flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-center text-center">
          <AlertTriangle className="w-4 h-4 text-yellow-300 animate-pulse" />
          <span>
            <strong>મેડિનોવા લાઇવ કમાન્ડ સેન્ટર:</strong> ૧૮ બેડ ખાલી (ICU & જનરલ) | ઓપીડી ટોકન બુકિંગ ₹49 | ૨૪/૭ એમ્બ્યુલન્સ હેલ્પલાઇન 1800-MEDCORE
          </span>
        </div>
      </div>

      {/* Top Command Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-[#1D2A4D] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#13C5DD] flex items-center justify-center text-white shadow-md">
              <Cross className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-poppins font-extrabold text-lg text-[#1D2A4D] dark:text-white tracking-wide uppercase">
                MEDINNOVA <span className="text-[#13C5DD] text-xs font-bold lowercase">os</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient MRN, doctor, bed #..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#13C5DD]"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Current Role Badge (read-only, locked to authenticated role) */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-[#13C5DD]" />
            <span>{roleMeta.name}</span>
          </div>

          <LanguageToggle />
          <ThemeToggle />

          {/* User Profile Menu */}
          <div className="relative flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#13C5DD]/20 border-2 border-[#13C5DD] flex items-center justify-center text-[#13C5DD]">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {user?.name || "User"}
                </div>
                <div className="text-[10px] text-[#13C5DD] font-bold">
                  {roleMeta.badge}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{user?.email}</div>
                  <div className="text-[10px] font-bold text-[#13C5DD] mt-0.5">{roleMeta.name} • {roleMeta.badge}</div>
                </div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <LogOut className="w-3.5 h-3.5" />
                  )}
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Workspace Sidebar */}
        <aside
          className={`w-64 bg-white dark:bg-[#1D2A4D] border-r border-slate-200 dark:border-slate-800 p-4 transition-all duration-300 flex flex-col justify-between ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          <div className="space-y-6">
            <div className="px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">સક્રિય પોર્ટલ સેક્શન</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">{user?.name || roleMeta.name}</div>
              <div className="text-[10px] text-[#13C5DD] font-bold mt-0.5">{roleMeta.badge}</div>
            </div>

            {/* Sidebar Hash Navigation Links */}
            <nav className="space-y-1 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentHash === item.hash || (item.hash === "" && currentHash === "");

                return (
                  <a
                    key={item.hash}
                    href={`/app${item.hash}`}
                    onClick={() => setCurrentHash(item.hash)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? "bg-[#13C5DD] text-white shadow-md font-extrabold"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors uppercase disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </aside>

        {/* Main Content Render */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
