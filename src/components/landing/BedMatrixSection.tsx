"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import PatientAdmissionModal from "@/components/modals/PatientAdmissionModal";
import {
  Bed,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  Filter,
  DoorOpen,
  Wind,
  Activity,
  User,
  Building,
  HeartPulse
} from "lucide-react";

export interface BlueprintBed {
  id: string;
  code: string;
  roomNumber: string;
  roomNameGu: string;
  roomNameHi: string;
  roomNameEn: string;
  wing: "icu" | "deluxe" | "general" | "emergency";
  status: "available" | "occupied" | "sanitizing";
  patientName?: string;
  hasOxygen: boolean;
  hasVentilator: boolean;
  hasAC: boolean;
  hasAttachedBath: boolean;
  dailyCharge: string;
}

export interface RoomGroup {
  roomNumber: string;
  wing: "icu" | "deluxe" | "general" | "emergency";
  titleGu: string;
  titleEn: string;
  beds: BlueprintBed[];
}

const BLUEPRINT_ROOMS: RoomGroup[] = [
  {
    roomNumber: "ICU Wing 101",
    wing: "icu",
    titleGu: "ICU ક્રિટિકલ કેર રૂમ (ICU 101-104)",
    titleEn: "ICU Critical Care Suite",
    beds: [
      { id: "icu-1", code: "ICU-101", roomNumber: "101", roomNameGu: "ICU કેર", roomNameHi: "ICU केयर", roomNameEn: "ICU Care", wing: "icu", status: "occupied", patientName: "Patient #4081", hasOxygen: true, hasVentilator: true, hasAC: true, hasAttachedBath: false, dailyCharge: "₹2,500/દિન" },
      { id: "icu-2", code: "ICU-102", roomNumber: "101", roomNameGu: "ICU કેર", roomNameHi: "ICU केयर", roomNameEn: "ICU Care", wing: "icu", status: "available", hasOxygen: true, hasVentilator: true, hasAC: true, hasAttachedBath: false, dailyCharge: "₹2,500/દિન" },
      { id: "icu-3", code: "ICU-103", roomNumber: "102", roomNameGu: "ICU કેર", roomNameHi: "ICU केयर", roomNameEn: "ICU Care", wing: "icu", status: "available", hasOxygen: true, hasVentilator: true, hasAC: true, hasAttachedBath: false, dailyCharge: "₹2,500/દિન" },
      { id: "icu-4", code: "ICU-104", roomNumber: "102", roomNameGu: "ICU કેર", roomNameHi: "ICU केयर", roomNameEn: "ICU Care", wing: "icu", status: "sanitizing", hasOxygen: true, hasVentilator: true, hasAC: true, hasAttachedBath: false, dailyCharge: "₹2,500/દિન" }
    ]
  },
  {
    roomNumber: "Deluxe Suite 301",
    wing: "deluxe",
    titleGu: "ડીલક્સ પર્સનલ પ્રાઇવેટ રૂમ (Deluxe Suite)",
    titleEn: "Deluxe Private Suite Rooms",
    beds: [
      { id: "del-1", code: "DEL-301", roomNumber: "301", roomNameGu: "ડીલક્સ પર્સનલ સુઈટ", roomNameHi: "डीलक्स प्राइवेट सूट", roomNameEn: "Deluxe Private Suite", wing: "deluxe", status: "available", hasOxygen: true, hasVentilator: false, hasAC: true, hasAttachedBath: true, dailyCharge: "₹1,800/દિન" },
      { id: "del-2", code: "DEL-302", roomNumber: "302", roomNameGu: "ડીલક્સ પર્સનલ સુઈટ", roomNameHi: "डीलक्स प्राइवेट सूट", roomNameEn: "Deluxe Private Suite", wing: "deluxe", status: "occupied", patientName: "Patient #4095", hasOxygen: true, hasVentilator: false, hasAC: true, hasAttachedBath: true, dailyCharge: "₹1,800/દિન" },
      { id: "del-3", code: "DEL-303", roomNumber: "303", roomNameGu: "ડીલક્સ પર્સનલ સુઈટ", roomNameHi: "डीलक्स प्राइवेट सूट", roomNameEn: "Deluxe Private Suite", wing: "deluxe", status: "available", hasOxygen: true, hasVentilator: false, hasAC: true, hasAttachedBath: true, dailyCharge: "₹1,800/દિન" },
      { id: "del-4", code: "DEL-304", roomNumber: "304", roomNameGu: "ડીલક્સ પર્સનલ સુઈટ", roomNameHi: "डीलक्स प्राइवेट सूट", roomNameEn: "Deluxe Private Suite", wing: "deluxe", status: "available", hasOxygen: true, hasVentilator: false, hasAC: true, hasAttachedBath: true, dailyCharge: "₹1,800/દિન" }
    ]
  },
  {
    roomNumber: "General Ward 201",
    wing: "general",
    titleGu: "જનરલ વોર્ડ અને સ્પેશિયલ બોર્ડિંગ",
    titleEn: "General Ward & Shared Care",
    beds: [
      { id: "gen-1", code: "GEN-201", roomNumber: "201", roomNameGu: "જનરલ વોર્ડ", roomNameHi: "जनरल वार्ड", roomNameEn: "General Ward", wing: "general", status: "available", hasOxygen: true, hasVentilator: false, hasAC: false, hasAttachedBath: true, dailyCharge: "₹500/દિન" },
      { id: "gen-2", code: "GEN-202", roomNumber: "201", roomNameGu: "જનરલ વોર્ડ", roomNameHi: "जनरल वार्ड", roomNameEn: "General Ward", wing: "general", status: "occupied", patientName: "Patient #4112", hasOxygen: true, hasVentilator: false, hasAC: false, hasAttachedBath: true, dailyCharge: "₹500/દિન" },
      { id: "gen-3", code: "GEN-203", roomNumber: "202", roomNameGu: "જનરલ વોર્ડ", roomNameHi: "जनरल वार्ड", roomNameEn: "General Ward", wing: "general", status: "available", hasOxygen: true, hasVentilator: false, hasAC: false, hasAttachedBath: true, dailyCharge: "₹500/દિન" },
      { id: "gen-4", code: "GEN-204", roomNumber: "202", roomNameGu: "જનરલ વોર્ડ", roomNameHi: "जनरल वार्ड", roomNameEn: "General Ward", wing: "general", status: "available", hasOxygen: true, hasVentilator: false, hasAC: false, hasAttachedBath: true, dailyCharge: "₹500/દિન" }
    ]
  }
];

export default function BedMatrixSection() {
  const { t, language } = useLanguage();
  const [selectedBed, setSelectedBed] = useState<BlueprintBed | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBedClick = (bed: BlueprintBed) => {
    if (bed.status === "occupied") return;
    setSelectedBed(bed);
  };

  return (
    <section id="bed-drawing-matrix" className="py-20 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div>
            <span className="medinova-subheading text-xs">
              HOSPITAL FLOOR PLAN & ROOM BLUEPRINT
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-poppins text-[#1D2A4D] dark:text-white uppercase">
            {language === "gu"
              ? "રૂમ અને બેડ આર્કિટેક્ચરલ નકશા પરથી બેડ બુક કરો"
              : language === "hi"
              ? "रूम और बेड नक़्शे से लाइव बेड बुक करें"
              : "Architectural Hospital Room & Bed Floor Plan"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            થિયેટર પ્લેન અને ઓરિજિનલ હોસ્પિટલ રૂમના ડ્રોઇંગ પરથી તમારો પર્સનલ બેડ જુઓ અને ઓનલાઇન કન્ફર્મ કરો.
          </p>
        </div>

        {/* Legend Bar */}
        <div className="max-w-4xl mx-auto mb-10 p-4 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md flex flex-wrap items-center justify-around gap-4 text-xs font-extrabold">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-[#00C896] text-white flex items-center justify-center shadow-sm">
              <Bed className="w-3 h-3" />
            </div>
            <span className="text-slate-800 dark:text-slate-200">🟢 ખાલી બેડ (Available Bed)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-70">
              <Bed className="w-3 h-3" />
            </div>
            <span className="text-slate-800 dark:text-slate-200">🔴 દર્દી એડમિટ (Occupied)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-amber-400 text-white flex items-center justify-center">
              <Bed className="w-3 h-3" />
            </div>
            <span className="text-slate-800 dark:text-slate-200">🟡 સફાઈ હેઠળ (Sanitizing)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-[#13C5DD] text-white flex items-center justify-center ring-4 ring-[#13C5DD]/30">
              <Bed className="w-3 h-3" />
            </div>
            <span className="text-slate-800 dark:text-slate-200">🔵 તમારો પસંદ કરેલ (Selected)</span>
          </div>
        </div>

        {/* Architectural Hospital Drawing Container */}
        <div className="max-w-6xl mx-auto p-6 sm:p-10 rounded-3xl bg-[#1D2A4D] text-white shadow-2xl border-4 border-slate-700 relative overflow-hidden space-y-8">
          
          {/* Blueprint Grid Lines Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#13C5DD_1px,transparent_1px),linear-gradient(to_bottom,#13C5DD_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          {/* Blueprint Top Header & Nurse Station */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6 text-[#13C5DD]" />
              <div>
                <div className="text-xs font-bold text-[#13C5DD] uppercase tracking-wider">
                  હોસ્પિટલ ફ્લોર પ્લાન (FLOOR SCHEMATIC 1ST & 2ND LEVEL)
                </div>
                <div className="text-sm font-extrabold">
                  મેડિનોવા મલ્ટીસ્પેસિઆલિટી કેર હોસ્પિટલ
                </div>
              </div>
            </div>

            <div className="px-4 py-2 rounded-full bg-[#13C5DD]/20 border border-[#13C5DD]/40 text-[#13C5DD] text-xs font-bold flex items-center gap-2">
              <HeartPulse className="w-4 h-4 animate-pulse" />
              <span>સેન્ટ્રલ ઓક્સિજન & વેન્ટિલેટર ગ્રીડ સક્રિય</span>
            </div>
          </div>

          {/* Rooms Architectural Grid Drawing */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {BLUEPRINT_ROOMS.map((roomGroup, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/80 border-2 border-slate-700 shadow-inner flex flex-col justify-between space-y-4"
              >
                {/* Room Enclosure Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <DoorOpen className="w-4 h-4 text-[#13C5DD]" />
                    <span className="text-xs font-extrabold font-poppins text-white uppercase">
                      {roomGroup.titleGu}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold">
                    DOOR #10{idx + 1}
                  </span>
                </div>

                {/* Drawn Room Bed Slots */}
                <div className="grid grid-cols-2 gap-3">
                  {roomGroup.beds.map((bed) => {
                    const isSelected = selectedBed?.id === bed.id;

                    let bedCardStyle = "bg-[#00C896] hover:bg-[#00b084] text-white cursor-pointer shadow-md"; // Available
                    if (bed.status === "occupied") {
                      bedCardStyle = "bg-red-500/70 text-white cursor-not-allowed opacity-60";
                    } else if (bed.status === "sanitizing") {
                      bedCardStyle = "bg-amber-400 text-slate-900 cursor-not-allowed opacity-80";
                    }

                    if (isSelected) {
                      bedCardStyle = "bg-[#13C5DD] text-white ring-4 ring-[#13C5DD]/50 scale-105 shadow-2xl";
                    }

                    return (
                      <div
                        key={bed.id}
                        onClick={() => handleBedClick(bed)}
                        className={`p-3.5 rounded-xl border border-white/10 transition-all flex flex-col items-center justify-center text-center ${bedCardStyle}`}
                      >
                        <Bed className="w-6 h-6 mb-1" />
                        <div className="text-xs font-extrabold font-poppins">{bed.code}</div>
                        <div className="text-[9px] opacity-90 font-bold mt-0.5">
                          {bed.status === "occupied"
                            ? "એડમિટ દર્દી"
                            : bed.status === "sanitizing"
                            ? "સફાઈ ચાલુ"
                            : "ખાલી બેડ"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Room Amenities Drawing */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-[#13C5DD]" /> AC સપોર્ટ
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-[#00C896]" /> ઓક્સિજન
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Room Selection Footer */}
          <AnimatePresence>
            {selectedBed && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="relative z-10 p-5 rounded-2xl bg-white text-slate-900 shadow-2xl border-2 border-[#13C5DD] flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-[#13C5DD] text-white flex items-center justify-center font-bold shadow-md">
                    <Bed className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-xs text-[#13C5DD] font-extrabold uppercase tracking-wider">
                      નકશામાંથી પસંદ કરેલ રૂમ અને બેડ (Selected Bed Drawing)
                    </div>
                    <div className="text-base font-extrabold font-poppins text-[#1D2A4D]">
                      રૂમ: {selectedBed.roomNameGu} • બેડ નંબર: {selectedBed.code}
                    </div>
                    <div className="text-xs text-slate-500 font-bold mt-0.5 flex flex-wrap items-center gap-3">
                      <span>ઓક્સિજન સપોર્ટ: {selectedBed.hasOxygen ? "હાં" : "ના"}</span>
                      <span>• વેન્ટિલેટર: {selectedBed.hasVentilator ? "હાં" : "ના"}</span>
                      <span>• ચાર્જ: {selectedBed.dailyCharge}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#13C5DD] hover:bg-[#10b1c7] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  આ બેડ ₹199 માં કન્ફર્મ કરો
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      <PatientAdmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
