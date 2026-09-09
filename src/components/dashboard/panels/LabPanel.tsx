"use client";

import React from "react";
import { FlaskConical, FileText, CheckCircle2, AlertTriangle, Upload, Download } from "lucide-react";

export default function LabPanel() {
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white">
            Pathology Laboratory & LIS Automation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Barcode sample tracking, auto-analyzer integration & lab report sign-off
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-[#00C896] text-white text-xs font-bold shadow-md">
          + Scan Barcode Specimen
        </button>
      </div>

      {/* Lab Order Queue Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
        <h2 className="text-base font-bold font-poppins text-slate-900 dark:text-white flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-[#0F6CBD]" /> Pending Test Diagnostics Queue
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="pb-3">Sample ID</th>
                <th className="pb-3">Patient Name</th>
                <th className="pb-3">Test Requested</th>
                <th className="pb-3">Ordering Doctor</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3 font-bold text-slate-900 dark:text-white">#L-8821</td>
                <td>Eleanor Vance</td>
                <td>Complete Blood Count (CBC) + Lipid Panel</td>
                <td>Dr. Sarah Jenkins</td>
                <td><span className="px-2 py-0.5 rounded-full bg-[#00C896]/15 text-[#00C896] font-bold">Approved</span></td>
                <td>
                  <button className="px-3 py-1 rounded-lg bg-[#0F6CBD] text-white font-bold">
                    View PDF Report
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900 dark:text-white">#L-8822</td>
                <td>Robert Sterling</td>
                <td>Hemoglobin A1c (HbA1c)</td>
                <td>Dr. Michael Chang</td>
                <td><span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 font-bold">Testing in LIS</span></td>
                <td>
                  <button className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold">
                    Upload Values
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
