"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  Stethoscope,
  Bed,
  Heart,
  AlertTriangle,
  FlaskConical,
  Eye,
  Pill,
  Scissors,
  CreditCard,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

export default function ModulesGrid() {
  const modules = [
    {
      id: "uhid",
      title: "Patient Registration & UHID",
      desc: "Instant unique hospital ID (MC-2026-XXXXXX) generation, ABHA ID verification, demographics, blood group & allergies linked across all visits.",
      icon: Users,
      badge: "Core Foundation",
      color: "from-blue-500/20 to-cyan-500/20 text-[#13C5DD]",
    },
    {
      id: "opd",
      title: "OPD Queue & Token Manager",
      desc: "Live doctor consultation queues, token dispensing, slot booking, automated triage waiting estimates, and no-show tracking.",
      icon: Calendar,
      badge: "Front Desk",
      color: "from-indigo-500/20 to-blue-500/20 text-indigo-400",
    },
    {
      id: "emr",
      title: "Doctor Clinical EMR & Rx",
      desc: "SOAP consultation composer, ICD-10 coded diagnoses, structured e-prescriptions with dosage/frequency, and direct investigation orders.",
      icon: Stethoscope,
      badge: "Clinical Care",
      color: "from-teal-500/20 to-emerald-500/20 text-emerald-400",
    },
    {
      id: "ipd",
      title: "IPD Admissions & Bed Matrix",
      desc: "Interactive ward layout (ICU, Deluxe, General), real-time occupancy status (Available, Occupied, Cleaning, Reserved), and daily consultant rounds.",
      icon: Bed,
      badge: "Inpatient OS",
      color: "from-emerald-500/20 to-teal-500/20 text-teal-400",
    },
    {
      id: "nursing",
      title: "Nursing Station & Vitals Roster",
      desc: "Continuous inpatient vital monitoring with panic thresholds, medication administration charts, IV infusion records, and shift handovers.",
      icon: Heart,
      badge: "Ward Management",
      color: "from-rose-500/20 to-pink-500/20 text-rose-400",
    },
    {
      id: "emergency",
      title: "Emergency & Trauma Command",
      desc: "Red, Orange, Yellow, Green triage classification, ambulance intake, crash cart logistics, and rapid disposition to ICU or Emergency OT.",
      icon: AlertTriangle,
      badge: "24/7 Critical",
      color: "from-red-500/20 to-orange-500/20 text-red-400",
    },
    {
      id: "lis",
      title: "Laboratory Information (LIS)",
      desc: "Full pathology test catalog, sample collection barcodes, automated normal range validation, critical panic alerts, and pathologist verification.",
      icon: FlaskConical,
      badge: "Diagnostics",
      color: "from-purple-500/20 to-indigo-500/20 text-purple-400",
    },
    {
      id: "ris",
      title: "Radiology Information (RIS)",
      desc: "X-Ray, CT, MRI, Ultrasound imaging study workflow, PACS-ready reporting templates, and authenticated radiologist sign-offs.",
      icon: Eye,
      badge: "Imaging",
      color: "from-cyan-500/20 to-blue-500/20 text-cyan-400",
    },
    {
      id: "pharmacy",
      title: "Pharmacy POS & FEFO Stock",
      desc: "Direct doctor prescription dispensing, First-Expiry-First-Out batch tracking, low stock reorder alerts, and 12% GST medical billing.",
      icon: Pill,
      badge: "Store & POS",
      color: "from-amber-500/20 to-orange-500/20 text-amber-400",
    },
    {
      id: "ot",
      title: "Operation Theatre (OT)",
      desc: "Surgical schedule coordination, surgeon & anesthetist roster, pre-op safety verification checklists, and post-op surgical notes.",
      icon: Scissors,
      badge: "Surgical Complex",
      color: "from-blue-500/20 to-teal-500/20 text-blue-400",
    },
    {
      id: "billing",
      title: "GST Invoicing & Cashless TPA",
      desc: "Automatic service charge capture across OPD/IPD/Lab/Pharmacy, itemized GST bills, instant UPI payments, and PM-JAY cashless claims.",
      icon: CreditCard,
      badge: "Financial Operations",
      color: "from-emerald-500/20 to-green-500/20 text-emerald-400",
    },
    {
      id: "security",
      title: "Security & Immutable Audit Logs",
      desc: "Cryptographic tamper-evident audit trail capturing every record view, prescription change, drug dispensing, and billing adjustment.",
      icon: ShieldCheck,
      badge: "ABDM Aligned",
      color: "from-slate-500/20 to-zinc-500/20 text-slate-300",
    },
  ];

  return (
    <section id="modules" className="py-20 lg:py-28 bg-slate-50 dark:bg-[#0B0F17]/60 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider">
            COMPLETE HOSPITAL OS CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-poppins text-slate-900 dark:text-white tracking-tight">
            Integrated Hospital Management Modules
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Every clinical, diagnostic, pharmaceutical, financial, and administrative workflow connected to a single unified patient database.
          </p>
        </div>

        {/* Modules 12-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-extrabold uppercase tracking-wider">
                    {m.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold font-poppins text-slate-900 dark:text-white group-hover:text-[#13C5DD] transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explore Console Callout */}
        <div className="text-center pt-4">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#13C5DD] text-[#1D2A4D] font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            <span>Launch Live Interactive Hospital Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
