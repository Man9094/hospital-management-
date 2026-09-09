"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Activity,
  Cross,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("admin@medcore.in");
  const [password, setPassword] = useState("MedCore@2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/app");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(email.trim(), password, rememberMe);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/app");
        }, 800);
      } else {
        setError(result.error || "Authentication failed. Please check credentials.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const demoAccounts = [
    { label: "Hospital Admin", email: "admin@medcore.in", badge: "Admin Console" },
    { label: "Consultant Doctor", email: "doctor@medcore.in", badge: "Doctor EMR" },
    { label: "Nursing Station", email: "nurse@medcore.in", badge: "Ward Vitals" },
    { label: "Reception / OPD", email: "reception@medcore.in", badge: "Token Desk" },
    { label: "Pathologist (LIS)", email: "lab@medcore.in", badge: "Lab Orders" },
    { label: "Pharmacist", email: "pharmacy@medcore.in", badge: "Pharmacy POS" },
    { label: "Billing & TPA", email: "billing@medcore.in", badge: "GST Invoicing" },
    { label: "Patient Portal", email: "patient@medcore.in", badge: "Health Record" },
  ];

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("MedCore@2026");
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      
      {/* Background Gradient Blob */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#0F6CBD]/10 via-[#13C5DD]/15 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0F6CBD] to-[#13C5DD] flex items-center justify-center text-white shadow-lg font-bold">
            <Cross className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="font-poppins font-black text-2xl text-slate-900 dark:text-white uppercase">
            MEDCORE <span className="text-[#13C5DD] text-xs font-bold lowercase">hms</span>
          </span>
        </Link>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
          Indian Hospital Operating System • Secure Staff Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-8 space-y-6"
        >
          {/* Quick Demo Fill Chips */}
          <div className="space-y-2">
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#13C5DD]" />
              <span>One-Click Demo Account Login</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleQuickFill(account.email)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    email === account.email
                      ? "bg-[#13C5DD]/15 border-[#13C5DD] text-[#1D2A4D] dark:text-white font-extrabold"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  <div className="truncate font-bold">{account.label}</div>
                  <div className="text-[10px] opacity-70 truncate">{account.badge}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Authenticated! Redirecting to hospital workspace...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Clinical Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Password (Demo: MedCore@2026)
                </label>
                <Link href="/forgot-password" className="text-[#13C5DD] hover:underline font-bold">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 accent-[#13C5DD]"
              />
              <label htmlFor="remember" className="text-slate-600 dark:text-slate-400 cursor-pointer">
                Remember session for 7 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#13C5DD] to-[#0F6CBD] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Sign In to Hospital Workspace
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-400">
            <Link href="/" className="hover:text-[#13C5DD] font-bold">
              ← Return to MedCore Public Website
            </Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
