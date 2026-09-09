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
    <section className="py-24 relative bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C896]/10 text-[#00C896] text-xs font-bold uppercase tracking-wider">
            Proven Hospital Transformations
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-poppins text-slate-900 dark:text-white">
            Real Clinical Outcomes & Enterprise ROI
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            See how leading hospital systems replaced legacy software to achieve operational excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {CASES.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6"
            >
              <div>
                <div className="text-xs font-bold text-[#0F6CBD] dark:text-[#4CC9F0] uppercase tracking-wider mb-1">
                  {item.location}
                </div>
                <h3 className="text-xl font-bold font-poppins text-slate-900 dark:text-white">
                  {item.title}
                </h3>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <strong className="text-slate-900 dark:text-slate-200">Challenge:</strong> {item.challenge}
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-slate-200">Solution:</strong> {item.solution}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                {item.results.map((res, rIdx) => (
                  <div key={rIdx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-center">
                    <div className="text-[10px] text-slate-400 font-medium">{res.label}</div>
                    <div className="text-sm font-extrabold text-[#00C896] mt-0.5">{res.val}</div>
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
