"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import ECGPulse from "@/components/ui/ECGPulse";
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
  Heart,
  Stethoscope,
  Building2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/app");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);

    const result = await login(email, password, rememberMe);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.replace("/app");
      }, 800);
    } else {
      setError(result.error || "Login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Show nothing while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#13C5DD] animate-spin" />
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0B0F17]">
      
      {/* ═══════════════════════════════════════════════════════════
          LEFT PANEL — Hospital Branding & Visual
         ═══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[48%] relative bg-[#1D2A4D] flex-col items-center justify-center p-12 overflow-hidden">
        {/* Subtle medical grid background */}
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#13C5DD_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        {/* Top-right glow */}
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-[#13C5DD]/15 rounded-full blur-[100px] pointer-events-none" />
        {/* Bottom-left glow */}
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-[#00C896]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-md w-full space-y-8 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#13C5DD] flex items-center justify-center text-white shadow-lg shadow-[#13C5DD]/30">
              <Cross className="w-9 h-9 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-poppins font-extrabold text-3xl tracking-wider uppercase text-white">
                MEDINNOVA <span className="text-[#13C5DD] text-sm lowercase font-semibold">care</span>
              </h1>
              <p className="text-slate-400 text-xs uppercase tracking-[0.3em] font-bold mt-1">
                Hospital Management System
              </p>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold font-poppins text-white leading-relaxed">
              Secure Clinical Portal for
              <span className="text-[#13C5DD]"> Healthcare Professionals</span>
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Access patient records, manage appointments, lab diagnostics, pharmacy inventory, and billing — all from one unified command center.
            </p>
          </motion.div>

          {/* ECG Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="px-6"
          >
            <ECGPulse color="#13C5DD" className="h-10 w-full" />
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <ShieldCheck className="w-5 h-5 text-[#00C896] mx-auto mb-1" />
              <div className="text-[10px] font-bold text-slate-300 uppercase">ABDM Ready</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <Heart className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-slate-300 uppercase">500+ Hospitals</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <Building2 className="w-5 h-5 text-[#13C5DD] mx-auto mb-1" />
              <div className="text-[10px] font-bold text-slate-300 uppercase">Enterprise Grade</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          RIGHT PANEL — Login Form
         ═══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        {/* Subtle background glow for right panel */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#13C5DD]/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile Logo (shown on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#13C5DD] flex items-center justify-center text-white shadow-md">
                <Cross className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="font-poppins font-extrabold text-xl tracking-wider uppercase text-white">
                  MEDINNOVA <span className="text-[#13C5DD] text-xs lowercase font-semibold">care</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
            {/* Card glow accents */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#13C5DD]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#00C896]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13C5DD]/10 text-[#13C5DD] text-xs font-semibold mb-3 border border-[#13C5DD]/20">
                <Activity className="w-3.5 h-3.5" /> MedCore Cloud Platform
              </div>
              <h2 className="text-2xl font-bold font-poppins text-slate-900 dark:text-white">
                Sign in to Portal
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Enter your credentials to access your workspace
              </p>
            </div>

            {/* Success State */}
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-3"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#00C896]/20 text-[#00C896] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Authentication Successful
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Redirecting to your dashboard...
                </p>
                <Loader2 className="w-5 h-5 mx-auto text-[#13C5DD] animate-spin mt-2" />
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="admin@medcore.in"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#13C5DD] disabled:opacity-50 transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="login-password"
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-[#13C5DD] hover:underline font-medium"
                      tabIndex={-1}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#13C5DD] disabled:opacity-50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2">
                  <input
                    id="login-remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isSubmitting}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#13C5DD] focus:ring-[#13C5DD] bg-slate-50 dark:bg-slate-900"
                  />
                  <label
                    htmlFor="login-remember"
                    className="text-xs text-slate-600 dark:text-slate-400 font-medium cursor-pointer select-none"
                  >
                    Remember me for 7 days
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#13C5DD] to-[#00C896] hover:from-[#10b1c7] hover:to-[#00a87e] text-white font-semibold text-sm shadow-lg shadow-[#13C5DD]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In to Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Back to Home */}
                <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                  <Link
                    href="/"
                    className="text-[#13C5DD] font-semibold hover:underline"
                  >
                    ← Back to MedInnova Home
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-slate-500 dark:text-slate-600 mt-4">
            Protected by 256-bit AES encryption • ABDM compliant architecture
          </p>
        </motion.div>
      </div>
    </div>
  );
}
