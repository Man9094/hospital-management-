"use client";

import React from "react";
import Link from "next/link";
import { Cross, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#18141C] text-[#9B8E92] text-xs border-t border-[#3E3842]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#4A1F2B] flex items-center justify-center text-white font-bold">
                <Cross className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-sans font-bold text-lg text-[#ECE5E7] uppercase tracking-tight">
                MEDCORE <span className="text-[#E2838E] text-xs font-semibold lowercase">hms</span>
              </span>
            </Link>
            <p className="text-[#9B8E92] leading-relaxed max-w-sm">
              MedCore HMS — Indian Hospital Operating System. Unifying patient registration, OPD queues, clinical EMR, diagnostics, pharmacy, billing, and administration.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#85B599]">
              <ShieldCheck className="w-4 h-4 text-[#3F6B52]" />
              <span className="text-[#9B8E92]">Designed with healthcare data security and ABDM/NABH workflow requirements in mind.</span>
            </div>
          </div>

          {/* Column 1: Hospital Modules */}
          <div className="space-y-3">
            <div className="font-bold text-[#ECE5E7] uppercase tracking-wider text-[11px]">
              Clinical Modules
            </div>
            <ul className="space-y-2">
              <li><Link href="/app#patients" className="hover:text-[#E2838E] transition-colors">Patient & UHID Master</Link></li>
              <li><Link href="/app#appointments" className="hover:text-[#E2838E] transition-colors">OPD Queue & Token</Link></li>
              <li><Link href="/app#emr" className="hover:text-[#E2838E] transition-colors">Doctor Clinical EMR</Link></li>
              <li><Link href="/app#nursing" className="hover:text-[#E2838E] transition-colors">Nursing Station</Link></li>
              <li><Link href="/app#emergency" className="hover:text-[#E2838E] transition-colors">Emergency Command</Link></li>
            </ul>
          </div>

          {/* Column 2: Inpatient & Diagnostics */}
          <div className="space-y-3">
            <div className="font-bold text-[#ECE5E7] uppercase tracking-wider text-[11px]">
              Diagnostics & IPD
            </div>
            <ul className="space-y-2">
              <li><Link href="/app#beds" className="hover:text-[#E2838E] transition-colors">Ward Bed Matrix</Link></li>
              <li><Link href="/app#lab" className="hover:text-[#E2838E] transition-colors">Laboratory LIS</Link></li>
              <li><Link href="/app#radiology" className="hover:text-[#E2838E] transition-colors">Radiology RIS</Link></li>
              <li><Link href="/app#pharmacy" className="hover:text-[#E2838E] transition-colors">Pharmacy & FEFO Stock</Link></li>
              <li><Link href="/app#billing" className="hover:text-[#E2838E] transition-colors">GST Billing & TPA Claims</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform Governance */}
          <div className="space-y-3">
            <div className="font-bold text-[#ECE5E7] uppercase tracking-wider text-[11px]">
              Platform & Access
            </div>
            <ul className="space-y-2">
              <li><Link href="/login" className="hover:text-[#E2838E] transition-colors">Staff Portal Login</Link></li>
              <li><Link href="/app#security" className="hover:text-[#E2838E] transition-colors">Security Audit Logs</Link></li>
              <li><Link href="/app" className="hover:text-[#E2838E] transition-colors">Interactive Demo Console</Link></li>
              <li><span className="text-[#686563] font-mono text-[10px]">Demo Password: MedCore@2026</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2D2732] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#686563]">
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
