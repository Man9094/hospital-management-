"use client";

import React, { useState, useEffect } from "react";
import { usePortal } from "@/context/PortalContext";
import {
  Bed,
  Users,
  CreditCard,
  Stethoscope,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Building2,
  FlaskConical,
  Pill,
  RefreshCw,
  Loader2,
  Eye,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  Sparkles
} from "lucide-react";

export default function HospitalAdminPanel() {
  const { setSelectedUhid } = usePortal();
  const [metrics, setMetrics] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [bedsData, setBedsData] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resettingSeed, setResettingSeed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadAdminDashboard = async () => {
    setLoading(true);
    try {
      const [anRes, bedRes, billRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/beds"),
        fetch("/api/billing")
      ]);

      const anJson = await anRes.json();
      const bedJson = await bedRes.json();
      const billJson = await billRes.json();

      if (anJson.success) {
        setMetrics(anJson.metrics);
        setDepartments(anJson.departmentPerformance || []);
      }
      if (bedJson.success) {
        setBedsData(bedJson);
      }
      if (billJson.success) {
        setInvoices(billJson.invoices || []);
      }
    } catch (err) {
      console.error("Failed to load admin analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminDashboard();
  }, []);

  const handleBedStatusToggle = async (bedId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "available" ? "occupied" : currentStatus === "occupied" ? "cleaning" : "available";
    try {
      const res = await fetch("/api/beds", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bed_id: bedId, status: nextStatus }),
      });
      const json = await res.json();
      if (json.success) {
        loadAdminDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDemoData = async () => {
    if (!confirm("Are you sure you want to re-seed demo data? This will restore realistic patient records, queues, beds, and billing.")) {
      return;
    }
    setResettingSeed(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setFeedback("Database re-seeded successfully with fresh Indian hospital master data!");
        loadAdminDashboard();
      } else {
        alert(json.error || "Failed to reset demo data");
      }
    } catch (err) {
      alert("Error resetting database");
    } finally {
      setResettingSeed(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#13C5DD] animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-medium">Aggregating hospital-wide telemetry & financial metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4" /> HOSPITAL OPERATIONAL COMMAND CENTER
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
            Apex MedCore Executive Dashboard & Bed Matrix
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDemoData}
            disabled={resettingSeed}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold uppercase flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {resettingSeed ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Reset Demo Data
          </button>
          <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-extrabold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live Telemetry Active
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: OPD */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Today's OPD Queue</span>
            <Users className="w-4 h-4 text-[#13C5DD]" />
          </div>
          <div className="text-3xl font-black font-poppins text-slate-900 dark:text-white">
            {metrics?.todayOpd || 4}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <span className="text-amber-500 font-bold">{metrics?.waitingOpd || 2} waiting</span> • {metrics?.todayOpd - (metrics?.waitingOpd || 0)} completed
          </div>
        </div>

        {/* Card 2: IPD & Bed Occupancy */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Bed Occupancy</span>
            <Bed className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black font-poppins text-slate-900 dark:text-white">
            {metrics?.occupiedBeds || 5} <span className="text-sm font-normal text-slate-400">/ {metrics?.totalBeds || 12} Beds</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <span className="text-emerald-500 font-bold">{metrics?.availableBeds || 5} available</span> • ICU: {metrics?.icuOccupied || 2}/{metrics?.icuTotal || 4}
          </div>
        </div>

        {/* Card 3: Revenue */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Today's Revenue</span>
            <CreditCard className="w-4 h-4 text-[#0F6CBD]" />
          </div>
          <div className="text-3xl font-black font-poppins text-slate-900 dark:text-white">
            ₹{(metrics?.todayRevenue || 71584).toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            TPA Receivables: <strong className="text-cyan-600 dark:text-cyan-400">₹{(metrics?.insuranceReceivables || 60000).toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {/* Card 4: Diagnostics */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Pending Diagnostics</span>
            <FlaskConical className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black font-poppins text-slate-900 dark:text-white">
            {metrics?.pendingLabReports || 1}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Critical Alerts: <strong className="text-red-500">{metrics?.criticalLabAlerts || 1} alert</strong>
          </div>
        </div>

      </div>

      {/* Interactive Ward Bed Matrix */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-extrabold font-poppins text-slate-900 dark:text-white flex items-center gap-2">
              <Bed className="w-5 h-5 text-[#13C5DD]" /> Real-Time Hospital Ward Bed Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Click any bed to toggle operational status or inspect allocated patient.</p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" /> Occupied</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> Cleaning</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500" /> Reserved</span>
          </div>
        </div>

        <div className="space-y-6">
          {bedsData?.wards?.map((ward: any) => (
            <div key={ward.id} className="space-y-3">
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span className="text-slate-900 dark:text-white">{ward.name} ({ward.floor})</span>
                <span className="text-slate-400">Tariff: ₹{ward.charge_per_day.toLocaleString("en-IN")}/day</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {ward.beds?.map((bed: any) => {
                  const isAvailable = bed.status === "available";
                  const isOccupied = bed.status === "occupied";
                  const isCleaning = bed.status === "cleaning";
                  
                  return (
                    <div
                      key={bed.id}
                      onClick={() => handleBedStatusToggle(bed.id, bed.status)}
                      className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all hover:scale-[1.02] ${
                        isAvailable
                          ? "bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500"
                          : isOccupied
                          ? "bg-red-500/10 border-red-500/30 hover:border-red-500"
                          : isCleaning
                          ? "bg-amber-500/10 border-amber-500/30 hover:border-amber-500"
                          : "bg-blue-500/10 border-blue-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 dark:text-white">{bed.bed_number}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          isAvailable ? "bg-emerald-500" : isOccupied ? "bg-red-500 animate-pulse" : "bg-amber-500"
                        }`} />
                      </div>

                      <div className="mt-2 text-[11px]">
                        {isOccupied ? (
                          <div>
                            <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{bed.patient_name || "Admitted"}</div>
                            <div className="text-[10px] text-slate-400">{bed.current_patient_uhid}</div>
                          </div>
                        ) : (
                          <div className="text-slate-400 font-medium capitalize">{bed.status}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Department Volume & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department Load */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h2 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#13C5DD]" /> Department Clinical Volume
          </h2>

          <div className="space-y-3">
            {departments.slice(0, 5).map((d, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white">{d.name}</div>
                  <div className="text-[10px] text-slate-400">Dept Code: {d.code}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#13C5DD]/15 text-[#13C5DD] font-extrabold">
                  {d.opd_volume || 0} Consultations
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h2 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-500" /> Recent Billing Transactions & TPA
          </h2>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {invoices.slice(0, 5).map((inv) => (
              <div
                key={inv.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    {inv.patient_name}
                    <span className="text-[10px] text-[#13C5DD] font-mono">{inv.invoice_number}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{inv.bill_type} • {inv.insurance_provider || "Self Pay"}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-slate-900 dark:text-white">₹{inv.total_amount.toLocaleString("en-IN")}</div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">
                    ● {inv.payment_status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
