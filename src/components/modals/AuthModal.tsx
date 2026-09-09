"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortal, RoleType, ROLES } from "@/context/PortalContext";
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Activity, Hospital } from "lucide-react";

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalMode, setAuthModalMode, setActiveRole } = usePortal();
  const [selectedRole, setSelectedRole] = useState<RoleType>("hospital_admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setActiveRole(selectedRole);
      setSubmitted(false);
      setIsAuthModalOpen(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8"
        >
          {/* Background Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0F6CBD]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#00C896]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F6CBD]/10 text-[#0F6CBD] dark:text-[#4CC9F0] text-xs font-semibold mb-3 border border-[#0F6CBD]/20">
              <Activity className="w-3.5 h-3.5" /> MedCore Cloud Platform
            </div>
            <h2 className="text-2xl font-bold font-poppins text-slate-900 dark:text-white">
              {authModalMode === "login"
                ? "Sign in to Portal"
                : authModalMode === "signup"
                ? "Start 14-Day Free Trial"
                : "Reset Password"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {authModalMode === "login"
                ? "Select your hospital role to access specialized workspace"
                : authModalMode === "signup"
                ? "Join 500+ top medical centers worldwide"
                : "Enter your registered clinical email to receive reset code"}
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8 text-center space-y-3"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-[#00C896]/20 text-[#00C896] flex items-center justify-center">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Authenticating Session...
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Redirecting to <span className="font-semibold text-[#0F6CBD] dark:text-[#4CC9F0]">{ROLES[selectedRole].name}</span> command center.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Picker for Login & Signup */}
              {authModalMode !== "forgot" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Access Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as RoleType)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                  >
                    {Object.values(ROLES).map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name} ({role.badge})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Name for Signup */}
              {authModalMode === "signup" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Dr. Eleanor Vance"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Hospital / Clinic Name
                    </label>
                    <div className="relative">
                      <Hospital className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="St. Jude Memorial Hospital"
                        value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="admin@metrohealth.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                  />
                </div>
              </div>

              {/* Password */}
              {authModalMode !== "forgot" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    {authModalMode === "login" && (
                      <button
                        type="button"
                        onClick={() => setAuthModalMode("forgot")}
                        className="text-xs text-[#0F6CBD] dark:text-[#4CC9F0] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0F6CBD] to-[#00C896] hover:from-[#0c5999] hover:to-[#00a87e] text-white font-semibold text-sm shadow-lg shadow-[#0F6CBD]/25 flex items-center justify-center gap-2 transition-all"
              >
                {authModalMode === "login"
                  ? "Launch Workspace Portal"
                  : authModalMode === "signup"
                  ? "Create Free Enterprise Account"
                  : "Send Password Reset Link"}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Mode Toggles */}
              <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                {authModalMode === "login" ? (
                  <span>
                    New hospital organization?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthModalMode("signup")}
                      className="text-[#0F6CBD] dark:text-[#4CC9F0] font-semibold hover:underline"
                    >
                      Start Free Trial
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthModalMode("login")}
                      className="text-[#0F6CBD] dark:text-[#4CC9F0] font-semibold hover:underline"
                    >
                      Sign In
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
