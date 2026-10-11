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
      {/* Background Subtle Warm Tint */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#4A1F2B]/5 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Feature Pill */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3E9EB] dark:bg-[#32293D] border border-[#E3DFDB] dark:border-[#4C3C54] text-xs font-semibold text-[#4A1F2B] dark:text-[#F7B5C3] shadow-[0_1px_3px_rgba(41,39,39,0.06)] animate-in fade-in duration-500">
            <span className="w-2 h-2 rounded-full bg-[#4A1F2B] dark:bg-[#F7B5C3]" />
            <span className="font-bold uppercase tracking-wider">Warm Clinical Enterprise HMS</span>
            <span className="text-[#83505B] dark:text-[#C08491]">• Built for 24/7 Demanding Clinical Shifts</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-sans text-[#292727] dark:text-[#FEF8F7] tracking-tight leading-[1.1]">
            Run Your Hospital From <br />
            <span className="text-[#4A1F2B] dark:text-[#E2838E]">
              One Connected Platform
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-[#686563] dark:text-[#D5C2C5] font-normal max-w-3xl mx-auto leading-relaxed">
            MedCore HMS connects patient registration, OPD, IPD, EMR, nursing, diagnostics, pharmacy, billing, insurance, inventory and administration in one unified hospital operating system.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app"
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#4A1F2B] hover:bg-[#5E2737] text-white font-medium text-xs uppercase tracking-wider shadow-[0_1px_3px_rgba(41,39,39,0.06)] transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Live Hospital HMS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-white dark:bg-[#242026] border border-[#E3DFDB] dark:border-[#3E3842] text-[#292727] dark:text-[#FEF8F7] font-medium text-xs uppercase tracking-wider shadow-[0_1px_3px_rgba(41,39,39,0.06)] hover:bg-[#F7F6F3] dark:hover:bg-[#2D2732] transition-colors flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-[#4A1F2B] dark:text-[#E2838E]" />
              <span>Request Hospital Demo</span>
            </Link>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#83505B] dark:text-[#C08491] font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#3F6B52] dark:text-[#85B599]" /> Unified UHID Patient Record</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#3F6B52] dark:text-[#85B599]" /> ABDM & Ayushman Bharat Ready</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#3F6B52] dark:text-[#85B599]" /> Multi-Role RBAC Authorization</span>
          </div>
        </div>

        {/* Interactive Hospital Command Center Preview Shell */}
        <div className="relative max-w-6xl mx-auto rounded-lg p-1 bg-[#E3DFDB] dark:bg-[#3E3842] shadow-[0_4px_16px_rgba(41,39,39,0.08)]">
          <div className="rounded-md bg-[#18141C] border border-[#3E3842] p-4 sm:p-6 space-y-6 text-[#ECE5E7] overflow-hidden">
            
            {/* Top Bar of Preview */}
            <div className="flex items-center justify-between pb-4 border-b border-[#2D2732] text-xs">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8C3A45]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E58C3A]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3F6B52]" />
                </div>
                <span className="font-mono text-[#9B8E92]">Apex MedCore Superspeciality Hospital • Live Console</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#3F6B52]/20 text-[#85B599] font-mono text-[11px] font-bold">
                  ● 12 BEDS MONITORED
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar inside Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-md bg-[#242026] border border-[#3E3842] space-y-1">
                <div className="text-[11px] text-[#9B8E92] font-semibold uppercase">Today's OPD Volume</div>
                <div className="text-2xl font-bold text-[#ECE5E7]">186 Tokens</div>
                <div className="text-[10px] text-[#85B599]">92% Consulting on Time</div>
              </div>
              <div className="p-4 rounded-md bg-[#242026] border border-[#3E3842] space-y-1">
                <div className="text-[11px] text-[#9B8E92] font-semibold uppercase">Bed Occupancy (IPD)</div>
                <div className="text-2xl font-bold text-[#E2838E]">74 / 100 Beds</div>
                <div className="text-[10px] text-[#9B8E92]">ICU: 8/12 Occupied</div>
              </div>
              <div className="p-4 rounded-md bg-[#242026] border border-[#3E3842] space-y-1">
                <div className="text-[11px] text-[#9B8E92] font-semibold uppercase">Today's Revenue</div>
                <div className="text-2xl font-bold text-[#85B599]">₹8.42 Lakh</div>
                <div className="text-[10px] text-[#9B8E92]">Cashless Claims: ₹5.10 L</div>
              </div>
              <div className="p-4 rounded-md bg-[#242026] border border-[#3E3842] space-y-1">
                <div className="text-[11px] text-[#9B8E92] font-semibold uppercase">Active Emergency Cases</div>
                <div className="text-2xl font-bold text-[#F497A4]">6 Trauma Cases</div>
                <div className="text-[10px] text-[#E58C3A]">2 Critical Panic Flags</div>
              </div>
            </div>

            {/* Connected Journey Preview Flow */}
            <div className="p-4 rounded-md bg-[#242026]/70 border border-[#3E3842] space-y-2">
              <div className="text-[10px] font-bold uppercase text-[#9B8E92] tracking-wider">
                End-to-End Connected Patient Flow Architecture
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
                <span className="px-2.5 py-1 rounded-md bg-[#32293D] text-[#E2838E] border border-[#4C3C54]">
                  1. Registration (UHID)
                </span>
                <span className="text-[#686563]">→</span>
                <span className="px-2.5 py-1 rounded-md bg-[#23382B] text-[#85B599] border border-[#3F6B52]/40">
                  2. OPD Token & Vitals
                </span>
                <span className="text-[#686563]">→</span>
                <span className="px-2.5 py-1 rounded-md bg-[#32293D] text-[#D1C3C6] border border-[#4C3C54]">
                  3. Doctor EMR & Rx
                </span>
                <span className="text-[#686563]">→</span>
                <span className="px-2.5 py-1 rounded-md bg-[#2D2732] text-[#E58C3A] border border-[#5A4535]">
                  4. LIS / RIS Diagnostics
                </span>
                <span className="text-[#686563]">→</span>
                <span className="px-2.5 py-1 rounded-md bg-[#23382B] text-[#85B599] border border-[#3F6B52]/40">
                  5. Pharmacy FEFO POS
                </span>
                <span className="text-[#686563]">→</span>
                <span className="px-2.5 py-1 rounded-md bg-[#2D2732] text-[#D1C3C6] border border-[#3E3842]">
                  6. IPD Bed Allocation
                </span>
                <span className="text-[#686563]">→</span>
                <span className="px-2.5 py-1 rounded-md bg-[#32293D] text-[#E2838E] border border-[#4C3C54]">
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
