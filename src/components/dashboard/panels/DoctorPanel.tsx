"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePortal } from "@/context/PortalContext";
import ClinicalCard from "@/components/ui/clinical/ClinicalCard";
import ClinicalBadge from "@/components/ui/clinical/ClinicalBadge";
import ClinicalButton from "@/components/ui/clinical/ClinicalButton";
import PatientHeaderBanner from "@/components/ui/clinical/PatientHeaderBanner";
import VitalStrip from "@/components/ui/clinical/VitalStrip";
import {
  Stethoscope,
  FileText,
  CheckCircle2,
  Clock,
  User,
  Heart,
  Plus,
  Pill,
  FlaskConical,
  Eye,
  AlertTriangle,
  Loader2,
  Save,
  Check,
  Search,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  DoorOpen,
  Trash2,
  Calendar,
  Layers
} from "lucide-react";

export default function DoctorPanel() {
  const { setSelectedUhid } = usePortal();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [labCatalog, setLabCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeEmrTab, setActiveEmrTab] = useState<"consultation" | "history">("consultation");

  // Doctor status & Delay State
  const [doctorStatus, setDoctorStatus] = useState<string>("in_cabin");
  const [delayMinutes, setDelayMinutes] = useState<number>(0);
  const [delayReason, setDelayReason] = useState<string>("");
  const [cabinNumber, setCabinNumber] = useState<string>("Cabin 104");
  const [savingStatus, setSavingStatus] = useState(false);

  // Live In-Cabin Consultation Stopwatch
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Consultation form state
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [hpi, setHpi] = useState("");
  const [examination, setExamination] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [icd10, setIcd10] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  // Vitals
  const [vitals, setVitals] = useState({
    bp_systolic: 120,
    bp_diastolic: 80,
    heart_rate: 76,
    temperature: 98.6,
    spo2: 98,
    respiratory_rate: 18,
    weight_kg: 70,
  });

  // Prescriptions
  const [rxItems, setRxItems] = useState<any[]>([
    { medicine_name: "Augmentin 625 Duo", generic_name: "Amoxicillin + Clavulanate", dosage: "625mg", frequency: "1-0-1", timing: "After Food", duration_days: 5, quantity: 10, instructions: "After meals" }
  ]);
  const [generalAdvice, setGeneralAdvice] = useState("Drink plenty of warm fluids. Avoid cold and dusty environments.");
  const [selectedLabs, setSelectedLabs] = useState<string[]>([]);

  // Stopwatch interval
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const loadData = async () => {
    try {
      const [aptRes, labRes, docRes] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/lab?catalog=true"),
        fetch("/api/doctor-status?doctorId=3")
      ]);
      const aptJson = await aptRes.json();
      const labJson = await labRes.json();
      const docJson = await docRes.json();

      if (aptJson.success && aptJson.appointments) {
        setAppointments(aptJson.appointments);
        
        const active = aptJson.appointments.find((a: any) => a.status === "in_consultation");
        if (active) {
          selectPatient(active);
          if (active.consultation_start_time) {
            const elapsed = Math.max(0, Math.floor((Date.now() - new Date(active.consultation_start_time).getTime()) / 1000));
            setTimerSeconds(elapsed);
            setIsTimerRunning(true);
          }
        } else if (aptJson.appointments.length > 0 && !selectedApt) {
          selectPatient(aptJson.appointments[0]);
        }
      }

      if (labJson.success && labJson.tests) {
        setLabCatalog(labJson.tests);
      }

      if (docJson.success && docJson.doctors && docJson.doctors.length > 0) {
        const d = docJson.doctors[0];
        setDoctorStatus(d.status || "available");
        setDelayMinutes(d.delay_minutes || 0);
        setDelayReason(d.delay_reason || "");
        setCabinNumber(d.cabin_number || "Cabin 104");
      }
    } catch (err) {
      console.error("Failed to load doctor console:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectPatient = (apt: any) => {
    setSelectedApt(apt);
    setChiefComplaint(apt.chief_complaint || "Routine consultation");
    setDiagnosis("");
    setIcd10("");
    setTreatmentPlan("");
    setSelectedLabs([]);
    setSuccessMessage("");

    if (apt.status === "in_consultation" && apt.consultation_start_time) {
      const elapsed = Math.max(0, Math.floor((Date.now() - new Date(apt.consultation_start_time).getTime()) / 1000));
      setTimerSeconds(elapsed);
      setIsTimerRunning(true);
    } else {
      setTimerSeconds(0);
      setIsTimerRunning(false);
    }
  };

  const handleUpdateDoctorStatus = async (newStatus?: string, newDelay?: number) => {
    setSavingStatus(true);
    try {
      const statusToSave = newStatus !== undefined ? newStatus : doctorStatus;
      const delayToSave = newDelay !== undefined ? newDelay : delayMinutes;

      await fetch("/api/doctor-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: 3,
          status: statusToSave,
          delay_minutes: delayToSave,
          delay_reason: delayReason,
          cabin_number: cabinNumber,
        }),
      });

      setDoctorStatus(statusToSave);
      setDelayMinutes(delayToSave);
      await loadData();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleStartConsultation = async () => {
    if (!selectedApt) return;
    try {
      await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointment_id: selectedApt.id,
          action: "start_consultation",
          consultation_start_time: new Date().toISOString(),
        }),
      });

      setTimerSeconds(0);
      setIsTimerRunning(true);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleAddRxItem = () => {
    setRxItems([
      ...rxItems,
      { medicine_name: "Montair-LC", generic_name: "Montelukast + Levocetirizine", dosage: "1 Tab", frequency: "0-0-1", timing: "Bedtime", duration_days: 5, quantity: 5, instructions: "Night time" }
    ]);
  };

  const handleRemoveRxItem = (index: number) => {
    setRxItems(rxItems.filter((_, i) => i !== index));
  };

  const handleSaveConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApt || !diagnosis) {
      alert("Please enter clinical diagnosis");
      return;
    }

    setSubmitting(true);
    setSuccessMessage("");

    const durationMin = Math.max(1, Math.round((timerSeconds / 60) * 10) / 10);

    try {
      const res = await fetch("/api/emr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_uhid: selectedApt.patient_uhid,
          appointment_id: selectedApt.id,
          duration_minutes: durationMin,
          chief_complaint: chiefComplaint,
          history_present_illness: hpi,
          examination_findings: examination,
          diagnosis,
          icd10_code: icd10,
          treatment_plan: treatmentPlan,
          follow_up_date: followUpDate,
          vitals,
          prescription_items: rxItems,
          general_advice: generalAdvice,
          lab_test_ids: selectedLabs,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsTimerRunning(false);
        setSuccessMessage(`Encounter completed (${durationMin} min duration), Rx signed & LIS orders routed!`);
        await loadData();
      } else {
        alert(json.error || "Failed to save consultation");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Error saving consultation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#4A1F2B] dark:text-[#C08491] animate-spin mx-auto" />
        <p className="text-xs text-[#514346] dark:text-[#D5C2C5] font-medium">
          Loading Clinical EMR and OPD Consultation Queue...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* ─── DOCTOR CABIN LIVE STATUS & DELAY MANAGEMENT BAR ─── */}
      <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] p-3 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#4A1F2B] text-white flex items-center justify-center font-bold text-sm">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#1D1B1B] dark:text-[#FEF8F7]">
                Dr. Vikram Rao, MD (Senior Consultant)
              </span>
              <ClinicalBadge variant="brand">{cabinNumber}</ClinicalBadge>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#514346] dark:text-[#D5C2C5]">
              <span>Status: <strong className="capitalize text-[#4A1F2B] dark:text-[#C08491]">{doctorStatus.replace("_", " ")}</strong></span>
              {delayMinutes > 0 && (
                <span className="text-[#BA1A1A] font-bold">
                  (Delayed by +{delayMinutes}m · Broadcasted to OPD Display)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Live Stopwatch & Quick Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Active Consultation Stopwatch */}
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#FAF7F6] dark:bg-[#1F1924] border border-[#E3DFDB] dark:border-[#3B3041] tabular-nums">
            <Clock className={`w-3.5 h-3.5 ${isTimerRunning ? "text-[#3F6B52] animate-pulse" : "text-[#837376]"}`} />
            <div className="text-xs">
              <span className="text-[10px] uppercase text-[#837376] font-semibold block leading-tight">Session Time</span>
              <span className="font-mono font-bold text-sm text-[#1D1B1B] dark:text-[#FEF8F7]">
                {formatTime(timerSeconds)}
              </span>
            </div>
            {isTimerRunning ? (
              <button
                onClick={() => setIsTimerRunning(false)}
                className="p-1 rounded text-[#9A6A25] hover:bg-[#FAF4EB] transition-colors"
                title="Pause stopwatch"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setIsTimerRunning(true)}
                className="p-1 rounded text-[#3F6B52] hover:bg-[#EEF4F0] transition-colors"
                title="Start stopwatch"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Delay Controls */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-[#837376] font-semibold">Delay:</span>
            {[0, 15, 30].map((mins) => (
              <button
                key={mins}
                onClick={() => handleUpdateDoctorStatus(doctorStatus, mins)}
                className={`h-[26px] px-2 rounded text-[11px] font-semibold transition-colors ${
                  delayMinutes === mins
                    ? "bg-[#4A1F2B] text-white"
                    : "bg-[#F2EDEC] dark:bg-[#231D27] text-[#514346] hover:bg-[#EDE7E6]"
                }`}
              >
                {mins === 0 ? "On Time" : `+${mins}m`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 rounded-md bg-[#EEF4F0] dark:bg-[#1C2C22] border border-[#D4E3D9] dark:border-[#2C4A38] text-[#3F6B52] dark:text-[#7ADDB0] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ─── 2-COLUMN CLINICAL EMR WORKSPACE ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT COLUMN: OPD PATIENT QUEUE (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <ClinicalCard
            title={`OPD Queue (${appointments.length})`}
            subtitle="Today's booked tokens & consulting slots"
            icon={<Clock className="w-4 h-4 text-[#70404B]" />}
            noPadding
          >
            <div className="divide-y divide-[#E3DFDB] dark:divide-[#3B3041] max-h-[640px] overflow-y-auto">
              {appointments.map((apt) => {
                const isSelected = selectedApt?.id === apt.id;
                const isInConsultation = apt.status === "in_consultation";
                const isCompleted = apt.status === "completed";

                return (
                  <div
                    key={apt.id}
                    onClick={() => selectPatient(apt)}
                    className={`p-3 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#F3E9EB] dark:bg-[#32293D] border-l-4 border-[#4A1F2B] dark:border-[#C08491]"
                        : "hover:bg-[#FAF7F6] dark:hover:bg-[#201A25]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] text-[#4A1F2B] dark:text-[#C08491]">
                          {apt.token_number}
                        </span>
                        {apt.case_number && (
                          <span className="text-[10px] font-bold text-[#837376]">
                            Case #{apt.case_number}
                          </span>
                        )}
                      </div>
                      <ClinicalBadge
                        variant={
                          isInConsultation ? "critical" : isCompleted ? "success" : "neutral"
                        }
                        dot={isInConsultation}
                      >
                        {isInConsultation ? "IN CABIN" : apt.status.toUpperCase()}
                      </ClinicalBadge>
                    </div>

                    <div className="mt-1.5 flex items-baseline justify-between">
                      <h4 className="font-bold text-xs text-[#1D1B1B] dark:text-[#FEF8F7] truncate max-w-[170px]">
                        {apt.patient_name}
                      </h4>
                      <span className="text-[10px] text-[#837376] font-mono">{apt.patient_uhid}</span>
                    </div>

                    <p className="text-[11px] text-[#514346] dark:text-[#D5C2C5] truncate mt-0.5">
                      {apt.chief_complaint || "Consultation"}
                    </p>
                  </div>
                );
              })}
            </div>
          </ClinicalCard>
        </div>

        {/* RIGHT COLUMN: CLINICAL EMR CONSULTATION PAD (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedApt ? (
            <>
              {/* STITCH PATIENT HEADER DEMOGRAPHIC BAR WITH CRITICAL ALLERGY SHIELD */}
              <PatientHeaderBanner
                patient={{
                  uhid: selectedApt.patient_uhid,
                  full_name: selectedApt.patient_name,
                  age: selectedApt.age,
                  gender: selectedApt.gender,
                  blood_group: selectedApt.blood_group,
                  allergies: selectedApt.allergies,
                  mobile: selectedApt.mobile,
                  cabin_number: selectedApt.cabin_number || cabinNumber,
                  case_number: selectedApt.case_number,
                  doctor_name: "Dr. Vikram Rao",
                }}
                onViewDossier={() => setSelectedUhid(selectedApt.patient_uhid)}
              />

              {/* TABBED CLINICAL WORKSPACE NAVIGATION */}
              <div className="flex items-center gap-2 border-b border-[#E3DFDB] dark:border-[#3B3041] pb-2 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveEmrTab("consultation")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
                    activeEmrTab === "consultation"
                      ? "bg-[#4A1F2B] text-white shadow-xs"
                      : "text-[#514346] dark:text-[#D5C2C5] hover:bg-[#F2EDEC]"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Clinical Notes & Prescription</span>
                </button>
                {selectedApt.status !== "in_consultation" && selectedApt.status !== "completed" && (
                  <ClinicalButton
                    variant="primary"
                    size="sm"
                    onClick={handleStartConsultation}
                    icon={<Play className="w-3 h-3" />}
                    className="ml-auto"
                  >
                    Call Patient In Cabin
                  </ClinicalButton>
                )}
              </div>

              {/* CONSULTATION FORM PAD */}
              <form onSubmit={handleSaveConsultation} className="space-y-4">
                
                {/* 1. Vital Signs Cluster */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold uppercase text-[#837376] tracking-wider">
                      Current Vitals Readout
                    </span>
                    <span className="text-[10px] text-[#837376]">Synchronized with triage</span>
                  </div>
                  <VitalStrip vitals={vitals} />
                </div>

                {/* 2. Chief Complaint & History of Present Illness (HPI) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#514346] dark:text-[#D5C2C5]">
                      Chief Complaint *
                    </label>
                    <input
                      type="text"
                      required
                      value={chiefComplaint}
                      onChange={(e) => setChiefComplaint(e.target.value)}
                      placeholder="e.g. Acute chest pain, persistent cough x 4 days"
                      className="w-full h-8 px-3 rounded-md bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] text-xs text-[#1D1B1B] dark:text-[#FEF8F7] focus:outline-none focus:border-[#4A1F2B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#514346] dark:text-[#D5C2C5]">
                      History of Present Illness (HPI)
                    </label>
                    <input
                      type="text"
                      value={hpi}
                      onChange={(e) => setHpi(e.target.value)}
                      placeholder="Onset, character, aggravating / relieving factors..."
                      className="w-full h-8 px-3 rounded-md bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] text-xs text-[#1D1B1B] dark:text-[#FEF8F7] focus:outline-none focus:border-[#4A1F2B]"
                    />
                  </div>
                </div>

                {/* 3. Clinical Examination Findings */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#514346] dark:text-[#D5C2C5]">
                    Physical & Systemic Examination Findings
                  </label>
                  <textarea
                    rows={2}
                    value={examination}
                    onChange={(e) => setExamination(e.target.value)}
                    placeholder="Chest clear, S1/S2 heard, no pedal edema, abdomen soft non-tender..."
                    className="w-full p-2.5 rounded-md bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] text-xs text-[#1D1B1B] dark:text-[#FEF8F7] focus:outline-none focus:border-[#4A1F2B]"
                  />
                </div>

                {/* 4. ICD-10 Clinical Diagnosis */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-[#514346] dark:text-[#D5C2C5]">
                      Clinical Diagnosis *
                    </label>
                    <input
                      type="text"
                      required
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Acute Bronchitis / Essential Hypertension"
                      className="w-full h-8 px-3 rounded-md bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] text-xs font-semibold text-[#1D1B1B] dark:text-[#FEF8F7] focus:outline-none focus:border-[#4A1F2B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#514346] dark:text-[#D5C2C5]">
                      ICD-10 Code
                    </label>
                    <input
                      type="text"
                      value={icd10}
                      onChange={(e) => setIcd10(e.target.value)}
                      placeholder="e.g. J20.9 / I10"
                      className="w-full h-8 px-3 rounded-md bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] text-xs font-mono font-bold text-[#4A1F2B] dark:text-[#C08491] focus:outline-none focus:border-[#4A1F2B]"
                    />
                  </div>
                </div>

                {/* 5. Treatment Plan & Rx Items Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-xs uppercase text-[#1D1B1B] dark:text-[#FEF8F7] tracking-wider">
                      Prescribed Medicines (Rx)
                    </span>
                    <button
                      type="button"
                      onClick={handleAddRxItem}
                      className="h-[24px] px-2 rounded bg-[#F3E9EB] dark:bg-[#32293D] text-[#4A1F2B] dark:text-[#F7B5C3] font-semibold text-[11px] hover:opacity-90 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Drug
                    </button>
                  </div>

                  <div className="border border-[#E3DFDB] dark:border-[#3B3041] rounded-md overflow-hidden bg-white dark:bg-[#241D29]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF7F6] dark:bg-[#1F1924] text-[10px] uppercase font-bold text-[#837376] border-b border-[#E3DFDB] dark:border-[#3B3041]">
                        <tr>
                          <th className="p-2">Medicine / Brand</th>
                          <th className="p-2">Dosage</th>
                          <th className="p-2">Frequency</th>
                          <th className="p-2">Timing</th>
                          <th className="p-2 text-center">Days</th>
                          <th className="p-2 text-center">Qty</th>
                          <th className="p-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E3DFDB] dark:divide-[#3B3041] font-medium">
                        {rxItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-[#FAF7F6] dark:hover:bg-[#201A25]">
                            <td className="p-2">
                              <input
                                type="text"
                                value={item.medicine_name}
                                onChange={(e) => {
                                  const updated = [...rxItems];
                                  updated[idx].medicine_name = e.target.value;
                                  setRxItems(updated);
                                }}
                                className="w-full h-7 px-2 rounded border border-[#E3DFDB] dark:border-[#3B3041] bg-transparent text-xs font-semibold focus:outline-none"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={item.dosage}
                                onChange={(e) => {
                                  const updated = [...rxItems];
                                  updated[idx].dosage = e.target.value;
                                  setRxItems(updated);
                                }}
                                className="w-16 h-7 px-2 rounded border border-[#E3DFDB] dark:border-[#3B3041] bg-transparent text-xs focus:outline-none"
                              />
                            </td>
                            <td className="p-2">
                              <select
                                value={item.frequency}
                                onChange={(e) => {
                                  const updated = [...rxItems];
                                  updated[idx].frequency = e.target.value;
                                  setRxItems(updated);
                                }}
                                className="h-7 px-1.5 rounded border border-[#E3DFDB] dark:border-[#3B3041] bg-transparent text-xs focus:outline-none"
                              >
                                <option value="1-0-1">1-0-1 (BID)</option>
                                <option value="1-1-1">1-1-1 (TID)</option>
                                <option value="1-0-0">1-0-0 (Morning)</option>
                                <option value="0-0-1">0-0-1 (Bedtime)</option>
                                <option value="SOS">SOS (As needed)</option>
                              </select>
                            </td>
                            <td className="p-2">
                              <select
                                value={item.timing}
                                onChange={(e) => {
                                  const updated = [...rxItems];
                                  updated[idx].timing = e.target.value;
                                  setRxItems(updated);
                                }}
                                className="h-7 px-1.5 rounded border border-[#E3DFDB] dark:border-[#3B3041] bg-transparent text-xs focus:outline-none"
                              >
                                <option value="After Food">After Food</option>
                                <option value="Before Food">Before Food</option>
                                <option value="Bedtime">Bedtime</option>
                                <option value="With Food">With Food</option>
                              </select>
                            </td>
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                value={item.duration_days}
                                onChange={(e) => {
                                  const updated = [...rxItems];
                                  updated[idx].duration_days = parseInt(e.target.value) || 1;
                                  setRxItems(updated);
                                }}
                                className="w-12 h-7 px-1 text-center rounded border border-[#E3DFDB] dark:border-[#3B3041] bg-transparent text-xs focus:outline-none"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const updated = [...rxItems];
                                  updated[idx].quantity = parseInt(e.target.value) || 1;
                                  setRxItems(updated);
                                }}
                                className="w-12 h-7 px-1 text-center rounded border border-[#E3DFDB] dark:border-[#3B3041] bg-transparent text-xs focus:outline-none"
                              />
                            </td>
                            <td className="p-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveRxItem(idx)}
                                className="p-1 rounded text-[#837376] hover:text-[#BA1A1A] transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 6. Diagnostic Orders Requisition */}
                {labCatalog.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#514346] dark:text-[#D5C2C5] flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5 text-[#70404B]" />
                      <span>Order Laboratory Diagnostic Investigations (LIS)</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {labCatalog.slice(0, 8).map((t) => {
                        const isChecked = selectedLabs.includes(t.id);
                        return (
                          <label
                            key={t.id}
                            className={`p-2 rounded-md border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                              isChecked
                                ? "bg-[#F3E9EB] dark:bg-[#32293D] border-[#4A1F2B] text-[#4A1F2B] font-bold"
                                : "bg-white dark:bg-[#241D29] border-[#E3DFDB] dark:border-[#3B3041] text-[#514346]"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.value) {
                                  setSelectedLabs(
                                    isChecked
                                      ? selectedLabs.filter((id) => id !== t.id)
                                      : [...selectedLabs, t.id]
                                  );
                                }
                              }}
                              className="w-3.5 h-3.5 accent-[#4A1F2B]"
                            />
                            <span className="truncate">{t.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Submit Commits Bar */}
                <div className="pt-2 flex items-center justify-between border-t border-[#E3DFDB] dark:border-[#3B3041]">
                  <div className="text-xs text-[#837376]">
                    Session: <strong className="font-mono text-[#1D1B1B] dark:text-[#FEF8F7]">{formatTime(timerSeconds)}</strong>
                  </div>
                  <ClinicalButton
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={submitting}
                    icon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  >
                    {submitting ? "Signing Consultation..." : "Finalize & Sign Clinical Encounter"}
                  </ClinicalButton>
                </div>

              </form>
            </>
          ) : (
            <div className="py-24 text-center text-xs text-[#837376] bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-6">
              Select a patient from the OPD Queue on the left to begin clinical consultation.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
