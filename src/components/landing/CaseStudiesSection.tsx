"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, ShieldCheck, ArrowRight } from "lucide-react";

const CASES = [
  {
    title: "St. Jude 500-Bed Multi-Specialty Hospital",
    location: "Chicago, IL",
    challenge: "Long OPD wait times (45+ mins) and fragmented paper lab records.",
    solution: "Deployed MedCore QR token check-in, auto-analyzer LIS, and speech AI EHR.",
    results: [
      { label: "Check-In Speed", val: "-68% Wait Time" },
      { label: "Lab Report Accuracy", val: "99.98% Accuracy" },
      { label: "Annual Savings", val: "$420,000 / Year" }
    ]
  },
  {
    title: "Apollo Metro Cardiac Institute",
    location: "New Delhi, IN",
    challenge: "High ICU bed vacancy delays and manual prescription errors.",
    solution: "Integrated MedCore IPD Bed Matrix, barcode pharmacy POS, and PACS radiology.",
    results: [
      { label: "Bed Turnover", val: "+38% Capacity" },
      { label: "Prescription Errors", val: "Zero Incidents" },
      { label: "EHR Vitals Sync", val: "Real-Time" }
    ]
  }
];

export default function CaseStudiesSection() {
  return (
    <section className="py-24 relative bg-[#FBF9F9] dark:bg-[#18141C]/60 border-y border-[#E5E0E2] dark:border-[#3E3842]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E8F0EC] text-[#3F6B52] dark:bg-[#23382B] dark:text-[#85B599] text-xs font-semibold uppercase tracking-wider">
            Proven Hospital Transformations
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sans text-[#292727] dark:text-[#FEF8F7]">
            Real Clinical Outcomes & Enterprise ROI
          </h2>
          <p className="text-[#686563] dark:text-[#D5C2C5] text-base">
            See how leading hospital systems replaced legacy software to achieve operational excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {CASES.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              viewport={{ once: true }}
              className="p-8 rounded-lg bg-white dark:bg-[#242026] border border-[#E5E0E2] dark:border-[#3E3842] shadow-[0_1px_3px_rgba(41,39,39,0.06)] space-y-6"
            >
              <div>
                <div className="text-xs font-semibold text-[#4A1F2B] dark:text-[#E2838E] uppercase tracking-wider mb-1">
                  {item.location}
                </div>
                <h3 className="text-xl font-bold font-sans text-[#292727] dark:text-[#FEF8F7]">
                  {item.title}
                </h3>
              </div>

              <div className="space-y-3 text-xs text-[#686563] dark:text-[#D5C2C5]">
                <div>
                  <strong className="text-[#292727] dark:text-[#ECE5E7]">Challenge:</strong> {item.challenge}
                </div>
                <div>
                  <strong className="text-[#292727] dark:text-[#ECE5E7]">Solution:</strong> {item.solution}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E5E0E2] dark:border-[#3E3842]">
                {item.results.map((res, rIdx) => (
                  <div key={rIdx} className="p-3 rounded-md bg-[#F7F6F3] dark:bg-[#2D2732] text-center border border-[#E5E0E2] dark:border-[#3E3842]">
                    <div className="text-[10px] text-[#686563] dark:text-[#9B8E92] font-medium">{res.label}</div>
                    <div className="text-sm font-bold text-[#3F6B52] dark:text-[#85B599] mt-0.5">{res.val}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
