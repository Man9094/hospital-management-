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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Patient OTP Login State ────────────────────────────────────
  const [patientIdentifier, setPatientIdentifier] = useState("");
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
          const redirectUrl = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("redirect") : null;
          router.push(redirectUrl || "/app");
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
    <div className="min-h-screen bg-[#F7F6F3] dark:bg-[#18141C] flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden transition-colors text-[#1D1B1B] dark:text-[#FEF8F7]">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-2.5">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-md bg-[#4A1F2B] flex items-center justify-center text-white shadow-xs font-bold">
            <Cross className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-sans font-bold text-2xl text-[#1D1B1B] dark:text-white uppercase tracking-tight">
            MEDCORE <span className="text-[#4A1F2B] dark:text-[#C08491] text-xs font-bold lowercase">hms</span>
          </span>
        </Link>
        <p className="text-xs text-[#514346] dark:text-[#D5C2C5] font-semibold uppercase tracking-wider">
          Warm Clinical Enterprise Hospital Operating System
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6"
        >
          
          {/* Top Switcher: Patient OTP vs Staff Credentials */}
          <div className="grid grid-cols-2 p-1 rounded-md bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041]">
            <button
              type="button"
              onClick={() => {
                setPortalMode("patient");
                setError("");
                setSuccess(false);
              }}
              className={`py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                portalMode === "patient"
                  ? "bg-[#4A1F2B] text-white shadow-xs font-bold"
                  : "text-[#514346] hover:text-[#1D1B1B] dark:hover:text-white"
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
              className={`py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                portalMode === "staff"
                  ? "bg-[#4A1F2B] text-white shadow-xs font-bold"
                  : "text-[#514346] hover:text-[#1D1B1B] dark:hover:text-white"
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor &amp; Staff Login</span>
            </button>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="p-3 rounded-md bg-[#FFDAD6] border border-[#BA1A1A]/30 text-[#93000A] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-md bg-[#EEF4F0] border border-[#3F6B52]/30 text-[#3F6B52] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#3F6B52]" />
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
                  <Sparkles className="w-3.5 h-3.5 text-[#4A1F2B] dark:text-[#C08491]" />
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
                      className={`p-2 rounded-md border text-left transition-all ${
                        patientIdentifier === p.uhid
                          ? "bg-[#F3E9EB] dark:bg-[#32293D] border-[#4A1F2B] dark:border-[#C08491] text-[#1D1B1B] dark:text-[#FEF8F7]"
                          : "bg-[#F8F2F2] dark:bg-[#18141C] border-[#E3DFDB] dark:border-[#3B3041] text-[#514346] dark:text-[#D5C2C5] hover:border-[#837376]"
                      }`}
                    >
                      <div className="font-bold truncate">{p.name}</div>
                      <div className="text-[10px] text-[#4A1F2B] dark:text-[#C08491] font-mono font-bold">{p.uhid}</div>
                      <div className="text-[9px] text-[#837376] mt-0.5 truncate">{p.status}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 1: ENTER UHID / MOBILE */}
              {patientStep === "input" && (
                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#514346] dark:text-[#D5C2C5] uppercase mb-1">
                      Hospital UHID or Registered Mobile Number
                    </label>
                    <div className="relative">
                      <QrCode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#837376]" />
                      <input
                        type="text"
                        required
                        value={patientIdentifier}
                        onChange={(e) => setPatientIdentifier(e.target.value)}
                        placeholder="e.g. MC-2026-000106 or +91 98250 99881"
                        className="w-full h-9 pl-9 pr-3 rounded-md bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs font-semibold text-[#1D1B1B] dark:text-[#FEF8F7] placeholder:text-[#837376] focus:outline-none focus:border-[#4A1F2B] dark:focus:border-[#C08491]"
                      />
                    </div>
                    <p className="text-[11px] text-[#837376] mt-1 font-medium">
                      Enter the Unique Hospital ID (UHID) provided during registration or your +91 mobile number.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-9 rounded-md bg-[#4A1F2B] hover:bg-[#70404B] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Get 6-Digit Secure OTP</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: ENTER OTP */}
              {patientStep === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-3.5 animate-in fade-in">
                  <div className="p-3 rounded-md bg-[#F3E9EB] dark:bg-[#32293D] border border-[#E3DFDB] dark:border-[#4C3C54] text-xs space-y-1">
                    <div className="font-bold text-[#4A1F2B] dark:text-[#C08491] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#3F6B52]" /> Security Code Sent
                    </div>
                    <div className="text-[#1D1B1B] dark:text-[#FEF8F7]">
                      Patient: <strong>{patientInfo?.name}</strong> ({patientInfo?.uhid})
                    </div>
                    <div className="text-[11px] text-[#837376]">
                      Sent to: <strong>{patientInfo?.maskedMobile}</strong>
                    </div>
                  </div>

                  {/* WhatsApp Automated Server Delivery Card */}
                  {whatsappUrl && (
                    <div className="p-3 rounded-md bg-[#EEF4F0] dark:bg-[#1C2C22] border border-[#3F6B52]/30 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#3F6B52] dark:text-[#7ADDB0] uppercase tracking-wide">
                          <MessageSquare className="w-4 h-4" />
                          <span>Automated WhatsApp Dispatch</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#3F6B52]/15 text-[#3F6B52] dark:text-[#7ADDB0] text-[10px] font-bold uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3F6B52] animate-pulse" />
                          Delivered via Bot
                        </span>
                      </div>
                      
                      <div className="text-[11px] text-[#514346] dark:text-[#D5C2C5]">
                        OTP automatically dispatched to <strong>+{patientInfo?.phone || "91 9328898884"}</strong> via MedCore HIS Gateway.
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-3 rounded-md bg-[#3F6B52] hover:bg-[#325642] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
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
                            className="py-1.5 px-3 rounded-md bg-[#4A1F2B] hover:bg-[#70404B] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <span>WhatsApp Web</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[#514346] dark:text-[#D5C2C5] uppercase mb-1">
                      Enter 6-Digit Verification Code
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#837376]" />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="• • • • • •"
                        className="w-full h-9 pl-9 pr-3 rounded-md bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-base font-bold tracking-widest text-center text-[#1D1B1B] dark:text-[#FEF8F7] focus:outline-none focus:border-[#4A1F2B] dark:focus:border-[#C08491] font-mono tabular-nums"
                      />
                    </div>

                    {demoOtp && (
                      <div className="mt-2 flex items-center justify-between text-xs bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] p-2 rounded-md">
                        <span className="text-[11px] text-[#514346] dark:text-[#D5C2C5]">
                          Live Code: <strong className="text-[#4A1F2B] dark:text-[#C08491] font-mono font-bold text-xs">{demoOtp}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setOtpCode(demoOtp)}
                          className="px-2 py-0.5 rounded bg-[#4A1F2B] text-white text-[10px] font-semibold uppercase hover:bg-[#70404B] transition-colors"
                        >
                          Fill Code Now
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-9 rounded-md bg-[#4A1F2B] hover:bg-[#70404B] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify &amp; Open Patient Portal</span>
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
                      className="text-xs font-semibold text-[#837376] hover:text-[#4A1F2B] dark:hover:text-[#C08491] transition-colors"
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
                    <Sparkles className="w-3.5 h-3.5 text-[#4A1F2B] dark:text-[#C08491]" />
                    <span>Instant Live Test Accounts</span>
                  </span>
                  <span className="text-[10px] text-[#3F6B52] dark:text-[#7ADDB0] font-bold">All Roles Active</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                  {staffDemoAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => {
                        setEmail(acc.email);
                        setPassword("MedCore@2026");
                        setError("");
                      }}
                      className={`p-2 rounded-md border text-left transition-all group ${
                        email === acc.email
                          ? "bg-[#F3E9EB] dark:bg-[#32293D] border-[#4A1F2B] dark:border-[#C08491] text-[#1D1B1B] dark:text-[#FEF8F7] shadow-xs"
                          : "bg-[#F8F2F2] dark:bg-[#18141C] border-[#E3DFDB] dark:border-[#3B3041] text-[#514346] dark:text-[#D5C2C5] hover:border-[#837376]"
                      }`}
                    >
                      <div className="font-bold truncate text-[11px] group-hover:text-[#4A1F2B] dark:group-hover:text-[#C08491] transition-colors">{acc.label}</div>
                      <div className="text-[9px] text-[#4A1F2B] dark:text-[#C08491] font-semibold truncate flex items-center justify-between mt-0.5">
                        <span>{acc.badge}</span>
                        <span className="text-[8px] text-[#837376] uppercase">Select</span>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-[#837376] italic">
                  Selecting a test account only fills credentials into the form. You must explicitly click Sign In below to authenticate.
                </p>
              </div>

              {/* Staff Form */}
              <form onSubmit={handleStaffSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#514346] dark:text-[#D5C2C5] uppercase mb-1">
                    Official Hospital Email ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#837376]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="doctor@medcore.in"
                      className="w-full h-9 pl-9 pr-3 rounded-md bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs font-semibold text-[#1D1B1B] dark:text-[#FEF8F7] placeholder:text-[#837376] focus:outline-none focus:border-[#4A1F2B] dark:focus:border-[#C08491]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#514346] dark:text-[#D5C2C5] uppercase">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-semibold text-[#4A1F2B] dark:text-[#C08491] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#837376]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-9 pl-9 pr-10 rounded-md bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs font-semibold text-[#1D1B1B] dark:text-[#FEF8F7] placeholder:text-[#837376] focus:outline-none focus:border-[#4A1F2B] dark:focus:border-[#C08491]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#837376] hover:text-[#1D1B1B]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-[#514346] dark:text-[#D5C2C5] font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#E3DFDB] text-[#4A1F2B] focus:ring-[#4A1F2B]"
                    />
                    <span>Remember this device (7 days)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-9 rounded-md bg-[#4A1F2B] hover:bg-[#70404B] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Hospital Console</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

            </div>
          )}

          {/* Footer Security Badge */}
          <div className="pt-3 border-t border-[#E3DFDB] dark:border-[#3B3041] flex items-center justify-between text-[11px] text-[#837376] font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#3F6B52]" /> AES-256 ABDM Aligned
            </span>
            <span>Apex MedCore HMS</span>
          </div>

        </motion.div>
      </div>

    </div>
  );
}
