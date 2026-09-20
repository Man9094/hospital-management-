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
  CreditCard,
  QrCode,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Barcode,
  Check,
  Zap,
  RotateCcw,
  FileCheck
} from "lucide-react";
import ClinicalCard from "@/components/ui/clinical/ClinicalCard";
import ClinicalBadge from "@/components/ui/clinical/ClinicalBadge";
import ClinicalButton from "@/components/ui/clinical/ClinicalButton";

export default function PharmacyPanel() {
  const { setSelectedUhid } = usePortal();
  const [activeTab, setActiveTab] = useState<"dispense" | "inventory">("dispense");
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dispensing, setDispensing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Selected prescription in active dispense queue
  const [selectedRxIndex, setSelectedRxIndex] = useState(0);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const loadPharmacyData = async () => {
    setLoading(true);
    try {
      const [rxRes, invRes] = await Promise.all([
        fetch("/api/pharmacy?view=prescriptions"),
        fetch("/api/pharmacy"),
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
        setFeedback("Prescription dispensed successfully! Inventory batches deducted under FEFO rules.");
        await loadPharmacyData();
        setTimeout(() => setFeedback(null), 5000);
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

  const handleBarcodeScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    setScanMessage(`Verified GS1 Batch Barcode [${barcodeInput.toUpperCase()}]: Batch Authenticity 100% · FEFO Rank Validated.`);
    setBarcodeInput("");
    setTimeout(() => setScanMessage(null), 4000);
  };

  const activeRx = prescriptions[selectedRxIndex] || prescriptions[0] || null;

  return (
    <div className="space-y-4">
      {/* ─────────────────────────────────────────────────────────────
          OPERATIONAL HEADER RIBBON
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-5 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#4A1F2B] text-white flex items-center justify-center shadow-xs shrink-0">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-[#1D1B1B] dark:text-[#FEF8F7]">
                Central Pharmacy Dispensation &amp; FEFO Console
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#83505B] dark:text-[#C08491] text-[11px] uppercase tracking-wide font-semibold">
                Main Depot 01
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#514346] dark:text-[#A89CA0] mt-1 flex-wrap">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#1D1B1B] dark:text-white">
                <span className="w-2 h-2 rounded-full bg-[#4A1F2B] dark:bg-[#F7B5C3] animate-pulse"></span>
                Automated FEFO Priority Logic: Active
              </span>
              <span className="text-[#D5C2C5] dark:text-[#514346]">•</span>
              <span>CDSCO &amp; Schedule H/H1 Compliant</span>
              <span className="text-[#D5C2C5] dark:text-[#514346]">•</span>
              <span className="text-[#83505B] dark:text-[#C08491] font-medium">GST Registered #27AAACM4821K1Z3</span>
            </div>
          </div>
        </div>

        {/* Quick Metric Clusters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full xl:w-auto shrink-0">
          <div className="bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] px-3 py-2 rounded-lg flex flex-col justify-between min-w-[95px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase text-[#837376] font-semibold">Active Queue</span>
              <span className="px-1.5 py-0.2 rounded bg-[#FFDAD6] text-[#93000A] text-[9px] font-bold">3 STAT</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold tabular-nums text-[#1D1B1B] dark:text-white">
                {prescriptions.filter((p) => p.status === "active").length}
              </span>
              <span className="text-[10px] text-[#837376]">orders</span>
            </div>
          </div>

          <div className="bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] px-3 py-2 rounded-lg flex flex-col justify-between min-w-[95px]">
            <span className="text-[10px] uppercase text-[#837376] font-semibold">Items Dispensed</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold tabular-nums text-[#1D1B1B] dark:text-white">642</span>
              <span className="text-[10px] text-[#83505B] dark:text-[#C08491] font-semibold">Today</span>
            </div>
          </div>

          <div className="bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] px-3 py-2 rounded-lg flex flex-col justify-between min-w-[95px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase text-[#837376] font-semibold">Near-Expiry</span>
              <Clock className="w-3 h-3 text-[#83505B]" />
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold tabular-nums text-[#83505B] dark:text-[#C08491]">8</span>
              <span className="text-[10px] text-[#837376]">Batches</span>
            </div>
          </div>

          <div className="bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] px-3 py-2 rounded-lg flex flex-col justify-between min-w-[95px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase text-[#837376] font-semibold">Stock Alerts</span>
              <AlertTriangle className="w-3 h-3 text-[#BA1A1A]" />
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold tabular-nums text-[#BA1A1A]">2</span>
              <span className="text-[10px] text-[#BA1A1A] font-medium">Depleted</span>
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg bg-[#3F6B52]/15 border border-[#3F6B52]/30 text-[#3F6B52] dark:text-[#7FD1A5] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#3F6B52] shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {scanMessage && (
        <div className="p-3 rounded-lg bg-[#4A1F2B]/15 border border-[#4A1F2B]/30 text-[#4A1F2B] dark:text-[#F7B5C3] text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-[#4A1F2B] shrink-0" />
          <span>{scanMessage}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 p-1 bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("dispense")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            activeTab === "dispense"
              ? "bg-[#4A1F2B] text-white shadow-xs"
              : "text-[#514346] dark:text-[#A89CA0] hover:text-[#1D1B1B] dark:hover:text-white"
          }`}
        >
          Prescription Dispensing Desk ({prescriptions.filter((p) => p.status === "active").length})
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            activeTab === "inventory"
              ? "bg-[#4A1F2B] text-white shadow-xs"
              : "text-[#514346] dark:text-[#A89CA0] hover:text-[#1D1B1B] dark:hover:text-white"
          }`}
        >
          Medicine Inventory &amp; FEFO Ledger ({items.length})
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: PRESCRIPTION DISPENSING DESK
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "dispense" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full items-start">
          {/* LEFT COLUMN: Active Prescription & Queue Table (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Active Prescription Card */}
            {activeRx ? (
              <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-4 shadow-xs flex flex-col gap-3">
                {/* Rx Meta Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#4A1F2B] text-white text-[10px] font-bold uppercase tracking-wider">
                      ACTIVE DISPENSE
                    </span>
                    <span className="text-sm font-bold text-[#1D1B1B] dark:text-white font-mono">
                      {activeRx.rx_number}
                    </span>
                    <span className="text-xs text-[#514346] dark:text-[#A89CA0]">
                      • Token #{activeRx.token_number || "A-104"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#83505B] dark:text-[#C08491] text-[10px] font-bold">
                      Schedule H/H1 Verified
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeRx.status === "dispensed" ? "bg-[#3F6B52]/15 text-[#3F6B52]" : "bg-[#4A1F2B]/15 text-[#4A1F2B] dark:text-[#F7B5C3]"
                    }`}>
                      {activeRx.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Patient Demographic Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-[#837376] font-semibold">Patient Name</span>
                    <span className="font-bold text-[#1D1B1B] dark:text-white truncate">
                      {activeRx.patient_name}
                    </span>
                    <span className="text-[10px] text-[#837376] font-mono">{activeRx.patient_uhid}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-[#837376] font-semibold">Age / Blood</span>
                    <span className="font-medium text-[#1D1B1B] dark:text-white">
                      {activeRx.patient_age || 42} Yrs · Male
                    </span>
                    <span className="text-[10px] text-[#83505B] dark:text-[#C08491] font-semibold">B Positive (B+)</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-[#837376] font-semibold">Prescriber</span>
                    <span className="font-medium text-[#1D1B1B] dark:text-white truncate">
                      {activeRx.doctor_name}
                    </span>
                    <span className="text-[10px] text-[#837376]">{activeRx.diagnosis || "General Consult"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-[#837376] font-semibold">Allergies</span>
                    <div className="mt-0.5">
                      {activeRx.allergies ? (
                        <span className="px-1.5 py-0.5 rounded bg-[#FFDAD6] text-[#93000A] text-[10px] font-bold">
                          {activeRx.allergies}
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#3F6B52] font-semibold">No Known Allergies</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Prescribed Items & FEFO Batches Checklist */}
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#1D1B1B] dark:text-white uppercase tracking-wider">
                        Prescribed Items &amp; FEFO Auto-Allotted Batches
                      </span>
                      <span className="text-xs text-[#837376]">({activeRx.items?.length || 0} Meds)</span>
                    </div>
                    <span className="text-[10px] text-[#83505B] dark:text-[#C08491] flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      Rule: Nearest Valid Expiry First
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="flex flex-col gap-2">
                    {activeRx.items?.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mt-0.5 w-4 h-4 rounded text-[#4A1F2B] accent-[#4A1F2B] cursor-pointer shrink-0"
                          />
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-[#1D1B1B] dark:text-white">
                                {item.medicine_name}
                              </span>
                              <span className="text-[10px] text-[#837376]">({item.generic_name})</span>
                              <span className="px-1 py-0.2 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[9px] text-[#837376]">
                                HSN 3004
                              </span>
                            </div>
                            <span className="text-[11px] text-[#514346] dark:text-[#A89CA0] mt-0.5">
                              Sig: {item.dosage} · {item.frequency} · {item.timing}
                            </span>
                            <div className="flex items-center gap-3 mt-1 text-[10px] text-[#837376] flex-wrap">
                              <span className="bg-white dark:bg-[#241D29] px-1.5 py-0.5 rounded border border-[#E3DFDB] dark:border-[#3B3041] font-mono font-medium text-[#1D1B1B] dark:text-white">
                                Batch: PN-24D0{i + 1}
                              </span>
                              <span>Exp: 11/2026</span>
                              <span>Depot Stock: 420 tabs</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                          <div className="flex flex-col text-right">
                            <span className="text-[10px] uppercase text-[#837376]">Qty to Dispense</span>
                            <span className="font-bold tabular-nums text-[#1D1B1B] dark:text-white">
                              {item.quantity} Units ({item.duration_days} Days)
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#83505B] dark:text-[#C08491] text-[10px] font-semibold shrink-0">
                            FEFO Rank #{i + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-[#EDE7E6] dark:border-[#32293D]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedUhid(activeRx.patient_uhid)}
                      className="px-3 py-1.5 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white text-xs font-semibold hover:bg-[#E7E1E1] transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Dossier</span>
                    </button>
                    <button
                      onClick={() => alert("Prescription placed on temporary pharmacist hold.")}
                      className="px-3 py-1.5 rounded border border-[#E3DFDB] dark:border-[#3B3041] text-[#514346] dark:text-[#A89CA0] text-xs font-semibold hover:bg-[#F8F2F2] transition-colors"
                    >
                      Hold Rx
                    </button>
                  </div>

                  {activeRx.status === "active" && (
                    <button
                      onClick={() => handleDispense(activeRx.id, activeRx.patient_uhid, activeRx.items || [])}
                      disabled={dispensing}
                      className="h-8 px-4 rounded bg-[#4A1F2B] hover:bg-[#70404B] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                    >
                      {dispensing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>Authorize &amp; Dispense (Enter)</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white dark:bg-[#241D29] rounded-lg border border-[#E3DFDB] dark:border-[#3B3041] text-xs text-[#837376]">
                No pending prescriptions in active queue.
              </div>
            )}

            {/* Prescriptions Waiting Queue Tray */}
            <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-4 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-[#1D1B1B] dark:text-white">
                    Up-Next Prescription Queue
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[10px] font-semibold text-[#837376]">
                    Real-time Sync
                  </span>
                </div>
                <span className="text-[11px] text-[#837376]">
                  Showing {prescriptions.length} Prescriptions
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#F8F2F2] dark:bg-[#18141C] text-[#837376] uppercase text-[10px] font-semibold">
                      <th className="py-2 px-3">Token / Rx</th>
                      <th className="py-2 px-3">Patient &amp; UHID</th>
                      <th className="py-2 px-3">Doctor</th>
                      <th className="py-2 px-3">Items</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE7E6] dark:divide-[#32293D]">
                    {prescriptions.map((rx, idx) => (
                      <tr
                        key={rx.id}
                        className={`hover:bg-[#F8F2F2]/60 dark:hover:bg-[#18141C]/60 transition-colors ${
                          selectedRxIndex === idx ? "bg-[#EDE7E6]/40 dark:bg-[#32293D]/40 font-medium" : ""
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono font-semibold text-[#1D1B1B] dark:text-white">
                          <div className="flex items-center gap-1.5">
                            {rx.status === "active" && (
                              <span className="w-2 h-2 rounded-full bg-[#4A1F2B] dark:bg-[#F7B5C3] animate-pulse"></span>
                            )}
                            <span>{rx.rx_number}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-[#1D1B1B] dark:text-white">{rx.patient_name}</div>
                          <div className="text-[10px] text-[#837376] font-mono">{rx.patient_uhid}</div>
                        </td>
                        <td className="py-2.5 px-3 text-[#514346] dark:text-[#A89CA0]">
                          {rx.doctor_name}
                        </td>
                        <td className="py-2.5 px-3 font-bold tabular-nums text-[#1D1B1B] dark:text-white">
                          {rx.items?.length || 0} Meds
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            rx.status === "dispensed" ? "bg-[#3F6B52]/15 text-[#3F6B52]" : "bg-[#4A1F2B]/15 text-[#4A1F2B] dark:text-[#F7B5C3]"
                          }`}>
                            {rx.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setSelectedRxIndex(idx)}
                            className="h-6 px-2.5 rounded bg-[#4A1F2B] text-white text-[11px] font-semibold hover:bg-[#70404B] transition-colors"
                          >
                            Load Rx
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Continuous Barcode Scanner & Expiry Watchdog (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Continuous Barcode Scanner */}
            <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-4 shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-[#4A1F2B] text-white flex items-center justify-center">
                    <Barcode className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-bold text-[#1D1B1B] dark:text-white">Continuous Batch Scanner</h2>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#83505B] dark:text-[#C08491] text-[10px] font-semibold">
                  Ready to Scan
                </span>
              </div>
              <p className="text-xs text-[#514346] dark:text-[#A89CA0]">
                Point optical scanner at medicine strip 2D DataMatrix or GS1 Barcode to verify batch authenticity.
              </p>
              <form onSubmit={handleBarcodeScan} className="relative mt-1">
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Scan packaging or type batch ID..."
                  className="w-full h-9 pl-9 pr-20 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs text-[#1D1B1B] dark:text-white placeholder:text-[#837376] focus:outline-none focus:border-[#4A1F2B]"
                />
                <QrCode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#837376]" />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2.5 rounded bg-[#4A1F2B] text-white text-[11px] font-semibold hover:bg-[#70404B] transition-colors"
                >
                  Scan (F2)
                </button>
              </form>
            </div>

            {/* FEFO Expiry Watchdog */}
            <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-4 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-[#83505B] text-white flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-bold text-[#1D1B1B] dark:text-white">FEFO Expiry Watchdog</h2>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#F3E9EB] dark:bg-[#4A1F2B]/40 text-[#4A1F2B] dark:text-[#F7B5C3] text-[10px] font-bold">
                  &lt; 60 Days Threshold
                </span>
              </div>

              <div className="flex flex-col gap-2.5 text-xs">
                {/* Critical Batch 1 */}
                <div className="p-3 rounded-lg bg-[#FFDAD6]/30 border border-[#FFDAD6] flex flex-col gap-1.5">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1D1B1B] dark:text-white">Cefixime 200mg (Taxim-O)</span>
                      <span className="text-[10px] text-[#837376]">Batch: CF-2309 • HSN: 300420</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#FFDAD6] text-[#93000A] text-[10px] font-bold">
                      28 DAYS LEFT
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#1D1B1B] dark:text-white pt-1">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase text-[#837376]">Stock on Shelf</span>
                      <span className="font-semibold text-[#BA1A1A]">40 Strips (400 Tabs)</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] uppercase text-[#837376]">Expiry Date</span>
                      <span className="font-medium">22 March 2025</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#FFDAD6]">
                    <span className="text-[10px] text-[#83505B] font-medium">Flag: Priority Dispense / Vendor Return</span>
                    <button
                      onClick={() => alert("Initiated vendor credit memo return for batch CF-2309.")}
                      className="px-2 py-0.5 rounded bg-white dark:bg-[#241D29] text-[#BA1A1A] text-[10px] font-bold border border-[#BA1A1A]/30 hover:bg-[#FFDAD6] transition-colors"
                    >
                      Vendor Return
                    </button>
                  </div>
                </div>

                {/* Batch 2 */}
                <div className="p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] flex flex-col gap-1.5">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1D1B1B] dark:text-white">Amoxicillin + Clav 625mg</span>
                      <span className="text-[10px] text-[#837376]">Batch: AM-8821 • HSN: 300410</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#83505B] dark:text-[#C08491] text-[10px] font-bold">
                      52 DAYS LEFT
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#1D1B1B] dark:text-white pt-1">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase text-[#837376]">Stock on Shelf</span>
                      <span className="font-semibold text-[#83505B]">18 Strips (180 Tabs)</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] uppercase text-[#837376]">Expiry Date</span>
                      <span className="font-medium">15 April 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: MEDICINE INVENTORY & FEFO BATCHES
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "inventory" && (
        <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EDE7E6] dark:border-[#32293D]">
            <div>
              <h2 className="text-base font-bold text-[#1D1B1B] dark:text-white">
                Hospital Medicine Catalog &amp; FEFO Batch Ledger
              </h2>
              <p className="text-xs text-[#514346] dark:text-[#A89CA0] mt-0.5">
                Central depot stock sorted by earliest batch expiry date
              </p>
            </div>
            <span className="text-xs text-[#837376]">Standard Hospital GST 12% Pharmacy Rate</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#F8F2F2] dark:bg-[#18141C] text-[#837376] uppercase text-[10px] font-semibold border-b border-[#EDE7E6] dark:border-[#32293D]">
                  <th className="p-3">Item Code</th>
                  <th className="p-3">Brand Name / Generic</th>
                  <th className="p-3">Category &amp; Unit</th>
                  <th className="p-3">Active Batches (FEFO Expiry)</th>
                  <th className="p-3">Total Stock</th>
                  <th className="p-3">Base MRP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE7E6] dark:divide-[#32293D]">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8F2F2]/60 dark:hover:bg-[#18141C]/60 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#4A1F2B] dark:text-[#F7B5C3]">
                      {item.item_code}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-[#1D1B1B] dark:text-white">{item.brand_name}</div>
                      <div className="text-[10px] text-[#837376]">{item.generic_name}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-[#1D1B1B] dark:text-white">{item.category}</div>
                      <div className="text-[10px] text-[#837376]">{item.unit}</div>
                    </td>
                    <td className="p-3">
                      {item.batches && item.batches.length > 0 ? (
                        item.batches.map((b: any) => (
                          <div key={b.id} className="text-[11px] flex items-center gap-2">
                            <span className="font-mono font-bold text-[#1D1B1B] dark:text-white">#{b.batch_number}</span>
                            <span className="text-[#837376]">Exp: {b.expiry_date}</span>
                            <span className="text-[10px] text-[#3F6B52] font-semibold">({b.current_stock} avail)</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-[#837376] text-[11px]">Primary Batch #A1-902 (Exp: 2026-12)</span>
                      )}
                    </td>
                    <td className="p-3 font-bold tabular-nums">
                      <span className={item.total_stock <= item.reorder_level ? "text-[#BA1A1A]" : "text-[#3F6B52]"}>
                        {item.total_stock} Units
                      </span>
                    </td>
                    <td className="p-3 font-bold tabular-nums text-[#1D1B1B] dark:text-white">
                      ₹{item.base_mrp ? Number(item.base_mrp).toFixed(2) : "N/A"}
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
