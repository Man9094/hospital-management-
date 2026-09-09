"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  X,
  Bed,
  CheckCircle2,
  Phone,
  User,
  Calendar,
  CreditCard,
  ShieldCheck,
  Building2,
  Sparkles,
  MapPin
} from "lucide-react";

interface PatientAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PatientAdmissionModal({ isOpen, onClose }: PatientAdmissionModalProps) {
  const { t, language } = useLanguage();
  const [admissionType, setAdmissionType] = useState<"opd" | "ipd">("ipd");
  const [selectedBedCode, setSelectedBedCode] = useState<string>("ICU-104");
  const [step, setStep] = useState<"form" | "success">("form");

  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    age: "",
    gender: "male",
    city: "અદાવાદ",
    symptoms: ""
  });

  const BEDS_LIST = [
    { code: "ICU-102", ward: "ICU (ICU-102)", status: "available" },
    { code: "ICU-104", ward: "ICU (ICU-104)", status: "available" },
    { code: "GEN-201", ward: "જનરલ વોર્ડ (GEN-201)", status: "available" },
    { code: "GEN-203", ward: "જનરલ વોર્ડ (GEN-203)", status: "available" },
    { code: "DEL-301", ward: "ડીલક્સ રુમ (DEL-301)", status: "available" },
    { code: "DEL-303", ward: "ડીલક્સ રુમ (DEL-303)", status: "available" }
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 bg-[#1D2A4D] text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#13C5DD] text-white flex items-center justify-center font-bold shadow-md">
              <Bed className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold font-poppins">
                {language === "gu"
                  ? "ઘરેથી દર્દી એડમિશન & બુકિંગ"
                  : language === "hi"
                  ? "घर से मरीज एडमिशन बुकिंग"
                  : "Home Patient Admission Portal"}
              </h3>
              <p className="text-xs text-[#13C5DD] font-bold">
                થિયેટર સીટની જેમ લાઈવ બેડ કન્ફર્મેશન
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAdmissionType("ipd")}
                  className={`py-2.5 rounded-xl transition-all ${
                    admissionType === "ipd"
                      ? "bg-[#13C5DD] text-white shadow-sm font-extrabold"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  🛏️ IPD બેડ એડમિશન (₹199)
                </button>
                <button
                  type="button"
                  onClick={() => setAdmissionType("opd")}
                  className={`py-2.5 rounded-xl transition-all ${
                    admissionType === "opd"
                      ? "bg-[#13C5DD] text-white shadow-sm font-extrabold"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  🩺 OPD ટોકન બુકિંગ (₹49)
                </button>
              </div>

              {/* Theater Seats Bed Picker Selection */}
              {admissionType === "ipd" && (
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 uppercase flex items-center justify-between">
                    <span>પસંદ કરેલ હોસ્પિટલ બેડ (Theater-Style Bed Map)</span>
                    <span className="text-[#00C896] text-[10px]">🟢 ૬ બેડ અવેલેબલ</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {BEDS_LIST.map((bed) => (
                      <button
                        key={bed.code}
                        type="button"
                        onClick={() => setSelectedBedCode(bed.code)}
                        className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center justify-center transition-all ${
                          selectedBedCode === bed.code
                            ? "bg-[#13C5DD] text-white border-[#13C5DD] shadow-md ring-2 ring-[#13C5DD]/30"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#13C5DD]"
                        }`}
                      >
                        <Bed className="w-4 h-4 mb-1" />
                        <span>{bed.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    દર્દીનું પુરુ નામ (Patient Full Name)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="દા.ત. રમેશભાઈ પટેલ"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#13C5DD]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      મોબાઈલ નંબર (Phone)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#13C5DD]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      ઉંમર (Age)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="45"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#13C5DD]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    તકલીફ / લક્ષણો (Health Symptoms)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="દા.ત. તાવ, શ્વાસમાં તકલીફ, હાડકાનો દુખાવો..."
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#13C5DD]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#13C5DD] hover:bg-[#10b1c7] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                {admissionType === "ipd" ? `₹199 માં ${selectedBedCode} બુક કરો` : "₹49 માં OPD ટોકન બુક કરો"}
              </button>
            </form>
          ) : (
            /* Success Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#00C896] text-white flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold font-poppins text-[#1D2A4D] dark:text-white">
                  એડમિશન બુકિંગ કન્ફર્મ થયું!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  તમારો બેડ કન્ફર્મેશન કોડ <strong className="text-[#13C5DD]">{selectedBedCode}</strong> તમારા મોબાઈલ નંબર પર વોટ્સએપ દ્વારા મોકલી દેવામાં આવ્યો છે.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-full bg-[#13C5DD] text-white font-extrabold text-xs uppercase"
              >
                બંધ કરો (Done)
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
