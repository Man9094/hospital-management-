"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePortal, RoleType, ROLES } from "@/context/PortalContext";
import { useAuth } from "@/context/AuthContext";
import { X, Lock, Mail, ShieldCheck, ArrowRight, Activity, Loader2, Sparkles } from "lucide-react";

export default function AuthModal() {
  const router = useRouter();
  const { isAuthModalOpen, setIsAuthModalOpen, authModalMode, setAuthModalMode, activeRole, setActiveRole } = usePortal();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<RoleType>("hospital_admin");
  const [email, setEmail] = useState("admin@medcore.in");
  const [password, setPassword] = useState("MedCore@2026");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthModalOpen) return null;

  const handleRoleSelect = (roleKey: RoleType) => {
    setSelectedRole(roleKey);
    const meta = ROLES[roleKey];
    if (meta && meta.email) {
      setEmail(meta.email);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await login(email, password, true);
      if (result.success) {
        setActiveRole(selectedRole);
        setIsAuthModalOpen(false);
        router.push("/app");
      } else {
        setError(result.error || "Authentication failed. Please check credentials.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13C5DD]/10 text-[#13C5DD] text-xs font-bold mb-2 border border-[#13C5DD]/20">
              <Activity className="w-3.5 h-3.5" /> MedCore Hospital Authentication
            </div>
            <h2 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white">
              Hospital Staff & Patient Login
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select a role for instant demo authentication or enter your credentials.
            </p>
          </div>

          {/* Quick Role Select Chips */}
          <div className="mb-6 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Choose Pre-Configured Demo Role
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(ROLES) as RoleType[]).slice(0, 6).map((rKey) => {
                const r = ROLES[rKey];
                const isSelected = selectedRole === rKey;
                return (
                  <button
                    key={rKey}
                    type="button"
                    onClick={() => handleRoleSelect(rKey)}
                    className={`p-2 rounded-xl text-left border text-xs transition-all ${
                      isSelected
                        ? "bg-[#13C5DD] text-[#1D2A4D] font-extrabold border-[#13C5DD] shadow-sm"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    <div className="truncate font-bold">{r.badge}</div>
                    <div className="text-[10px] opacity-75 truncate">{r.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Clinical Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password (Demo: MedCore@2026)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#13C5DD] to-[#0F6CBD] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  <span>Sign In as {ROLES[selectedRole]?.badge || "User"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-[10px] text-slate-400">
            Protected under AES-256 GCM encryption • ABDM-ready authorization
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
