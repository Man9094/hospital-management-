"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  Building2,
  Stethoscope,
  Users,
  ShieldCheck,
  CheckCircle2,
  Zap,
  TrendingUp,
  Award,
  Clock,
  HeartPulse
} from "lucide-react";

export default function BenefitsPersonaSection() {
  const { t, language } = useLanguage();

  return (
    <section id="about" className="py-20 bg-[#FBF9F9] dark:bg-[#18141C]/60 border-y border-[#E5E0E2] dark:border-[#3E3842]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* About Medinova Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div>
            <span className="text-xs font-bold text-[#4A1F2B] dark:text-[#E2838E] uppercase tracking-wider">
              ABOUT MEDCORE HMS
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-sans text-[#292727] dark:text-[#FEF8F7] uppercase">
            {language === "gu"
              ? "અમારા વિશે — ભારતીય દર્દીઓ માટે સરળ હેલ્થકેર"
              : language === "hi"
              ? "हमारे बारे में — भारतीय मरीजों के लिए आसान हेल्थकेयर"
              : "About Us — Simple Healthcare For Indian Patients"}
          </h2>
          <p className="text-[#686563] dark:text-[#D5C2C5] text-sm">
            ગુજરાત અને સમગ્ર ભારતની હોસ્પિટલો સાથે જોડાઈને દર્દીઓને ઘરે બેઠા જ અનુકૂળ ડોક્ટર અને બેડ એડમિશનની સુવિધા આપતું પ્લેટફોર્મ.
          </p>
        </div>

        {/* 3 Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: For Patients */}
          <div className="p-6 rounded-lg bg-white dark:bg-[#242026] border border-[#E5E0E2] dark:border-[#3E3842] shadow-[0_1px_3px_rgba(41,39,39,0.06)] space-y-4">
            <div className="w-11 h-11 rounded-md bg-[#F3E9EB] text-[#4A1F2B] dark:bg-[#32293D] dark:text-[#E2838E] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-sans text-[#292727] dark:text-[#FEF8F7] uppercase">
              દર્દીઓ અને પરિવાર માટે
            </h3>
            <ul className="space-y-2 text-xs text-[#686563] dark:text-[#D5C2C5] font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3F6B52] dark:text-[#85B599] shrink-0" /> ઘરે બેઠા અનુકૂળ ડોક્ટરની પસંદગી
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3F6B52] dark:text-[#85B599] shrink-0" /> થિયેટર સીટની જેમ લાઈવ બેડ કન્ફર્મેશન (₹199)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3F6B52] dark:text-[#85B599] shrink-0" /> ઓનલાઇન OPD લાઇન નંબર બુકિંગ (₹49)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3F6B52] dark:text-[#85B599] shrink-0" /> વોટ્સએપ પર પીડીએફ લેબ રિપોર્ટ
              </li>
            </ul>
          </div>

          {/* Card 2: For Doctors */}
          <div className="p-6 rounded-lg bg-white dark:bg-[#242026] border border-[#E5E0E2] dark:border-[#3E3842] shadow-[0_1px_3px_rgba(41,39,39,0.06)] space-y-4">
            <div className="w-11 h-11 rounded-md bg-[#F3E9EB] text-[#4A1F2B] dark:bg-[#32293D] dark:text-[#E2838E] flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-sans text-[#292727] dark:text-[#FEF8F7] uppercase">
              તબીબો અને નિષ્ણાતો માટે
            </h3>
            <ul className="space-y-2 text-xs text-[#686563] dark:text-[#D5C2C5] font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3F6B52] dark:text-[#85B599] shrink-0" /> ડિજિટલ OPD ટોકન અને રોસ્ટર મેનેજમેન્ટ
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3F6B52] dark:text-[#85B599] shrink-0" /> ગુજરાતી, હિન્દી અને ઈંગ્લિશ ઈ-પ્રિસ્ક્રિપ્શન
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3F6B52] dark:text-[#85B599] shrink-0" /> ટેલિ-કન્સલ્ટેશન અને વીડિયો કોલ કન્સલ્ટ
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3F6B52] dark:text-[#85B599] shrink-0" /> ઓટોમેટિક મહેનતાણું & ઓપીડી પાવતી
              </li>
            </ul>
          </div>

          {/* Card 3: For Hospitals */}
          <div className="p-6 rounded-lg bg-white dark:bg-[#242026] border border-[#E5E0E2] dark:border-[#3E3842] shadow-[0_1px_3px_rgba(41,39,39,0.06)] space-y-4">
            <div className="w-11 h-11 rounded-md bg-[#F3E9EB] text-[#4A1F2B] dark:bg-[#32293D] dark:text-[#E2838E] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-sans text-[#292727] dark:text-[#FEF8F7] uppercase">
              હોસ્પિટલો અને ક્લિનિક માટે
            </h3>
            <ul className="space-y-2 text-xs text-[#686563] dark:text-[#D5C2C5] font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3F6B52] dark:text-[#85B599] shrink-0" /> કોઈ માસિક કે વાર્ષિક સબ્સ્ક્રિપ્શન ફી નથી
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3F6B52] dark:text-[#85B599] shrink-0" /> ABDM, આયુષ્માન ભારત (PM-JAY) સુસંગત
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3F6B52] dark:text-[#85B599] shrink-0" /> રિયલ-ટાઇમ બેડ મેપિંગ અને ICU મોનિટરિંગ
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3F6B52] dark:text-[#85B599] shrink-0" /> પેપરલેસ GST બિલિંગ અને TPA ક્લેમ
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
