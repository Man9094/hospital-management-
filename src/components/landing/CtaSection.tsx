"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Building2, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-[#1D2A4D] via-[#0F365F] to-[#13C5DD] text-white shadow-2xl overflow-hidden text-center space-y-8">
          
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-xs font-black uppercase tracking-wider">
              Modernize Your Hospital Infrastructure
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-poppins tracking-tight">
              Ready to Upgrade to MedCore Hospital Operating System?
            </h2>
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto">
              Transform registration queues, clinical EMR, diagnostics, pharmacy stock, and billing into one synchronized hospital platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-[#1D2A4D] font-black text-sm uppercase tracking-wider shadow-lg hover:bg-slate-100 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Live Hospital Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#13C5DD]" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#13C5DD]/20 border border-white/30 text-white font-extrabold text-sm uppercase tracking-wider hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Staff Portal Login</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-200 pt-2 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-300" /> Full Role-Based Access</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-300" /> Instant UHID Integration</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-300" /> Transparent Indian Demo Data</span>
          </div>

        </div>

      </div>
    </section>
  );
}
