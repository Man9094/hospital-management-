"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does MedCore HMS connect all hospital departments into one platform?",
      a: "MedCore assigns every patient a permanent Unique Hospital Identification Number (UHID) upon initial registration. This UHID acts as the central anchor connecting OPD tokens, Doctor EMR notes, LIS pathology samples, RIS imaging studies, pharmacy FEFO dispensing, IPD bed allocations, and GST invoices into a single synchronized patient dossier.",
    },
    {
      q: "Does MedCore support Indian GST and cashless Insurance / TPA / PM-JAY billing?",
      a: "Yes. MedCore features built-in GST compliance with customizable 5%, 12%, and 18% tax categories for hospital medicines and services. It provides complete workflows for cashless pre-authorization, TPA claim tracking (Star Health, Medi Assist, etc.), and Ayushman Bharat PM-JAY package settlements.",
    },
    {
      q: "How is patient medical privacy protected across different hospital staff roles?",
      a: "MedCore enforces strict Role-Based Access Control (RBAC) at both the application and database API levels. For example, pharmacists only view prescribed medications and dosage; lab technicians view investigation orders; billing clerks see itemized charges; and patients access exclusively their personal health passport.",
    },
    {
      q: "What is the ABDM / ABHA Health ID readiness of MedCore HMS?",
      a: "MedCore is architected following National Health Authority (NHA) Ayushman Bharat Digital Mission (ABDM) standards, supporting ABHA Health ID linking, consent management architecture, and standardized diagnostic coding.",
    },
    {
      q: "How does the interactive Bed Matrix work during IPD admissions?",
      a: "The graphical Bed Matrix visualizes all hospital wards (ICU, Semi-Private, Deluxe, General) in real time. Staff can immediately see available, occupied, sanitizing, or reserved beds, transfer patients between rooms, and track ward charges per day with automated billing capture.",
    },
  ];

  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="text-xs font-bold text-[#4A1F2B] dark:text-[#E2838E] uppercase tracking-wider">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-sans text-[#292727] dark:text-[#FEF8F7] tracking-tight">
            Hospital OS Architecture FAQs
          </h2>
          <p className="text-sm sm:text-base text-[#686563] dark:text-[#D5C2C5]">
            Answers for hospital administrators, medical directors, and IT officers.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-lg border border-[#E5E0E2] dark:border-[#3E3842] bg-white dark:bg-[#242026] shadow-[0_1px_3px_rgba(41,39,39,0.06)] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-bold font-sans text-sm sm:text-base text-[#292727] dark:text-[#FEF8F7]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#4A1F2B] dark:text-[#E2838E]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#686563] dark:text-[#D5C2C5] leading-relaxed border-t border-[#E5E0E2] dark:border-[#3E3842] pt-4 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
