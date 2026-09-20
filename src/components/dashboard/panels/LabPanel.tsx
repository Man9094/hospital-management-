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
  ShieldCheck,
  Zap
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
    <div className="space-y-4">
      {/* Title Strip */}
      <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#4A1F2B] text-white flex items-center justify-center shrink-0 shadow-xs">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#83505B] dark:text-[#C08491] uppercase tracking-wider">
              LABORATORY INFORMATION SYSTEM (LIS)
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#1D1B1B] dark:text-[#FEF8F7]">
              Pathology Queue, Sample Barcodes &amp; Verified Diagnostic Reports
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#837376]">
            Active Orders: <strong className="text-[#1D1B1B] dark:text-white tabular-nums">{orders.length}</strong>
          </span>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg bg-[#3F6B52]/15 border border-[#3F6B52]/30 text-[#3F6B52] dark:text-[#7FD1A5] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#3F6B52] shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
          <h2 className="text-sm font-bold text-[#1D1B1B] dark:text-white">
            Active Diagnostic Test Orders ({orders.length})
          </h2>
          <span className="text-xs text-[#837376]">Automatic Barcode &amp; Reference Ranges</span>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-6 h-6 text-[#4A1F2B] dark:text-[#C08491] animate-spin mx-auto" />
            <span className="block text-xs text-[#837376] mt-2">Loading pathology queue...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#837376]">No diagnostic orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#F8F2F2] dark:bg-[#18141C] text-[#837376] uppercase text-[10px] font-semibold border-b border-[#EDE7E6] dark:border-[#32293D]">
                  <th className="p-3">Order / Barcode</th>
                  <th className="p-3">Patient Details</th>
                  <th className="p-3">Test &amp; Category</th>
                  <th className="p-3">Result / Normal Range</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE7E6] dark:divide-[#32293D]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F8F2F2]/60 dark:hover:bg-[#18141C]/60 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-[#4A1F2B] dark:text-[#F7B5C3] font-mono">{o.order_number}</div>
                      <div className="text-[10px] text-[#837376] font-mono">{o.sample_barcode}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-[#1D1B1B] dark:text-white flex items-center gap-1">
                        <span>{o.patient_name}</span>
                        <button
                          onClick={() => setSelectedUhid(o.patient_uhid)}
                          className="text-[#83505B] dark:text-[#C08491] hover:text-[#4A1F2B]"
                        >
                          <Eye className="w-3.5 h-3.5 inline" />
                        </button>
                      </div>
                      <div className="text-[10px] text-[#837376]">{o.patient_uhid} · {o.patient_gender}, {o.patient_age}y</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-[#1D1B1B] dark:text-white">{o.test_name}</div>
                      <div className="text-[10px] text-[#837376]">{o.category} · Sample: {o.sample_type}</div>
                    </td>
                    <td className="p-3">
                      {o.result_value ? (
                        <div>
                          <div className={`font-bold tabular-nums ${o.is_critical ? "text-[#BA1A1A] font-extrabold" : "text-[#1D1B1B] dark:text-white"}`}>
                            {o.result_value} {o.result_unit}
                          </div>
                          <div className="text-[10px] text-[#837376]">Ref: {o.reference_range || o.default_ref}</div>
                        </div>
                      ) : (
                        <span className="text-[#837376] italic">Pending Entry</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.status === "verified" ? "bg-[#3F6B52]/15 text-[#3F6B52]" :
                        o.status === "result_ready" ? "bg-[#4A1F2B]/15 text-[#4A1F2B] dark:text-[#F7B5C3]" :
                        o.status === "sample_collected" ? "bg-[#83505B]/15 text-[#83505B] dark:text-[#C08491]" :
                        "bg-[#9A6A25]/15 text-[#9A6A25]"
                      }`}>
                        ● {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {o.status === "ordered" && (
                          <button
                            onClick={() => handleAction(o.id, "collect_sample")}
                            className="px-2.5 py-1 rounded bg-[#83505B] text-white text-[11px] font-semibold hover:bg-[#70404B] transition-colors"
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
                            className="px-2.5 py-1 rounded bg-[#4A1F2B] text-white text-[11px] font-semibold hover:bg-[#70404B] transition-colors"
                          >
                            Enter Results
                          </button>
                        )}
                        {o.status === "result_ready" && (
                          <button
                            onClick={() => handleAction(o.id, "verify_report")}
                            className="px-2.5 py-1 rounded bg-[#3F6B52] text-white text-[11px] font-semibold hover:bg-[#345943] transition-colors"
                          >
                            Verify &amp; Sign
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

      {/* Result Entry Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-xl p-5 space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
              <div>
                <h3 className="text-sm font-bold text-[#1D1B1B] dark:text-white">
                  Enter Laboratory Results
                </h3>
                <div className="text-xs text-[#837376]">{editingOrder.test_name} ({editingOrder.order_number})</div>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="text-[#837376] hover:text-[#1D1B1B] dark:hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveResult} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#514346] dark:text-[#A89CA0] mb-1">
                  Observed Test Value &amp; Findings *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hb: 14.8 g/dL, WBC: 8400 /cumm, Platelets: 2.8L"
                  value={resultVal}
                  onChange={(e) => setResultVal(e.target.value)}
                  className="w-full h-9 px-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white font-semibold"
                />
                <span className="text-[10px] text-[#837376] block mt-1">Reference: {editingOrder.default_ref || "N/A"}</span>
              </div>

              <div>
                <label className="block font-semibold text-[#514346] dark:text-[#A89CA0] mb-1">
                  Pathologist Observations / Remarks
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Normal morphology, no toxic granules observed."
                  className="w-full p-2.5 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white"
                />
              </div>

              <label className="flex items-center gap-2 p-2.5 rounded bg-[#FFDAD6]/30 border border-[#FFDAD6] text-[#93000A] font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCritical}
                  onChange={(e) => setIsCritical(e.target.checked)}
                  className="accent-[#BA1A1A]"
                />
                <span>Critical Panic Value Alert (Notify Attending Doctor Immediately)</span>
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EDE7E6] dark:border-[#32293D]">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-3 py-1.5 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded bg-[#4A1F2B] text-white font-semibold hover:bg-[#70404B] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
