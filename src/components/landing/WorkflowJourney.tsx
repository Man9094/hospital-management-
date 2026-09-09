"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { UserPlus, Stethoscope, FlaskConical, Pill, CreditCard, LogOut, CheckCircle } from "lucide-react";

export default function WorkflowJourney() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const STEPS = [
    { number: "01", title: t.step1, icon: UserPlus, desc: "રિસેપ્શન અથવા દર્દી કિયોસ્ક દ્વારા ઝડપી નોંધણી અને ઓપીડી ટોકન બારકોડ પ્રિન્ટિંગ.", details: "૩૦ સેકન્ડથી પણ ઓછા સમયમાં એન્ટ્રી." },
    { number: "02", title: t.step2, icon: Stethoscope, desc: "ડોક્ટર દ્વારા દર્દીની તપાસ, બીપી/વજન વિટલ્સ અને ડિજિટલ દવાઓનું લખાણ.", details: "પ્રિસ્ક્રિપ્શન પ્રિન્ટ અને વોટ્સએપ મેસેજ." },
    { number: "03", title: t.step3, icon: FlaskConical, desc: "લેબ સેમ્પલ કલેક્શન, ઓટો પેથોલોજી રિપોર્ટ એન્ટ્રી અને એક્સ-રે રિપોર્ટિંગ.", details: "ઓટોમેટિક રિપોર્ટ તૈયાર અને સાઇન." },
    { number: "04", title: t.step4, icon: Pill, desc: "મેડિકલ સ્ટોર દ્વારા બારકોડ સ્કેન કરી પ્રિસ્ક્રિપ્શન દવાઓ આપવી.", details: "એક્સપાયરી ડેટ ચકાસણી સાથે સ્ટોક ઓછો." },
    { number: "05", title: t.step5, icon: CreditCard, desc: "ઓપીડી કન્સલ્ટેશન, લેબ ટેસ્ટ અને દવાઓનું કમ્બાઈન્ડ જીએસટી પાકું બિલ.", details: "કેશ, યુપીઆઈ, કાર્ડ કે વીમા કેશલેસ." },
    { number: "06", title: t.step6, icon: LogOut, desc: "હોસ્પિટલમાંથી ડીજિટલ ડિસ્ચાર્જ કાર્ડ અને આગળની તપાસ તારીખ યાદ અપાવવી.", details: "દર્દી માટે ઓનલાઇન પાસપોર્ટ." }
  ];

  return (
    <section id="workflow" className="py-20 border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C896]/10 text-[#00C896] text-xs font-bold">
            {t.workflowBadge}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-poppins text-slate-900 dark:text-white">
            {t.workflowTitle}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {t.workflowSub}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeStep === idx
                    ? "bg-[#0F6CBD] text-white border-[#0F6CBD] shadow-sm"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold ${activeStep === idx ? "text-white/80" : "text-slate-400"}`}>
                    {step.number}
                  </span>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold truncate">{step.title}</div>
              </button>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-[#0F6CBD] text-white font-extrabold text-sm flex items-center justify-center">
              {STEPS[activeStep].number}
            </span>
            <h3 className="text-xl font-bold font-poppins text-slate-900 dark:text-white">
              {STEPS[activeStep].title}
            </h3>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {STEPS[activeStep].desc}
          </p>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs font-bold text-[#00C896]">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{STEPS[activeStep].details}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
