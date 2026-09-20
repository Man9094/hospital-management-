"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Building2, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-lg p-8 sm:p-14 bg-[#4A1F2B] text-white shadow-[0_4px_16px_rgba(41,39,39,0.08)] overflow-hidden text-center space-y-8">
          
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="px-3 py-1 rounded-md bg-white/10 text-[#F3E9EB] text-xs font-semibold uppercase tracking-wider">
              Modernize Your Hospital Infrastructure
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-sans tracking-tight">
              Ready to Upgrade to MedCore Hospital Operating System?
            </h2>
            <p className="text-sm sm:text-base text-[#F3E9EB]/90 max-w-2xl mx-auto">
              Transform registration queues, clinical EMR, diagnostics, pharmacy stock, and billing into one synchronized hospital platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app"
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-white text-[#4A1F2B] font-medium text-xs uppercase tracking-wider shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:bg-[#F7F6F3] transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Live Hospital Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#4A1F2B]" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-white/10 border border-white/20 text-white font-medium text-xs uppercase tracking-wider hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Staff Portal Login</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#F3E9EB]/80 pt-2 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#85B599]" /> Full Role-Based Access</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#85B599]" /> Instant UHID Integration</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#85B599]" /> Transparent Indian Demo Data</span>
          </div>

        </div>

      </div>
    </section>
  );
}
