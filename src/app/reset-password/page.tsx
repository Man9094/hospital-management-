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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#18141C]">
      
      {/* ═══ Left Panel ═══ */}
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
                Set New Password
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white leading-relaxed">
              Create a Strong
              <span className="text-[#C08491]"> New Password</span>
            </h2>
            <p className="text-sm text-[#D5C2C5] mt-3 leading-relaxed">
              Choose a secure password that meets all requirements below to protect hospital and clinical records.
            </p>
          </div>

          <ECGPulse color="#C08491" className="h-10 w-full px-6" />
        </div>
      </div>

      {/* ═══ Right Panel ═══ */}
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

          <div className="bg-white dark:bg-[#241D29] rounded-lg border border-[#E3DFDB] dark:border-[#3B3041] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-8 relative overflow-hidden">
            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E9EB] dark:bg-[#32293D] text-[#4A1F2B] dark:text-[#F7B5C3] text-xs font-semibold mb-3 border border-[#E3DFDB] dark:border-[#4C3C54]">
                <Activity className="w-3.5 h-3.5" /> Set New Password
              </div>
              <h2 className="text-2xl font-bold text-[#1D1B1B] dark:text-white">
                {success ? "Password Updated!" : "Create New Password"}
              </h2>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-4 relative z-10"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-[#EEF4F0] text-[#3F6B52] dark:bg-[#1C2C22] dark:text-[#7ADDB0] flex items-center justify-center border border-[#D4E3D9] dark:border-[#2C4A38]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <p className="text-xs text-[#514346] dark:text-[#D5C2C5]">
                  Your password has been successfully changed.
                </p>
                <p className="text-[11px] text-[#837376]">
                  Redirecting to login...
                </p>
                <Loader2 className="w-4 h-4 mx-auto text-[#4A1F2B] dark:text-[#C08491] animate-spin" />
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

                {/* New Password */}
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-xs font-semibold text-[#514346] dark:text-[#D5C2C5] mb-1"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#837376]" />
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
                      className="w-full h-9 pl-9 pr-10 rounded-md bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs font-semibold text-[#1D1B1B] dark:text-[#FEF8F7] placeholder:text-[#837376] focus:outline-none focus:border-[#4A1F2B] dark:focus:border-[#C08491] disabled:opacity-50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#837376] hover:text-[#1D1B1B]"
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
                    className="p-3 rounded-md bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] space-y-1.5"
                  >
                    {requirements.map((req) => (
                      <div key={req.label} className="flex items-center gap-2 text-xs">
                        {req.met ? (
                          <Check className="w-3.5 h-3.5 text-[#3F6B52]" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-[#BA1A1A]" />
                        )}
                        <span className={req.met ? "text-[#3F6B52] font-semibold" : "text-[#837376]"}>
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
                    className="block text-xs font-semibold text-[#514346] dark:text-[#D5C2C5] mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#837376]" />
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
                      className={`w-full h-9 pl-9 pr-10 rounded-md bg-[#F8F2F2] dark:bg-[#18141C] text-xs font-semibold text-[#1D1B1B] dark:text-[#FEF8F7] placeholder:text-[#837376] focus:outline-none focus:border-[#4A1F2B] dark:focus:border-[#C08491] disabled:opacity-50 transition-all ${
                        confirmPassword.length > 0 && !passwordsMatch
                          ? "border border-[#BA1A1A]"
                          : "border border-[#E3DFDB] dark:border-[#3B3041]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#837376] hover:text-[#1D1B1B]"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="text-xs text-[#BA1A1A] mt-1 font-semibold">Passwords do not match.</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || !allRequirementsMet || !passwordsMatch}
                  className="w-full h-9 rounded-md bg-[#4A1F2B] hover:bg-[#70404B] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <span>Set New Password</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center text-xs text-[#837376]">
                  <Link href="/login" className="text-[#4A1F2B] dark:text-[#C08491] font-semibold hover:underline">
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
        <div className="min-h-screen bg-[#18141C] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#4A1F2B] dark:text-[#C08491] animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
