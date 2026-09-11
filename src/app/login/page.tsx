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
  User,
  Phone,
  KeyRound,
  QrCode,
  Heart,
  Stethoscope,
  RefreshCw,
  Clock,
  MessageSquare,
  ExternalLink,
  Share2,
  Copy,
  Check
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading, checkAuth } = useAuth();

  // Mode: "patient" (UHID/OTP Login) vs "staff" (Credentials Login)
  const [portalMode, setPortalMode] = useState<"patient" | "staff">("patient");

  // ─── Staff Login State ──────────────────────────────────────────
  const [email, setEmail] = useState("doctor@medcore.in");
  const [password, setPassword] = useState("MedCore@2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Patient OTP Login State ────────────────────────────────────
  const [patientIdentifier, setPatientIdentifier] = useState("9328898884");
  const [patientStep, setPatientStep] = useState<"input" | "otp">("input");
  const [otpCode, setOtpCode] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [whatsappMessage, setWhatsappMessage] = useState<string | null>(null);

  // ─── Shared UI State ───────────────────────────────────────────
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/app");
    }
  }, [authLoading, isAuthenticated, router]);

  // ─── Staff Login Handler ────────────────────────────────────────
  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter staff email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(email.trim(), password, rememberMe);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/app");
        }, 600);
      } else {
        setError(result.error || "Authentication failed. Please check credentials.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Patient Send OTP Handler ───────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOtpMessage("");

    if (!patientIdentifier.trim()) {
      setError("Please enter your Hospital UHID, Mobile Number, or Email.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/patient-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_otp",
          identifier: patientIdentifier.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPatientInfo({
          name: data.patient_name,
          uhid: data.patient_uhid,
          maskedMobile: data.masked_mobile,
          phone: data.phone,
          whatsappWebUrl: data.whatsapp_web_url,
        });
        setDemoOtp(data.otp);
        setWhatsappUrl(data.whatsapp_url);
        setWhatsappMessage(data.whatsapp_message);
        setOtpMessage(`Security code generated for ${data.masked_mobile}`);
        setPatientStep("otp");

        // Automatically open WhatsApp with pre-filled OTP
        if (data.whatsapp_url) {
          try {
            window.open(data.whatsapp_url, "_blank");
          } catch (e) {
            console.error("Popup blocked", e);
          }
        }
      } else {
        setError(data.error || "Failed to find patient record. Please check UHID or phone.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to reach authentication server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Patient Verify OTP Handler ─────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otpCode || otpCode.trim().length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/patient-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action: "verify_otp",
          identifier: patientIdentifier.trim(),
          otp: otpCode.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        await checkAuth();
        setTimeout(() => {
          router.push("/app");
        }, 600);
      } else {
        setError(data.error || "Invalid OTP code. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to verify code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Staff Demo Presets
  const staffDemoAccounts = [
    { label: "Consultant Doctor", email: "doctor@medcore.in", badge: "Doctor EMR" },
    { label: "Hospital Admin", email: "admin@medcore.in", badge: "Admin Hub" },
    { label: "Nursing Station", email: "nurse@medcore.in", badge: "Vitals & IPD" },
    { label: "Reception Desk", email: "reception@medcore.in", badge: "Token Dispenser" },
    { label: "Pathologist (LIS)", email: "lab@medcore.in", badge: "Lab Diagnostics" },
    { label: "Pharmacist", email: "pharmacy@medcore.in", badge: "FEFO Stock" },
  ];

  // Patient Demo Presets
  const patientDemoAccounts = [
    { name: "Man Chaudhary", uhid: "MC-2026-000108", mobile: "+91 93288 98884", status: "Live OPD Token (Case #2 - Cabin 104)" },
    { name: "Alexander Vance", uhid: "MC-2026-000106", mobile: "+91 98250 99881", status: "In Doctor Cabin (Case #1)" },
    { name: "Rameshbhai Patel", uhid: "MC-2026-000101", mobile: "+91 98250 14892", status: "Inpatient (Diabetic Review)" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#0F6CBD]/15 via-[#13C5DD]/20 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-2.5">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0F6CBD] to-[#13C5DD] flex items-center justify-center text-white shadow-lg shadow-[#13C5DD]/20 font-bold">
            <Cross className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="font-poppins font-black text-2xl text-slate-900 dark:text-white uppercase tracking-tight">
            MEDCORE <span className="text-[#13C5DD] text-xs font-bold lowercase">hms</span>
          </span>
        </Link>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
          Indian Hospital Operating System • Secure Access Gateway
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-8 space-y-6"
        >
          
          {/* Dual Portal Switcher Tabs */}
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setPortalMode("patient");
                setError("");
                setSuccess(false);
              }}
              className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                portalMode === "patient"
                  ? "bg-[#13C5DD] text-[#1D2A4D] shadow-md font-black"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Patient / OPD Portal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPortalMode("staff");
                setError("");
                setSuccess(false);
              }}
              className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                portalMode === "staff"
                  ? "bg-[#13C5DD] text-[#1D2A4D] shadow-md font-black"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor & Staff Login</span>
            </button>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Authenticated successfully! Redirecting to dashboard...</span>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB 1: PATIENT OTP LOGIN (SIMPLE & SECURE) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {portalMode === "patient" && (
            <div className="space-y-5">
              
              {/* Patient Demo One-Click Fill */}
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#13C5DD]" />
                  <span>Choose Demo Patient or Enter Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {patientDemoAccounts.map((p) => (
                    <button
                      key={p.uhid}
                      type="button"
                      onClick={() => {
                        setPatientIdentifier(p.uhid);
                        setPatientStep("input");
                        setError("");
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        patientIdentifier === p.uhid
                          ? "bg-[#13C5DD]/15 border-[#13C5DD] text-[#1D2A4D] dark:text-white"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-extrabold truncate">{p.name}</div>
                      <div className="text-[10px] text-[#13C5DD] font-mono font-bold">{p.uhid}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 truncate">{p.status}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 1: ENTER UHID / MOBILE */}
              {patientStep === "input" && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                      Hospital UHID or Registered Mobile Number
                    </label>
                    <div className="relative">
                      <QrCode className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={patientIdentifier}
                        onChange={(e) => setPatientIdentifier(e.target.value)}
                        placeholder="e.g. MC-2026-000106 or +91 98250 99881"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#13C5DD]"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">
                      Enter the Unique Hospital ID (UHID) provided during registration or your +91 mobile number.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#13C5DD] to-[#0F6CBD] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#13C5DD]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Get 6-Digit Secure OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: ENTER OTP */}
              {patientStep === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-[#13C5DD]/10 border border-[#13C5DD]/30 text-xs space-y-1">
                    <div className="font-extrabold text-[#13C5DD] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Security Code Sent
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">
                      Patient: <strong>{patientInfo?.name}</strong> ({patientInfo?.uhid})
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Sent to: <strong>{patientInfo?.maskedMobile}</strong>
                    </div>
                  </div>

                  {/* WhatsApp Automated Server Delivery Card */}
                  {whatsappUrl && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                          <MessageSquare className="w-4 h-4" />
                          <span>Automated WhatsApp Dispatch</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Delivered via Bot
                        </span>
                      </div>
                      
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                        <p>
                          ✅ OTP automatically sent from Hospital WhatsApp Gateway (<strong>+91 79 2658 9000</strong>) to <strong>+{patientInfo?.phone || "91 9328898884"}</strong>.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01]"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-white" />
                          <span>View on WhatsApp</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        {patientInfo?.whatsappWebUrl && (
                          <a
                            href={patientInfo.whatsappWebUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-[1.01]"
                          >
                            <span>WhatsApp Web</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                      Enter 6-Digit Verification Code
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="• • • • • •"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-lg font-black tracking-widest text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#13C5DD] font-mono"
                      />
                    </div>

                    {demoOtp && (
                      <div className="mt-2 flex items-center justify-between text-xs bg-slate-100 dark:bg-slate-900 p-2 rounded-xl">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Live Code: <strong className="text-[#13C5DD] font-mono font-black text-xs">{demoOtp}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setOtpCode(demoOtp)}
                          className="px-2.5 py-1 rounded-lg bg-[#13C5DD] text-[#1D2A4D] text-[10px] font-black uppercase hover:opacity-90 transition-colors shadow-sm"
                        >
                          Fill Code Now
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#13C5DD] to-[#0F6CBD] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#13C5DD]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Open Patient Portal</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setPatientStep("input");
                        setOtpCode("");
                        setError("");
                      }}
                      className="text-xs font-bold text-slate-400 hover:text-[#13C5DD] transition-colors"
                    >
                      ← Change UHID / Mobile Number
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB 2: STAFF & DOCTOR LOGIN (ENTERPRISE CREDENTIALS) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {portalMode === "staff" && (
            <div className="space-y-5">
              
              {/* Staff Quick Demo Presets */}
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#13C5DD]" />
                    <span>Instant Live Test Accounts</span>
                  </span>
                  <span className="text-[10px] text-emerald-500 font-black">All Roles Active</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                  {staffDemoAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={async () => {
                        setEmail(acc.email);
                        setPassword("MedCore@2026");
                        setError("");
                        setIsSubmitting(true);
                        try {
                          const result = await login(acc.email, "MedCore@2026", true);
                          if (result.success) {
                            setSuccess(true);
                            setTimeout(() => router.push("/app"), 500);
                          } else {
                            setError(result.error || "Login failed");
                          }
                        } catch {
                          setError("Network error");
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      className={`p-2 rounded-xl border text-left transition-all group hover:scale-[1.02] ${
                        email === acc.email
                          ? "bg-[#13C5DD]/15 border-[#13C5DD] text-[#1D2A4D] dark:text-white shadow-sm"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-extrabold truncate text-[11px] group-hover:text-[#13C5DD] transition-colors">{acc.label}</div>
                      <div className="text-[9px] text-[#13C5DD] font-bold truncate flex items-center justify-between mt-0.5">
                        <span>{acc.badge}</span>
                        <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Staff Form */}
              <form onSubmit={handleStaffSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                    Official Hospital Email ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="doctor@medcore.in"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#13C5DD]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-bold text-[#13C5DD] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#13C5DD]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#13C5DD] focus:ring-[#13C5DD]"
                    />
                    <span>Remember this device (7 days)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#13C5DD] to-[#0F6CBD] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#13C5DD]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Hospital Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

            </div>
          )}

          {/* Footer Security Badge */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> AES-256 ABDM Verified
            </span>
            <span>Apex MedCore HMS v2.0</span>
          </div>

        </motion.div>
      </div>

    </div>
  );
}
