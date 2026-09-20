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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg overflow-hidden rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-[0_4px_16px_rgba(41,39,39,0.08)] p-6"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1 rounded text-[#837376] hover:text-[#1D1B1B] dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F3E9EB] dark:bg-[#4A1F2B]/40 text-[#4A1F2B] dark:text-[#F7B5C3] text-[11px] font-bold mb-2">
              <Activity className="w-3.5 h-3.5" /> MedCore Hospital Authentication
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#1D1B1B] dark:text-white">
              Hospital Staff &amp; Patient Login
            </h2>
            <p className="text-xs text-[#837376] mt-0.5">
              Select a pre-configured role for instant access or enter your credentials.
            </p>
          </div>

          {/* Quick Role Select Chips */}
          <div className="mb-4 space-y-1.5">
            <div className="text-[10px] font-bold text-[#837376] uppercase tracking-wider">
              Choose Role Workspace
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(Object.keys(ROLES) as RoleType[]).slice(0, 6).map((rKey) => {
                const r = ROLES[rKey];
                const isSelected = selectedRole === rKey;
                return (
                  <button
                    key={rKey}
                    type="button"
                    onClick={() => handleRoleSelect(rKey)}
                    className={`p-2 rounded-lg text-left border text-xs transition-all ${
                      isSelected
                        ? "bg-[#4A1F2B] text-white font-bold border-[#4A1F2B] shadow-xs"
                        : "bg-[#F8F2F2] dark:bg-[#18141C] border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white hover:border-[#4A1F2B]"
                    }`}
                  >
                    <div className="font-bold truncate">{r.name}</div>
                    <div className="text-[10px] opacity-75 truncate">{r.badge}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="mb-3 p-2.5 rounded-lg bg-[#FFDAD6] text-[#93000A] text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-[#514346] dark:text-[#A89CA0] mb-0.5">
                Staff / Patient Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#837376]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-8 pl-9 pr-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white font-semibold focus:outline-none focus:border-[#4A1F2B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#514346] dark:text-[#A89CA0] mb-0.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#837376]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-8 pl-9 pr-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white font-semibold focus:outline-none focus:border-[#4A1F2B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-9 rounded bg-[#4A1F2B] hover:bg-[#70404B] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
              <span>Authenticate &amp; Open Workspace</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
