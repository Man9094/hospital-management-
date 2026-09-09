"use client";

import React, { useState } from "react";
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

// ─── Admin Page Component ───────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ─── Auth Guards ──────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#13C5DD] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const allowedRoles = ["hospital_admin", "super_admin"];
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="p-8 rounded-3xl bg-[#111827] border border-red-500/20 shadow-2xl space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-extrabold font-poppins text-white">Access Denied</h1>
            <p className="text-sm text-slate-400">
              The <span className="font-bold text-white">Hospital Admin Panel</span> is restricted to authorized administrators only.
            </p>
            <p className="text-xs text-slate-500">
              Your role: <span className="font-bold text-[#13C5DD]">{user.role.replace("_", " ").toUpperCase()}</span>
            </p>
          </div>
          <button
            onClick={() => router.push("/app")}
            className="px-6 py-3 rounded-xl bg-[#13C5DD] text-white font-bold text-xs uppercase flex items-center justify-center gap-2 mx-auto"
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
    <div className="min-h-screen bg-[#F3F6F9] dark:bg-[#0B0F17] flex flex-col font-sans transition-colors duration-300">
      
      {/* ═══ Admin Top Header ═══ */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#0F1629] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#13C5DD] flex items-center justify-center text-white shadow-md">
              <Cross className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-poppins font-extrabold text-lg text-[#1D2A4D] dark:text-white tracking-wide uppercase">
                MEDCORE <span className="text-[#13C5DD] text-xs font-bold lowercase">admin</span>
              </span>
            </div>
          </Link>

          {/* Admin Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-extrabold uppercase">
            <ShieldCheck className="w-3 h-3" /> Hospital Admin Panel
          </div>
        </div>

        {/* Search */}
        <div className="hidden lg:flex items-center relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff, patient, department..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#13C5DD]"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          </button>

          <ThemeToggle />

          {/* User Menu */}
          <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-500">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{user.name}</div>
                <div className="text-[10px] text-amber-500 font-bold">Administrator</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{user.email}</div>
                  <div className="text-[10px] font-bold text-amber-500 mt-0.5">Hospital Administrator</div>
                </div>
                <Link
                  href="/app"
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> General Dashboard
                </Link>
                <button
                  onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ═══ Body ═══ */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ═══ Admin Sidebar ═══ */}
        <aside className={`bg-white dark:bg-[#0F1629] border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}>
          <div className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Administration</div>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#13C5DD] text-white shadow-md"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors uppercase disabled:opacity-50"
            >
              {isLoggingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </aside>

        {/* ═══ Main Content ═══ */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
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
    { label: "Total Patients Today", value: "247", change: "+12%", trend: "up", icon: Heart, color: "#E63946" },
    { label: "Beds Occupied", value: "182/240", change: "76%", trend: "neutral", icon: Bed, color: "#13C5DD" },
    { label: "Active Staff", value: "32", change: "+2", trend: "up", icon: Users, color: "#00C896" },
    { label: "Today's Revenue", value: "₹4,82,500", change: "+18%", trend: "up", icon: CreditCard, color: "#F59E0B" },
    { label: "OPD Tokens", value: "89", change: "-5%", trend: "down", icon: Calendar, color: "#8B5CF6" },
    { label: "Pending Lab Reports", value: "14", change: "-3", trend: "down", icon: FlaskConical, color: "#EC4899" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4" /> HOSPITAL ADMINISTRATION — OVERVIEW
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
            Admin Command Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time hospital operations overview • {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-[#13C5DD] text-white text-xs font-bold flex items-center gap-2 shadow-md hover:bg-[#10b1c7] transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-5 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.color + "15" }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === "up" ? "text-[#00C896]" : stat.trend === "down" ? "text-red-400" : "text-slate-400"}`}>
                  {stat.trend === "up" && <TrendingUp className="w-3.5 h-3.5" />}
                  {stat.trend === "down" && <TrendingDown className="w-3.5 h-3.5" />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#13C5DD]" /> Recent Hospital Activity
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
                  event.type === "success" ? "bg-[#00C896]" :
                  event.type === "warning" ? "bg-amber-400" :
                  event.type === "danger" ? "bg-red-400" :
                  "bg-[#13C5DD]"
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
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Quick Actions
          </h3>
          <div className="space-y-2">
            {[
              { label: "Add New Staff Member", icon: UserPlus, color: "#00C896" },
              { label: "Register Patient", icon: Heart, color: "#E63946" },
              { label: "Create Department", icon: Building2, color: "#8B5CF6" },
              { label: "Generate Invoice", icon: CreditCard, color: "#F59E0B" },
              { label: "View Audit Logs", icon: ShieldCheck, color: "#13C5DD" },
              { label: "Download Reports", icon: Download, color: "#EC4899" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button key={action.label} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: action.color + "15" }}>
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
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4" /> STAFF MANAGEMENT
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">Hospital Staff Directory</h1>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-[#13C5DD] text-white text-xs font-bold flex items-center gap-2 shadow-md">
          <UserPlus className="w-4 h-4" /> Add New Staff
        </button>
      </div>

      {/* Staff Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: "32", icon: Users, color: "#13C5DD" },
          { label: "Active", value: "28", icon: UserCheck, color: "#00C896" },
          { label: "On Leave", value: "3", icon: Clock, color: "#F59E0B" },
          { label: "Inactive", value: "1", icon: UserX, color: "#E63946" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-4 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" style={{ color: s.color }} />
                <span className="text-[10px] font-bold text-slate-500 uppercase">{s.label}</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Staff Table */}
      <div className="rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
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
                      <div className="w-8 h-8 rounded-full bg-[#13C5DD]/10 flex items-center justify-center text-[#13C5DD] font-bold text-[10px]">
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
                      member.status === "active" ? "bg-[#00C896]/10 text-[#00C896]" :
                      member.status === "on_leave" ? "bg-amber-500/10 text-amber-500" :
                      "bg-red-500/10 text-red-500"
                    }`}>
                      ● {member.status === "active" ? "Active" : member.status === "on_leave" ? "On Leave" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{member.joined}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-[#13C5DD]"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-500"><Edit className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
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
        <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
          <Heart className="w-4 h-4" /> PATIENT RECORDS
        </div>
        <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">Patient Database</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Registered", value: "12,847", icon: Users, color: "#13C5DD" },
          { label: "Active (IPD)", value: "182", icon: Bed, color: "#00C896" },
          { label: "Today OPD", value: "89", icon: Calendar, color: "#8B5CF6" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-5 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2"><Icon className="w-4 h-4" style={{ color: s.color }} /><span className="text-[10px] font-bold text-slate-500 uppercase">{s.label}</span></div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{s.value}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 p-6 overflow-x-auto">
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
                <td className="p-3 font-extrabold text-[#13C5DD]">{p.mrn}</td>
                <td className="p-3 font-bold text-slate-900 dark:text-white">{p.name}</td>
                <td className="p-3 text-slate-400 font-mono">{p.abha}</td>
                <td className="p-3">{p.phone}</td>
                <td className="p-3">{p.lastVisit}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    p.status === "IPD" ? "bg-[#13C5DD]/10 text-[#13C5DD]" :
                    p.status === "OPD" ? "bg-[#00C896]/10 text-[#00C896]" :
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
    { name: "Cardiology", head: "Dr. Sneha Shah", staff: 8, patients: 24, status: "active", color: "#E63946" },
    { name: "Orthopedic", head: "Dr. Amit Mehta", staff: 6, patients: 18, status: "active", color: "#13C5DD" },
    { name: "Pathology Lab", head: "David Chen", staff: 5, patients: 0, status: "active", color: "#8B5CF6" },
    { name: "General Medicine", head: "Dr. Rajesh Patel", staff: 10, patients: 42, status: "active", color: "#00C896" },
    { name: "Pharmacy", head: "Maria Santos", staff: 4, patients: 0, status: "active", color: "#F59E0B" },
    { name: "Emergency / ICU", head: "Dr. Anand Kumar", staff: 12, patients: 8, status: "active", color: "#EC4899" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4" /> DEPARTMENTS
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">Department Management</h1>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-[#13C5DD] text-white text-xs font-bold flex items-center gap-2 shadow-md">
          <Building2 className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div key={dept.name} className="p-5 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: dept.color + "15" }}>
                <Stethoscope className="w-5 h-5" style={{ color: dept.color }} />
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#00C896]/10 text-[#00C896] text-[10px] font-bold">● Active</span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{dept.name}</h3>
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
        <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5"><Bed className="w-4 h-4" /> BED & WARD CONFIGURATION</div>
        <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">Ward & Bed Management</h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Beds", value: "240", color: "#13C5DD" },
          { label: "Occupied", value: "182", color: "#E63946" },
          { label: "Available", value: "52", color: "#00C896" },
          { label: "Maintenance", value: "6", color: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 p-6 overflow-x-auto">
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
                <td className="p-3 font-bold text-[#00C896]">{w.available}</td>
                <td className="p-3 font-bold text-[#13C5DD]">{w.rate}</td>
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
        <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> REVENUE & BILLING</div>
        <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">Financial Overview</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Monthly Revenue", value: "₹1,42,50,000", change: "+22%", color: "#00C896" },
          { label: "Pending Payments", value: "₹8,45,000", change: "12 invoices", color: "#F59E0B" },
          { label: "Insurance Claims", value: "₹34,00,000", change: "8 pending", color: "#13C5DD" },
        ].map((s) => (
          <div key={s.label} className="p-5 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-bold text-slate-500 uppercase">{s.label}</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{s.value}</div>
            <div className="text-[10px] font-bold mt-1" style={{ color: s.color }}>{s.change}</div>
          </div>
        ))}
      </div>
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 text-center">
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
        <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5"><FileText className="w-4 h-4" /> REPORTS & ANALYTICS</div>
        <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">Hospital Analytics</h1>
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
            <div key={report.title} className="p-5 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow cursor-pointer">
              <Icon className="w-5 h-5 text-[#13C5DD] mb-3" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{report.title}</h3>
              <p className="text-[10px] text-slate-400 mt-1">{report.desc}</p>
              <button className="mt-3 text-[10px] font-bold text-[#13C5DD] flex items-center gap-1">Download PDF <Download className="w-3 h-3" /></button>
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
        <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> AUDIT & SECURITY LOGS</div>
        <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">Security Audit Trail</h1>
      </div>
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 space-y-3 font-mono text-xs">
        {[
          { time: "21:46:02", msg: "ABDM Health Data Exchange API v2.0 — Signature Validated (AES-256 GCM)", level: "info" },
          { time: "21:45:18", msg: "Cloud Backup Completed Successfully — Encrypted Payload Saved (Mumbai Region)", level: "info" },
          { time: "21:44:00", msg: "Hospital Admin login verified from IP 103.220.xx.xx", level: "auth" },
          { time: "21:42:30", msg: "Failed login attempt for unknown@test.com from IP 198.51.xx.xx (Rate limited)", level: "warn" },
          { time: "21:40:15", msg: "Patient record MRN #90412 accessed by Dr. Rajesh Patel (Authorized)", level: "info" },
          { time: "21:38:00", msg: "Password reset token generated for admin@medcore.in", level: "auth" },
        ].map((log, i) => (
          <div key={i} className={`p-3 rounded-xl bg-slate-900 ${
            log.level === "warn" ? "text-amber-400" : log.level === "auth" ? "text-blue-400" : "text-green-400"
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
        <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5"><Settings className="w-4 h-4" /> HOSPITAL SETTINGS</div>
        <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">System Configuration</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hospital Info */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2"><Building2 className="w-4 h-4 text-[#13C5DD]" /> Hospital Information</h3>
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
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2"><Settings className="w-4 h-4 text-[#13C5DD]" /> System Config</h3>
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
