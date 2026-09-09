"use client";

import React, { useState } from "react";
import { UserCheck, QrCode, Ticket, AlertTriangle, Plus, CheckCircle2 } from "lucide-react";

export default function ReceptionPanel() {
  const [patientName, setPatientName] = useState("");
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  const handleGenerateToken = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedToken(`A-${Math.floor(100 + Math.random() * 900)}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white">
            Front Desk Express Check-In & Token Dispenser
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Walk-in patient registration, OPD token generator & emergency intake desk
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
          <AlertTriangle className="w-4 h-4" /> Trigger Emergency ER Intake
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Token Generator Form */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <h2 className="text-base font-bold font-poppins text-slate-900 dark:text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#0F6CBD]" /> Issue Express OPD Consultation Token
          </h2>

          <form onSubmit={handleGenerateToken} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Patient Name / Phone Number
              </label>
              <input
                type="text"
                required
                placeholder="Marcus Sterling (+1 555-0192)"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Department Specialty
              </label>
              <select className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100">
                <option>Cardiology (Dr. Sarah Jenkins)</option>
                <option>Orthopedics (Dr. Michael Chang)</option>
                <option>Neurology (Dr. Elena Rostova)</option>
                <option>General OPD Triage Desk</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0F6CBD] to-[#00C896] text-white font-bold text-xs shadow-md"
            >
              Print & Dispense Token
            </button>
          </form>

          {generatedToken && (
            <div className="p-4 rounded-2xl bg-[#00C896]/15 border border-[#00C896]/30 text-center space-y-1">
              <div className="text-xs text-[#00C896] font-bold">Token Dispensed Successfully!</div>
              <div className="text-4xl font-extrabold font-poppins text-slate-900 dark:text-white">{generatedToken}</div>
              <div className="text-[11px] text-slate-400">Assigned Room: Consultation Suite 304</div>
            </div>
          )}
        </div>

        {/* Live Queue Overview */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <h2 className="text-base font-bold font-poppins text-slate-900 dark:text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#00C896]" /> OPD Waiting Display Monitor
          </h2>

          <div className="space-y-2">
            {[
              { token: "A-101", room: "Room 301", dr: "Dr. Chang", status: "Completed" },
              { token: "A-102", room: "Room 302", dr: "Dr. Rostova", status: "In Consultation" },
              { token: "A-103", room: "Room 304", dr: "Dr. Jenkins", status: "Calling Next" }
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div className="font-bold text-slate-900 dark:text-white">{item.token} • {item.room}</div>
                <div className="text-slate-400">{item.dr}</div>
                <span className="px-2 py-0.5 rounded-full bg-[#0F6CBD]/10 text-[#0F6CBD] font-bold text-[10px]">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
