"use client";

import React, { useState, useEffect } from "react";
import { usePortal } from "@/context/PortalContext";
import {
  Heart,
  Activity,
  Droplets,
  AlertTriangle,
  Clock,
  Search,
  CheckCircle2,
  Eye,
  Plus,
  Calendar,
  User,
  ShieldAlert,
  FileText,
  Calculator,
  Send,
  Loader2,
  TrendingUp,
  BedDouble,
  Thermometer,
  Zap
} from "lucide-react";
import ClinicalCard from "@/components/ui/clinical/ClinicalCard";
import ClinicalBadge from "@/components/ui/clinical/ClinicalBadge";
import ClinicalButton from "@/components/ui/clinical/ClinicalButton";

interface Inpatient {
  admission_id: number;
  patient_name: string;
  patient_uhid: string;
  patient_age: number;
  gender?: string;
  bed_number: string;
  ward_name: string;
  ward_type: string;
  doctor_name: string;
  initial_diagnosis: string;
  allergies?: string;
  latest_vitals?: {
    bp_systolic: number;
    bp_diastolic: number;
    heart_rate: number;
    temperature: number;
    spo2: number;
    blood_sugar?: number;
    recorded_at?: string;
  };
}

export default function NursingPanel() {
  const { setSelectedUhid } = usePortal();
  const [inpatients, setInpatients] = useState<Inpatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "vitals" | "iv" | "fall" | "critical">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Rapid vitals form state
  const [selectedBedUhid, setSelectedBedUhid] = useState("");
  const [vitals, setVitals] = useState({
    bp_systolic: 120,
    bp_diastolic: 80,
    heart_rate: 76,
    temperature: 98.6,
    spo2: 98,
    blood_sugar: 110,
    pain_score: 2,
  });
  const [nurseNotes, setNurseNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Dedicated modal for bed-card quick record
  const [modalUhid, setModalUhid] = useState<string | null>(null);

  // IV Calculator state
  const [ivVol, setIvVol] = useState(500);
  const [ivHours, setIvHours] = useState(6);
  const [ivDropFactor, setIvDropFactor] = useState(20);
  const [calculatedRate, setCalculatedRate] = useState("28 drops/min (83.3 mL/hr)");

  // SBAR notes state
  const [sbarNotes, setSbarNotes] = useState([
    {
      id: 1,
      bed: "Bed 301 (Leela Nair)",
      time: "10:45 AM",
      sb: "Day 2 TKR. Mobilized with walker 15m.",
      ar: "Mild incision pain, administered Tramadol 50mg SOS at 09:00. Check knee compression drain by 14:00.",
      nurse: "SN Priya Nair, RN",
    },
    {
      id: 2,
      bed: "Bed 303 (Ritu Saxena)",
      time: "09:50 AM",
      sb: "Dengue thrombocytopenia. Platelets 48k. No petechiae noted on lower limbs.",
      ar: "Inform Dr. Mehta immediately if platelets <40,000 on repeat sample.",
      nurse: "SN Anita Das, RN",
    },
  ]);
  const [quickSbarInput, setQuickSbarInput] = useState("");

  const loadNursingData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/nursing");
      const json = await res.json();
      if (json.success && json.inpatients) {
        setInpatients(json.inpatients);
        if (json.inpatients.length > 0 && !selectedBedUhid) {
          setSelectedBedUhid(json.inpatients[0].patient_uhid);
        }
      }
    } catch (err) {
      console.error("Failed to load nursing data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNursingData();
  }, []);

  const calculateDrip = () => {
    if (ivHours <= 0) return;
    const mlPerHour = (ivVol / ivHours).toFixed(1);
    const dropsPerMin = Math.round((ivVol * ivDropFactor) / (ivHours * 60));
    setCalculatedRate(`${dropsPerMin} drops/min (${mlPerHour} mL/hr)`);
  };

  const handleSaveNurseNote = async (e: React.FormEvent, uhidToSave?: string) => {
    e.preventDefault();
    const targetUhid = uhidToSave || selectedBedUhid;
    if (!targetUhid) {
      alert("Please select a patient / bed.");
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/nursing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_uhid: targetUhid,
          shift: "Morning",
          notes: nurseNotes || "Shift routine vitals checked and recorded in telemetry roster.",
          vitals: {
            bp_systolic: vitals.bp_systolic,
            bp_diastolic: vitals.bp_diastolic,
            heart_rate: vitals.heart_rate,
            temperature: vitals.temperature,
            spo2: vitals.spo2,
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback(`Vitals & observation recorded successfully for UHID ${targetUhid}!`);
        setModalUhid(null);
        setNurseNotes("");
        await loadNursingData();
        setTimeout(() => setFeedback(null), 5000);
      } else {
        alert(json.error || "Failed to save nursing entry");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving shift observation");
    } finally {
      setSubmitting(false);
    }
  };

  const addSbarNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSbarInput.trim()) return;
    const newEntry = {
      id: Date.now(),
      bed: "Ward 3B General",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sb: quickSbarInput,
      ar: "Action noted for handover to Shift B Lead Nurse.",
      nurse: "Staff Nurse On-Duty",
    };
    setSbarNotes([newEntry, ...sbarNotes]);
    setQuickSbarInput("");
  };

  // Filter beds
  const filteredBeds = inpatients.filter((pat) => {
    const matchesSearch =
      pat.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pat.patient_uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pat.bed_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pat.initial_diagnosis.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "vitals") return true; // all inpatients in hospital have regular vitals
    if (filter === "iv") return pat.initial_diagnosis?.toLowerCase().includes("fever") || pat.initial_diagnosis?.toLowerCase().includes("knee") || pat.initial_diagnosis?.toLowerCase().includes("sepsis");
    if (filter === "fall") return (pat.patient_age || 0) >= 60;
    if (filter === "critical") {
      const v = pat.latest_vitals;
      if (!v) return false;
      return v.spo2 < 95 || v.bp_systolic > 140 || v.bp_systolic < 90 || v.heart_rate > 100;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* ─────────────────────────────────────────────────────────────
          TOP OPERATIONAL BANNER / WARD OVERVIEW STRIP
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-5 shadow-xs">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          {/* Ward Identity & In-Charge Details */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#4A1F2B] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-[#1D1B1B] dark:text-[#FEF8F7]">
                  Ward 3B · Semi-Private &amp; HDU
                </h1>
                <span className="bg-[#E7E1E1] dark:bg-[#32293D] px-2 py-0.5 rounded text-[#514346] dark:text-[#C08491] text-[11px] uppercase tracking-wider font-semibold">
                  Medical/Surgical Step-Down
                </span>
                <span className="bg-[#F3E9EB] dark:bg-[#4A1F2B]/40 text-[#4A1F2B] dark:text-[#F7B5C3] px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-semibold">
                  Apex Block East
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#514346] dark:text-[#A89CA0] text-xs mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#83505B]" />
                  In-Charge: <strong className="text-[#1D1B1B] dark:text-white font-medium">Staff Nurse Priya Nair, RN (#NR-4821)</strong>
                </span>
                <span className="text-[#D5C2C5] dark:text-[#514346]">•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#83505B]" />
                  Morning Shift (07:00 – 15:30)
                </span>
                <span className="text-[#D5C2C5] dark:text-[#514346]">•</span>
                <span className="inline-flex items-center gap-1 text-[#BA1A1A] dark:text-[#FFDAD6] font-semibold">
                  <Zap className="w-3.5 h-3.5" />
                  Handover Due: 14:45
                </span>
              </div>
            </div>
          </div>

          {/* Live Bed Census Stat Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full xl:w-auto shrink-0">
            <div className="bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] px-3 py-2 rounded-lg flex flex-col justify-between min-w-[90px]">
              <span className="text-[10px] uppercase text-[#837376] tracking-wider font-semibold">Total Beds</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-lg font-bold tabular-nums text-[#1D1B1B] dark:text-white">24</span>
                <span className="text-[10px] text-[#837376]">Cap</span>
              </div>
            </div>
            <div className="bg-[#EDE7E6] dark:bg-[#32293D] border border-[#D5C2C5] dark:border-[#4A1F2B] px-3 py-2 rounded-lg flex flex-col justify-between min-w-[90px]">
              <span className="text-[10px] uppercase text-[#837376] dark:text-[#C08491] tracking-wider font-semibold">Occupied</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-lg font-bold tabular-nums text-[#4A1F2B] dark:text-[#F7B5C3]">{inpatients.length || 21}</span>
                <span className="text-[10px] text-[#83505B] dark:text-[#C08491] font-medium">87.5%</span>
              </div>
            </div>
            <div className="bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] px-3 py-2 rounded-lg flex flex-col justify-between min-w-[90px]">
              <span className="text-[10px] uppercase text-[#837376] tracking-wider font-semibold">Available</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-lg font-bold tabular-nums text-[#3F6B52]">03</span>
                <span className="text-[10px] text-[#837376]">Cleaned</span>
              </div>
            </div>
            <div className="bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] px-3 py-2 rounded-lg flex flex-col justify-between min-w-[90px]">
              <span className="text-[10px] uppercase text-[#837376] tracking-wider font-semibold">Pending D/C</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-lg font-bold tabular-nums text-[#83505B] dark:text-[#C08491]">02</span>
                <span className="text-[10px] text-[#83505B]">Billing clear</span>
              </div>
            </div>
            <div className="bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] px-3 py-2 rounded-lg flex flex-col justify-between min-w-[90px]">
              <span className="text-[10px] uppercase text-[#837376] tracking-wider font-semibold">Isolation</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-lg font-bold tabular-nums text-[#BA1A1A]">01</span>
                <span className="text-[10px] text-[#BA1A1A]">Bed 312</span>
              </div>
            </div>
          </div>
        </div>

        {/* Micro Task Ticker Strip */}
        <div className="mt-4 pt-3 border-t border-[#EDE7E6] dark:border-[#32293D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="bg-[#4A1F2B] text-white px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold shrink-0">
              STAT Alert
            </span>
            <p className="text-xs text-[#1D1B1B] dark:text-white truncate">
              Dr. Vikram Rao &amp; Dr. Alok Verma rounding in 15 mins for Beds 301, 302, 308. Verify morning lab panels &amp; MAR logs.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => {
                const el = document.getElementById("quick-vitals-target");
                if (el) el.focus();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#4A1F2B] text-white text-xs font-semibold hover:bg-[#70404B] transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Vitals</span>
            </button>
            <button
              onClick={() => alert("Digital Handover Checklist exported to Shift B In-Charge Nurse.")}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white text-xs font-semibold hover:bg-[#E7E1E1] transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export SBAR</span>
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg bg-[#3F6B52]/15 border border-[#3F6B52]/30 text-[#3F6B52] dark:text-[#7FD1A5] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#3F6B52] shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          WORKSTATION MAIN DUAL WORKSPACE: 8-COL BEDS & 4-COL CLINICAL DRAWER
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* LEFT 8-COL: INPATIENT BED GRID & REAL-TIME NURSING FLOW */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          {/* Action Toolbar & Interactive Filters */}
          <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] p-3 rounded-lg shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Quick Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filter === "all"
                    ? "bg-[#4A1F2B] text-white shadow-xs"
                    : "bg-[#F8F2F2] dark:bg-[#18141C] text-[#514346] dark:text-[#A89CA0] hover:bg-[#EDE7E6]"
                }`}
              >
                All Beds ({inpatients.length})
              </button>
              <button
                onClick={() => setFilter("vitals")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filter === "vitals"
                    ? "bg-[#4A1F2B] text-white shadow-xs"
                    : "bg-[#F8F2F2] dark:bg-[#18141C] text-[#514346] dark:text-[#A89CA0] hover:bg-[#EDE7E6]"
                }`}
              >
                Due for Vitals ({inpatients.length})
              </button>
              <button
                onClick={() => setFilter("iv")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filter === "iv"
                    ? "bg-[#4A1F2B] text-white shadow-xs"
                    : "bg-[#F8F2F2] dark:bg-[#18141C] text-[#514346] dark:text-[#A89CA0] hover:bg-[#EDE7E6]"
                }`}
              >
                Active IV Fluids (4)
              </button>
              <button
                onClick={() => setFilter("fall")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filter === "fall"
                    ? "bg-[#4A1F2B] text-white shadow-xs"
                    : "bg-[#F8F2F2] dark:bg-[#18141C] text-[#514346] dark:text-[#A89CA0] hover:bg-[#EDE7E6]"
                }`}
              >
                High Fall Risk ({inpatients.filter((p) => p.patient_age >= 60).length})
              </button>
              <button
                onClick={() => setFilter("critical")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filter === "critical"
                    ? "bg-[#4A1F2B] text-white shadow-xs"
                    : "bg-[#F8F2F2] dark:bg-[#18141C] text-[#514346] dark:text-[#A89CA0] hover:bg-[#EDE7E6]"
                }`}
              >
                Critical Vitals
              </button>
            </div>

            {/* Search Input */}
            <div className="relative shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#837376]" />
              <input
                type="text"
                placeholder="Filter bed / patient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 pr-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs text-[#1D1B1B] dark:text-white placeholder:text-[#837376] focus:outline-none focus:border-[#4A1F2B] w-48 transition-all"
              />
            </div>
          </div>

          {/* BED CARDS FEED */}
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="py-12 text-center bg-white dark:bg-[#241D29] rounded-lg border border-[#E3DFDB] dark:border-[#3B3041]">
                <Loader2 className="w-6 h-6 text-[#4A1F2B] dark:text-[#C08491] animate-spin mx-auto" />
                <span className="block text-xs text-[#837376] mt-2">Loading ward telemetry...</span>
              </div>
            ) : filteredBeds.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#241D29] rounded-lg border border-[#E3DFDB] dark:border-[#3B3041] text-xs text-[#837376]">
                No patients match the selected filter criteria.
              </div>
            ) : (
              filteredBeds.map((pat) => {
                const v = pat.latest_vitals;
                const isFallRisk = pat.patient_age >= 60;
                const isCritical = v ? v.spo2 < 95 || v.bp_systolic > 140 : false;

                return (
                  <div
                    key={pat.admission_id}
                    className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-4 shadow-xs hover:shadow-sm transition-all"
                  >
                    <div className="flex flex-col gap-3">
                      {/* Bed Header Strip */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D] gap-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="px-2.5 py-1 rounded bg-[#4A1F2B] text-white text-xs font-bold tracking-tight uppercase">
                            {pat.bed_number}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-bold text-[#1D1B1B] dark:text-white">
                                {pat.patient_name}
                              </span>
                              <span className="text-xs text-[#514346] dark:text-[#A89CA0]">
                                ({pat.patient_age}Y / {pat.gender || "M"})
                              </span>
                              <span className="bg-[#E7E1E1] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-medium">
                                {pat.patient_uhid}
                              </span>
                              <span className="bg-[#F3E9EB] dark:bg-[#4A1F2B]/40 text-[#4A1F2B] dark:text-[#F7B5C3] text-[10px] px-1.5 py-0.5 rounded font-bold">
                                B+ve
                              </span>
                            </div>
                            <span className="text-[11px] text-[#514346] dark:text-[#A89CA0]">
                              {pat.initial_diagnosis} · Consultant: <strong className="text-[#1D1B1B] dark:text-white">{pat.doctor_name}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Alerts & Flags */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isFallRisk && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#514346] dark:text-[#C08491] text-[11px] font-semibold">
                              <AlertTriangle className="w-3 h-3 text-[#83505B]" />
                              High Fall Risk
                            </span>
                          )}
                          {pat.allergies && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFDAD6] text-[#93000A] text-[11px] font-bold">
                              <ShieldAlert className="w-3 h-3 text-[#BA1A1A]" />
                              Allergy: {pat.allergies}
                            </span>
                          )}
                          {isCritical && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFDAD6] text-[#93000A] text-[11px] font-bold">
                              <Zap className="w-3 h-3 text-[#BA1A1A] animate-pulse" />
                              Abnormal Vitals
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Vitals Matrix Micro-Ribbon */}
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-[#F8F2F2] dark:bg-[#18141C] p-2.5 rounded-lg border border-[#E3DFDB] dark:border-[#3B3041]">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-[#837376] font-semibold">BP (mmHg)</span>
                          <span className="text-sm font-bold tabular-nums text-[#1D1B1B] dark:text-white mt-0.5">
                            {v ? `${v.bp_systolic}/${v.bp_diastolic}` : "120/80"}
                          </span>
                          <span className="text-[10px] text-[#837376]">
                            {v && v.bp_systolic > 135 ? "Elevated" : "Normotensive"}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-[#837376] font-semibold">Heart Rate</span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-sm font-bold tabular-nums text-[#1D1B1B] dark:text-white">
                              {v ? v.heart_rate : 76}
                            </span>
                            <span className="text-[10px] text-[#837376]">bpm</span>
                          </div>
                          <span className="text-[10px] text-[#837376]">Sinus reg.</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-[#837376] font-semibold">SpO2 (Air)</span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className={`text-sm font-bold tabular-nums ${v && v.spo2 < 95 ? "text-[#BA1A1A]" : "text-[#3F6B52]"}`}>
                              {v ? `${v.spo2}%` : "98%"}
                            </span>
                            <span className="text-[10px] text-[#837376]">Room Air</span>
                          </div>
                          <span className="text-[10px] text-[#837376]">
                            {v && v.spo2 < 95 ? "Oxygen Req" : "Adequate"}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-[#837376] font-semibold">Temp</span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-sm font-bold tabular-nums text-[#1D1B1B] dark:text-white">
                              {v ? `${v.temperature}°F` : "98.6°F"}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#837376]">Afebrile</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-[#837376] font-semibold">GRBS (mg/dL)</span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-sm font-bold tabular-nums text-[#1D1B1B] dark:text-white">
                              {v?.blood_sugar || 118}
                            </span>
                            <span className="text-[10px] text-[#837376]">Fasting</span>
                          </div>
                          <span className="text-[10px] text-[#837376]">Target met</span>
                        </div>
                        <div className="flex flex-col justify-between">
                          <span className="text-[10px] uppercase text-[#837376] font-semibold">Last Taken</span>
                          <div className="flex items-center gap-1 text-[#1D1B1B] dark:text-white text-xs font-semibold">
                            <Clock className="w-3 h-3 text-[#83505B]" />
                            <span>10:15 AM</span>
                          </div>
                          <span className="text-[10px] text-[#83505B] dark:text-[#C08491]">By RN S. Roy</span>
                        </div>
                      </div>

                      {/* Active Interventions & Actions */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center pt-1">
                        {/* IV Infusion Status */}
                        <div className="md:col-span-6 bg-[#EDE7E6] dark:bg-[#32293D] p-2.5 rounded-lg flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-[#F3E9EB] text-[#4A1F2B] dark:bg-[#4A1F2B] dark:text-white flex items-center justify-center shrink-0">
                              <Droplets className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold text-[#1D1B1B] dark:text-white truncate">
                                Normal Saline 0.9% @ 75 mL/hr
                              </span>
                              <span className="text-[10px] text-[#514346] dark:text-[#A89CA0]">
                                500mL bag · 250mL remaining (~3h 20m)
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-[#241D29] text-[#1D1B1B] dark:text-white shrink-0">
                            Infusing
                          </span>
                        </div>

                        {/* Bed Action Buttons */}
                        <div className="md:col-span-6 flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModalUhid(pat.patient_uhid)}
                            className="flex-1 py-1.5 px-3 rounded bg-[#4A1F2B] text-white text-xs font-semibold hover:bg-[#70404B] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Record Vitals &amp; Log</span>
                          </button>
                          <button
                            onClick={() => setSelectedUhid(pat.patient_uhid)}
                            className="px-3 py-1.5 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white text-xs font-semibold hover:bg-[#E7E1E1] transition-colors flex items-center gap-1"
                            title="Open Full Clinical Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Dossier</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Historical Shift Vitals Trend Graph (SVG Visual Richness) */}
          <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] p-4 rounded-lg shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2">
              <div>
                <h2 className="text-sm font-bold text-[#1D1B1B] dark:text-white">
                  Ward 3B · Morning Shift Vitals Trend (MAP &amp; SpO2)
                </h2>
                <p className="text-[11px] text-[#514346] dark:text-[#A89CA0]">
                  Continuous telemetry telemetry trend for beds under high observation
                </p>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4A1F2B]"></span> Mean Arterial Pressure (MAP)
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#83505B]"></span> SpO2 (%)
                </span>
              </div>
            </div>

            <div className="w-full bg-[#F8F2F2] dark:bg-[#18141C] rounded-lg p-3 border border-[#E3DFDB] dark:border-[#3B3041] overflow-x-auto">
              <svg className="w-full h-28 text-[#514346]" fill="none" preserveAspectRatio="none" viewBox="0 0 760 110">
                <line stroke="#ede7e6" strokeDasharray="4 4" x1="0" x2="760" y1="20" y2="20" />
                <line stroke="#ede7e6" strokeDasharray="4 4" x1="0" x2="760" y1="55" y2="55" />
                <line stroke="#ede7e6" strokeDasharray="4 4" x1="0" x2="760" y1="90" y2="90" />
                <text fill="#837376" fontFamily="Source Sans 3" fontSize="9" x="5" y="16">100% / 120 mmHg</text>
                <text fill="#837376" fontFamily="Source Sans 3" fontSize="9" x="5" y="52">95% / 90 mmHg</text>
                <text fill="#837376" fontFamily="Source Sans 3" fontSize="9" x="5" y="88">90% / 60 mmHg</text>

                {/* Line 1: MAP Track (#4A1F2B) */}
                <path d="M 60 48 Q 130 42, 200 46 T 340 38 T 480 58 T 620 44 T 740 45" fill="none" stroke="#4A1F2B" strokeLinecap="round" strokeWidth="2.5" />
                {/* Line 2: SpO2 Track (#83505B) */}
                <path d="M 60 25 Q 130 22, 200 27 T 340 30 T 480 34 T 620 28 T 740 24" fill="none" stroke="#83505B" strokeDasharray="3 3" strokeLinecap="round" strokeWidth="2.5" />

                <circle cx="200" cy="46" fill="#4A1F2B" r="3.5" />
                <circle cx="340" cy="38" fill="#4A1F2B" r="3.5" />
                <circle cx="480" cy="58" fill="#BA1A1A" r="4.5" />
                <circle cx="620" cy="44" fill="#4A1F2B" r="3.5" />
                <circle cx="200" cy="27" fill="#83505B" r="3" />
                <circle cx="480" cy="34" fill="#83505B" r="3" />
                <circle cx="740" cy="24" fill="#83505B" r="3" />
              </svg>
              <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-[#837376] font-mono">
                <span>07:00 (Shift In)</span>
                <span>08:30 (Morning Rounds)</span>
                <span>10:00 (Post-Meds)</span>
                <span>11:30 (Mid-Shift Review)</span>
                <span>13:00 (Post-Prandial)</span>
                <span>14:45 (Handover Window)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 4-COL: NURSING QUICK ENTRY DRAWER & CALCULATORS */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          {/* RAPID VITALS ENTRY WIDGET */}
          <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#4A1F2B] text-white flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-[#1D1B1B] dark:text-white">Rapid Vitals Entry</h2>
              </div>
              <span className="text-[10px] bg-[#EDE7E6] dark:bg-[#32293D] px-2 py-0.5 rounded text-[#1D1B1B] dark:text-white font-medium">
                Auto-Sync EMR
              </span>
            </div>

            <form onSubmit={(e) => handleSaveNurseNote(e)} className="flex flex-col gap-2.5 mt-3 text-xs">
              {/* Target Bed Selection */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#514346] dark:text-[#A89CA0]">
                  Select Bed / Inpatient *
                </label>
                <select
                  id="quick-vitals-target"
                  value={selectedBedUhid}
                  onChange={(e) => setSelectedBedUhid(e.target.value)}
                  className="h-8 px-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white focus:outline-none focus:border-[#4A1F2B]"
                  required
                >
                  <option value="">Choose Bed...</option>
                  {inpatients.map((pat) => (
                    <option key={pat.admission_id} value={pat.patient_uhid}>
                      {pat.bed_number} · {pat.patient_name} ({pat.patient_uhid})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dual BP Input */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-[#514346] dark:text-[#A89CA0]">Systolic (mmHg)</label>
                  <input
                    type="number"
                    value={vitals.bp_systolic}
                    onChange={(e) => setVitals({ ...vitals, bp_systolic: parseInt(e.target.value) || 0 })}
                    className="h-8 px-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white focus:outline-none focus:border-[#4A1F2B]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-[#514346] dark:text-[#A89CA0]">Diastolic (mmHg)</label>
                  <input
                    type="number"
                    value={vitals.bp_diastolic}
                    onChange={(e) => setVitals({ ...vitals, bp_diastolic: parseInt(e.target.value) || 0 })}
                    className="h-8 px-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white focus:outline-none focus:border-[#4A1F2B]"
                  />
                </div>
              </div>

              {/* Pulse & SpO2 */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-[#514346] dark:text-[#A89CA0]">Pulse Rate (bpm)</label>
                  <input
                    type="number"
                    value={vitals.heart_rate}
                    onChange={(e) => setVitals({ ...vitals, heart_rate: parseInt(e.target.value) || 0 })}
                    className="h-8 px-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white focus:outline-none focus:border-[#4A1F2B]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-[#514346] dark:text-[#A89CA0]">SpO2 (%)</label>
                  <input
                    type="number"
                    value={vitals.spo2}
                    onChange={(e) => setVitals({ ...vitals, spo2: parseInt(e.target.value) || 0 })}
                    className="h-8 px-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white focus:outline-none focus:border-[#4A1F2B]"
                  />
                </div>
              </div>

              {/* Temp & GRBS */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-[#514346] dark:text-[#A89CA0]">Temperature (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vitals.temperature}
                    onChange={(e) => setVitals({ ...vitals, temperature: parseFloat(e.target.value) || 0 })}
                    className="h-8 px-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white focus:outline-none focus:border-[#4A1F2B]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-[#514346] dark:text-[#A89CA0]">Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    value={vitals.blood_sugar}
                    onChange={(e) => setVitals({ ...vitals, blood_sugar: parseInt(e.target.value) || 0 })}
                    className="h-8 px-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white focus:outline-none focus:border-[#4A1F2B]"
                  />
                </div>
              </div>

              {/* Numerical Pain Score (0 to 10) */}
              <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold text-[#514346] dark:text-[#A89CA0]">
                    Pain Score (0 - 10 NRS)
                  </label>
                  <span className="text-[11px] font-bold text-[#4A1F2B] dark:text-[#F7B5C3]">
                    Score: {vitals.pain_score} ({vitals.pain_score <= 2 ? "Mild" : vitals.pain_score <= 6 ? "Moderate" : "Severe"})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={vitals.pain_score}
                  onChange={(e) => setVitals({ ...vitals, pain_score: parseInt(e.target.value) })}
                  className="w-full accent-[#4A1F2B] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#837376]">
                  <span>0 (None)</span>
                  <span>5 (Moderate)</span>
                  <span>10 (Severe)</span>
                </div>
              </div>

              {/* Shift Notes */}
              <div className="flex flex-col gap-1 pt-1">
                <label className="text-[10px] text-[#514346] dark:text-[#A89CA0]">
                  Shift Observation / Med Admin Note
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. IV Ceftriaxone 1g administered. Afebrile."
                  value={nurseNotes}
                  onChange={(e) => setNurseNotes(e.target.value)}
                  className="p-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs text-[#1D1B1B] dark:text-white focus:outline-none focus:border-[#4A1F2B]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-1 h-8 rounded bg-[#4A1F2B] text-white hover:bg-[#70404B] transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Record &amp; Broadcast Vitals</span>
              </button>
            </form>
          </div>

          {/* IV FLUID RATE DROP CALCULATOR */}
          <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#83505B] text-white flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-[#1D1B1B] dark:text-white">IV Drip Rate Calculator</h2>
              </div>
              <span className="text-[10px] text-[#837376]">Macro/Micro</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#837376]">Vol (mL)</label>
                <input
                  type="number"
                  value={ivVol}
                  onChange={(e) => setIvVol(parseInt(e.target.value) || 0)}
                  className="h-7 px-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#837376]">Hours</label>
                <input
                  type="number"
                  value={ivHours}
                  onChange={(e) => setIvHours(parseInt(e.target.value) || 0)}
                  className="h-7 px-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#837376]">Drop Factor</label>
                <select
                  value={ivDropFactor}
                  onChange={(e) => setIvDropFactor(parseInt(e.target.value) || 20)}
                  className="h-7 px-1 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white"
                >
                  <option value="20">20 gtt/mL (Macro)</option>
                  <option value="15">15 gtt/mL (Std)</option>
                  <option value="60">60 gtt/mL (Micro)</option>
                </select>
              </div>
            </div>

            <div className="mt-3 p-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#837376]">Calculated Rate:</span>
                <span className="text-xs font-bold text-[#4A1F2B] dark:text-[#F7B5C3]">{calculatedRate}</span>
              </div>
              <button
                onClick={calculateDrip}
                className="px-2.5 py-1 bg-[#EDE7E6] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white hover:bg-[#E7E1E1] rounded text-[11px] font-semibold transition-colors"
              >
                Recalculate
              </button>
            </div>
          </div>

          {/* SBAR NURSE-TO-NURSE SHIFT HANDOVER LOG */}
          <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-4 shadow-xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#32293D] text-white flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-[#1D1B1B] dark:text-white">SBAR Handover Log</h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white font-semibold">
                Shift B Ready
              </span>
            </div>

            {/* Handover stream */}
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {sbarNotes.map((item) => (
                <div key={item.id} className="p-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#4A1F2B] dark:text-[#F7B5C3]">{item.bed}</span>
                    <span className="text-[10px] text-[#837376]">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-[#1D1B1B] dark:text-white leading-relaxed">
                    <strong className="font-semibold text-[#83505B]">[S/B]</strong> {item.sb}{" "}
                    <strong className="font-semibold text-[#83505B]">[A/R]</strong> {item.ar}
                  </p>
                  <span className="text-[10px] text-[#837376] italic">Logged by {item.nurse}</span>
                </div>
              ))}
            </div>

            {/* Quick SBAR note post */}
            <form onSubmit={addSbarNote} className="flex items-center gap-1.5 mt-1">
              <input
                type="text"
                value={quickSbarInput}
                onChange={(e) => setQuickSbarInput(e.target.value)}
                placeholder="Quick SBAR handover note..."
                className="h-8 flex-1 px-2.5 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs text-[#1D1B1B] dark:text-white focus:outline-none focus:border-[#4A1F2B]"
              />
              <button
                type="submit"
                className="h-8 px-3 rounded bg-[#4A1F2B] text-white hover:bg-[#70404B] transition-colors text-xs font-semibold"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BEDSIDE QUICK RECORD MODAL (OVERLAY)
      ───────────────────────────────────────────────────────────── */}
      {modalUhid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#4A1F2B] dark:text-[#C08491]" />
                <h3 className="text-sm font-bold text-[#1D1B1B] dark:text-white">
                  Record Shift Observation ({modalUhid})
                </h3>
              </div>
              <button
                onClick={() => setModalUhid(null)}
                className="text-xs text-[#837376] hover:text-[#1D1B1B] dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => handleSaveNurseNote(e, modalUhid)} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#837376] mb-1">BP Systolic / Diastolic</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={vitals.bp_systolic}
                      onChange={(e) => setVitals({ ...vitals, bp_systolic: parseInt(e.target.value) || 0 })}
                      className="w-full p-1.5 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041]"
                    />
                    <input
                      type="number"
                      value={vitals.bp_diastolic}
                      onChange={(e) => setVitals({ ...vitals, bp_diastolic: parseInt(e.target.value) || 0 })}
                      className="w-full p-1.5 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#837376] mb-1">SpO2 (%) &amp; HR (bpm)</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={vitals.spo2}
                      onChange={(e) => setVitals({ ...vitals, spo2: parseInt(e.target.value) || 0 })}
                      className="w-full p-1.5 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041]"
                    />
                    <input
                      type="number"
                      value={vitals.heart_rate}
                      onChange={(e) => setVitals({ ...vitals, heart_rate: parseInt(e.target.value) || 0 })}
                      className="w-full p-1.5 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#514346] dark:text-[#A89CA0] mb-1">
                  Shift Notes &amp; Medication Administered *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. IV Ceftriaxone 1g administered. Patient comfortable. Urine output 450ml."
                  value={nurseNotes}
                  onChange={(e) => setNurseNotes(e.target.value)}
                  className="w-full p-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EDE7E6] dark:border-[#32293D]">
                <button
                  type="button"
                  onClick={() => setModalUhid(null)}
                  className="px-3 py-1.5 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-xs font-semibold text-[#1D1B1B] dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded bg-[#4A1F2B] text-white font-semibold text-xs hover:bg-[#70404B] transition-colors"
                >
                  {submitting ? "Saving..." : "Save Shift Log"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
