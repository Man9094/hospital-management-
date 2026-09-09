"use client";

import React, { useState, useEffect } from "react";
import { usePortal } from "@/context/PortalContext";
import {
  Pill,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Plus,
  Loader2,
  Package,
  Layers,
  ArrowRight,
  Eye,
  CreditCard
} from "lucide-react";

export default function PharmacyPanel() {
  const { setSelectedUhid } = usePortal();
  const [activeTab, setActiveTab] = useState<"prescriptions" | "inventory">("prescriptions");
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dispensing, setDispensing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadPharmacyData = async () => {
    setLoading(true);
    try {
      const [rxRes, invRes] = await Promise.all([
        fetch("/api/pharmacy?view=prescriptions"),
        fetch("/api/pharmacy")
      ]);
      const rxJson = await rxRes.json();
      const invJson = await invRes.json();
      if (rxJson.success) setPrescriptions(rxJson.prescriptions || []);
      if (invJson.success) setItems(invJson.items || []);
    } catch (err) {
      console.error("Failed to load pharmacy data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPharmacyData();
  }, []);

  const handleDispense = async (prescriptionId: number, patientUhid: string, rxItems: any[]) => {
    setDispensing(true);
    setFeedback(null);

    // Map rx items to batches for deduction
    const itemsToDispense = rxItems.map((item) => ({
      batch_id: 1, // Default to first active batch
      quantity: item.quantity || 10,
    }));

    try {
      const res = await fetch("/api/pharmacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prescription_id: prescriptionId,
          patient_uhid: patientUhid,
          items_to_dispense: itemsToDispense,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setFeedback("Prescription dispensed successfully and pharmacy inventory updated!");
        loadPharmacyData();
      } else {
        alert(json.error || "Dispensing failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error dispensing prescription");
    } finally {
      setDispensing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
            <Pill className="w-4 h-4" /> HOSPITAL PHARMACY & INVENTORY POS
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
            Prescription Dispensing & FEFO Batch Inventory Management
          </h1>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("prescriptions")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "prescriptions" ? "bg-[#13C5DD] text-[#1D2A4D] shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Prescriptions Queue ({prescriptions.filter(p => p.status === 'active').length})
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "inventory" ? "bg-[#13C5DD] text-[#1D2A4D] shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Medicine Inventory & FEFO ({items.length})
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* TAB 1: PRESCRIPTIONS QUEUE */}
      {activeTab === "prescriptions" && (
        <div className="space-y-4">
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-6 h-6 text-[#13C5DD] animate-spin mx-auto" />
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-[#1D2A4D] rounded-3xl border border-slate-200 dark:border-slate-800">
              No pending prescriptions from doctor consultations.
            </div>
          ) : (
            prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <div className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{rx.rx_number}</span>
                      <span className="text-xs font-bold text-[#13C5DD]">• {rx.patient_name} ({rx.patient_uhid})</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Prescribed by {rx.doctor_name} • Diagnosis: <strong className="text-slate-700 dark:text-slate-200">{rx.diagnosis}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedUhid(rx.patient_uhid)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Dossier
                    </button>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      rx.status === "dispensed" ? "bg-emerald-500/15 text-emerald-500" : "bg-blue-500/15 text-blue-500 animate-pulse"
                    }`}>
                      ● {rx.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-extrabold uppercase">
                      <tr>
                        <th className="p-2.5">Medicine Name & Formulation</th>
                        <th className="p-2.5">Dosage</th>
                        <th className="p-2.5">Frequency</th>
                        <th className="p-2.5">Timing</th>
                        <th className="p-2.5">Quantity to Dispense</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {rx.items?.map((item: any, i: number) => (
                        <tr key={i}>
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                            {item.medicine_name}
                            <span className="block text-[10px] text-slate-400 font-normal">{item.generic_name}</span>
                          </td>
                          <td className="p-2.5">{item.dosage}</td>
                          <td className="p-2.5 font-bold text-[#13C5DD]">{item.frequency}</td>
                          <td className="p-2.5">{item.timing}</td>
                          <td className="p-2.5 font-extrabold text-slate-900 dark:text-white">
                            {item.quantity} Units ({item.duration_days} Days)
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {rx.status === "active" && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleDispense(rx.id, rx.patient_uhid, rx.items || [])}
                      disabled={dispensing}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#13C5DD] to-[#0F6CBD] text-white font-extrabold text-xs shadow-md uppercase flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {dispensing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      Fulfill & Dispense Prescription
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: MEDICINE INVENTORY & FEFO BATCHES */}
      {activeTab === "inventory" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white">
              Stock Catalog with FEFO (First-Expiry-First-Out) Tracking
            </h2>
            <span className="text-xs text-slate-400">GST 12% Hospital Pharmacy Rate</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-extrabold uppercase">
                <tr>
                  <th className="p-3">Item Code</th>
                  <th className="p-3">Brand Name / Generic</th>
                  <th className="p-3">Category & Unit</th>
                  <th className="p-3">Batch & Expiry</th>
                  <th className="p-3">Stock Available</th>
                  <th className="p-3">MRP (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-mono text-[#13C5DD] font-bold">{item.item_code}</td>
                    <td className="p-3">
                      <div className="font-extrabold text-slate-900 dark:text-white">{item.brand_name}</div>
                      <div className="text-[10px] text-slate-400">{item.generic_name}</div>
                    </td>
                    <td className="p-3">
                      <div>{item.category}</div>
                      <div className="text-[10px] text-slate-400">{item.unit}</div>
                    </td>
                    <td className="p-3">
                      {item.batches?.map((b: any) => (
                        <div key={b.id} className="text-[11px]">
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">#{b.batch_number}</span>
                          <span className="text-slate-400 ml-1.5">Exp: {b.expiry_date}</span>
                        </div>
                      ))}
                    </td>
                    <td className="p-3 font-extrabold">
                      <span className={item.total_stock <= item.reorder_level ? "text-amber-500 font-black" : "text-emerald-500"}>
                        {item.total_stock} Units
                      </span>
                    </td>
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">
                      ₹{item.base_mrp ? item.base_mrp.toFixed(2) : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
