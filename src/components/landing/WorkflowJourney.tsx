"use client";

import React from "react";
import {
  Users,
  Calendar,
  Heart,
  Stethoscope,
  FlaskConical,
  Pill,
  Bed,
  CreditCard,
  FileCheck,
  ArrowDown
} from "lucide-react";

export default function WorkflowJourney() {
  const steps = [
    {
      num: "01",
      title: "Patient Registration & Unique UHID",
      desc: "Reception records demographics, links ABHA Health ID, blood group and generates a permanent lifetime UHID (e.g. MC-2026-000106).",
      icon: Users,
      role: "Reception Desk",
    },
    {
      num: "02",
      title: "OPD Appointment & Token Dispatch",
      desc: "Automated queue assigns doctor consultation token number (Token A-101), calculates estimated wait time, and routes patient to triage.",
      icon: Calendar,
      role: "Queue Manager",
    },
    {
      num: "03",
      title: "Triage & Baseline Vitals Intake",
      desc: "Nursing staff records blood pressure, pulse, temperature, and SpO2 with automated warning badges for abnormal parameters.",
      icon: Heart,
      role: "Nursing Station",
    },
    {
      num: "04",
      title: "Doctor Clinical EMR & Examination",
      desc: "Attending consultant examines patient, documents SOAP notes, assigns ICD-10 diagnosis code, and generates digital treatment plan.",
      icon: Stethoscope,
      role: "Attending Physician",
    },
    {
      num: "05",
      title: "Laboratory & Radiology Investigations",
      desc: "LIS generates sample barcode for blood tests; RIS tracks imaging studies. Verified pathology and radiology findings sync automatically.",
      icon: FlaskConical,
      role: "Pathology & Radiology",
    },
    {
      num: "06",
      title: "E-Prescription & FEFO Pharmacy",
      desc: "Doctor's e-prescription routes directly to pharmacy. Pharmacist dispenses medicines from earliest-expiry batches with stock tracking.",
      icon: Pill,
      role: "Hospital Pharmacy",
    },
    {
      num: "07",
      title: "Inpatient Bed Admission (If Required)",
      desc: "Direct admission to ICU, Deluxe, or General ward bed. Automatic bed status update, daily rounds charting, and medication scheduling.",
      icon: Bed,
      role: "IPD Ward Staff",
    },
    {
      num: "08",
      title: "Automatic GST Billing & Cashless TPA",
      desc: "System compiles itemized charges across consultation, diagnostics, medicines, and ward stay. Supports PM-JAY and instant UPI receipts.",
      icon: CreditCard,
      role: "Billing & Accounts",
    },
    {
      num: "09",
      title: "Clinical Discharge & Patient Portal",
      desc: "Doctor signs verified discharge summary. Patient accesses complete reports, bills, and follow-up advice on their encrypted personal health portal.",
      icon: FileCheck,
      role: "Patient Health Passport",
    },
  ];

  return (
    <section id="workflow" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider">
            SEAMLESS CONTINUITY OF CARE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-poppins text-slate-900 dark:text-white tracking-tight">
            The Complete Connected Patient Journey
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Never lose patient context. Every doctor visit, test result, pharmacy dispensation, and bed movement is permanently linked to one UHID record.
          </p>
        </div>

        {/* 9-Step Timeline Journey */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black font-poppins text-[#13C5DD]">
                      {step.num}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#13C5DD]" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-extrabold uppercase">
                    {step.role}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-[#13C5DD]/15 text-[#13C5DD] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
