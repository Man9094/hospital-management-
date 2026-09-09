"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Bed, Activity, AlertTriangle, Truck, Droplet, Video, Scissors, Scan } from "lucide-react";

export default function ModulesGrid() {
  const { t } = useLanguage();

  const MODULES = [
    { icon: Bed, title: t.ipdTitle, desc: t.ipdDesc, tag: "IPD વોર્ડ" },
    { icon: Activity, title: t.opdTitle, desc: t.opdDesc, tag: "OPD વિભાગ" },
    { icon: AlertTriangle, title: t.erTitle, desc: t.erDesc, tag: "ઇમરજન્સી" },
    { icon: Truck, title: t.ambTitle, desc: t.ambDesc, tag: "એમ્બ્યુલન્સ" },
    { icon: Droplet, title: t.bloodTitle, desc: t.bloodDesc, tag: "બ્લડ બેંક" },
    { icon: Video, title: t.teleTitle, desc: t.teleDesc, tag: "ઓનલાઇન કન્સલ્ટેશન" },
    { icon: Scissors, title: t.otTitle, desc: t.otDesc, tag: "ઓપરેશન થિયેટર" },
    { icon: Scan, title: t.pacsTitle, desc: t.pacsDesc, tag: "લેબ & એક્સ-રે" }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F6CBD]/10 text-[#0F6CBD] dark:text-[#4CC9F0] text-xs font-bold">
            {t.modulesTitle}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-poppins text-slate-900 dark:text-white">
            {t.modulesSub}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {MODULES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-[#0F6CBD] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#0F6CBD] dark:text-[#4CC9F0] flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold font-poppins text-slate-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
