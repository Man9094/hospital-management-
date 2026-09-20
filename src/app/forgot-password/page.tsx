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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#18141C]">
      
      {/* ═══ Left Panel — Branding ═══ */}
      <div className="hidden lg:flex lg:w-[48%] relative bg-[#241D29] flex-col items-center justify-center p-12 overflow-hidden border-r border-[#3B3041]">
        <div className="relative z-10 max-w-md w-full space-y-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-md bg-[#4A1F2B] flex items-center justify-center text-white shadow-xs font-bold">
              <Cross className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-3xl tracking-wider uppercase text-white">
                MEDCORE <span className="text-[#C08491] text-sm lowercase font-semibold">hms</span>
              </h1>
              <p className="text-[#D5C2C5] text-xs uppercase tracking-[0.3em] font-semibold mt-1">
                Account Recovery
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white leading-relaxed">
              Secure Password
              <span className="text-[#C08491]"> Recovery Portal</span>
            </h2>
            <p className="text-sm text-[#D5C2C5] mt-3 leading-relaxed">
              Enter your registered official email and we'll help you reset your password securely.
            </p>
          </div>

          <ECGPulse color="#C08491" className="h-10 w-full px-6" />

          <div className="p-3.5 rounded-md bg-white/5 border border-[#3B3041]">
            <ShieldCheck className="w-5 h-5 text-[#3F6B52] mx-auto mb-2" />
            <p className="text-[11px] text-[#9B90A8] font-medium">
              Password reset links are valid for 1 hour and can only be used once under hospital security policy.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Right Panel — Form ═══ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative bg-[#F7F6F3] dark:bg-[#18141C]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-md bg-[#4A1F2B] flex items-center justify-center text-white shadow-xs">
                <Cross className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="font-sans font-bold text-xl tracking-wider uppercase text-[#1D1B1B] dark:text-white">
                MEDCORE <span className="text-[#4A1F2B] dark:text-[#C08491] text-xs lowercase font-semibold">hms</span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-[#241D29] rounded-lg border border-[#E3DFDB] dark:border-[#3B3041] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-8 relative overflow-hidden">
            {/* Header */}
            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E9EB] dark:bg-[#32293D] text-[#4A1F2B] dark:text-[#F7B5C3] text-xs font-semibold mb-3 border border-[#E3DFDB] dark:border-[#4C3C54]">
                <Activity className="w-3.5 h-3.5" /> Password Recovery
              </div>
              <h2 className="text-2xl font-bold text-[#1D1B1B] dark:text-white">
                {submitted ? "Check Your Email" : "Reset Password"}
              </h2>
              <p className="text-xs text-[#514346] dark:text-[#D5C2C5] mt-1">
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
                <div className="w-12 h-12 mx-auto rounded-full bg-[#EEF4F0] text-[#3F6B52] dark:bg-[#1C2C22] dark:text-[#7ADDB0] flex items-center justify-center border border-[#D4E3D9] dark:border-[#2C4A38]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <p className="text-xs text-[#514346] dark:text-[#D5C2C5]">
                  If an account with <span className="font-semibold text-[#4A1F2B] dark:text-[#C08491]">{email}</span> exists, you'll receive password reset instructions shortly.
                </p>
                <p className="text-[11px] text-[#837376]">
                  Didn't receive it? Check your spam folder or try again in a few minutes.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md bg-[#4A1F2B] text-white font-semibold text-xs hover:bg-[#70404B] transition-colors mt-2"
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
                    className="flex items-start gap-2 p-3 rounded-md bg-[#FFDAD6] border border-[#BA1A1A]/30 text-[#93000A] text-xs font-semibold"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-xs font-semibold text-[#514346] dark:text-[#D5C2C5] mb-1"
                  >
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#837376]" />
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
                      className="w-full h-9 pl-9 pr-3 rounded-md bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs font-semibold text-[#1D1B1B] dark:text-[#FEF8F7] placeholder:text-[#837376] focus:outline-none focus:border-[#4A1F2B] dark:focus:border-[#C08491] disabled:opacity-50 transition-all"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-9 rounded-md bg-[#4A1F2B] hover:bg-[#70404B] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                {/* Back to Login */}
                <div className="pt-2 text-center text-xs text-[#837376]">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="text-[#4A1F2B] dark:text-[#C08491] font-semibold hover:underline"
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
