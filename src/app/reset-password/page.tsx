"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import ECGPulse from "@/components/ui/ECGPulse";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Cross,
  Activity,
  Check,
  X,
} from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password requirements
  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  const allRequirementsMet = requirements.every((r) => r.met);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      router.replace("/forgot-password");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!allRequirementsMet) {
      setError("Password does not meet all requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.replace("/login");
        }, 3000);
      } else {
        setError(data.error || "Failed to reset password. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0B0F17]">
      
      {/* ═══ Left Panel ═══ */}
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
                Set New Password
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold font-poppins text-white leading-relaxed">
              Create a Strong
              <span className="text-[#13C5DD]"> New Password</span>
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Choose a secure password that meets all requirements below. This protects your account and patient data.
            </p>
          </div>

          <ECGPulse color="#13C5DD" className="h-10 w-full px-6" />
        </div>
      </div>

      {/* ═══ Right Panel ═══ */}
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

          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#13C5DD]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#00C896]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13C5DD]/10 text-[#13C5DD] text-xs font-semibold mb-3 border border-[#13C5DD]/20">
                <Activity className="w-3.5 h-3.5" /> Set New Password
              </div>
              <h2 className="text-2xl font-bold font-poppins text-slate-900 dark:text-white">
                {success ? "Password Updated!" : "Create New Password"}
              </h2>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-4 relative z-10"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#00C896]/20 text-[#00C896] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Your password has been successfully changed.
                </p>
                <p className="text-xs text-slate-400">
                  Redirecting to login...
                </p>
                <Loader2 className="w-5 h-5 mx-auto text-[#13C5DD] animate-spin" />
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

                {/* New Password */}
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Enter new password"
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
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements Checklist */}
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
                  >
                    {requirements.map((req) => (
                      <div key={req.label} className="flex items-center gap-2 text-xs">
                        {req.met ? (
                          <Check className="w-3.5 h-3.5 text-[#00C896]" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-red-400" />
                        )}
                        <span className={req.met ? "text-[#00C896]" : "text-slate-500 dark:text-slate-400"}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-12 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#13C5DD] disabled:opacity-50 transition-all ${
                        confirmPassword.length > 0 && !passwordsMatch
                          ? "border-red-300 dark:border-red-500/30"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || !allRequirementsMet || !passwordsMatch}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#13C5DD] to-[#00C896] hover:from-[#10b1c7] hover:to-[#00a87e] text-white font-semibold text-sm shadow-lg shadow-[#13C5DD]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      Set New Password
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                  <Link href="/login" className="text-[#13C5DD] font-semibold hover:underline">
                    ← Back to Login
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#13C5DD] animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
