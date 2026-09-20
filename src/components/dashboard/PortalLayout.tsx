"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePortal, ROLES, RoleType } from "@/context/PortalContext";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
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
  Monitor,
  CheckCircle2,
  Flame
} from "lucide-react";

interface NavGroup {
  category: string;
  items: {
    hash: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { activeRole, setActiveRole, setSelectedUhid } = usePortal();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentHash, setCurrentHash] = useState<string>("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");
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
        setSelectedUhid(json.patients[0].uhid);
      } else {
        alert(`No patient record found matching "${quickSearch}"`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  // Stitch Categorized Navigation
  const staffNavGroups: NavGroup[] = [
    {
      category: "OPERATIONS",
      items: [
        { hash: "", label: "Dashboard", icon: LayoutDashboard },
        { hash: "#patients", label: "Patients & UHID", icon: Users },
        { hash: "#appointments", label: "Appointments Queue", icon: Calendar },
        { hash: "#opd-board", label: "Digital Token Board", icon: Monitor, badge: "Live" },
      ],
    },
    {
      category: "CLINICAL",
      items: [
        { hash: "#emr", label: "Clinical EMR", icon: Stethoscope },
        { hash: "#nursing", label: "Nursing Station", icon: Heart },
        { hash: "#beds", label: "Inpatient / Beds", icon: Bed },
      ],
    },
    {
      category: "DIAGNOSTICS",
      items: [
        { hash: "#lab", label: "Laboratory (LIS)", icon: FlaskConical },
        { hash: "#radiology", label: "Radiology (RIS)", icon: Eye },
      ],
    },
    {
      category: "SUPPORT",
      items: [
        { hash: "#pharmacy", label: "Pharmacy (FEFO)", icon: Pill },
        { hash: "#billing", label: "Billing & Invoices", icon: CreditCard },
      ],
    },
    {
      category: "ADMINISTRATION",
      items: [
        { hash: "#emergency", label: "Emergency Triage", icon: AlertTriangle, badge: "L1" },
        { hash: "#security", label: "Audit Logs", icon: ShieldCheck },
      ],
    },
  ];

  const patientNavGroups: NavGroup[] = [
    {
      category: "MY HEALTH PASSPORT",
      items: [
        { hash: "", label: "Health Passport & Status", icon: LayoutDashboard },
        { hash: "#opd-board", label: "Live OPD Token Display", icon: Monitor, badge: "Live" },
      ],
    },
  ];

  const navGroups = activeRole === "patient" ? patientNavGroups : staffNavGroups;

  return (
    <div className="min-h-screen bg-[#F7F6F3] dark:bg-[#18141C] flex font-sans transition-colors duration-200 text-[#1D1B1B] dark:text-[#FEF8F7]">
      
      {/* ─── STITCH ASIDE: 64 (16rem) FIXED BURGUNDY NAVIGATION RAIL ─── */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#4A1F2B] text-[#FEF8F7] flex flex-col z-50 shadow-[0_1px_8px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center gap-3 border-b border-white/10 shrink-0">
          <div className="w-8 h-8 rounded bg-white text-[#4A1F2B] flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
            <Cross className="w-5 h-5 stroke-[3]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-white truncate leading-tight tracking-wide">
              MedCore HOS
            </span>
            <span className="text-[10px] text-[#C08491] tracking-wider uppercase font-semibold">
              Apex Healthcare
            </span>
          </div>
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navGroups.map((group) => (
            <div key={group.category} className="space-y-1">
              <div className="px-3 pt-1 pb-1 text-[10px] uppercase tracking-wider text-[#C08491] font-bold">
                {group.category}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentHash === item.hash || (item.hash === "" && currentHash === "");

                return (
                  <a
                    key={item.hash + item.label}
                    href={`/app${item.hash}`}
                    onClick={() => {
                      setCurrentHash(item.hash);
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-white text-[#4A1F2B] shadow-xs font-bold"
                        : "text-[#FEF8F7]/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          isActive
                            ? "bg-[#4A1F2B] text-white"
                            : "bg-[#83505B] text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          ))}
        </div>

        {/* Aside Footer: Shift Status & Back link */}
        <div className="p-3 border-t border-white/10 bg-[#310A17]/60 shrink-0 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-[#C08491] uppercase tracking-wider font-semibold">
                System Online · Shift Alpha
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10 text-white/70">
            <Link href="/" className="hover:text-white transition-colors">
              MedCore Web
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-[#FFB4AB] hover:underline"
            >
              {isLoggingOut ? "..." : "Logout"}
            </button>
          </div>
        </div>
      </aside>

      {/* ─── STITCH CONTENT WRAPPER: WITH 64 (16rem) LEFT PADDING ─── */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* ─── STITCH COMMAND HEADER: 56px (h-14) ─── */}
        <header className="sticky top-0 h-14 bg-white dark:bg-[#241D29] border-b border-[#E3DFDB] dark:border-[#3B3041] z-40 flex items-center justify-between px-4 sm:px-6 shadow-xs">
          
          {/* Left: Mobile Toggle, Breadcrumb, Campus Selector */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-md text-[#514346] hover:bg-[#F7F6F3] dark:hover:bg-[#32293D] lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden xl:flex items-center gap-1.5 text-xs text-[#514346] dark:text-[#D5C2C5] shrink-0">
              <span className="font-semibold text-[#1D1B1B] dark:text-[#FEF8F7]">MedCore</span>
              <span className="text-[#837376]">/</span>
              <span className="font-semibold text-[#4A1F2B] dark:text-[#C08491] truncate">
                Clinical Operations
              </span>
            </div>

            <div className="h-4 w-[1px] bg-[#E3DFDB] dark:bg-[#3B3041] hidden xl:block" />

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F8F2F2] dark:bg-[#18141C] text-xs text-[#514346] dark:text-[#D5C2C5] border border-[#E3DFDB] dark:border-[#3B3041]">
              <Building2 className="w-3.5 h-3.5 text-[#83505B] shrink-0" />
              <span className="font-medium text-[#1D1B1B] dark:text-[#FEF8F7] truncate max-w-[200px] 2xl:max-w-none">
                Main Campus — Trauma & Super-Speciality
              </span>
            </div>
          </div>

          {/* Center/Right: Universal Search, Triage Pill, Bell, Profile */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Universal UHID Search */}
            <form onSubmit={handleSearch} className="relative w-64 lg:w-80 hidden md:block">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#837376]" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Universal UHID / Patient search..."
                className="w-full h-8 pl-8 pr-12 rounded-md bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs text-[#1D1B1B] dark:text-[#FEF8F7] placeholder:text-[#837376] focus:outline-none focus:border-[#4A1F2B] dark:focus:border-[#C08491] focus:bg-white dark:focus:bg-[#241D29] transition-all font-medium"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1 py-0.5 rounded bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] text-[#837376] font-mono">
                Ctrl+K
              </span>
            </form>

            {/* TRIAGE L1 ACTIVE BADGE */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#BA1A1A]/30 bg-[#FFDAD6] text-[#93000A] text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BA1A1A] animate-ping" />
              <span>TRIAGE L1 ACTIVE</span>
            </div>

            {/* Notifications */}
            <button className="relative p-1.5 rounded-md text-[#514346] hover:bg-[#F7F6F3] dark:hover:bg-[#32293D] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#BA1A1A] ring-2 ring-white dark:ring-[#241D29]" />
            </button>

            {/* Role Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F3E9EB] dark:bg-[#32293D] border border-[#E3DFDB] dark:border-[#4C3C54] text-xs font-semibold text-[#4A1F2B] dark:text-[#F7B5C3] hover:opacity-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#4A1F2B] dark:text-[#C08491]" />
                <span className="hidden sm:inline">{roleMeta.name}</span>
                <span className="px-1.5 py-0.2 rounded bg-[#4A1F2B] text-white text-[10px] font-bold">
                  {roleMeta.badge}
                </span>
                <ChevronDown className="w-3 h-3 text-[#837376]" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-md bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-xl p-1.5 z-50">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-[#837376] uppercase tracking-wider border-b border-[#E3DFDB] dark:border-[#3B3041] mb-1">
                    Switch Active Portal View
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
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left text-xs font-semibold transition-colors ${
                            activeRole === rKey
                              ? "bg-[#4A1F2B] text-white font-bold"
                              : "hover:bg-[#F7F6F3] dark:hover:bg-[#32293D] text-[#1D1B1B] dark:text-[#FEF8F7]"
                          }`}
                        >
                          <span className="truncate">{r.name}</span>
                          <span className="text-[10px] opacity-75">{r.badge}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <ThemeToggle />

            {/* Divider */}
            <div className="h-6 w-[1px] bg-[#E3DFDB] dark:bg-[#3B3041]" />

            {/* Profile Menu: Dr. Vikram Rao Photo & Details */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-0.5 rounded-md hover:bg-[#F7F6F3] dark:hover:bg-[#32293D] transition-colors"
              >
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-xs font-bold text-[#1D1B1B] dark:text-[#FEF8F7] leading-tight">
                    {user?.name || "Dr. Vikram Rao, MD"}
                  </span>
                  <span className="text-[10px] text-[#514346] dark:text-[#D5C2C5]">
                    {roleMeta.badge}
                  </span>
                </div>
                {/* Real Stitch Portrait Asset */}
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E3DFDB] dark:border-[#3B3041] bg-[#4A1F2B] shrink-0">
                  <img
                    src="/stitch/dr-vikram-rao.png"
                    alt="Dr. Vikram Rao"
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-md bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-xl p-2 z-50">
                  <div className="px-2.5 py-1.5 border-b border-[#E3DFDB] dark:border-[#3B3041] mb-1">
                    <div className="text-xs font-bold text-[#1D1B1B] dark:text-[#FEF8F7]">
                      {user?.name || roleMeta.name}
                    </div>
                    <div className="text-[10px] text-[#837376]">
                      {user?.email || roleMeta.email}
                    </div>
                    <div className="text-[10px] font-semibold text-[#4A1F2B] dark:text-[#C08491] mt-0.5">
                      {roleMeta.badge}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left text-xs font-semibold text-[#BA1A1A] hover:bg-[#FFDAD6]/40 transition-colors"
                  >
                    {isLoggingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 bg-[#F7F6F3] dark:bg-[#18141C] overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Universal Patient Dossier Modal */}
      <PatientDossierModal />
    </div>
  );
}
