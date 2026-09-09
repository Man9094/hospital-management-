"use client";

import React from "react";
import Link from "next/link";
import { usePortal } from "@/context/PortalContext";
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Bed,
  Stethoscope,
  FlaskConical,
  Pill,
  CreditCard,
  Sparkles,
  Activity,
  CheckCircle2,
  Play
} from "lucide-react";

export default function HeroSection() {
  const { openAuthModal } = usePortal();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-[#0F6CBD]/15 via-[#13C5DD]/20 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Feature Pill */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm animate-in fade-in duration-500">
            <span className="w-2 h-2 rounded-full bg-[#13C5DD] animate-ping" />
            <span className="text-[#13C5DD] font-black uppercase tracking-wider">MedCore HMS 2.0</span>
            <span>• Indian Hospital Operating System (Hos-OS)</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-poppins text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Run Your Hospital From <br />
            <span className="bg-gradient-to-r from-[#0F6CBD] via-[#13C5DD] to-[#00C896] bg-clip-text text-transparent">
              One Connected Platform
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
            MedCore HMS connects patient registration, OPD, IPD, EMR, nursing, diagnostics, pharmacy, billing, insurance, inventory and administration in one unified hospital operating system.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#13C5DD] to-[#0F6CBD] text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-[#13C5DD]/25 hover:shadow-[#13C5DD]/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Live Hospital HMS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wider shadow-md hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-[#13C5DD]" />
              <span>Request Hospital Demo</span>
            </Link>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unified UHID Patient Record</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> ABDM & Ayushman Bharat Ready</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-Role RBAC Authorization</span>
          </div>
        </div>

        {/* Interactive Hospital Command Center Preview Shell */}
        <div className="relative max-w-6xl mx-auto rounded-3xl p-2 bg-gradient-to-b from-slate-200 dark:from-slate-700 to-slate-100 dark:to-slate-900 shadow-2xl">
          <div className="rounded-[22px] bg-[#0B0F17] border border-slate-800 p-4 sm:p-6 space-y-6 text-white overflow-hidden">
            
            {/* Top Bar of Preview */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-slate-400">Apex MedCore Superspeciality Hospital • Live Console</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold">
                  ● 12 BEDS MONITORED
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar inside Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400 font-bold uppercase">Today's OPD Volume</div>
                <div className="text-2xl font-black font-poppins text-white">186 Tokens</div>
                <div className="text-[10px] text-emerald-400">92% Consulting on Time</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400 font-bold uppercase">Bed Occupancy (IPD)</div>
                <div className="text-2xl font-black font-poppins text-[#13C5DD]">74 / 100 Beds</div>
                <div className="text-[10px] text-slate-400">ICU: 8/12 Occupied</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400 font-bold uppercase">Today's Revenue</div>
                <div className="text-2xl font-black font-poppins text-emerald-400">₹8.42 Lakh</div>
                <div className="text-[10px] text-slate-400">Cashless Claims: ₹5.10 L</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400 font-bold uppercase">Active Emergency Cases</div>
                <div className="text-2xl font-black font-poppins text-red-400">6 Trauma Cases</div>
                <div className="text-[10px] text-amber-400">2 Critical Panic Flags</div>
              </div>
            </div>

            {/* Connected Journey Preview Flow */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
              <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                End-to-End Connected Patient Flow Architecture
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                <span className="px-3 py-1.5 rounded-xl bg-[#13C5DD]/15 text-[#13C5DD] border border-[#13C5DD]/30">
                  1. Registration (UHID)
                </span>
                <span className="text-slate-600">→</span>
                <span className="px-3 py-1.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  2. OPD Token & Vitals
                </span>
                <span className="text-slate-600">→</span>
                <span className="px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  3. Doctor EMR & Rx
                </span>
                <span className="text-slate-600">→</span>
                <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  4. LIS / RIS Diagnostics
                </span>
                <span className="text-slate-600">→</span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  5. Pharmacy FEFO POS
                </span>
                <span className="text-slate-600">→</span>
                <span className="px-3 py-1.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  6. IPD Bed Allocation
                </span>
                <span className="text-slate-600">→</span>
                <span className="px-3 py-1.5 rounded-xl bg-green-500/15 text-green-400 border border-green-500/30">
                  7. GST Billing & TPA
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
