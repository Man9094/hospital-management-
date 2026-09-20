"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  Users,
  Stethoscope,
  Calendar,
  FileText,
  CreditCard,
  Shield,
  FlaskConical,
  Scan,
  Pill,
  Package,
  Droplet,
  Scissors,
  Bed,
  AlertTriangle,
  Truck,
  UserCog,
  DollarSign,
  Briefcase,
  BarChart3,
  MessageSquare,
  Mail,
  Smartphone,
  Printer,
  Key,
  CloudUpload,
  ArrowRight
} from "lucide-react";

export default function FeaturesSection() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");

  const CATEGORIES = [
    { id: "all", label: t.catAll },
    { id: "clinical", label: t.catClinical },
    { id: "diagnostics", label: t.catDiagnostics },
    { id: "ops", label: t.catOps },
    { id: "admin", label: t.catAdmin }
  ];

  const FEATURES = [
    { category: "clinical", icon: Users, title: "Patient Master File & ABDM ID", desc: "Complete 360° patient profile, medical history, emergency contacts, insurance cards, and digital signature intake." },
    { category: "clinical", icon: Stethoscope, title: "Doctor OPD & Token Roster", desc: "Manage doctor consultation slots, leave schedules, OPD consultation queue tokens, and automatic commission calculations." },
    { category: "clinical", icon: Calendar, title: "Smart Appointment Booking", desc: "Online self-service patient booking portal, walk-in token generator, and automated SMS/WhatsApp appointment reminders." },
    { category: "clinical", icon: FileText, title: "Electronic Health Records (EHR)", desc: "NABH & ABDM compliant EHR. Gujarati/Hindi/English SOAP clinical notes, e-prescriptions, and ICD-11 coding." },
    { category: "clinical", icon: Bed, title: "IPD & Bed Occupancy Matrix", desc: "Visual bed map for ICU, General Ward, and Deluxe Rooms. Automated bed transfer charges and discharge summaries." },
    { category: "clinical", icon: Scissors, title: "Operation Theatre (OT) Scheduler", desc: "Surgeon roster, anaesthesia notes, pre-op checklist, surgical equipment kit tracking, and live OT status monitors." },
    { category: "clinical", icon: AlertTriangle, title: "24/7 Emergency & Triage", desc: "ESI color-coded trauma triage, priority bed allocation, instant ER doctor alerts, and rapid blood request trigger." },
    { category: "clinical", icon: Truck, title: "Ambulance Dispatch Tracker", desc: "Real-time GPS ambulance fleet tracking, driver dispatch notes, paramedic vitals sync, and ER arrival countdown." },
    { category: "diagnostics", icon: FlaskConical, title: "Pathology Lab Automation", desc: "Sample barcode tracking, automated LIS integration, panic alerts, and online PDF lab report dispatches." },
    { category: "diagnostics", icon: Scan, title: "Radiology PACS & Digital X-Ray", desc: "Zero-footprint web DICOM viewer for X-Rays, CT scans, and MRIs with instant doctor viewing." },
    { category: "diagnostics", icon: Droplet, title: "Blood Bank Management", desc: "Donor registration, blood component separation (RBC, Plasma, Platelets), cross-matching logs, and expiry date warnings." },
    { category: "ops", icon: Pill, title: "Pharmacy POS & Medicine Stock", desc: "Barcode prescription fulfillment, batch number expiry tracking, generic drug substitutes, and GST invoice receipts." },
    { category: "ops", icon: Package, title: "Central Hospital Store", desc: "Surgical consumables, PPE kits, asset tracking, inter-department indent approvals, and vendor purchase orders." },
    { category: "admin", icon: CreditCard, title: "GST Billing & Cashless Claims", desc: "Itemized billing, advance deposit tracking, discount approvals, HSN/SAC GST codes, and TPA insurance receipts." },
    { category: "admin", icon: Shield, title: "Ayushman Bharat & TPA Claims", desc: "Pre-authorization request workflow, claim document attachment, cashless hospitalization approvals, and audit trail." },
    { category: "admin", icon: UserCog, title: "Staff & Nurse Duty Roster", desc: "Shift scheduling, overtime tracking, nurse-to-patient ratio monitors, and duty handover digital logs." },
    { category: "admin", icon: DollarSign, title: "Doctor Revenue Share & Payroll", desc: "Automated salary processing, doctor OPD/surgery revenue sharing splits, tax deductions, and pay slip distribution." },
    { category: "admin", icon: Briefcase, title: "Human Resources (HR)", desc: "Employee onboarding, credential verification, license expiration warnings, attendance biometric integration, and appraisals." },
    { category: "admin", icon: BarChart3, title: "Hospital Executive Analytics", desc: "Real-time revenue dashboards, bed occupancy trends, department P&L breakdown, and predictive patient volume models." },
    { category: "ops", icon: MessageSquare, title: "Automated SMS Dispatch", desc: "Instant SMS alerts for appointment confirmation, prescription links, lab report ready, and discharge instructions." },
    { category: "ops", icon: Mail, title: "Email Notifications Engine", desc: "Automated itemized billing invoices, appointment confirmation calendar invites, and discharge summary PDFs." },
    { category: "ops", icon: Smartphone, title: "WhatsApp Business Integration", desc: "Interactive WhatsApp bot for patient self-service booking, token status updates, and lab report PDF download." },
    { category: "ops", icon: Printer, title: "Custom PDF Reports Engine", desc: "Export 100+ clinical and financial reports (NABH compliance logs, audit trails, pharmacy tax returns) in 1-click." },
    { category: "admin", icon: Key, title: "Granular Role Permissions", desc: "Define exact field-level access control for Doctors, Nurses, Receptionists, Pharmacists, Accountants, and Admins." },
    { category: "ops", icon: CloudUpload, title: "Multi-Branch & Cloud Backup", desc: "Manage multiple hospital branches under one global tenant with automatic encrypted hourly cloud backups." }
  ];

  const filtered = activeCategory === "all" ? FEATURES : FEATURES.filter(f => f.category === activeCategory);

  return (
    <section id="features" className="py-20 bg-[#FBF9F9] dark:bg-[#18141C]/60 border-y border-[#E5E0E2] dark:border-[#3E3842]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Medinova Style Centered Subheading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div>
            <span className="text-xs font-bold text-[#4A1F2B] dark:text-[#E2838E] uppercase tracking-wider">
              {t.featuresBadge}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-sans text-[#292727] dark:text-[#FEF8F7] uppercase">
            {t.featuresTitle}
          </h2>
          <p className="text-[#686563] dark:text-[#D5C2C5] text-sm">
            {t.featuresSub}
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                activeCategory === cat.id
                  ? "bg-[#4A1F2B] text-white shadow-xs"
                  : "bg-white dark:bg-[#242026] text-[#292727] dark:text-[#ECE5E7] border border-[#E5E0E2] dark:border-[#3E3842] hover:border-[#4A1F2B] dark:hover:border-[#E2838E]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Medinova Service Item Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-lg bg-white dark:bg-[#242026] border border-[#E5E0E2] dark:border-[#3E3842] shadow-[0_1px_3px_rgba(41,39,39,0.06)] hover:shadow-[0_4px_16px_rgba(41,39,39,0.08)] hover:border-[#4A1F2B] dark:hover:border-[#8C3A45] transition-all text-center flex flex-col items-center justify-between group"
              >
                <div className="w-14 h-14 rounded-md bg-[#F3E9EB] text-[#4A1F2B] dark:bg-[#32293D] dark:text-[#E2838E] flex items-center justify-center mb-4 shadow-xs group-hover:scale-105 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-sans text-[#292727] dark:text-[#FEF8F7] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#686563] dark:text-[#D5C2C5] leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>
                <button className="w-8 h-8 rounded-md bg-[#F7F6F3] dark:bg-[#2D2732] text-[#4A1F2B] dark:text-[#E2838E] flex items-center justify-center group-hover:bg-[#4A1F2B] group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
