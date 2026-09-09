"use client";

import React from "react";
import { Heart, Calendar, FileText, Download, CreditCard, Video, CheckCircle2 } from "lucide-react";

export default function PatientPanel() {
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white">
            Alexander Vance — Patient Health Passport
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Patient ID #88492 • Blood Group O+ • Allergy: Penicillin
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0F6CBD] to-[#00C896] text-white text-xs font-bold shadow-md">
          + Book New Appointment
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Next Appointment */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Appointment</span>
            <Calendar className="w-4 h-4 text-[#0F6CBD]" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">Dr. Sarah Jenkins</div>
            <div className="text-xs text-slate-400">Cardiology • Tomorrow at 10:30 AM</div>
          </div>
          <button className="w-full py-2 rounded-xl bg-[#00C896] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
            <Video className="w-4 h-4" /> Launch Telemedicine Visit
          </button>
        </div>

        {/* Card 2: Lab Reports */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Lab Reports</span>
            <FileText className="w-4 h-4 text-[#00C896]" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Lipid Profile & Complete Blood Count</div>
            <div className="text-xs text-slate-400">Signed yesterday by Pathologist</div>
          </div>
          <button className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700">
            <Download className="w-4 h-4" /> Download Official PDF Report
          </button>
        </div>

        {/* Card 3: Active Prescription */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active E-Prescription</span>
            <CreditCard className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Atorvastatin 10mg & Metoprolol 25mg</div>
            <div className="text-xs text-slate-400">Pharmacy Delivery Ready</div>
          </div>
          <button className="w-full py-2 rounded-xl bg-[#0F6CBD] text-white text-xs font-bold shadow-sm">
            Pay & Order Home Refill ($24.00)
          </button>
        </div>

      </div>

    </div>
  );
}
