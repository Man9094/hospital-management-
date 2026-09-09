"use client";

import React from "react";
import Link from "next/link";
import { Cross, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0F6CBD] to-[#13C5DD] flex items-center justify-center text-white font-bold">
                <Cross className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-poppins font-black text-lg text-white uppercase">
                MEDCORE <span className="text-[#13C5DD] text-xs font-bold lowercase">hms</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              MedCore HMS — Indian Hospital Operating System. Unifying patient registration, OPD queues, clinical EMR, diagnostics, pharmacy, billing, and administration.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Designed with healthcare data security and ABDM/NABH workflow requirements in mind.</span>
            </div>
          </div>

          {/* Column 1: Hospital Modules */}
          <div className="space-y-3">
            <div className="font-extrabold text-white uppercase tracking-wider text-[11px]">
              Clinical Modules
            </div>
            <ul className="space-y-2">
              <li><Link href="/app#patients" className="hover:text-[#13C5DD] transition-colors">Patient & UHID Master</Link></li>
              <li><Link href="/app#appointments" className="hover:text-[#13C5DD] transition-colors">OPD Queue & Token</Link></li>
              <li><Link href="/app#emr" className="hover:text-[#13C5DD] transition-colors">Doctor Clinical EMR</Link></li>
              <li><Link href="/app#nursing" className="hover:text-[#13C5DD] transition-colors">Nursing Station</Link></li>
              <li><Link href="/app#emergency" className="hover:text-[#13C5DD] transition-colors">Emergency Command</Link></li>
            </ul>
          </div>

          {/* Column 2: Inpatient & Diagnostics */}
          <div className="space-y-3">
            <div className="font-extrabold text-white uppercase tracking-wider text-[11px]">
              Diagnostics & IPD
            </div>
            <ul className="space-y-2">
              <li><Link href="/app#beds" className="hover:text-[#13C5DD] transition-colors">Ward Bed Matrix</Link></li>
              <li><Link href="/app#lab" className="hover:text-[#13C5DD] transition-colors">Laboratory LIS</Link></li>
              <li><Link href="/app#radiology" className="hover:text-[#13C5DD] transition-colors">Radiology RIS</Link></li>
              <li><Link href="/app#pharmacy" className="hover:text-[#13C5DD] transition-colors">Pharmacy & FEFO Stock</Link></li>
              <li><Link href="/app#billing" className="hover:text-[#13C5DD] transition-colors">GST Billing & TPA Claims</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform Governance */}
          <div className="space-y-3">
            <div className="font-extrabold text-white uppercase tracking-wider text-[11px]">
              Platform & Access
            </div>
            <ul className="space-y-2">
              <li><Link href="/login" className="hover:text-[#13C5DD] transition-colors">Staff Portal Login</Link></li>
              <li><Link href="/app#security" className="hover:text-[#13C5DD] transition-colors">Security Audit Logs</Link></li>
              <li><Link href="/app" className="hover:text-[#13C5DD] transition-colors">Interactive Demo Console</Link></li>
              <li><span className="text-slate-500 font-mono text-[10px]">Demo Password: MedCore@2026</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} MedCore HMS. Indian Hospital Operating System. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Demo Data Mode Active</span>
            <span>•</span>
            <span>AES-256 GCM Architecture</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
