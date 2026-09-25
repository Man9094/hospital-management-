"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  Cross,
  LayoutDashboard,
  Users,
  Bed,
  Stethoscope,
  Building2,
  CreditCard,
  Settings,
  ShieldCheck,
  ShieldAlert,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  UserPlus,
  UserCheck,
  UserX,
  FileText,
  Download,
  Calendar,
  Pill,
  FlaskConical,
  ArrowUpRight,
  ArrowLeft,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Edit,
  Trash2,
  MoreVertical,
  RefreshCw,
  CircleDot,
  Heart,
  Sparkles,
  BadgeCheck,
  User,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────
type AdminSection =
  | "dashboard"
  | "staff"
  | "patients"
  | "departments"
  | "beds"
  | "billing"
  | "reports"
  | "settings"
  | "audit";

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
  color: string;
}

// ─── Admin Login Page Component (Shown when unauthenticated on /admin) ───
function AdminLoginPage() {
  const router = useRouter();
  const { login, checkAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [accessDeniedMsg, setAccessDeniedMsg] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAccessDeniedMsg("");

    if (!email.trim() || !password) {
      setError("Please enter administrator email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email.trim(), password, rememberMe);
      if (!res.success) {
        setError(res.error || "Invalid administrator credentials. Access restricted.");
        setIsSubmitting(false);
        return;
      }

      // Re-verify server-side session and role
      const meRes = await fetch("/api/auth/me", { credentials: "include" });
      const meData = await meRes.json();
      if (meData.authenticated && meData.user) {
        const role = meData.user.role;
        if (!["hospital_admin", "super_admin"].includes(role)) {
          // TEST 3: Authenticated non-admin role -> Admin access denied -> Redirect to /app
          setAccessDeniedMsg(
            `Authenticated as ${meData.user.name} (${role.replace("_", " ").toUpperCase()}). Hospital Admin privileges required. Redirecting to your clinical dashboard...`
          );
          setTimeout(() => {
            router.push("/app");
          }, 1800);
          return;
        }

        // Admin role confirmed -> sync auth state and load dashboard
        await checkAuth();
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillTestCredentials = (testEmail: string) => {
    setEmail(testEmail);
    setPassword("MedCore@2026");
    setError("");
    setAccessDeniedMsg("");
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] dark:bg-[#18141C] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors text-[#1D1B1B] dark:text-[#FEF8F7]">
      {/* Top Hospital Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2.5">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-md bg-[#4A1F2B] flex items-center justify-center text-white shadow-xs font-bold">
            <Cross className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-sans font-bold text-2xl text-[#1D1B1B] dark:text-white uppercase tracking-tight">
            MEDCORE <span className="text-[#4A1F2B] dark:text-[#C08491] text-xs font-bold lowercase">admin</span>
          </span>
        </Link>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F3E9EB] dark:bg-[#32293D] text-[#4A1F2B] dark:text-[#F7B5C3] text-[10px] font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-[#4A1F2B] dark:text-[#C08491]" />
            Restricted Governance Portal
          </div>
        </div>
      </div>

      {/* Main Admin Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-6 sm:p-8 shadow-[0_4px_16px_rgba(41,39,39,0.06)] space-y-5"
        >
          <div>
            <h2 className="text-lg font-bold text-[#1D1B1B] dark:text-white">
              Administrator Sign In
            </h2>
            <p className="text-xs text-[#837376] mt-0.5">
              Enter verified administrator credentials to access the hospital management console.
            </p>
          </div>

          {/* Error Notice (TEST 2) */}
          {error && (
            <div className="p-3 rounded-md bg-[#FFDAD6] border border-[#BA1A1A]/30 text-[#93000A] text-xs font-semibold flex items-start gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Access Denied Notice (TEST 3) */}
          {accessDeniedMsg && (
            <div className="p-3 rounded-md bg-[#FAF4EB] border border-[#9A6A25]/30 text-[#9A6A25] text-xs font-semibold flex items-start gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{accessDeniedMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#514346] dark:text-[#D5C2C5] uppercase mb-1">
                Admin Official Email ID
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#837376]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@medcore.in"
                  className="w-full h-9 pl-9 pr-3 rounded-md bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs font-semibold text-[#1D1B1B] dark:text-[#FEF8F7] placeholder:text-[#837376] focus:outline-none focus:border-[#4A1F2B] dark:focus:border-[#C08491]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#514346] dark:text-[#D5C2C5] uppercase">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-[#4A1F2B] dark:text-[#C08491] hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#837376]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 pl-9 pr-10 rounded-md bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs font-semibold text-[#1D1B1B] dark:text-[#FEF8F7] placeholder:text-[#837376] focus:outline-none focus:border-[#4A1F2B] dark:focus:border-[#C08491]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#837376] hover:text-[#1D1B1B] dark:hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[#514346] dark:text-[#D5C2C5] font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E3DFDB] text-[#4A1F2B] focus:ring-[#4A1F2B]"
                />
                <span>Remember admin session (7 days)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-9 rounded-md bg-[#4A1F2B] hover:bg-[#70404B] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Authenticate &amp; Open Admin Console</span>
                </>
              )}
            </button>
          </form>

          {/* Test Account Helper Chips */}
          <div className="pt-2 border-t border-[#E3DFDB] dark:border-[#3B3041] space-y-2">
            <div className="text-[10px] font-bold text-[#837376] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#4A1F2B] dark:text-[#C08491]" />
              <span>Fill Test Credentials (Development)</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => fillTestCredentials("admin@medcore.in")}
                className="p-2 rounded border border-[#E3DFDB] dark:border-[#3B3041] bg-[#F8F2F2] dark:bg-[#18141C] text-left hover:border-[#4A1F2B] transition-colors"
              >
                <div className="font-bold text-[11px] text-[#1D1B1B] dark:text-white">Hospital Admin</div>
                <div className="text-[10px] text-[#837376] truncate">admin@medcore.in</div>
              </button>
              <button
                type="button"
                onClick={() => fillTestCredentials("superadmin@medcore.in")}
                className="p-2 rounded border border-[#E3DFDB] dark:border-[#3B3041] bg-[#F8F2F2] dark:bg-[#18141C] text-left hover:border-[#4A1F2B] transition-colors"
              >
                <div className="font-bold text-[11px] text-[#1D1B1B] dark:text-white">Super Admin</div>
                <div className="text-[10px] text-[#837376] truncate">superadmin@medcore.in</div>
              </button>
            </div>
            <p className="text-[10px] text-[#837376] italic">
              Note: Test buttons only fill email and password. Explicit login submission is strictly required.
            </p>
          </div>

          {/* Footer Security Badges */}
          <div className="pt-3 border-t border-[#E3DFDB] dark:border-[#3B3041] flex items-center justify-between text-[11px] text-[#837376]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3F6B52]" /> RBAC Protected
            </span>
            <span>MedCore HMS v2.4</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Admin Page Component ───────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Set sidebar open on desktop screens initially
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  // ─── Auth Guards ──────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#18141C] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#4A1F2B] dark:text-[#C08491] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // 1. Unauthenticated: Render Admin Login page directly on /admin (NO REDIRECT, NO AUTO-AUTH)
  if (!isAuthenticated || !user) {
    return <AdminLoginPage />;
  }

  // 2. Role verification: Non-admin roles are strictly denied
  const allowedRoles = ["hospital_admin", "super_admin"];
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-[#18141C] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="p-8 rounded-lg bg-[#242026] border border-[#3E3842] shadow-[0_4px_16px_rgba(0,0,0,0.2)] space-y-4">
            <div className="w-14 h-14 mx-auto rounded-md bg-[#5C2329]/30 border border-[#8C3A45]/40 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-[#E2838E]" />
            </div>
            <h1 className="text-2xl font-bold font-sans text-[#ECE5E7]">Access Denied</h1>
            <p className="text-sm text-[#9B8E92]">
              The <span className="font-bold text-[#ECE5E7]">Hospital Admin Panel</span> is restricted to authorized administrators only.
            </p>
            <p className="text-xs text-[#9B8E92]">
              Your role: <span className="font-semibold text-[#E2838E]">{user.role.replace("_", " ").toUpperCase()}</span>
            </p>
          </div>
          <button
            onClick={() => router.push("/app")}
            className="px-5 py-2.5 rounded-md bg-[#4A1F2B] hover:bg-[#5E2737] text-white font-medium text-xs uppercase flex items-center justify-center gap-2 mx-auto transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go to My Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  // ─── Sidebar Navigation ───────────────────────────────────
  const sidebarItems: { id: AdminSection; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "staff", label: "Staff Management", icon: Users, badge: "32" },
    { id: "patients", label: "Patient Records", icon: Heart },
    { id: "departments", label: "Departments", icon: Building2 },
    { id: "beds", label: "Bed & Ward Config", icon: Bed },
    { id: "billing", label: "Revenue & Billing", icon: CreditCard },
    { id: "reports", label: "Reports & Analytics", icon: FileText },
    { id: "audit", label: "Audit & Security", icon: ShieldCheck },
    { id: "settings", label: "Hospital Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3] dark:bg-[#18141C] flex flex-col font-sans transition-colors duration-200 text-[#1D1B1B] dark:text-[#FEF8F7]">
      
      {/* ═══ Admin Top Header ═══ */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#241D29] border-b border-[#E3DFDB] dark:border-[#3B3041] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-md text-[#514346] hover:bg-[#F7F6F3] dark:hover:bg-[#32293D]">
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#4A1F2B] flex items-center justify-center text-white shadow-xs font-bold">
              <Cross className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <span className="font-sans font-bold text-base text-[#1D1B1B] dark:text-white tracking-wide uppercase">
                MEDCORE <span className="text-[#4A1F2B] dark:text-[#C08491] text-xs font-bold lowercase">admin</span>
              </span>
            </div>
          </Link>

          {/* Admin Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#F3E9EB] dark:bg-[#32293D] border border-[#E3DFDB] dark:border-[#4C3C54] text-[#4A1F2B] dark:text-[#F7B5C3] text-[10px] font-bold uppercase">
            <ShieldCheck className="w-3 h-3 text-[#4A1F2B] dark:text-[#C08491]" /> Hospital Governance
          </div>
        </div>

        {/* Search */}
        <div className="hidden lg:flex items-center relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 text-[#837376]" />
          <input
            type="text"
            placeholder="Search staff, patient, department..."
            className="w-full h-8 pl-8 pr-4 rounded-md bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs text-[#1D1B1B] dark:text-[#FEF8F7] placeholder:text-[#837376] focus:outline-none focus:border-[#4A1F2B]"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-1.5 rounded-md text-[#514346] hover:bg-[#F7F6F3] dark:hover:bg-[#32293D]">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#BA1A1A]" />
          </button>

          <ThemeToggle />

          {/* User Menu */}
          <div className="relative pl-2 border-l border-[#E3DFDB] dark:border-[#3B3041]">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-md hover:bg-[#F7F6F3] dark:hover:bg-[#32293D] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#F3E9EB] dark:bg-[#32293D] border border-[#4A1F2B] dark:border-[#C08491] flex items-center justify-center text-[#4A1F2B] dark:text-[#C08491]">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-[#1D1B1B] dark:text-white leading-tight">Admin Console</div>
                <div className="text-[10px] text-[#837376]">Superadmin</div>
              </div>
              <ChevronDown className="w-3 h-3 text-[#837376] hidden sm:block" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-md bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-xl p-1.5 z-50">
                <Link
                  href="/app"
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left text-xs font-semibold text-[#1D1B1B] dark:text-[#FEF8F7] hover:bg-[#F7F6F3] dark:hover:bg-[#32293D] transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#4A1F2B]" /> Hospital Workspace
                </Link>
                <button
                  onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left text-xs font-semibold text-[#BA1A1A] hover:bg-[#FFDAD6]/40 transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ═══ Body ═══ */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Mobile Backdrop Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
            aria-label="Close admin menu"
          />
        )}

        {/* ═══ Admin Sidebar (Drawer on mobile, rail on desktop) ═══ */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#241D29] border-r border-[#E3DFDB] dark:border-[#3B3041] transition-transform duration-200 flex flex-col shrink-0 w-64 lg:static lg:z-auto shadow-2xl lg:shadow-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-60"
          }`}
        >
          {/* Mobile Header in Sidebar */}
          <div className="p-3 border-b border-[#E3DFDB] dark:border-[#3B3041] flex items-center justify-between lg:hidden shrink-0">
            <span className="text-xs font-bold text-[#4A1F2B] dark:text-[#C08491]">Admin Navigation</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded text-[#837376] hover:text-[#1D1B1B] dark:hover:text-white"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-3 space-y-1 overflow-y-auto">
            <div className="px-2.5 py-1.5 text-[10px] font-bold text-[#837376] uppercase tracking-wider">Administration</div>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (typeof window !== "undefined" && window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-[#4A1F2B] text-white shadow-xs font-bold"
                      : "text-[#514346] dark:text-[#D5C2C5] hover:bg-[#F7F6F3] dark:hover:bg-[#32293D]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-[#F2EDEC] dark:bg-[#18141C] text-[#837376]"}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-[#E3DFDB] dark:border-[#3B3041]">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-[#F2EDEC] dark:bg-[#18141C] text-xs font-semibold text-[#837376] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/30 transition-colors uppercase disabled:opacity-50"
            >
              {isLoggingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ═══ Main Content ═══ */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === "dashboard" && <AdminDashboard />}
              {activeSection === "staff" && <StaffManagement />}
              {activeSection === "patients" && <PatientRecords />}
              {activeSection === "departments" && <DepartmentsSection />}
              {activeSection === "beds" && <BedConfigSection />}
              {activeSection === "billing" && <BillingSection />}
              {activeSection === "reports" && <ReportsSection />}
              {activeSection === "audit" && <AuditSection />}
              {activeSection === "settings" && <SettingsSection />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Admin Dashboard Overview
// ═══════════════════════════════════════════════════════════════
function AdminDashboard() {
  const stats: StatCard[] = [
    { label: "Total Patients Today", value: "247", change: "+12%", trend: "up", icon: Heart, color: "#8C3A45" },
    { label: "Beds Occupied", value: "182/240", change: "76%", trend: "neutral", icon: Bed, color: "#3E6177" },
    { label: "Active Staff", value: "32", change: "+2", trend: "up", icon: Users, color: "#3F6B52" },
    { label: "Today's Revenue", value: "₹4,82,500", change: "+18%", trend: "up", icon: CreditCard, color: "#C07830" },
    { label: "OPD Tokens", value: "89", change: "-5%", trend: "down", icon: Calendar, color: "#83505B" },
    { label: "Pending Lab Reports", value: "14", change: "-3", trend: "down", icon: FlaskConical, color: "#5C2329" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-extrabold text-[#4A1F2B] dark:text-[#E2838E] uppercase tracking-wider flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4" /> HOSPITAL ADMINISTRATION — OVERVIEW
          </div>
          <h1 className="text-2xl font-bold font-sans text-slate-900 dark:text-white mt-1">
            Admin Command Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time hospital operations overview • {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
          <button className="px-4 py-2.5 rounded-md bg-[#4A1F2B] text-white text-xs font-medium flex items-center gap-2 shadow-xs hover:bg-[#5E2737] transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-5 rounded-lg bg-white dark:bg-[#241D29] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: stat.color + "15" }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === "up" ? "text-[#3F6B52] dark:text-[#85B599]" : stat.trend === "down" ? "text-red-400" : "text-slate-400"}`}>
                  {stat.trend === "up" && <TrendingUp className="w-3.5 h-3.5" />}
                  {stat.trend === "down" && <TrendingDown className="w-3.5 h-3.5" />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold font-sans text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 p-6 rounded-lg bg-white dark:bg-[#241D29] border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold font-sans text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#4A1F2B] dark:text-[#E2838E]" /> Recent Hospital Activity
          </h3>
          <div className="space-y-3">
            {[
              { time: "2 min ago", text: "Dr. Rajesh Patel completed OPD consultation for Token #A-101", type: "success" },
              { time: "8 min ago", text: "ICU Bed #12 assigned to emergency patient (MRN #91002)", type: "warning" },
              { time: "15 min ago", text: "Lab report CBC #LAB-881 uploaded and sent via WhatsApp", type: "success" },
              { time: "22 min ago", text: "New patient registration: Sunita Shah (ABHA verified)", type: "info" },
              { time: "35 min ago", text: "Pharmacy stock alert: Amoxicillin 500mg below reorder level", type: "danger" },
              { time: "1 hr ago", text: "Billing invoice #INV-9013 cashless claim approved (₹45,000)", type: "success" },
            ].map((event, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  event.type === "success" ? "bg-[#3F6B52]" :
                  event.type === "warning" ? "bg-amber-400" :
                  event.type === "danger" ? "bg-red-400" :
                  "bg-[#4A1F2B]"
                }`} />
                <div className="flex-1">
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{event.text}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-lg bg-white dark:bg-[#241D29] border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold font-sans text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Quick Actions
          </h3>
          <div className="space-y-2">
            {[
              { label: "Add New Staff Member", icon: UserPlus, color: "#3F6B52" },
              { label: "Register Patient", icon: Heart, color: "#8C3A45" },
              { label: "Create Department", icon: Building2, color: "#83505B" },
              { label: "Generate Invoice", icon: CreditCard, color: "#C07830" },
              { label: "View Audit Logs", icon: ShieldCheck, color: "#3E6177" },
              { label: "Download Reports", icon: Download, color: "#5C2329" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button key={action.label} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: action.color + "15" }}>
                    <Icon className="w-4 h-4" style={{ color: action.color }} />
                  </div>
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Staff Management
// ═══════════════════════════════════════════════════════════════
function StaffManagement() {
  const staffMembers = [
    { id: 1, name: "Dr. Rajesh Patel", role: "Doctor", dept: "Cardiology", status: "active", email: "rajesh.patel@medcore.in", joined: "Jan 2024" },
    { id: 2, name: "Dr. Sneha Shah", role: "Doctor", dept: "Neurology", status: "active", email: "sneha.shah@medcore.in", joined: "Mar 2024" },
    { id: 3, name: "Elena Rostova", role: "Receptionist", dept: "Front Desk", status: "active", email: "elena@medcore.in", joined: "Feb 2024" },
    { id: 4, name: "David Chen", role: "Lab Technician", dept: "Pathology", status: "active", email: "david.chen@medcore.in", joined: "Apr 2024" },
    { id: 5, name: "Maria Santos", role: "Pharmacist", dept: "Pharmacy", status: "on_leave", email: "maria@medcore.in", joined: "Jan 2024" },
    { id: 6, name: "Amit Mehta", role: "Doctor", dept: "Orthopedic", status: "active", email: "amit.m@medcore.in", joined: "May 2024" },
    { id: 7, name: "Priya Sharma", role: "Nurse", dept: "ICU", status: "active", email: "priya.s@medcore.in", joined: "Jun 2024" },
    { id: 8, name: "Ravi Kumar", role: "Admin Staff", dept: "Admin", status: "inactive", email: "ravi.k@medcore.in", joined: "Dec 2023" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-extrabold text-[#4A1F2B] dark:text-[#C08491] uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4" /> STAFF MANAGEMENT
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">Hospital Staff Directory</h1>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-[#4A1F2B] text-white text-xs font-bold flex items-center gap-2 shadow-md">
          <UserPlus className="w-4 h-4" /> Add New Staff
        </button>
      </div>

      {/* Staff Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: "32", icon: Users, color: "#3E6177" },
          { label: "Active", value: "28", icon: UserCheck, color: "#3F6B52" },
          { label: "On Leave", value: "3", icon: Clock, color: "#C07830" },
          { label: "Inactive", value: "1", icon: UserX, color: "#8C3A45" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-4 rounded-lg bg-white dark:bg-[#242026] border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" style={{ color: s.color }} />
                <span className="text-[10px] font-bold text-slate-500 uppercase">{s.label}</span>
              </div>
              <div className="text-xl font-bold font-sans text-slate-900 dark:text-white mt-1">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Staff Table */}
      <div className="rounded-lg bg-white dark:bg-[#242026] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-extrabold uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {staffMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F3E9EB] dark:bg-[#32293D] flex items-center justify-center text-[#4A1F2B] dark:text-[#E2838E] font-bold text-[10px]">
                        {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{member.name}</div>
                        <div className="text-[10px] text-slate-400">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium">{member.role}</td>
                  <td className="p-4 font-medium">{member.dept}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      member.status === "active" ? "bg-[#E8F0EC] text-[#3F6B52] dark:bg-[#23382B] dark:text-[#85B599]" :
                      member.status === "on_leave" ? "bg-amber-500/10 text-amber-500" :
                      "bg-red-500/10 text-red-500"
                    }`}>
                      ● {member.status === "active" ? "Active" : member.status === "on_leave" ? "On Leave" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{member.joined}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-[#4A1F2B] dark:hover:text-[#E2838E]"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-500"><Edit className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Patient Records
// ═══════════════════════════════════════════════════════════════
function PatientRecords() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-extrabold text-[#4A1F2B] dark:text-[#E2838E] uppercase tracking-wider flex items-center gap-1.5">
          <Heart className="w-4 h-4" /> PATIENT RECORDS
        </div>
        <h1 className="text-2xl font-bold font-sans text-slate-900 dark:text-white mt-1">Patient Database</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Registered", value: "12,847", icon: Users, color: "#3E6177" },
          { label: "Active (IPD)", value: "182", icon: Bed, color: "#3F6B52" },
          { label: "Today OPD", value: "89", icon: Calendar, color: "#83505B" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-5 rounded-lg bg-white dark:bg-[#241D29] border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2"><Icon className="w-4 h-4" style={{ color: s.color }} /><span className="text-[10px] font-bold text-slate-500 uppercase">{s.label}</span></div>
              <div className="text-2xl font-bold font-sans text-slate-900 dark:text-white mt-1">{s.value}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg bg-white dark:bg-[#241D29] border border-slate-200 dark:border-slate-800 p-6 overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-extrabold uppercase">
            <tr>
              <th className="p-3">MRN #</th>
              <th className="p-3">Patient Name</th>
              <th className="p-3">ABHA ID</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Last Visit</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {[
              { mrn: "#90412", name: "રમેશભાઈ પટેલ", abha: "91-4091-2094-1102", phone: "+91 98765 43210", lastVisit: "19 Aug 2026", status: "IPD" },
              { mrn: "#90415", name: "સુનીતાબેન શાહ", abha: "91-8812-4019-3391", phone: "+91 87654 32109", lastVisit: "18 Aug 2026", status: "OPD" },
              { mrn: "#90420", name: "કિશોરભાઈ જોશી", abha: "91-7710-3028-2290", phone: "+91 76543 21098", lastVisit: "20 Aug 2026", status: "Discharged" },
            ].map((p) => (
              <tr key={p.mrn} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-3 font-bold text-[#4A1F2B] dark:text-[#E2838E]">{p.mrn}</td>
                <td className="p-3 font-bold text-slate-900 dark:text-white">{p.name}</td>
                <td className="p-3 text-slate-400 font-mono">{p.abha}</td>
                <td className="p-3">{p.phone}</td>
                <td className="p-3">{p.lastVisit}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    p.status === "IPD" ? "bg-[#F3E9EB] dark:bg-[#32293D] text-[#4A1F2B] dark:text-[#E2838E]" :
                    p.status === "OPD" ? "bg-[#E8F0EC] text-[#3F6B52] dark:bg-[#23382B] dark:text-[#85B599]" :
                    "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Departments
// ═══════════════════════════════════════════════════════════════
function DepartmentsSection() {
  const departments = [
    { name: "Cardiology", head: "Dr. Sneha Shah", staff: 8, patients: 24, status: "active", color: "#8C3A45" },
    { name: "Orthopedic", head: "Dr. Amit Mehta", staff: 6, patients: 18, status: "active", color: "#3E6177" },
    { name: "Pathology Lab", head: "David Chen", staff: 5, patients: 0, status: "active", color: "#83505B" },
    { name: "General Medicine", head: "Dr. Rajesh Patel", staff: 10, patients: 42, status: "active", color: "#3F6B52" },
    { name: "Pharmacy", head: "Maria Santos", staff: 4, patients: 0, status: "active", color: "#C07830" },
    { name: "Emergency / ICU", head: "Dr. Anand Kumar", staff: 12, patients: 8, status: "active", color: "#5C2329" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-extrabold text-[#4A1F2B] dark:text-[#E2838E] uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4" /> DEPARTMENTS
          </div>
          <h1 className="text-2xl font-bold font-sans text-slate-900 dark:text-white mt-1">Department Management</h1>
        </div>
        <button className="px-5 py-2.5 rounded-md bg-[#4A1F2B] hover:bg-[#5E2737] text-white text-xs font-medium flex items-center gap-2 shadow-xs transition-colors">
          <Building2 className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div key={dept.name} className="p-5 rounded-lg bg-white dark:bg-[#241D29] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: dept.color + "15" }}>
                <Stethoscope className="w-5 h-5" style={{ color: dept.color }} />
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#E8F0EC] text-[#3F6B52] dark:bg-[#23382B] dark:text-[#85B599] text-[10px] font-bold">● Active</span>
            </div>
            <h3 className="text-sm font-bold font-sans text-slate-900 dark:text-white">{dept.name}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Head: {dept.head}</p>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[10px]"><span className="font-bold text-slate-900 dark:text-white">{dept.staff}</span> <span className="text-slate-400">Staff</span></div>
              <div className="text-[10px]"><span className="font-bold text-slate-900 dark:text-white">{dept.patients}</span> <span className="text-slate-400">Patients</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Bed & Ward Configuration
// ═══════════════════════════════════════════════════════════════
function BedConfigSection() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-extrabold text-[#4A1F2B] dark:text-[#E2838E] uppercase tracking-wider flex items-center gap-1.5"><Bed className="w-4 h-4" /> BED & WARD CONFIGURATION</div>
        <h1 className="text-2xl font-bold font-sans text-slate-900 dark:text-white mt-1">Ward & Bed Management</h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Beds", value: "240", color: "#3E6177" },
          { label: "Occupied", value: "182", color: "#8C3A45" },
          { label: "Available", value: "52", color: "#3F6B52" },
          { label: "Maintenance", value: "6", color: "#C07830" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-lg bg-white dark:bg-[#241D29] border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-2xl font-bold font-sans" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-white dark:bg-[#241D29] border border-slate-200 dark:border-slate-800 p-6 overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-extrabold uppercase">
            <tr><th className="p-3">Ward</th><th className="p-3">Total</th><th className="p-3">Occupied</th><th className="p-3">Available</th><th className="p-3">Rate / Day</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {[
              { ward: "ICU", total: 20, occupied: 18, available: 2, rate: "₹8,500" },
              { ward: "General Ward", total: 120, occupied: 96, available: 20, rate: "₹1,200" },
              { ward: "Semi-Private", total: 60, occupied: 42, available: 16, rate: "₹3,500" },
              { ward: "Private Suite", total: 30, occupied: 20, available: 8, rate: "₹7,000" },
              { ward: "Maternity", total: 10, occupied: 6, available: 4, rate: "₹2,500" },
            ].map((w) => (
              <tr key={w.ward} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-3 font-bold text-slate-900 dark:text-white">{w.ward}</td>
                <td className="p-3 font-bold">{w.total}</td>
                <td className="p-3 font-bold text-red-400">{w.occupied}</td>
                <td className="p-3 font-bold text-[#3F6B52] dark:text-[#85B599]">{w.available}</td>
                <td className="p-3 font-bold text-[#4A1F2B] dark:text-[#E2838E]">{w.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Revenue & Billing
// ═══════════════════════════════════════════════════════════════
function BillingSection() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-extrabold text-[#4A1F2B] dark:text-[#E2838E] uppercase tracking-wider flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> REVENUE & BILLING</div>
        <h1 className="text-2xl font-bold font-sans text-slate-900 dark:text-white mt-1">Financial Overview</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Monthly Revenue", value: "₹1,42,50,000", change: "+22%", color: "#3F6B52" },
          { label: "Pending Payments", value: "₹8,45,000", change: "12 invoices", color: "#C07830" },
          { label: "Insurance Claims", value: "₹34,00,000", change: "8 pending", color: "#3E6177" },
        ].map((s) => (
          <div key={s.label} className="p-5 rounded-lg bg-white dark:bg-[#241D29] border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-bold text-slate-500 uppercase">{s.label}</div>
            <div className="text-2xl font-bold font-sans text-slate-900 dark:text-white mt-1">{s.value}</div>
            <div className="text-[10px] font-bold mt-1" style={{ color: s.color }}>{s.change}</div>
          </div>
        ))}
      </div>
      <div className="p-6 rounded-lg bg-white dark:bg-[#241D29] border border-slate-200 dark:border-slate-800 text-center">
        <div className="text-sm text-slate-500 dark:text-slate-400 py-8">Detailed billing charts and GST reports will appear here.</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Reports & Analytics
// ═══════════════════════════════════════════════════════════════
function ReportsSection() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-extrabold text-[#4A1F2B] dark:text-[#E2838E] uppercase tracking-wider flex items-center gap-1.5"><FileText className="w-4 h-4" /> REPORTS & ANALYTICS</div>
        <h1 className="text-2xl font-bold font-sans text-slate-900 dark:text-white mt-1">Hospital Analytics</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "Monthly Patient Report", desc: "OPD/IPD patient flow analysis", icon: Heart },
          { title: "Revenue Report", desc: "GST billing & payment summary", icon: CreditCard },
          { title: "Staff Attendance", desc: "Daily staff check-in/out logs", icon: Users },
          { title: "Lab Report Summary", desc: "Test volume & turnaround time", icon: FlaskConical },
          { title: "Pharmacy Inventory", desc: "Stock levels & expiry alerts", icon: Pill },
          { title: "Bed Utilization", desc: "Ward-wise occupancy rates", icon: Bed },
        ].map((report) => {
          const Icon = report.icon;
          return (
            <div key={report.title} className="p-5 rounded-lg bg-white dark:bg-[#241D29] border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow cursor-pointer">
              <Icon className="w-5 h-5 text-[#4A1F2B] dark:text-[#E2838E] mb-3" />
              <h3 className="text-sm font-bold font-sans text-slate-900 dark:text-white">{report.title}</h3>
              <p className="text-[10px] text-slate-400 mt-1">{report.desc}</p>
              <button className="mt-3 text-[10px] font-bold text-[#4A1F2B] dark:text-[#E2838E] flex items-center gap-1">Download PDF <Download className="w-3 h-3" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Audit & Security
// ═══════════════════════════════════════════════════════════════
function AuditSection() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-extrabold text-[#4A1F2B] dark:text-[#E2838E] uppercase tracking-wider flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> AUDIT & SECURITY LOGS</div>
        <h1 className="text-2xl font-bold font-sans text-slate-900 dark:text-white mt-1">Security Audit Trail</h1>
      </div>
      <div className="p-6 rounded-lg bg-white dark:bg-[#241D29] border border-slate-200 dark:border-slate-800 space-y-3 font-mono text-xs">
        {[
          { time: "21:46:02", msg: "ABDM Health Data Exchange API v2.0 — Signature Validated (AES-256 GCM)", level: "info" },
          { time: "21:45:18", msg: "Cloud Backup Completed Successfully — Encrypted Payload Saved (Mumbai Region)", level: "info" },
          { time: "21:44:00", msg: "Hospital Admin login verified from IP 103.220.xx.xx", level: "auth" },
          { time: "21:42:30", msg: "Failed login attempt for unknown@test.com from IP 198.51.xx.xx (Rate limited)", level: "warn" },
          { time: "21:40:15", msg: "Patient record MRN #90412 accessed by Dr. Rajesh Patel (Authorized)", level: "info" },
          { time: "21:38:00", msg: "Password reset token generated for admin@medcore.in", level: "auth" },
        ].map((log, i) => (
          <div key={i} className={`p-3 rounded-md bg-[#1C1820] border border-[#3E3842] ${
            log.level === "warn" ? "text-amber-400" : log.level === "auth" ? "text-[#E2838E]" : "text-[#85B599]"
          }`}>
            [2026-08-22 {log.time}] {log.level.toUpperCase()}: {log.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: Hospital Settings
// ═══════════════════════════════════════════════════════════════
function SettingsSection() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-extrabold text-[#4A1F2B] dark:text-[#E2838E] uppercase tracking-wider flex items-center gap-1.5"><Settings className="w-4 h-4" /> HOSPITAL SETTINGS</div>
        <h1 className="text-2xl font-bold font-sans text-slate-900 dark:text-white mt-1">System Configuration</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hospital Info */}
        <div className="p-6 rounded-lg bg-white dark:bg-[#241D29] border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2"><Building2 className="w-4 h-4 text-[#4A1F2B] dark:text-[#E2838E]" /> Hospital Information</h3>
          {[
            { label: "Hospital Name", value: "Apex MedCore Superspeciality Hospital" },
            { label: "Registration No.", value: "GJ-AHM-MED-2024-8841" },
            { label: "Quality Framework", value: "NABH Workflow Aligned" },
            { label: "ABDM Architecture", value: "Integration Ready (ABHA Verified)" },
            { label: "Address", value: "SG Highway, Bodakdev, Ahmedabad, Gujarat 380054" },
          ].map((field) => (
            <div key={field.label} className="flex items-start justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <span className="text-xs text-slate-500 font-bold">{field.label}</span>
              <span className="text-xs text-slate-900 dark:text-white font-medium text-right max-w-[200px]">{field.value}</span>
            </div>
          ))}
        </div>

        {/* System Config */}
        <div className="p-6 rounded-lg bg-white dark:bg-[#241D29] border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2"><Settings className="w-4 h-4 text-[#4A1F2B] dark:text-[#E2838E]" /> System Config</h3>
          {[
            { label: "OPD Token Rate", value: "₹49 / token" },
            { label: "IPD Admission Fee", value: "₹199 / admission" },
            { label: "Lab Home Collection", value: "₹29 / sample" },
            { label: "WhatsApp Notifications", value: "Enabled" },
            { label: "Auto Backup", value: "Every 6 hours (Mumbai DC)" },
          ].map((field) => (
            <div key={field.label} className="flex items-start justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <span className="text-xs text-slate-500 font-bold">{field.label}</span>
              <span className="text-xs text-slate-900 dark:text-white font-medium">{field.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
