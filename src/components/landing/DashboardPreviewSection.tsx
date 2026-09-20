"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortal, RoleType, ROLES } from "@/context/PortalContext";
import {
  Activity,
  Users,
  Bed,
  CreditCard,
  FileText,
  FlaskConical,
  Pill,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Heart
} from "lucide-react";

export default function DashboardPreviewSection() {
  const { activeRole, setActiveRole, openAuthModal } = usePortal();

  return (
    <section id="dashboard" className="py-24 relative bg-[#FBF9F9] dark:bg-[#18141C]/60 border-y border-[#E5E0E2] dark:border-[#3E3842]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div>
            <span className="text-xs font-bold text-[#4A1F2B] dark:text-[#E2838E] uppercase tracking-wider">
              ROLE-BASED CLINICAL PORTAL
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sans text-[#292727] dark:text-[#FEF8F7] uppercase">
            રોલ મુજબ વર્કસ્પેસ કમાન્ડ સેન્ટર
          </h2>
          <p className="text-[#686563] dark:text-[#D5C2C5] text-base">
            ડોક્ટર, દર્દી, ફ્રન્ટ ડેસ્ક અને પેથોલોજી સ્ટાફ માટે ખાસ ડિઝાઇન કરેલ લાઇવ પોર્ટલ મોકઅપ જુઓ.
          </p>
        </div>

        {/* Role Tab Selector */}
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto pb-4 gap-2 no-scrollbar mb-8">
          {Object.values(ROLES).map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id as RoleType)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeRole === role.id
                  ? "bg-[#4A1F2B] text-white border-[#4A1F2B] shadow-xs"
                  : "bg-white dark:bg-[#242026] text-[#292727] dark:text-[#ECE5E7] border-[#E5E0E2] dark:border-[#3E3842] hover:border-[#4A1F2B] dark:hover:border-[#E2838E]"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#3F6B52]" />
              {role.name.split(" ")[0]}
              <span className="opacity-70 text-[10px]">({role.badge})</span>
            </button>
          ))}
        </div>

        {/* Main Mockup Glass Window */}
        <div className="relative rounded-lg bg-white dark:bg-[#242026] border border-[#E5E0E2] dark:border-[#3E3842] shadow-[0_4px_16px_rgba(41,39,39,0.08)] overflow-hidden p-6 sm:p-8">
          
          {/* Top Window Navigation Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#E5E0E2] dark:border-[#3E3842] gap-4">
            <div className="flex items-center gap-3">
              <img
                src={ROLES[activeRole].avatar}
                alt={ROLES[activeRole].name}
                className="w-12 h-12 rounded-md object-cover border border-[#E5E0E2] dark:border-[#3E3842]"
              />
              <div>
                <div className="text-base font-bold font-sans text-[#292727] dark:text-[#FEF8F7] flex items-center gap-2">
                  {ROLES[activeRole].name}
                  <span className="px-2 py-0.5 rounded-md bg-[#F3E9EB] dark:bg-[#32293D] text-[#4A1F2B] dark:text-[#E2838E] text-xs font-semibold">
                    {ROLES[activeRole].badge}
                  </span>
                </div>
                <div className="text-xs text-[#686563] dark:text-[#9B8E92] mt-0.5">
                  {ROLES[activeRole].description}
                </div>
              </div>
            </div>

            <button
              onClick={() => openAuthModal("login")}
              className="px-4 py-2 rounded-md bg-[#4A1F2B] hover:bg-[#5E2737] text-white text-xs font-medium uppercase tracking-wider shadow-xs flex items-center gap-2 transition-colors"
            >
              <span>આ રોલ સાથે લૉગિન કરો</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dynamic Content View according to activeRole */}
          <div className="pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {activeRole === "super_admin" && <SuperAdminMockupView />}
                {activeRole === "hospital_admin" && <HospitalAdminMockupView />}
                {activeRole === "doctor" && <DoctorMockupView />}
                {activeRole === "patient" && <PatientMockupView />}
                {activeRole === "reception" && <ReceptionMockupView />}
                {activeRole === "lab" && <LabMockupView />}
                {activeRole === "pharmacist" && <PharmacyMockupView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}

function SuperAdminMockupView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-md bg-[#F7F6F3] dark:bg-[#2D2732] border border-[#E5E0E2] dark:border-[#3E3842]">
          <div className="text-xs text-[#686563] dark:text-[#9B8E92] font-medium">જોડાયેલી હોસ્પિટલ બ્રાન્ચ</div>
          <div className="text-2xl font-bold text-[#292727] dark:text-[#FEF8F7] mt-1">42 બ્રાન્ચ</div>
          <div className="text-xs text-[#3F6B52] dark:text-[#85B599] mt-1 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +4 હોસ્પિટલ ઉમેરાઈ
          </div>
        </div>
        <div className="p-4 rounded-md bg-[#F7F6F3] dark:bg-[#2D2732] border border-[#E5E0E2] dark:border-[#3E3842]">
          <div className="text-xs text-[#686563] dark:text-[#9B8E92] font-medium">સર્વિસ ચાર્જ આવક</div>
          <div className="text-2xl font-bold text-[#292727] dark:text-[#FEF8F7] mt-1">₹4,82,500</div>
          <div className="text-xs text-[#3F6B52] dark:text-[#85B599] mt-1 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> ₹49 OPD / ₹199 IPD ચાર્જ
          </div>
        </div>
        <div className="p-4 rounded-md bg-[#F7F6F3] dark:bg-[#2D2732] border border-[#E5E0E2] dark:border-[#3E3842]">
          <div className="text-xs text-[#686563] dark:text-[#9B8E92] font-medium">સિસ્ટમ લાઈવ અપટાઈમ</div>
          <div className="text-2xl font-bold text-[#3F6B52] dark:text-[#85B599] mt-1">99.995%</div>
          <div className="text-xs text-[#686563] dark:text-[#9B8E92] mt-1 font-medium">૨૪x૭ સર્વર એક્ટિવ</div>
        </div>
        <div className="p-4 rounded-md bg-[#F7F6F3] dark:bg-[#2D2732] border border-[#E5E0E2] dark:border-[#3E3842]">
          <div className="text-xs text-[#686563] dark:text-[#9B8E92] font-medium">ABDM સુરક્ષા સ્ક્રોર</div>
          <div className="text-2xl font-bold text-[#4A1F2B] dark:text-[#E2838E] mt-1">100/100</div>
          <div className="text-xs text-[#686563] dark:text-[#9B8E92] mt-1 font-medium">ISO 27001 પ્રમાણિત</div>
        </div>
      </div>
    </div>
  );
}

function HospitalAdminMockupView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-md bg-[#F7F6F3] dark:bg-[#2D2732] border border-[#E5E0E2] dark:border-[#3E3842]">
          <div className="text-xs text-[#686563] dark:text-[#9B8E92]">આજનું બિલિંગ કલેક્શન</div>
          <div className="text-2xl font-bold text-[#292727] dark:text-[#FEF8F7] mt-1">₹1,28,450</div>
          <div className="text-xs text-[#686563] dark:text-[#9B8E92] mt-1">OPD: ₹42k | IPD: ₹68k | Pharmacy: ₹18k</div>
        </div>
        <div className="p-4 rounded-md bg-[#F7F6F3] dark:bg-[#2D2732] border border-[#E5E0E2] dark:border-[#3E3842]">
          <div className="text-xs text-[#686563] dark:text-[#9B8E92]">ICU અને જનરલ બેડ સ્થિતિ</div>
          <div className="text-2xl font-bold text-[#4A1F2B] dark:text-[#E2838E] mt-1">18 બેડ ખાલી (Available)</div>
          <div className="text-xs text-[#3F6B52] dark:text-[#85B599] mt-1 font-semibold">લાઈવ ઓનલાઇન બુકિંગ સક્રિય</div>
        </div>
        <div className="p-4 rounded-md bg-[#F7F6F3] dark:bg-[#2D2732] border border-[#E5E0E2] dark:border-[#3E3842]">
          <div className="text-xs text-[#686563] dark:text-[#9B8E92]">હાલમાં હાજર સ્ટાફ</div>
          <div className="text-2xl font-bold text-[#292727] dark:text-[#FEF8F7] mt-1">184 તબીબો & નર્સ</div>
          <div className="text-xs text-[#3F6B52] dark:text-[#85B599] mt-1 font-medium">નર્સ-દર્દી રેશિયો: 1:3</div>
        </div>
      </div>
    </div>
  );
}

function DoctorMockupView() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-md bg-[#F7F6F3] dark:bg-[#2D2732] border border-[#E5E0E2] dark:border-[#3E3842] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#F3E9EB] dark:bg-[#32293D] text-[#4A1F2B] dark:text-[#E2838E] flex items-center justify-center font-bold">
            P-48
          </div>
          <div>
            <div className="font-bold text-[#292727] dark:text-[#FEF8F7] text-sm">દર્દી: રમેશભાઈ પટેલ (ઉંમર ૪૫)</div>
            <div className="text-xs text-[#686563] dark:text-[#9B8E92]">લક્ષણો: છાતીમાં તકલીફ અને હાઈ બીપી</div>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-md bg-[#E8F0EC] text-[#3F6B52] dark:bg-[#23382B] dark:text-[#85B599] text-xs font-semibold">
          EHR રેકોર્ડ કન્ફર્મ
        </span>
      </div>
    </div>
  );
}

function PatientMockupView() {
  return (
    <div className="p-4 rounded-md bg-[#F7F6F3] dark:bg-[#2D2732] border border-[#E5E0E2] dark:border-[#3E3842] space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[#292727] dark:text-[#FEF8F7]">તમારી આગામી OPD એપોઇન્ટમેન્ટ</span>
        <span className="text-[#4A1F2B] dark:text-[#E2838E] font-bold">આવતીકાલે સવારે ૧૦:૩૦ વાગ્યે</span>
      </div>
      <div className="p-3 rounded-md bg-white dark:bg-[#242026] border border-[#E5E0E2] dark:border-[#3E3842] flex items-center justify-between text-xs">
        <div>
          <div className="font-bold text-[#292727] dark:text-[#FEF8F7]">ડો. રાજેશ પટેલ (જનરલ ફિઝિશિયન)</div>
          <div className="text-[#686563] dark:text-[#9B8E92]">કન્સલ્ટેશન રુમ ૨૦૪ • મેડિનોવા કેર</div>
        </div>
        <button className="px-3 py-1.5 rounded-md bg-[#3F6B52] hover:bg-[#4C7E61] text-white font-medium transition-colors">
          વીડિયો કોલ શરૂ કરો
        </button>
      </div>
    </div>
  );
}

function ReceptionMockupView() {
  return (
    <div className="p-4 rounded-md bg-[#F7F6F3] dark:bg-[#2D2732] border border-[#E5E0E2] dark:border-[#3E3842] text-xs space-y-2">
      <div className="font-bold text-[#292727] dark:text-[#FEF8F7] text-sm">એક્સપ્રેસ લાઈન ટોકન મેનેજર</div>
      <div className="p-3 rounded-md bg-white dark:bg-[#242026] border border-[#E5E0E2] dark:border-[#3E3842] flex items-center justify-between">
        <span>ટોકન #A-108: તાત્કાલિક લાઈન બુકિંગ</span>
        <span className="px-2 py-0.5 rounded-md bg-[#F3E9EB] dark:bg-[#32293D] text-[#4A1F2B] dark:text-[#E2838E] font-bold">ડો. સ્નેહા શાહ ફાળવેલ</span>
      </div>
    </div>
  );
}

function LabMockupView() {
  return (
    <div className="p-4 rounded-md bg-[#F7F6F3] dark:bg-[#2D2732] border border-[#E5E0E2] dark:border-[#3E3842] text-xs space-y-2">
      <div className="font-bold text-[#292727] dark:text-[#FEF8F7] text-sm">લેબ સેમ્પલ અને ઓટોમેટિક રિપોર્ટ</div>
      <div className="p-3 rounded-md bg-white dark:bg-[#242026] border border-[#E5E0E2] dark:border-[#3E3842] flex items-center justify-between">
        <span>સેમ્પલ #L-8821 (Complete Blood Count)</span>
        <span className="text-[#3F6B52] dark:text-[#85B599] font-bold">PDF રિપોર્ટ વોટ્સએપ પર મોકલેલ</span>
      </div>
    </div>
  );
}

function PharmacyMockupView() {
  return (
    <div className="p-4 rounded-md bg-[#F7F6F3] dark:bg-[#2D2732] border border-[#E5E0E2] dark:border-[#3E3842] text-xs space-y-2">
      <div className="font-bold text-[#292727] dark:text-[#FEF8F7] text-sm">બારકોડ મેડિસિન પ્રિસ્ક્રિપ્શન</div>
      <div className="p-3 rounded-md bg-white dark:bg-[#242026] border border-[#E5E0E2] dark:border-[#3E3842] flex items-center justify-between">
        <span>એમોક્સિલીન 500mg • બેચ #AX-2026</span>
        <span className="text-[#3F6B52] dark:text-[#85B599] font-bold">દવા ઓટો હોમ ડિલિવરી ડિસ્પેચ</span>
      </div>
    </div>
  );
}
