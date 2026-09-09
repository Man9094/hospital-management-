"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ECGPulse from "@/components/ui/ECGPulse";
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Cross,
  Activity,
  ShieldCheck,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0B0F17]">
      
      {/* ═══ Left Panel — Branding ═══ */}
      <div className="hidden lg:flex lg:w-[48%] relative bg-[#1D2A4D] flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#13C5DD_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-[#13C5DD]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-[#00C896]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-md w-full space-y-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#13C5DD] flex items-center justify-center text-white shadow-lg shadow-[#13C5DD]/30">
              <Cross className="w-9 h-9 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-poppins font-extrabold text-3xl tracking-wider uppercase text-white">
                MEDCORE <span className="text-[#13C5DD] text-sm lowercase font-semibold">hms</span>
              </h1>
              <p className="text-slate-400 text-xs uppercase tracking-[0.3em] font-bold mt-1">
                Account Recovery
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold font-poppins text-white leading-relaxed">
              Secure Password
              <span className="text-[#13C5DD]"> Recovery Portal</span>
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Don't worry — it happens to everyone. Enter your registered email and we'll help you reset your password securely.
            </p>
          </div>

          <ECGPulse color="#13C5DD" className="h-10 w-full px-6" />

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <ShieldCheck className="w-5 h-5 text-[#00C896] mx-auto mb-2" />
            <p className="text-[10px] text-slate-400 font-medium">
              Password reset links are valid for 1 hour and can only be used once.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Right Panel — Form ═══ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#13C5DD]/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#13C5DD] flex items-center justify-center text-white shadow-md">
                <Cross className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="font-poppins font-extrabold text-xl tracking-wider uppercase text-white">
                MEDCORE <span className="text-[#13C5DD] text-xs lowercase font-semibold">hms</span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#13C5DD]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#00C896]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13C5DD]/10 text-[#13C5DD] text-xs font-semibold mb-3 border border-[#13C5DD]/20">
                <Activity className="w-3.5 h-3.5" /> Password Recovery
              </div>
              <h2 className="text-2xl font-bold font-poppins text-slate-900 dark:text-white">
                {submitted ? "Check Your Email" : "Reset Password"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {submitted
                  ? "We've sent recovery instructions to your email"
                  : "Enter your registered email to receive a reset link"}
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-4 relative z-10"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#00C896]/20 text-[#00C896] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  If an account with <span className="font-semibold text-[#13C5DD]">{email}</span> exists, you'll receive password reset instructions shortly.
                </p>
                <p className="text-xs text-slate-400">
                  Didn't receive it? Check your spam folder or try again in a few minutes.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#13C5DD] text-white font-semibold text-sm hover:bg-[#10b1c7] transition-colors mt-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
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

                {/* Email */}
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      id="forgot-email"
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#13C5DD] to-[#00C896] hover:from-[#10b1c7] hover:to-[#00a87e] text-white font-semibold text-sm shadow-lg shadow-[#13C5DD]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Back to Login */}
                <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="text-[#13C5DD] font-semibold hover:underline"
                  >
                    Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
