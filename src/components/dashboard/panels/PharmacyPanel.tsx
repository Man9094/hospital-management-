"use client";

import React from "react";
import { Pill, Barcode, Package, AlertTriangle, CheckCircle2, DollarSign } from "lucide-react";

export default function PharmacyPanel() {
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white">
            Pharmacy Barcode POS & Drug Inventory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            E-prescription fulfillment, batch expiry monitoring & auto-reorder alerts
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-[#0F6CBD] text-white text-xs font-bold shadow-md flex items-center gap-1.5">
          <Barcode className="w-4 h-4" /> Scan RX Barcode
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Prescription Fulfillment */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <h2 className="text-base font-bold font-poppins text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-[#00C896]" /> Pending Doctor E-Prescriptions
          </h2>

          <div className="space-y-3">
            {[
              { id: "RX-4091", doctor: "Dr. Sarah Jenkins", patient: "Eleanor Vance", drug: "Amoxicillin 500mg (15 caps) + Paracetamol 650mg", cost: "$18.50" },
              { id: "RX-4092", doctor: "Dr. Michael Chang", patient: "Robert Sterling", drug: "Metformin 500mg (30 tabs) + Atorvastatin 10mg", cost: "$32.00" }
            ].map((rx, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{rx.patient} ({rx.id})</div>
                  <div className="text-slate-400 mt-0.5">{rx.drug}</div>
                  <div className="text-[10px] text-[#0F6CBD] dark:text-[#4CC9F0] font-semibold mt-1">Prescribed by {rx.doctor}</div>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{rx.cost}</div>
                  <button className="px-3 py-1.5 rounded-xl bg-[#00C896] text-white font-bold text-xs shadow-sm">
                    Dispense & Print POS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Warnings */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <h2 className="text-base font-bold font-poppins text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-500" /> Stock Inventory Reorder Alerts
          </h2>

          <div className="space-y-2">
            {[
              { drug: "Amoxicillin 500mg", batch: "AX-2026", qty: "14 boxes left", status: "Auto-Reordered" },
              { drug: "Insulin Glargine 100IU", batch: "IG-9912", qty: "6 vials left", status: "Critical Low" }
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{item.drug}</div>
                  <div className="text-amber-500 text-[10px] font-semibold">Batch: {item.batch} • {item.qty}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px]">
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
