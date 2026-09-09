"use client";

import React, { useState } from "react";
import { Stethoscope, FileText, CheckCircle2, Clock, User, Heart, Mic, Plus, Pill } from "lucide-react";

export default function DoctorPanel() {
  const [activeTab, setActiveTab] = useState("queue");
  const [prescription, setPrescription] = useState("Amoxicillin 500mg - 1 tab TDS after meals (5 days)");

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white">
            Dr. Sarah Jenkins Consultation Console
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cardiology OPD Queue, EHR Vitals, AI SOAP Notes & E-Prescriptions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 animate-ping" /> Emergency ICU Call
          </button>
          <button className="px-3.5 py-1.5 rounded-xl bg-[#00C896] text-white text-xs font-bold flex items-center gap-1">
            <Mic className="w-3.5 h-3.5" /> Start Speech AI EHR
          </button>
        </div>
      </div>

      {/* Patient Queue Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Consultation Queue */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs font-bold pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-900 dark:text-white">Today's Patient Queue (14 Active)</span>
            <span className="text-[#00C896]">Token #A-104 Now</span>
          </div>

          {[
            { token: "A-104", name: "Eleanor Vance", age: "42 F", status: "In Room", statusCol: "bg-[#00C896] text-white" },
            { token: "A-105", name: "Robert Sterling", age: "58 M", status: "Waiting", statusCol: "bg-slate-100 dark:bg-slate-800 text-slate-400" },
            { token: "A-106", name: "Maria Gonzalez", age: "31 F", status: "Lab Ready", statusCol: "bg-[#0F6CBD]/20 text-[#0F6CBD]" }
          ].map((pat, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                i === 0
                  ? "bg-[#0F6CBD]/10 border-[#0F6CBD]"
                  : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0F6CBD] text-white flex items-center justify-center font-bold text-xs">
                  {pat.token}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{pat.name}</div>
                  <div className="text-[10px] text-slate-400">Cardiology • Age {pat.age}</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${pat.statusCol}`}>
                {pat.status}
              </span>
            </div>
          ))}
        </div>

        {/* Right Active Patient Record & EHR Writer */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-base font-bold font-poppins text-slate-900 dark:text-white">
                Active Patient: Eleanor Vance (MRN #99482)
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Vitals: BP 128/82 | Heart Rate: 74 BPM | SpO2: 99% | Temp: 98.6°F
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#00C896]/15 text-[#00C896] text-xs font-bold">
              EHR Vitals Synced
            </span>
          </div>

          {/* SOAP Clinical Notes Box */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Clinical SOAP Diagnosis Notes (AI Transcribed)
            </label>
            <textarea
              rows={3}
              defaultValue="Patient reports 3-day history of intermittent chest tightness post exertion. EKG shows normal sinus rhythm without acute ST changes. Recommended ECHO and lipid panel."
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
            />
          </div>

          {/* E-Prescription Form */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-[#00C896]" /> Digital E-Prescription
            </label>
            <input
              type="text"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
              Order Lab Test (CBC / Lipid)
            </button>
            <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0F6CBD] to-[#00C896] text-white text-xs font-bold shadow-md">
              Sign & Send E-Prescription to Pharmacy
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
