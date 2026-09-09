"use client";

import React, { useState, useEffect } from "react";
import { usePortal } from "@/context/PortalContext";
import {
  FlaskConical,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  Loader2,
  FileText,
  Save,
  Eye,
  ShieldCheck
} from "lucide-react";

export default function LabPanel() {
  const { setSelectedUhid } = usePortal();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [resultVal, setResultVal] = useState("");
  const [isCritical, setIsCritical] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadLabOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/lab");
      const json = await res.json();
      if (json.success && json.orders) {
        setOrders(json.orders);
      }
    } catch (err) {
      console.error("Failed to load lab orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLabOrders();
  }, []);

  const handleAction = async (orderId: number, action: "collect_sample" | "verify_report") => {
    try {
      const res = await fetch("/api/lab", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, action }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback(`Order updated: ${action === "collect_sample" ? "Sample Collected" : "Report Verified"}`);
        loadLabOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder || !resultVal) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/lab", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: editingOrder.id,
          action: "enter_results",
          result_value: resultVal,
          result_unit: editingOrder.default_unit || "",
          is_critical: isCritical,
          remarks,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback(`Results saved for ${editingOrder.order_number}`);
        setEditingOrder(null);
        setResultVal("");
        setRemarks("");
        setIsCritical(false);
        loadLabOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4" /> LABORATORY INFORMATION SYSTEM (LIS)
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
            Pathology Queue, Sample Barcodes & Verified Diagnostic Reports
          </h1>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white">
            Active Diagnostic Test Orders ({orders.length})
          </h2>
          <span className="text-xs text-slate-400 font-medium">Automatic Barcode & Reference Ranges</span>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-6 h-6 text-[#13C5DD] animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">No diagnostic orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-extrabold uppercase">
                <tr>
                  <th className="p-3">Order / Barcode</th>
                  <th className="p-3">Patient Details</th>
                  <th className="p-3">Test Name & Category</th>
                  <th className="p-3">Result / Normal Range</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3">
                      <div className="font-extrabold text-[#13C5DD]">{o.order_number}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{o.sample_barcode}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {o.patient_name}
                        <button
                          onClick={() => setSelectedUhid(o.patient_uhid)}
                          className="text-[#13C5DD] hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5 inline" />
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400">{o.patient_uhid} • {o.patient_gender}, {o.patient_age}y</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{o.test_name}</div>
                      <div className="text-[10px] text-slate-400">{o.category} • Sample: {o.sample_type}</div>
                    </td>
                    <td className="p-3">
                      {o.result_value ? (
                        <div>
                          <div className={`font-bold ${o.is_critical ? "text-red-500 font-extrabold" : "text-slate-800 dark:text-slate-200"}`}>
                            {o.result_value} {o.result_unit}
                          </div>
                          <div className="text-[10px] text-slate-400">Ref: {o.reference_range || o.default_ref}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pending Entry</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        o.status === "verified" ? "bg-emerald-500/15 text-emerald-500" :
                        o.status === "result_ready" ? "bg-purple-500/15 text-purple-500" :
                        o.status === "sample_collected" ? "bg-blue-500/15 text-blue-500" :
                        "bg-amber-500/15 text-amber-500"
                      }`}>
                        ● {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {o.status === "ordered" && (
                          <button
                            onClick={() => handleAction(o.id, "collect_sample")}
                            className="px-2.5 py-1 rounded-lg bg-blue-500 text-white text-[11px] font-bold hover:bg-blue-600 transition-colors"
                          >
                            Collect Sample
                          </button>
                        )}
                        {(o.status === "sample_collected" || o.status === "ordered" || o.status === "processing") && (
                          <button
                            onClick={() => {
                              setEditingOrder(o);
                              setResultVal(o.result_value || "");
                              setRemarks(o.remarks || "");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#13C5DD] text-[#1D2A4D] text-[11px] font-extrabold hover:opacity-90"
                          >
                            Enter Results
                          </button>
                        )}
                        {o.status === "result_ready" && (
                          <button
                            onClick={() => handleAction(o.id, "verify_report")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[11px] font-bold hover:bg-emerald-600"
                          >
                            Verify & Sign
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Result Entry Modal Drawer */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white">
                  Enter Laboratory Results
                </h3>
                <div className="text-xs text-slate-400">{editingOrder.test_name} ({editingOrder.order_number})</div>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveResult} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Observed Test Value & Findings *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hb: 14.8 g/dL, WBC: 8400 /cumm, Platelets: 2.8L"
                  value={resultVal}
                  onChange={(e) => setResultVal(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Reference: {editingOrder.default_ref || "N/A"}</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pathologist Observations / Remarks
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Normal morphology, no toxic granules observed."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <label className="flex items-center gap-2 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCritical}
                  onChange={(e) => setIsCritical(e.target.checked)}
                  className="accent-red-500"
                />
                <span>Critical Panic Value Alert (Notify Attending Doctor Immediately)</span>
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#13C5DD] text-[#1D2A4D] font-black uppercase shadow-md flex items-center gap-1.5"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Diagnostic Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
