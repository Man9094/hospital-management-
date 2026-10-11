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
      color: "bg-[#F3E9EB] text-[#4A1F2B] dark:bg-[#32293D] dark:text-[#E2838E]",
    },
    {
      id: "opd",
      title: "OPD Queue & Token Manager",
      desc: "Live doctor consultation queues, token dispensing, slot booking, automated triage waiting estimates, and no-show tracking.",
      icon: Calendar,
      badge: "Front Desk",
      color: "bg-[#EAF0F4] text-[#3E6177] dark:bg-[#25323B] dark:text-[#97B8CC]",
    },
    {
      id: "emr",
      title: "Doctor Clinical EMR & Rx",
      desc: "SOAP consultation composer, ICD-10 coded diagnoses, structured e-prescriptions with dosage/frequency, and direct investigation orders.",
      icon: Stethoscope,
      badge: "Clinical Care",
      color: "bg-[#E8F0EC] text-[#3F6B52] dark:bg-[#23382B] dark:text-[#85B599]",
    },
    {
      id: "ipd",
      title: "IPD Admissions & Bed Matrix",
      desc: "Interactive ward layout (ICU, Deluxe, General), real-time occupancy status (Available, Occupied, Cleaning, Reserved), and daily consultant rounds.",
      icon: Bed,
      badge: "Inpatient OS",
      color: "bg-[#E8F0EC] text-[#3F6B52] dark:bg-[#23382B] dark:text-[#85B599]",
    },
    {
      id: "nursing",
      title: "Nursing Station & Vitals Roster",
      desc: "Continuous inpatient vital monitoring with panic thresholds, medication administration charts, IV infusion records, and shift handovers.",
      icon: Heart,
      badge: "Ward Management",
      color: "bg-[#F7EDEF] text-[#83505B] dark:bg-[#382830] dark:text-[#D5AAB4]",
    },
    {
      id: "emergency",
      title: "Emergency & Trauma Command",
      desc: "Red, Orange, Yellow, Green triage classification, ambulance intake, crash cart logistics, and rapid disposition to ICU or Emergency OT.",
      icon: AlertTriangle,
      badge: "24/7 Critical",
      color: "bg-[#FAECEF] text-[#8C3A45] dark:bg-[#3D252A] dark:text-[#F497A4]",
    },
    {
      id: "lis",
      title: "Laboratory Information (LIS)",
      desc: "Full pathology test catalog, sample collection barcodes, automated normal range validation, critical panic alerts, and pathologist verification.",
      icon: FlaskConical,
      badge: "Diagnostics",
      color: "bg-[#F3E9EB] text-[#4A1F2B] dark:bg-[#32293D] dark:text-[#E2838E]",
    },
    {
      id: "ris",
      title: "Radiology Information (RIS)",
      desc: "X-Ray, CT, MRI, Ultrasound imaging study workflow, PACS-ready reporting templates, and authenticated radiologist sign-offs.",
      icon: Eye,
      badge: "Imaging",
      color: "bg-[#EAF0F4] text-[#3E6177] dark:bg-[#25323B] dark:text-[#97B8CC]",
    },
    {
      id: "pharmacy",
      title: "Pharmacy POS & FEFO Stock",
      desc: "Direct doctor prescription dispensing, First-Expiry-First-Out batch tracking, low stock reorder alerts, and 12% GST medical billing.",
      icon: Pill,
      badge: "Store & POS",
      color: "bg-[#FDF4E7] text-[#9E651E] dark:bg-[#382C1B] dark:text-[#D6A96C]",
    },
    {
      id: "ot",
      title: "Operation Theatre (OT)",
      desc: "Surgical schedule coordination, surgeon & anesthetist roster, pre-op safety verification checklists, and post-op surgical notes.",
      icon: Scissors,
      badge: "Surgical Complex",
      color: "bg-[#EAF0F4] text-[#3E6177] dark:bg-[#25323B] dark:text-[#97B8CC]",
    },
    {
      id: "billing",
      title: "GST Invoicing & Cashless TPA",
      desc: "Automatic service charge capture across OPD/IPD/Lab/Pharmacy, itemized GST bills, instant UPI payments, and PM-JAY cashless claims.",
      icon: CreditCard,
      badge: "Financial Operations",
      color: "bg-[#E8F0EC] text-[#3F6B52] dark:bg-[#23382B] dark:text-[#85B599]",
    },
    {
      id: "security",
      title: "Security & Immutable Audit Logs",
      desc: "Cryptographic tamper-evident audit trail capturing every record view, prescription change, drug dispensing, and billing adjustment.",
      icon: ShieldCheck,
      badge: "ABDM Aligned",
      color: "bg-[#F7F6F3] text-[#554C4F] dark:bg-[#2D2732] dark:text-[#C5B8BB]",
    },
  ];

  return (
    <section id="modules" className="py-20 lg:py-28 bg-[#FBF9F9] dark:bg-[#18141C]/60 border-y border-[#E5E0E2] dark:border-[#3E3842]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-bold text-[#4A1F2B] dark:text-[#E2838E] uppercase tracking-wider">
            COMPLETE HOSPITAL OS CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-sans text-[#292727] dark:text-[#FEF8F7] tracking-tight">
            Integrated Hospital Management Modules
          </h2>
          <p className="text-sm sm:text-base text-[#686563] dark:text-[#D5C2C5]">
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
                className="p-6 rounded-lg bg-white dark:bg-[#242026] border border-[#E5E0E2] dark:border-[#3E3842] shadow-[0_1px_3px_rgba(41,39,39,0.06)] hover:shadow-[0_4px_16px_rgba(41,39,39,0.08)] transition-all duration-200 space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-md ${m.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#F7F6F3] dark:bg-[#2D2732] text-[#686563] dark:text-[#9B8E92] text-[10px] font-semibold uppercase tracking-wider">
                    {m.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold font-sans text-[#292727] dark:text-[#FEF8F7] group-hover:text-[#4A1F2B] dark:group-hover:text-[#E2838E] transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-[#686563] dark:text-[#D5C2C5] leading-relaxed">
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#4A1F2B] hover:bg-[#5E2737] text-white font-medium text-xs uppercase tracking-wider shadow-[0_1px_3px_rgba(41,39,39,0.06)] transition-colors"
          >
            <span>Launch Live Interactive Hospital Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
