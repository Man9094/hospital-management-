"use client";

import React, { useState, useEffect } from "react";
import { usePortal } from "@/context/PortalContext";
import {
  Heart,
  Calendar,
  FileText,
  Download,
  CreditCard,
  Video,
  CheckCircle2,
  Clock,
  Pill,
  FlaskConical,
  ShieldCheck,
  Eye,
  Loader2,
  AlertTriangle,
  Monitor,
  DoorOpen,
  Sparkles,
  ArrowRight,
  Activity,
  Users,
  Timer
} from "lucide-react";

export default function PatientPanel() {
  const { setSelectedUhid } = usePortal();
  const patientUhid = "MC-2026-000106"; // Default demo patient Alexander Vance
  const [data, setData] = useState<any>(null);
  const [doctorStatusData, setDoctorStatusData] = useState<any[]>([]);
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatientData() {
      setLoading(true);
      try {
        const [pRes, dRes, aRes] = await Promise.all([
          fetch(`/api/patients/${patientUhid}`),
          fetch("/api/doctor-status"),
          fetch("/api/appointments")
        ]);
        const json = await pRes.json();
        const dJson = await dRes.json();
        const aJson = await aRes.json();

        if (json.success) setData(json);
        if (dJson.success) setDoctorStatusData(dJson.doctors || []);
        if (aJson.success) setAllAppointments(aJson.appointments || []);
      } catch (err) {
        console.error("Failed to load patient portal:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPatientData();
  }, [patientUhid]);

  const patient = data?.patient;
  const activeAppointment = data?.appointments && data.appointments.length > 0 ? data.appointments[0] : null;

  // Find attending doctor status
  const attendingDoc = doctorStatusData.find((d) => d.doctor_id === activeAppointment?.doctor_id);
  const isDocLate = attendingDoc?.delay_minutes > 0;
  const isCurrentInCabin = activeAppointment?.status === "in_consultation";

  // Calculate doctor's average duration & queue position
  const docAppointments = allAppointments.filter((a) => a.doctor_id === activeAppointment?.doctor_id);
  const completedApts = docAppointments.filter((a) => a.status === "completed" && a.duration_minutes > 0);
  const avgDuration =
    completedApts.length > 0
      ? (completedApts.reduce((acc, curr) => acc + curr.duration_minutes, 0) / completedApts.length).toFixed(1)
      : "12.0";

  // Calculate patients ahead
  const currentCaseNum = activeAppointment?.case_number || 1;
  const patientsAhead = docAppointments.filter(
    (a) => a.status === "waiting" && (a.case_number || 0) < currentCaseNum
  ).length;

  return (
    <div className="space-y-6">
      
      {/* Title / Passport Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#1D2A4D] via-[#0F365F] to-[#13C5DD] text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl font-bold">
            {patient?.full_name ? patient.full_name.charAt(0) : "A"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold font-poppins">{patient?.full_name || "Alexander Vance"}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-extrabold text-xs">
                {patientUhid}
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1">
              ABHA ID: <strong className="text-cyan-200">{patient?.abha_id || "91-3312-9988-1144"}</strong> • Blood Group: {patient?.blood_group || "O+"} • Allergy: {patient?.allergies || "Penicillin"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedUhid(patientUhid)}
            className="px-4 py-2.5 rounded-xl bg-white text-[#1D2A4D] text-xs font-black uppercase shadow-md flex items-center gap-1.5 hover:bg-slate-100 transition-colors"
          >
            <Eye className="w-4 h-4 text-[#13C5DD]" /> View Health Dossier
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#13C5DD] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Loading your encrypted health passport & live queue status...</p>
        </div>
      ) : (
        <div className="space-y-6">

          {/* LIVE OPD APPOINTMENT, CABIN STATUS & DOCTOR DELAY TRACKER */}
          {activeAppointment ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border-2 border-[#13C5DD]/50 shadow-2xl space-y-5">
              
              {/* Header with Live Pulse */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-black uppercase text-[#13C5DD] tracking-wider">
                    LIVE OPD CASE STATUS & DOCTOR CABIN TRACKER
                  </span>
                </div>
                <a
                  href="#opd-board"
                  className="px-3.5 py-1.5 rounded-xl bg-[#13C5DD]/15 text-[#13C5DD] text-xs font-extrabold flex items-center gap-1.5 hover:bg-[#13C5DD]/25 transition-colors self-start sm:self-auto"
                >
                  <Monitor className="w-4 h-4" /> Open Full Waiting Screen
                </a>
              </div>

              {/* Doctor Delay Alert Banner (If Doctor is running late) */}
              {isDocLate && (
                <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-pulse">
                  <div className="flex items-start sm:items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
                    <div>
                      <div className="font-black text-sm text-amber-600 dark:text-amber-400">
                        DOCTOR DELAY NOTICE: {attendingDoc.doctor_name} is running +{attendingDoc.delay_minutes} mins late
                      </div>
                      <div className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                        Reason: {attendingDoc.delay_reason || "Attending Emergency Rounds"}. All queue slots have been adjusted.
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-900 text-[11px] font-black shrink-0 self-start sm:self-auto">
                    DELAY ACTIVE: +{attendingDoc.delay_minutes} MINS
                  </span>
                </div>
              )}

              {/* 4-Column Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Your Assigned Case Slot */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#13C5DD]" /> Your Assigned Case Slot
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="px-3 py-1.5 rounded-xl bg-[#13C5DD] text-[#1D2A4D] font-black text-lg font-poppins shadow-sm">
                      CASE #{activeAppointment.case_number || 1}
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Token {activeAppointment.token_number}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Slot: {activeAppointment.slot_time}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Doctor & Cabin Location */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
                    <DoorOpen className="w-3.5 h-3.5 text-purple-500" /> Doctor & Cabin Room
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {activeAppointment.doctor_name}
                    </div>
                    <div className="text-[11px] font-extrabold text-[#13C5DD]">
                      {attendingDoc?.cabin_number || activeAppointment.cabin_number || "Cabin 104"} • {activeAppointment.department_name}
                    </div>
                  </div>
                </div>

                {/* 3. Doctor Consultation Time Metric */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5 text-blue-500" /> Time per Patient
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      ~{avgDuration} mins / patient
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Average consultation pace today
                    </div>
                  </div>
                </div>

                {/* 4. Current In-Cabin Status */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" /> Now Inside Doctor Cabin
                  </div>
                  {isCurrentInCabin ? (
                    <div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-900 font-black text-xs inline-block animate-bounce">
                        ● YOUR CASE IS IN CABIN!
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">Consultation currently active.</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        Serving Case #{attendingDoc?.active_case_number || 1}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {patientsAhead > 0 ? `${patientsAhead} patient(s) ahead of you` : "You are next in line!"}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Progress Flow */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                  <span>CONSULTATION FLOW</span>
                  <span>
                    Status: <strong className="text-emerald-500 uppercase">{isCurrentInCabin ? "In Cabin" : activeAppointment.status}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-extrabold">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                    ✓ 1. Token Issued
                  </div>
                  <div className={`p-2 rounded-xl border ${
                    activeAppointment.status !== "scheduled" ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                  }`}>
                    ✓ 2. In Waiting Lounge
                  </div>
                  <div className={`p-2 rounded-xl border ${
                    isCurrentInCabin ? "bg-[#13C5DD] text-[#1D2A4D] font-black animate-pulse shadow-md" : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                  }`}>
                    3. Doctor Cabin
                  </div>
                  <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700">
                    4. Pharmacy & Rx
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              No active OPD appointment found for today.
            </div>
          )}

          {/* Clinical Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Active Appointment Summary */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Appointment Overview</span>
                <Calendar className="w-4 h-4 text-[#13C5DD]" />
              </div>
              {activeAppointment ? (
                <div className="space-y-1">
                  <div className="text-base font-extrabold text-slate-900 dark:text-white">
                    {activeAppointment.doctor_name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {activeAppointment.department_name} • Token #{activeAppointment.token_number} (Case #{activeAppointment.case_number || 1})
                  </div>
                  <div className="text-xs font-bold text-[#13C5DD] pt-1">
                    Slot Time: {activeAppointment.appointment_date} ({activeAppointment.slot_time})
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400">No active appointments.</div>
              )}
              <a
                href="#opd-board"
                className="w-full py-2.5 rounded-xl bg-[#13C5DD] text-[#1D2A4D] text-xs font-black uppercase shadow-md flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-4 h-4" /> Live OPD Display Screen
              </a>
            </div>

            {/* Card 2: Lab Diagnostics Reports */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Verified Lab Reports</span>
                <FlaskConical className="w-4 h-4 text-emerald-500" />
              </div>
              {data?.labOrders && data.labOrders.length > 0 ? (
                <div className="space-y-1">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {data.labOrders[0].test_name}
                  </div>
                  <div className="text-xs text-slate-400">
                    Status: <span className="text-emerald-500 font-bold">● {data.labOrders[0].status.toUpperCase()}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 pt-1">
                    Result: {data.labOrders[0].result_value || "Processing"}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400">No lab reports on file.</div>
              )}
              <button
                onClick={() => setSelectedUhid(patientUhid)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-extrabold uppercase flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
              >
                <Download className="w-4 h-4" /> View Verified PDF Report
              </button>
            </div>

            {/* Card 3: Active Prescription */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Active E-Prescription</span>
                <Pill className="w-4 h-4 text-purple-500" />
              </div>
              {data?.prescriptions && data.prescriptions.length > 0 ? (
                <div className="space-y-1">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {data.prescriptions[0].rx_number}
                  </div>
                  <div className="text-xs text-slate-400">
                    {data.prescriptions[0].items?.length || 3} Medications Prescribed
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                    Pharmacy Status: Ready for Collection
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400">No active prescriptions.</div>
              )}
              <button
                onClick={() => setSelectedUhid(patientUhid)}
                className="w-full py-2.5 rounded-xl bg-[#0F6CBD] text-white text-xs font-black uppercase shadow-md flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" /> View Digital Prescription
              </button>
            </div>

          </div>

          {/* Security Privacy Notice */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Your medical data is encrypted with AES-256 and accessible only by you and your authorized attending doctors.</span>
          </div>

        </div>
      )}

    </div>
  );
}
