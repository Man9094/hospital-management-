"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePortal } from "@/context/PortalContext";
import { useLanguage } from "@/context/LanguageContext";
import PatientAdmissionModal from "@/components/modals/PatientAdmissionModal";
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Bed, Calendar } from "lucide-react";

export default function CtaSection() {
  const { openAuthModal } = usePortal();
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#1D2A4D] text-white p-8 sm:p-16 border-4 border-[#13C5DD] shadow-2xl text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#13C5DD]/20 text-[#13C5DD] text-xs font-extrabold uppercase border border-[#13C5DD]/40">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            {language === "gu" ? "ઝીરો માસિક ફી — ઘરેથી સરળ હેલ્થકેર" : "Zero Subscription — Easy Home Care"}
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-poppins text-white tracking-tight leading-tight max-w-3xl mx-auto uppercase">
            {language === "gu"
              ? "તમારા પરિવાર માટે આજે જ અનુકૂળ ડોક્ટર અને બેડ પસંદ કરો"
              : language === "hi"
              ? "अपने परिवार के लिए आज ही डॉक्टर और बेड चुनें"
              : "Select Your Preferred Doctor & Hospital Bed Today"}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            ભારતની ૫૦૦+ હોસ્પિટલો અને ૧૨,૦૦૦+ નિષ્ણાત તબીબો સાથે જોડાયેલા ઓનલાઇન પોર્ટલ પરથી ઘરે બેઠા જ સેવાઓ મેળવો.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#13C5DD] hover:bg-[#10b1c7] text-white font-extrabold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2"
            >
              <Bed className="w-5 h-5" />
              {language === "gu" ? "ઘરે બેઠા દર્દી એડમિટ કરો (₹199)" : "Admit Patient From Home"}
            </motion.button>

            <a
              href="#doctors"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#13C5DD]" />
              {language === "gu" ? "અમારા ડોકટરો પસંદ કરો" : "Select Specialist Doctor"}
            </a>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00C896]" /> કોઈ માસિક સબ્સ્ક્રિપ્શન ચાર્જ નથી
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00C896]" /> ૧૦૦% પારદર્શક સર્વિસ ફી
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00C896]" /> આયુષ્માન ભારત (PM-JAY) સુસંગત
            </span>
          </div>

        </div>
      </div>

      <PatientAdmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
