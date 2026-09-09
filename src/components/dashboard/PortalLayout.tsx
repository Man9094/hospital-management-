"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePortal, ROLES, RoleType } from "@/context/PortalContext";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import PatientDossierModal from "@/components/modals/PatientDossierModal";
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
  Building2,
  Heart,
  Eye,
  RefreshCw
} from "lucide-react";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { activeRole, setActiveRole, setSelectedUhid } = usePortal();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentHash, setCurrentHash] = useState<string>("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // Sync activeRole with authenticated user's role on login
  useEffect(() => {
    if (isAuthenticated && user && user.role) {
      const validRole = user.role as RoleType;
      if (ROLES[validRole] && activeRole !== validRole) {
        setActiveRole(validRole);
      }
    }
  }, [isAuthenticated, user, activeRole, setActiveRole]);

  const roleMeta = ROLES[activeRole] || ROLES["hospital_admin"];

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearch.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(`/api/patients?query=${encodeURIComponent(quickSearch.trim())}`);
      const json = await res.json();
      if (json.success && json.patients && json.patients.length > 0) {
        setSearchResults(json.patients);
        setSelectedUhid(json.patients[0].uhid);
      } else {
        alert(`No patient found matching "${quickSearch}"`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const navItems = [
    { hash: "", label: "Command Dashboard", icon: LayoutDashboard },
    { hash: "#patients", label: "Patient & UHID Directory", icon: Users },
    { hash: "#appointments", label: "OPD Appointments Queue", icon: Calendar },
    { hash: "#emr", label: "Clinical Doctor EMR", icon: Stethoscope },
    { hash: "#beds", label: "IPD Bed Matrix", icon: Bed },
    { hash: "#nursing", label: "Nursing Station", icon: Heart },
    { hash: "#emergency", label: "Emergency Command", icon: AlertTriangle },
    { hash: "#lab", label: "Laboratory (LIS)", icon: FlaskConical },
    { hash: "#radiology", label: "Radiology (RIS)", icon: Eye },
    { hash: "#pharmacy", label: "Pharmacy & FEFO Stock", icon: Pill },
    { hash: "#billing", label: "Billing & TPA Claims", icon: CreditCard },
    { hash: "#security", label: "Security & Audit Logs", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F3F6F9] dark:bg-[#0B0F17] flex flex-col font-sans transition-colors duration-300">
      
      {/* Demo Facility Mode Banner */}
      <div className="bg-[#1D2A4D] text-[#13C5DD] border-b border-slate-700 px-4 py-2 text-xs font-extrabold flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              <strong>Apex MedCore Superspeciality Hospital (Ahmedabad)</strong> — Indian Hospital Operating System
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-300">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">ABDM Architecture Ready</span>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">FEFO & GST Active</span>
          </div>
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

          <Link href="/app" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0F6CBD] to-[#13C5DD] flex items-center justify-center text-white shadow-md font-bold">
              <Cross className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-poppins font-extrabold text-lg text-[#1D2A4D] dark:text-white tracking-wide uppercase">
                MEDCORE <span className="text-[#13C5DD] text-xs font-bold lowercase">hms</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Global Patient Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Quick search UHID (e.g. MC-2026-000106), name, or phone..."
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#13C5DD] font-medium"
          />
        </form>

        {/* Right Actions & Demo Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Switch Role Quick Dropdown (for testing and demonstrations) */}
          <div className="relative">
            <button
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#13C5DD]/10 border border-[#13C5DD]/30 text-xs font-extrabold text-[#13C5DD] hover:bg-[#13C5DD]/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#13C5DD]" />
              <span className="hidden sm:inline">{roleMeta.name}</span>
              <span className="px-1.5 py-0.2 rounded bg-[#13C5DD] text-[#1D2A4D] text-[10px] font-black">
                {roleMeta.badge}
              </span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {roleSwitcherOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
                  Switch Portal View (Demo Roles)
                </div>
                <div className="space-y-0.5 max-h-60 overflow-y-auto">
                  {(Object.keys(ROLES) as RoleType[]).map((rKey) => {
                    const r = ROLES[rKey];
                    return (
                      <button
                        key={rKey}
                        onClick={() => {
                          setActiveRole(rKey);
                          setRoleSwitcherOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-bold transition-colors ${
                          activeRole === rKey
                            ? "bg-[#13C5DD] text-[#1D2A4D] font-extrabold"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        <span className="truncate">{r.name}</span>
                        <span className="text-[10px] font-normal opacity-80">{r.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

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
                  {user?.name || roleMeta.name}
                </div>
                <div className="text-[10px] text-[#13C5DD] font-bold">
                  {roleMeta.badge}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || roleMeta.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{user?.email || roleMeta.email}</div>
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
          className={`w-64 bg-white dark:bg-[#1D2A4D] border-r border-slate-200 dark:border-slate-800 p-4 transition-all duration-300 flex flex-col justify-between shrink-0 ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          <div className="space-y-5">
            <div className="px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Workspace</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">{roleMeta.name}</div>
              <div className="text-[10px] text-[#13C5DD] font-bold mt-0.5">{roleMeta.badge}</div>
            </div>

            {/* Sidebar Navigation Links */}
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
                        ? "bg-[#13C5DD] text-[#1D2A4D] shadow-md font-extrabold"
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

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Back to MedCore Website
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors uppercase disabled:opacity-50"
            >
              {isLoggingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Universal Patient Dossier Modal */}
      <PatientDossierModal />

    </div>
  );
}
