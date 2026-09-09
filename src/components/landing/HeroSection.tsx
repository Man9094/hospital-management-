"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePortal } from "@/context/PortalContext";
import { useLanguage } from "@/context/LanguageContext";
import PatientAdmissionModal from "@/components/modals/PatientAdmissionModal";
import ECGPulse from "@/components/ui/ECGPulse";
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Stethoscope,
  Clock,
  Sparkles,
  Bed,
  PhoneCall,
  UserCheck,
  Microscope,
  Ambulance,
  Building2
} from "lucide-react";

export default function HeroSection() {
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative bg-[#1D2A4D] text-white pt-12 pb-20 overflow-hidden">
      {/* Background Subtle Medical Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#13C5DD_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content - Medinova Style */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Medinova Sub-Heading Underline Accent */}
            <div className="inline-block">
              <span className="medinova-subheading text-sm">
                WELCOME TO MEDINNOVA CARE
              </span>
            </div>

            {/* Main Display Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-poppins uppercase tracking-wide leading-tight text-white">
              {language === "gu" ? (
                <>
                  તમારા અનુકૂળ ડોક્ટર અને બેડ <br />
                  <span className="text-[#13C5DD]">ઘરેથી જ પસંદ કરો</span>
                </>
              ) : (
                <>
                  BEST HEALTHCARE SOLUTION <br />
                  <span className="text-[#13C5DD]">FOR YOUR FAMILY</span>
                </>
              )}
            </h1>

            {/* Subtext */}
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t.heroSub}
            </p>

            {/* Medinova Style Rounded Pill Buttons (No Video) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#13C5DD] hover:bg-[#10b1c7] text-white font-extrabold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <Bed className="w-5 h-5" />
                {language === "gu" ? "ઘરે બેઠા દર્દી એડમિટ કરો (₹199)" : "Admit Patient Now"}
              </motion.button>

              <a
                href="#bed-drawing-matrix"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent hover:bg-white/10 text-white border-2 border-white/40 text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4 text-[#13C5DD]" />
                {language === "gu" ? "અમારા બધા બેડ જુઓ (Bed Status)" : "View Hospital Beds"}
              </a>
            </div>

            {/* Medinova Circular Feature Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-700/60">
              <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/10">
                <Stethoscope className="w-6 h-6 text-[#13C5DD] mx-auto mb-1" />
                <div className="text-xs font-bold text-white">QUALIFIED</div>
                <div className="text-[10px] text-[#13C5DD] uppercase font-bold">DOCTORS</div>
              </div>
              <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/10">
                <Bed className="w-6 h-6 text-[#13C5DD] mx-auto mb-1" />
                <div className="text-xs font-bold text-white">EMERGENCY</div>
                <div className="text-[10px] text-[#13C5DD] uppercase font-bold">ICU BEDS</div>
              </div>
              <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/10">
                <Microscope className="w-6 h-6 text-[#13C5DD] mx-auto mb-1" />
                <div className="text-xs font-bold text-white">ACCURATE</div>
                <div className="text-[10px] text-[#13C5DD] uppercase font-bold">LAB TESTING</div>
              </div>
              <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/10">
                <Ambulance className="w-6 h-6 text-[#13C5DD] mx-auto mb-1" />
                <div className="text-xs font-bold text-white">24/7 FREE</div>
                <div className="text-[10px] text-[#13C5DD] uppercase font-bold">AMBULANCE</div>
              </div>
            </div>

          </motion.div>

          {/* Right Live Bed Matrix Overview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl bg-white text-slate-900 shadow-2xl p-6 space-y-4">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#13C5DD]">
                    ઓનલાઇન હોસ્પિટલ સેવાઓ
                  </div>
                  <h3 className="text-lg font-bold font-poppins text-[#1D2A4D]">
                    ઘરેથી એડમિશન અને એપોઇન્ટમેન્ટ
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#13C5DD]/10 text-[#13C5DD] text-[10px] font-bold">
                  ● લાઈવ બેડ સિસ્ટમ
                </span>
              </div>

              {/* Heartbeat Ticker */}
              <div className="p-4 rounded-2xl bg-[#1D2A4D] text-white space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 text-[#13C5DD] font-bold">
                    <Heart className="w-4 h-4 fill-current text-red-500 animate-pulse" /> ICU અને જનરલ બેડ સ્થિતિ
                  </span>
                  <span>ખાલી: <strong className="text-[#00C896]">૧૮ બેડ</strong> | બુક: <strong className="text-red-400">૨૪ બેડ</strong></span>
                </div>
                <ECGPulse color="#13C5DD" className="h-8" />
              </div>

              {/* Service Charge Notice */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500 text-[10px] font-bold">OPD ટોકન બુકિંગ</div>
                  <div className="text-xl font-extrabold text-[#1D2A4D]">₹49 / બુકિંગ</div>
                  <div className="text-[10px] text-[#13C5DD] font-bold">ઓનલાઇન કન્ફર્મ</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500 text-[10px] font-bold">IPD બેડ એડમિશન</div>
                  <div className="text-xl font-extrabold text-[#13C5DD]">₹199 / દર્દી</div>
                  <div className="text-[10px] text-slate-500 font-bold">ઘરેથી જ બેડ નક્કી</div>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 rounded-full bg-[#13C5DD] hover:bg-[#10b1c7] text-white font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
              >
                <Bed className="w-4 h-4" /> દર્દી એડમિટ કરો (ઘરેથી)
              </button>

            </div>
          </motion.div>

        </div>
      </div>

      <PatientAdmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
