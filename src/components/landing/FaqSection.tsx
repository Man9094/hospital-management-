"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "How long does a typical MedCore hospital deployment take?",
    a: "For single-specialty clinics or OPD centers, rollout takes less than 24 hours with our automated setup wizard. For 200+ bed multi-specialty hospitals with legacy EHR data migration, our dedicated clinical integration team completes full deployment in 7 to 14 days."
  },
  {
    q: "Is MedCore fully HIPAA and HL7/FHIR compliant?",
    a: "Yes. MedCore signs a standard HIPAA Business Associate Agreement (BAA) with all healthcare organizations. Our API natively supports HL7 v2, v3, and FHIR R4 standards for seamless integration with legacy lab devices, PACS imaging, and national health registries."
  },
  {
    q: "Can we migrate data from our existing hospital software?",
    a: "Absolutely. We provide zero-downtime ETL data migration tools for legacy SQL, Excel, and legacy EHR databases. Our data engineers handle past patient records, allergy history, inventory master lists, and active billing ledgers cleanly."
  },
  {
    q: "What happens if our hospital loses internet connectivity?",
    a: "MedCore features an offline-first Edge Cache module. Critical OPD consultation notes, prescription issuing, and express patient check-ins continue locally on your hospital local network and automatically sync back to the cloud once internet restores."
  },
  {
    q: "How does the pricing work for multi-branch hospital chains?",
    a: "We offer tailored Enterprise licensing based on your active doctor count or total bed capacity. Contact our enterprise sales team for volume discounts across multi-city hospital networks."
  },
  {
    q: "What kind of training and customer support is included?",
    a: "All plans include 24/7 priority clinical support via phone, live chat, and dedicated WhatsApp channels. We also provide interactive video training modules for doctors, nurses, pharmacists, and reception staff."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [query, setQuery] = useState("");

  const filteredFaqs = FAQS.filter(
    (item) =>
      item.q.toLowerCase().includes(query.toLowerCase()) ||
      item.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="py-24 relative bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F6CBD]/10 text-[#0F6CBD] dark:text-[#4CC9F0] text-xs font-bold uppercase tracking-wider">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-slate-900 dark:text-white">
            Everything You Need to Know About MedCore
          </h2>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto pt-4">
            <Search className="w-4 h-4 absolute left-4 top-7 text-slate-400" />
            <input
              type="text"
              placeholder="Search deployment, compliance, data migration..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0F6CBD] shadow-sm"
            />
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold font-poppins text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4 hover:text-[#0F6CBD] dark:hover:text-[#4CC9F0]"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#00C896] shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#0F6CBD]" : "text-slate-400"}`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
