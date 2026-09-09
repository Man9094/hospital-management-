"use client";

import React from "react";
import {
  ShieldCheck,
  Lock,
  Server,
  FileCheck,
  EyeOff,
  KeyRound,
  CheckCircle2
} from "lucide-react";

export default function SecuritySection() {
  const securityFeatures = [
    {
      title: "Role-Based Access Control (RBAC)",
      desc: "Strict segregation of duties enforced at both the API and database levels across Super Admin, Doctors, Nurses, Pathologists, Pharmacists, and Billing Staff.",
      icon: KeyRound,
    },
    {
      title: "Encrypted Data Transmission & Storage",
      desc: "Architected for AES-256 GCM encryption at rest and TLS 1.3 in transit, protecting sensitive patient demographics, diagnosis notes, and financial records.",
      icon: Lock,
    },
    {
      title: "Immutable Tamper-Evident Audit Logs",
      desc: "Comprehensive activity logging capturing every record inspection, clinical modification, drug dispensing, and discount approval with IP tracking.",
      icon: FileCheck,
    },
    {
      title: "ABDM & FHIR Health Data Ready",
      desc: "Designed with Ayushman Bharat Digital Mission (ABDM), ABHA Health ID integration, and standardized healthcare interoperability schemas in mind.",
      icon: Server,
    },
  ];

  return (
    <section id="security" className="py-20 lg:py-28 bg-slate-50 dark:bg-[#0B0F17]/60 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider">
            HEALTHCARE SECURITY & DATA PRIVACY
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-poppins text-slate-900 dark:text-white tracking-tight">
            Designed for Indian Healthcare Compliance
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            MedCore HMS is architected with rigorous healthcare data protection standards, strict least-privilege role boundaries, and patient privacy at its core.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-md space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#13C5DD]/15 text-[#13C5DD] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold font-poppins text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Security Assurance Banner */}
        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <strong className="text-sm font-bold block">Patient Data Isolation & Zero Third-Party Tracking</strong>
              <span>Medical records and patient identities are never shared or indexed. Each hospital organization operates with isolated database structures.</span>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-white font-extrabold text-[11px] whitespace-nowrap shadow-sm">
            Security Verified
          </span>
        </div>

      </div>
    </section>
  );
}
