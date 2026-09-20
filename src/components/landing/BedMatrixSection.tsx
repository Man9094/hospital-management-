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
        <div className="max-w-4xl mx-auto mb-10 p-4 rounded-md bg-white dark:bg-[#242026] border border-[#E5E0E2] dark:border-[#3E3842] shadow-[0_1px_3px_rgba(41,39,39,0.06)] flex flex-wrap items-center justify-around gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#3F6B52] text-white flex items-center justify-center shadow-xs">
              <Bed className="w-3 h-3" />
            </div>
            <span className="text-[#292727] dark:text-[#ECE5E7]">🟢 ખાલી બેડ (Available Bed)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#8C3A45] text-white flex items-center justify-center">
              <Bed className="w-3 h-3" />
            </div>
            <span className="text-[#292727] dark:text-[#ECE5E7]">🔴 દર્દી એડમિટ (Occupied)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#C07830] text-white flex items-center justify-center">
              <Bed className="w-3 h-3" />
            </div>
            <span className="text-[#292727] dark:text-[#ECE5E7]">🟡 સફાઈ હેઠળ (Sanitizing)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#4A1F2B] text-white flex items-center justify-center ring-2 ring-[#E2838E]/50">
              <Bed className="w-3 h-3" />
            </div>
            <span className="text-[#292727] dark:text-[#ECE5E7]">🔵 તમારો પસંદ કરેલ (Selected)</span>
          </div>
        </div>

        {/* Architectural Hospital Drawing Container */}
        <div className="max-w-6xl mx-auto p-6 sm:p-8 rounded-lg bg-[#18141C] text-[#ECE5E7] shadow-[0_4px_16px_rgba(41,39,39,0.08)] border border-[#3E3842] relative overflow-hidden space-y-8">
          
          {/* Blueprint Grid Lines Pattern Overlay */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#3E3842_1px,transparent_1px),linear-gradient(to_bottom,#3E3842_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          {/* Blueprint Top Header & Nurse Station */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-md bg-[#242026] border border-[#3E3842]">
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6 text-[#E2838E]" />
              <div>
                <div className="text-xs font-bold text-[#E2838E] uppercase tracking-wider">
                  હોસ્પિટલ ફ્લોર પ્લાન (FLOOR SCHEMATIC 1ST & 2ND LEVEL)
                </div>
                <div className="text-sm font-semibold text-[#ECE5E7]">
                  મેડિનોવા મલ્ટીસ્પેસિઆલિટી કેર હોસ્પિટલ
                </div>
              </div>
            </div>

            <div className="px-4 py-2 rounded-md bg-[#242026] border border-[#3E3842] text-[#E2838E] text-xs font-bold flex items-center gap-2">
              <HeartPulse className="w-4 h-4 animate-pulse" />
              <span>સેન્ટ્રલ ઓક્સિજન & વેન્ટિલેટર ગ્રીડ સક્રિય</span>
            </div>
          </div>

          {/* Rooms Architectural Grid Drawing */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {BLUEPRINT_ROOMS.map((roomGroup, idx) => (
              <div
                key={idx}
                className="p-5 rounded-md bg-[#242026] border border-[#3E3842] space-y-4"
              >
                {/* Room Enclosure Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#3E3842]">
                  <div className="flex items-center gap-2">
                    <DoorOpen className="w-4 h-4 text-[#E2838E]" />
                    <span className="text-xs font-bold font-sans text-white uppercase">
                      {roomGroup.titleGu}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#1C1820] text-[#9B8E92] font-mono font-medium border border-[#3E3842]">
                    DOOR #10{idx + 1}
                  </span>
                </div>

                {/* Drawn Room Bed Slots */}
                <div className="grid grid-cols-2 gap-3">
                  {roomGroup.beds.map((bed) => {
                    const isSelected = selectedBed?.id === bed.id;

                    let bedCardStyle = "bg-[#3F6B52] hover:bg-[#4C7E61] text-white cursor-pointer shadow-xs"; // Available
                    if (bed.status === "occupied") {
                      bedCardStyle = "bg-[#5C2329]/80 text-[#F497A4] border border-[#8C3A45]/50 cursor-not-allowed";
                    } else if (bed.status === "sanitizing") {
                      bedCardStyle = "bg-[#5A3F20]/80 text-[#FAD79E] border border-[#C07830]/50 cursor-not-allowed";
                    }

                    if (isSelected) {
                      bedCardStyle = "bg-[#4A1F2B] text-white ring-2 ring-[#E2838E] scale-102 shadow-md";
                    }

                    return (
                      <div
                        key={bed.id}
                        onClick={() => handleBedClick(bed)}
                        className={`p-3 rounded-md border border-white/10 transition-all flex flex-col items-center justify-center text-center ${bedCardStyle}`}
                      >
                        <Bed className="w-5 h-5 mb-1" />
                        <div className="text-xs font-bold font-sans">{bed.code}</div>
                        <div className="text-[9px] opacity-90 font-medium mt-0.5">
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
                <div className="pt-2 border-t border-[#3E3842] flex items-center justify-between text-[10px] text-[#9B8E92] font-medium">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-[#E2838E]" /> AC સપોર્ટ
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-[#85B599]" /> ઓક્સિજન
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Room Selection Footer */}
          <AnimatePresence>
            {selectedBed && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="relative z-10 p-4 rounded-md bg-white dark:bg-[#242026] text-[#292727] dark:text-[#ECE5E7] shadow-[0_4px_16px_rgba(41,39,39,0.08)] border border-[#4A1F2B] dark:border-[#8C3A45] flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 rounded-md bg-[#4A1F2B] text-white flex items-center justify-center font-bold shadow-xs">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#4A1F2B] dark:text-[#E2838E] font-bold uppercase tracking-wider">
                      નકશામાંથી પસંદ કરેલ રૂમ અને બેડ (Selected Bed Drawing)
                    </div>
                    <div className="text-base font-bold font-sans text-[#292727] dark:text-[#ECE5E7]">
                      રૂમ: {selectedBed.roomNameGu} • બેડ નંબર: {selectedBed.code}
                    </div>
                    <div className="text-xs text-[#686563] dark:text-[#9B8E92] font-medium mt-0.5 flex flex-wrap items-center gap-3">
                      <span>ઓક્સિજન સપોર્ટ: {selectedBed.hasOxygen ? "હાં" : "ના"}</span>
                      <span>• વેન્ટિલેટર: {selectedBed.hasVentilator ? "હાં" : "ના"}</span>
                      <span>• ચાર્જ: {selectedBed.dailyCharge}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-[#4A1F2B] hover:bg-[#5E2737] text-white font-medium text-xs uppercase tracking-wider shadow-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
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
