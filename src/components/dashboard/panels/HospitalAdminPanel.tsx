"use client";

import React, { useState, useEffect } from "react";
import { usePortal } from "@/context/PortalContext";
import ClinicalCard from "@/components/ui/clinical/ClinicalCard";
import ClinicalBadge from "@/components/ui/clinical/ClinicalBadge";
import ClinicalButton from "@/components/ui/clinical/ClinicalButton";
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
  UserPlus,
  Hotel,
  Clock,
  Droplet
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
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-IN", { hour12: false }) + " IST");
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

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
        <Loader2 className="w-8 h-8 text-[#4A1F2B] dark:text-[#C08491] animate-spin mx-auto" />
        <p className="text-xs text-[#514346] dark:text-[#D5C2C5] font-medium">
          Aggregating hospital-wide telemetry & financial metrics...
        </p>
      </div>
    );
  }

  const occupiedBedsCount = metrics?.occupiedBeds || 18;
  const totalBedsCount = metrics?.totalBeds || 24;
  const occupancyPercentage = Math.round((occupiedBedsCount / totalBedsCount) * 100);

  return (
    <div className="space-y-4">
      
      {/* ─── STITCH OPERATIONAL HEADER & MICRO-RIBBON ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#241D29] p-3.5 rounded-lg border border-[#E3DFDB] dark:border-[#3B3041] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#83505B] animate-pulse shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-base text-[#1D1B1B] dark:text-[#FEF8F7] tracking-tight">
                Executive Operational Command
              </h1>
              <span className="px-1.5 py-0.5 rounded bg-[#4A1F2B] text-white text-[10px] font-bold uppercase tracking-wider">
                Live Hub
              </span>
            </div>
            <p className="text-[11px] text-[#514346] dark:text-[#D5C2C5]">
              Apex MedCore Central · Shift Alpha · Synchronized with HIS Core at{" "}
              <span className="font-semibold text-[#1D1B1B] dark:text-[#FEF8F7] font-mono">
                {currentTime || "11:42:18 IST"}
              </span>
            </p>
          </div>
        </div>

        {/* Rapid Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/app#patients"
            className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-md bg-[#4A1F2B] hover:bg-[#70404B] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Patient</span>
          </a>
          <a
            href="/app#beds"
            className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-md bg-[#F2EDEC] dark:bg-[#2F2734] hover:bg-[#EDE7E6] text-[#1D1B1B] dark:text-[#FEF8F7] text-xs font-semibold border border-[#E3DFDB] dark:border-[#3B3041] transition-colors"
          >
            <Hotel className="w-3.5 h-3.5 text-[#83505B]" />
            <span>Admit Ward</span>
          </a>
          <a
            href="/app#emergency"
            className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-md bg-[#FFDAD6] dark:bg-[#410002] hover:bg-[#FFDAD6]/80 text-[#93000A] dark:text-[#FFDAD6] text-xs font-semibold border border-[#BA1A1A]/30 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#BA1A1A]" />
            <span>Emergency Triage</span>
          </a>
          <ClinicalButton
            variant="secondary"
            size="sm"
            onClick={handleResetDemoData}
            disabled={resettingSeed}
            icon={resettingSeed ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          >
            Reset Seed Data
          </ClinicalButton>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-md bg-[#EEF4F0] dark:bg-[#1C2C22] border border-[#D4E3D9] dark:border-[#2C4A38] text-[#3F6B52] dark:text-[#7ADDB0] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ─── STITCH 5-CLUSTER CRITICAL METRIC STRIP ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 tabular-nums">
        
        {/* Metric 1: OPD Consultations */}
        <div className="bg-white dark:bg-[#241D29] p-3.5 rounded-lg border border-[#E3DFDB] dark:border-[#3B3041] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#4A1F2B] transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#837376] tracking-wider block">
                Today OPD Consults
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-[#1D1B1B] dark:text-[#FEF8F7] leading-none">
                  {metrics?.todayOpd || 128}
                </span>
                <span className="text-[11px] text-[#83505B] font-medium">/ 148 booked</span>
              </div>
            </div>
            <div className="p-1.5 rounded bg-[#F8F2F2] dark:bg-[#18141C] text-[#4A1F2B] dark:text-[#C08491]">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 space-y-1">
            <div className="w-full bg-[#E7E1E1] dark:bg-[#3B3041] h-1.5 rounded-full overflow-hidden flex">
              <div className="bg-[#4A1F2B] h-full" style={{ width: "72%" }} />
              <div className="bg-[#83505B] h-full" style={{ width: "16%" }} />
              <div className="bg-[#DED9D8] h-full" style={{ width: "12%" }} />
            </div>
            <div className="flex justify-between text-[10px] text-[#514346] dark:text-[#D5C2C5] font-medium">
              <span>Done <strong>{metrics?.todayOpd ? metrics.todayOpd - (metrics.waitingOpd || 0) : 108}</strong></span>
              <span>Consulting <strong className="text-[#4A1F2B] dark:text-[#C08491]">6</strong></span>
              <span>Wait <strong className="text-[#9A6A25]">{metrics?.waitingOpd || 14}</strong></span>
            </div>
          </div>
        </div>

        {/* Metric 2: Bed Occupancy */}
        <div className="bg-white dark:bg-[#241D29] p-3.5 rounded-lg border border-[#E3DFDB] dark:border-[#3B3041] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#4A1F2B] transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#837376] tracking-wider block">
                Inpatient Beds
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-[#1D1B1B] dark:text-[#FEF8F7] leading-none">
                  {occupancyPercentage}%
                </span>
                <span className="text-[11px] text-[#514346] dark:text-[#D5C2C5]">
                  {occupiedBedsCount}/{totalBedsCount}
                </span>
              </div>
            </div>
            <div className="p-1.5 rounded bg-[#F8F2F2] dark:bg-[#18141C] text-[#83505B]">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 space-y-1">
            <div className="w-full bg-[#E7E1E1] dark:bg-[#3B3041] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#83505B] h-full rounded-full" style={{ width: `${occupancyPercentage}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-[#514346] dark:text-[#D5C2C5] font-medium">
              <span>ICU <strong className="text-[#BA1A1A]">4/4</strong></span>
              <span>Deluxe <strong>3/4</strong></span>
              <span>Gen <strong>11/16</strong></span>
            </div>
          </div>
        </div>

        {/* Metric 3: Emergency / Triage */}
        <div className="bg-white dark:bg-[#241D29] p-3.5 rounded-lg border border-[#E3DFDB] dark:border-[#3B3041] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#4A1F2B] transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#837376] tracking-wider block">
                Emergency Triage
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-bold text-[#BA1A1A] leading-none">7</span>
                <span className="text-[10px] font-bold text-[#93000A] px-1.5 py-0.2 rounded bg-[#FFDAD6]">
                  Active Queue
                </span>
              </div>
            </div>
            <div className="p-1.5 rounded bg-[#FFDAD6]/40 text-[#BA1A1A]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 pt-0.5 flex items-center justify-between text-[10px]">
            <span className="font-semibold text-[#BA1A1A]">Red: 1</span>
            <span className="font-semibold text-[#9A6A25]">Orange: 2</span>
            <span className="font-semibold text-[#3F6B52]">Yellow: 4</span>
          </div>
        </div>

        {/* Metric 4: Revenue & TPA */}
        <div className="bg-white dark:bg-[#241D29] p-3.5 rounded-lg border border-[#E3DFDB] dark:border-[#3B3041] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#4A1F2B] transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#837376] tracking-wider block">
                Today's Invoiced Revenue
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-[#1D1B1B] dark:text-[#FEF8F7] leading-none">
                  ₹{((metrics?.todayRevenue || 71584) / 1000).toFixed(1)}k
                </span>
                <span className="text-[10px] text-[#3F6B52] font-semibold flex items-center">
                  <ArrowUpRight className="w-3 h-3" /> +12.4%
                </span>
              </div>
            </div>
            <div className="p-1.5 rounded bg-[#F8F2F2] dark:bg-[#18141C] text-[#3F6B52]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 pt-0.5 text-[10px] text-[#514346] dark:text-[#D5C2C5] flex justify-between">
            <span>TPA Cashless: <strong>68%</strong></span>
            <span>Settled: <strong>₹{(metrics?.todayRevenue || 71584).toLocaleString("en-IN")}</strong></span>
          </div>
        </div>

        {/* Metric 5: Diagnostics & Critical */}
        <div className="bg-white dark:bg-[#241D29] p-3.5 rounded-lg border border-[#E3DFDB] dark:border-[#3B3041] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#4A1F2B] transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#837376] tracking-wider block">
                Diagnostics Pipeline
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-[#1D1B1B] dark:text-[#FEF8F7] leading-none">
                  {metrics?.pendingLabReports || 4}
                </span>
                <span className="text-[11px] text-[#837376]">orders in LIS</span>
              </div>
            </div>
            <div className="p-1.5 rounded bg-[#F8F2F2] dark:bg-[#18141C] text-[#665C72]">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 pt-0.5 text-[10px] flex justify-between items-center">
            <span className="text-[#BA1A1A] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BA1A1A] animate-ping" />
              {metrics?.criticalLabAlerts || 1} Critical STAT
            </span>
            <span className="text-[#3F6B52] font-semibold">12 Verified</span>
          </div>
        </div>

      </div>

      {/* ─── REAL-TIME WARD BED MATRIX ─── */}
      <ClinicalCard
        title="Real-Time Hospital Ward Bed Matrix & Allocations"
        subtitle="Click any bed to cycle status (Available ➔ Occupied ➔ Cleaning). All beds enforce real-time nurse call syncing."
        icon={<Bed className="w-4 h-4" />}
        actions={
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#3F6B52]">
              <span className="w-2 h-2 rounded-full bg-[#3F6B52]" /> Available
            </span>
            <span className="flex items-center gap-1.5 text-[#BA1A1A]">
              <span className="w-2 h-2 rounded-full bg-[#BA1A1A]" /> Occupied
            </span>
            <span className="flex items-center gap-1.5 text-[#9A6A25]">
              <span className="w-2 h-2 rounded-full bg-[#9A6A25]" /> Cleaning
            </span>
          </div>
        }
      >
        <div className="space-y-4">
          {bedsData?.wards?.map((ward: any) => (
            <div key={ward.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-[#E3DFDB] dark:border-[#3B3041]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1D1B1B] dark:text-[#FEF8F7]">{ward.name}</span>
                  <span className="text-[#837376] font-medium">({ward.floor})</span>
                </div>
                <span className="text-[11px] text-[#837376] font-medium">
                  Tariff: <strong className="text-[#1D1B1B] dark:text-[#FEF8F7]">₹{ward.charge_per_day.toLocaleString("en-IN")}</strong>/day
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {ward.beds?.map((bed: any) => {
                  const isAvailable = bed.status === "available";
                  const isOccupied = bed.status === "occupied";
                  const isCleaning = bed.status === "cleaning";
                  
                  return (
                    <div
                      key={bed.id}
                      onClick={() => handleBedStatusToggle(bed.id, bed.status)}
                      className={`p-2.5 rounded-md border text-xs cursor-pointer transition-all hover:shadow-xs select-none ${
                        isAvailable
                          ? "bg-[#EEF4F0] dark:bg-[#1C2C22] border-[#D4E3D9] dark:border-[#2C4A38] text-[#3F6B52] dark:text-[#7ADDB0]"
                          : isOccupied
                          ? "bg-[#FDF1F0] dark:bg-[#301A1B] border-[#F7D7D5] dark:border-[#522528] text-[#1D1B1B] dark:text-[#FEF8F7]"
                          : isCleaning
                          ? "bg-[#FAF4EB] dark:bg-[#2C2417] border-[#F0E2CD] dark:border-[#4D3C23] text-[#9A6A25]"
                          : "bg-[#F4F2F5] dark:bg-[#25202E] border-[#DDD9E1] text-[#665C72]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{bed.bed_number}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          isAvailable ? "bg-[#3F6B52]" : isOccupied ? "bg-[#BA1A1A] animate-pulse" : "bg-[#9A6A25]"
                        }`} />
                      </div>

                      <div className="mt-1.5 text-[11px] min-h-[28px]">
                        {isOccupied ? (
                          <div>
                            <div className="font-bold truncate text-[#1D1B1B] dark:text-[#FEF8F7]">
                              {bed.patient_name || "Admitted Patient"}
                            </div>
                            <div className="text-[10px] text-[#837376] font-mono">{bed.current_patient_uhid}</div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-[#837376] capitalize pt-1">
                            {bed.status}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ClinicalCard>

      {/* ─── DUAL SPLIT: DEPARTMENT CLINICAL VOLUME & RECENT FINANCIALS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Department Throughput */}
        <div className="lg:col-span-6">
          <ClinicalCard
            title="Department Clinical Volume"
            subtitle="Real-time OPD patient flow and specialist capacity"
            icon={<Activity className="w-4 h-4 text-[#83505B]" />}
          >
            <div className="space-y-2">
              {departments.slice(0, 6).map((d, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-md bg-[#FAF7F6] dark:bg-[#1F1924] border border-[#E3DFDB] dark:border-[#3B3041] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-[#1D1B1B] dark:text-[#FEF8F7]">{d.name}</div>
                    <div className="text-[10px] text-[#837376]">Code: {d.code} · HOD: {d.head_doctor_name || "Dr. Staff"}</div>
                  </div>
                  <div className="text-right">
                    <ClinicalBadge variant="brand">
                      {d.opd_volume || 0} Consults
                    </ClinicalBadge>
                  </div>
                </div>
              ))}
            </div>
          </ClinicalCard>
        </div>

        {/* Recent Billing Ledger */}
        <div className="lg:col-span-6">
          <ClinicalCard
            title="Recent Invoices & TPA Settlement"
            subtitle="Itemized GST claims, cash counter receipts, and Ayushman Bharat records"
            icon={<CreditCard className="w-4 h-4 text-[#3F6B52]" />}
          >
            <div className="space-y-2 max-h-[320px] overflow-y-auto">
              {invoices.slice(0, 6).map((inv) => (
                <div
                  key={inv.id}
                  className="p-2.5 rounded-md bg-[#FAF7F6] dark:bg-[#1F1924] border border-[#E3DFDB] dark:border-[#3B3041] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-[#1D1B1B] dark:text-[#FEF8F7] flex items-center gap-2">
                      <span>{inv.patient_name}</span>
                      <span className="font-mono text-[10px] text-[#83505B]">{inv.invoice_number}</span>
                    </div>
                    <div className="text-[10px] text-[#837376]">
                      {inv.bill_type} · {inv.insurance_provider || "Self-Pay (Cash/UPI)"}
                    </div>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="font-bold text-sm text-[#1D1B1B] dark:text-[#FEF8F7]">
                      ₹{inv.total_amount.toLocaleString("en-IN")}
                    </div>
                    <ClinicalBadge variant={inv.payment_status === "paid" ? "success" : "warning"} dot>
                      {inv.payment_status.toUpperCase()}
                    </ClinicalBadge>
                  </div>
                </div>
              ))}
            </div>
          </ClinicalCard>
        </div>

      </div>

    </div>
  );
}
