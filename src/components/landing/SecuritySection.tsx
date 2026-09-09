"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, FileKey, History, Cloud, Award, CheckCircle2 } from "lucide-react";

const SEC_ITEMS = [
  {
    icon: ShieldCheck,
    title: "HIPAA & HL7/FHIR Compliant",
    desc: "Signed Business Associate Agreement (BAA) with full protected health information (PHI) safeguards."
  },
  {
    icon: Lock,
    title: "256-Bit AES Data Encryption",
    desc: "End-to-end data encryption in transit via TLS 1.3 and at rest with hardware security modules (HSM)."
  },
  {
    icon: FileKey,
    title: "Granular Role Access Control (RBAC)",
    desc: "Restrict field-level medical history access so nurses, doctors, and pharmacists only view authorized data."
  },
  {
    icon: History,
    title: "Immutable Audit Log Trail",
    desc: "Every record modification, view, and prescription export is cryptographically logged for compliance audits."
  },
  {
    icon: Cloud,
    title: "Automated Geo-Redundant Backups",
    desc: "Hourly automated snapshot backups with zero data loss RPO and sub-minute disaster recovery RTO."
  },
  {
    icon: Award,
    title: "SOC 2 Type II & ISO 27001 Certified",
    desc: "Independently audited annually by tier-1 security firms to guarantee enterprise clinical safety."
  }
];

export default function SecuritySection() {
  return (
    <section id="security" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C896]/10 text-[#00C896] text-xs font-bold uppercase tracking-wider">
            Uncompromising Medical Trust
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-poppins text-slate-900 dark:text-white">
            Bank-Grade Security for Sensitive Clinical Data
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Protected Health Information (PHI) demands the highest cybersecurity posture. MedCore delivers zero-trust architecture.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEC_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                viewport={{ once: true }}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:border-[#00C896] transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#00C896]/10 text-[#00C896] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-poppins text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
