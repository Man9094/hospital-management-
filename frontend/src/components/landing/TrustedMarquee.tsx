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
    <section className="py-10 border-y border-[#E5E0E2] dark:border-[#3E3842] bg-[#FBF9F9] dark:bg-[#18141C]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#686563] dark:text-[#9B8E92]">
          {t.trustedHeading}
        </p>
      </div>

      <div className="relative w-full overflow-hidden flex items-center">
        <div className="animate-marquee flex items-center gap-6 whitespace-nowrap">
          {[...INDIAN_HOSPITALS, ...INDIAN_HOSPITALS].map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-2.5 rounded-md bg-white dark:bg-[#242026] border border-[#E5E0E2] dark:border-[#3E3842] shadow-[0_1px_3px_rgba(41,39,39,0.06)] shrink-0"
            >
              <div className="w-7 h-7 rounded-md bg-[#F3E9EB] text-[#4A1F2B] dark:bg-[#32293D] dark:text-[#E2838E] font-bold text-xs flex items-center justify-center">
                {h.code.slice(0, 3)}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-[#292727] dark:text-[#ECE5E7] flex items-center gap-1">
                  {h.name}
                  <CheckCircle className="w-3 h-3 text-[#3F6B52] dark:text-[#85B599]" />
                </div>
                <div className="text-[10px] text-[#686563] dark:text-[#9B8E92]">{h.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
