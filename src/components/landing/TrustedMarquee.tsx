"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle } from "lucide-react";

const INDIAN_HOSPITALS = [
  { name: "Apollo Hospitals", location: "Ahmedabad & Mumbai", code: "APOLLO" },
  { name: "Fortis Healthcare", location: "New Delhi & Gurugram", code: "FORTIS" },
  { name: "Sterling Hospitals", location: "Rajkot & Vadodara", code: "STERLING" },
  { name: "Sal Hospital & Medical Institute", location: "Ahmedabad, GUJ", code: "SAL" },
  { name: "Zydus Hospitals", location: "Surat & Ahmedabad", code: "ZYDUS" },
  { name: "KIMS Hospitals Network", location: "Hyderabad & Vizag", code: "KIMS" },
  { name: "Max Healthcare", location: "Delhi NCR", code: "MAX" },
  { name: "Manipal Hospitals", location: "Bengaluru & Pune", code: "MANIPAL" }
];

export default function TrustedMarquee() {
  const { t } = useLanguage();

  return (
    <section className="py-10 border-y border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {t.trustedHeading}
        </p>
      </div>

      <div className="relative w-full overflow-hidden flex items-center">
        <div className="animate-marquee flex items-center gap-6 whitespace-nowrap">
          {[...INDIAN_HOSPITALS, ...INDIAN_HOSPITALS].map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm shrink-0"
            >
              <div className="w-7 h-7 rounded-lg bg-[#0F6CBD]/10 text-[#0F6CBD] font-bold text-xs flex items-center justify-center">
                {h.code.slice(0, 3)}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  {h.name}
                  <CheckCircle className="w-3 h-3 text-[#00C896]" />
                </div>
                <div className="text-[10px] text-slate-400">{h.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
