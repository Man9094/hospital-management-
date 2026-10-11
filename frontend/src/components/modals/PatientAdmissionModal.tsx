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
    city: "Ahmedabad",
    symptoms: ""
  });

  const BEDS_LIST = [
    { code: "ICU-102", ward: "ICU (ICU-102)", status: "available" },
    { code: "ICU-104", ward: "ICU (ICU-104)", status: "available" },
    { code: "GEN-201", ward: "General Ward (GEN-201)", status: "available" },
    { code: "GEN-203", ward: "General Ward (GEN-203)", status: "available" },
    { code: "DEL-301", ward: "Deluxe Room (DEL-301)", status: "available" },
    { code: "DEL-303", ward: "Deluxe Room (DEL-303)", status: "available" }
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-[0_4px_16px_rgba(41,39,39,0.08)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 bg-[#4A1F2B] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-bold shadow-xs">
              <Bed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {language === "gu"
                  ? "ઘરેથી દર્દી એડમિશન & બુકિંગ"
                  : language === "hi"
                  ? "घर से मरीज एडमिशन बुकिंग"
                  : "Home Patient Admission Portal"}
              </h3>
              <p className="text-xs text-[#F7B5C3] font-medium">
                Live bed confirmation &amp; token dispatch
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 p-1 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] font-semibold">
                <button
                  type="button"
                  onClick={() => setAdmissionType("ipd")}
                  className={`py-2 rounded-md transition-all ${
                    admissionType === "ipd"
                      ? "bg-[#4A1F2B] text-white shadow-xs"
                      : "text-[#514346] dark:text-[#A89CA0]"
                  }`}
                >
                  🛏️ IPD Bed Admission (₹199)
                </button>
                <button
                  type="button"
                  onClick={() => setAdmissionType("opd")}
                  className={`py-2 rounded-md transition-all ${
                    admissionType === "opd"
                      ? "bg-[#4A1F2B] text-white shadow-xs"
                      : "text-[#514346] dark:text-[#A89CA0]"
                  }`}
                >
                  🩺 OPD Token Booking (₹49)
                </button>
              </div>

              {/* Theater Seats Bed Picker Selection */}
              {admissionType === "ipd" && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#514346] dark:text-[#A89CA0] uppercase flex items-center justify-between">
                    <span>Select Ward Bed (Live Map)</span>
                    <span className="text-[#3F6B52] text-[10px]">🟢 6 Beds Available</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {BEDS_LIST.map((bed) => (
                      <button
                        key={bed.code}
                        type="button"
                        onClick={() => setSelectedBedCode(bed.code)}
                        className={`p-2 rounded-lg text-xs font-semibold border flex flex-col items-center justify-center transition-all ${
                          selectedBedCode === bed.code
                            ? "bg-[#4A1F2B] text-white border-[#4A1F2B] shadow-xs"
                            : "bg-[#F8F2F2] dark:bg-[#18141C] text-[#1D1B1B] dark:text-white border-[#E3DFDB] dark:border-[#3B3041] hover:border-[#4A1F2B]"
                        }`}
                      >
                        <Bed className="w-3.5 h-3.5 mb-0.5" />
                        <span>{bed.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Patient Demographics */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#514346] dark:text-[#A89CA0] mb-0.5">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Sharma"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full h-8 px-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#514346] dark:text-[#A89CA0] mb-0.5">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98250 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-8 px-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#514346] dark:text-[#A89CA0] mb-0.5">Age &amp; Gender *</label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        placeholder="Age"
                        required
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-16 h-8 px-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white"
                      />
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="flex-1 h-8 px-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#514346] dark:text-[#A89CA0] mb-0.5">Primary Symptoms / Reason</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Chest discomfort, breathing difficulty since morning"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    className="w-full p-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-9 rounded bg-[#4A1F2B] hover:bg-[#70404B] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Confirm &amp; Reserve {admissionType.toUpperCase()} Bed</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#3F6B52]/15 text-[#3F6B52] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#1D1B1B] dark:text-white">Admission Pre-Booked!</h4>
              <p className="text-xs text-[#837376]">
                Bed <strong>{selectedBedCode}</strong> is tentatively reserved for <strong>{formData.patientName || "Patient"}</strong>. Our reception team will reach out at {formData.phone || "your mobile"}.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded bg-[#4A1F2B] text-white font-semibold text-xs hover:bg-[#70404B] transition-colors"
              >
                Close Portal
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
