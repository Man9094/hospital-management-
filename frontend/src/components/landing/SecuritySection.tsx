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
    <section id="security" className="py-20 lg:py-28 bg-[#FBF9F9] dark:bg-[#18141C]/60 border-y border-[#E5E0E2] dark:border-[#3E3842]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-bold text-[#4A1F2B] dark:text-[#E2838E] uppercase tracking-wider">
            HEALTHCARE SECURITY & DATA PRIVACY
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-sans text-[#292727] dark:text-[#FEF8F7] tracking-tight">
            Designed for Indian Healthcare Compliance
          </h2>
          <p className="text-sm sm:text-base text-[#686563] dark:text-[#D5C2C5]">
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
                className="p-6 sm:p-8 rounded-lg bg-white dark:bg-[#242026] border border-[#E5E0E2] dark:border-[#3E3842] shadow-[0_1px_3px_rgba(41,39,39,0.06)] space-y-4"
              >
                <div className="w-11 h-11 rounded-md bg-[#F3E9EB] dark:bg-[#32293D] text-[#4A1F2B] dark:text-[#E2838E] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold font-sans text-[#292727] dark:text-[#FEF8F7]">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#686563] dark:text-[#D5C2C5] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Security Assurance Banner */}
        <div className="p-6 rounded-lg bg-[#E8F0EC] border border-[#3F6B52]/30 text-[#2A4837] dark:bg-[#23382B] dark:text-[#85B599] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#3F6B52] dark:text-[#85B599] shrink-0" />
            <div>
              <strong className="text-sm font-bold block text-[#2A4837] dark:text-[#ECE5E7]">Patient Data Isolation & Zero Third-Party Tracking</strong>
              <span className="text-[#3F6B52] dark:text-[#85B599]">Medical records and patient identities are never shared or indexed. Each hospital organization operates with isolated database structures.</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-md bg-[#3F6B52] text-white font-medium text-[11px] whitespace-nowrap shadow-xs">
            Security Verified
          </span>
        </div>

      </div>
    </section>
  );
}
