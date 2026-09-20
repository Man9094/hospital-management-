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
          fetch("/api/appointments"),
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

  const attendingDoc = doctorStatusData.find((d) => d.doctor_id === activeAppointment?.doctor_id);
  const isDocLate = attendingDoc?.delay_minutes > 0;
  const isCurrentInCabin = activeAppointment?.status === "in_consultation";

  const docAppointments = allAppointments.filter((a) => a.doctor_id === activeAppointment?.doctor_id);
  const completedApts = docAppointments.filter((a) => a.status === "completed" && a.duration_minutes > 0);
  const avgDuration =
    completedApts.length > 0
      ? (completedApts.reduce((acc, curr) => acc + curr.duration_minutes, 0) / completedApts.length).toFixed(1)
      : "12.0";

  const currentCaseNum = activeAppointment?.case_number || 1;
  const patientsAhead = docAppointments.filter(
    (a) => a.status === "waiting" && (a.case_number || 0) < currentCaseNum
  ).length;

  return (
    <div className="space-y-4">
      {/* Title / Passport Header */}
      <div className="bg-[#4A1F2B] text-white rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white text-xl font-bold shadow-xs">
            {patient?.full_name ? patient.full_name.charAt(0) : "A"}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-white">{patient?.full_name || "Alexander Vance"}</h1>
              <span className="px-2 py-0.5 rounded bg-white/15 text-[#F7B5C3] font-mono font-bold text-xs">
                {patientUhid}
              </span>
            </div>
            <p className="text-xs text-[#EDE7E6] mt-1">
              ABHA ID: <strong className="text-[#F7B5C3]">{patient?.abha_id || "91-3312-9988-1144"}</strong> · Blood Group: {patient?.blood_group || "O+"} · Allergy: <strong className="text-[#FFDAD6]">{patient?.allergies || "Penicillin"}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedUhid(patientUhid)}
            className="px-3.5 py-1.5 rounded-lg bg-white text-[#4A1F2B] text-xs font-semibold shadow-xs flex items-center gap-1.5 hover:bg-[#F8F2F2] transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#4A1F2B]" />
            <span>Health Dossier</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-2 bg-white dark:bg-[#241D29] rounded-lg border border-[#E3DFDB] dark:border-[#3B3041]">
          <Loader2 className="w-7 h-7 text-[#4A1F2B] dark:text-[#C08491] animate-spin mx-auto" />
          <p className="text-xs text-[#837376]">Loading encrypted health passport &amp; live queue status...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* LIVE OPD APPOINTMENT TRACKER */}
          {activeAppointment ? (
            <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-5 shadow-xs space-y-4">
              {/* Header with Live Pulse */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D] gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3F6B52] animate-pulse" />
                  <span className="text-xs font-bold uppercase text-[#4A1F2B] dark:text-[#F7B5C3] tracking-wider">
                    LIVE OPD CASE STATUS &amp; DOCTOR CABIN TRACKER
                  </span>
                </div>
                <a
                  href="#opd-board"
                  className="px-2.5 py-1 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#E7E1E1] transition-colors"
                >
                  <Monitor className="w-3.5 h-3.5 text-[#83505B] dark:text-[#C08491]" />
                  <span>Open Full Board</span>
                </a>
              </div>

              {/* Doctor Delay Alert Banner */}
              {isDocLate && (
                <div className="p-3 rounded-lg bg-[#9A6A25]/15 border border-[#9A6A25]/30 text-[#9A6A25] dark:text-[#E8BD68] text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#9A6A25] shrink-0" />
                    <div>
                      <div className="font-bold">
                        DOCTOR DELAY NOTICE: {attendingDoc.doctor_name} is running +{attendingDoc.delay_minutes} mins late
                      </div>
                      <div className="text-[11px] text-[#837376] mt-0.5">
                        Reason: {attendingDoc.delay_reason || "Attending Emergency Rounds"}. All queue slots adjusted.
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#9A6A25] text-white text-[10px] font-bold shrink-0">
                    DELAY ACTIVE: +{attendingDoc.delay_minutes} MINS
                  </span>
                </div>
              )}

              {/* 4-Column Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Assigned Slot */}
                <div className="p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] space-y-1">
                  <div className="text-[10px] font-semibold uppercase text-[#837376]">Your Assigned Case Slot</div>
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 rounded bg-[#4A1F2B] text-white font-bold text-base">
                      #{activeAppointment.case_number || 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1D1B1B] dark:text-white">
                        Token {activeAppointment.token_number}
                      </div>
                      <div className="text-[10px] text-[#837376]">
                        Slot: {activeAppointment.slot_time}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Cabin Location */}
                <div className="p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] space-y-1">
                  <div className="text-[10px] font-semibold uppercase text-[#837376]">Doctor &amp; Cabin</div>
                  <div>
                    <div className="text-xs font-bold text-[#1D1B1B] dark:text-white truncate">
                      {activeAppointment.doctor_name}
                    </div>
                    <div className="text-[11px] font-semibold text-[#83505B] dark:text-[#C08491]">
                      {attendingDoc?.cabin_number || activeAppointment.cabin_number || "Cabin 104"} · {activeAppointment.department_name}
                    </div>
                  </div>
                </div>

                {/* 3. Time Metric */}
                <div className="p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] space-y-1">
                  <div className="text-[10px] font-semibold uppercase text-[#837376]">Pace per Patient</div>
                  <div>
                    <div className="text-xs font-bold text-[#1D1B1B] dark:text-white tabular-nums">
                      ~{avgDuration} mins / patient
                    </div>
                    <div className="text-[10px] text-[#837376]">
                      Average consultation pace today
                    </div>
                  </div>
                </div>

                {/* 4. Current Status */}
                <div className="p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] space-y-1">
                  <div className="text-[10px] font-semibold uppercase text-[#837376]">Now Inside Cabin</div>
                  {isCurrentInCabin ? (
                    <div>
                      <span className="px-2 py-0.5 rounded bg-[#3F6B52] text-white font-bold text-[11px] inline-block">
                        ● YOUR CASE IS IN CABIN!
                      </span>
                      <div className="text-[10px] text-[#837376] mt-0.5">Consultation active now.</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs font-bold text-[#3F6B52]">
                        Serving Case #{attendingDoc?.active_case_number || 1}
                      </div>
                      <div className="text-[10px] text-[#837376]">
                        {patientsAhead > 0 ? `${patientsAhead} patient(s) ahead of you` : "You are next in line!"}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Flow */}
              <div className="p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-semibold text-[#837376] uppercase">
                  <span>Consultation Workflow</span>
                  <span>
                    Status: <strong className="text-[#3F6B52] uppercase">{isCurrentInCabin ? "In Cabin" : activeAppointment.status}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                  <div className="p-1.5 rounded bg-[#3F6B52]/15 text-[#3F6B52] border border-[#3F6B52]/30">
                    ✓ 1. Token Issued
                  </div>
                  <div className={`p-1.5 rounded border ${
                    activeAppointment.status !== "scheduled" ? "bg-[#3F6B52]/15 text-[#3F6B52] border-[#3F6B52]/30" : "bg-white dark:bg-[#241D29] text-[#837376]"
                  }`}>
                    ✓ 2. Waiting Lounge
                  </div>
                  <div className={`p-1.5 rounded border ${
                    isCurrentInCabin ? "bg-[#4A1F2B] text-white font-bold shadow-xs" : "bg-white dark:bg-[#241D29] text-[#837376]"
                  }`}>
                    3. Doctor Cabin
                  </div>
                  <div className="p-1.5 rounded bg-white dark:bg-[#241D29] text-[#837376] border border-[#EDE7E6] dark:border-[#32293D]">
                    4. Pharmacy &amp; Rx
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] text-center text-xs text-[#837376]">
              No active OPD appointment found for today.
            </div>
          )}

          {/* Clinical Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Active Appointment Summary */}
            <div className="p-4 rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#837376] uppercase tracking-wider">Appointment Overview</span>
                <Calendar className="w-4 h-4 text-[#83505B] dark:text-[#C08491]" />
              </div>
              {activeAppointment ? (
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#1D1B1B] dark:text-white">
                    {activeAppointment.doctor_name}
                  </div>
                  <div className="text-xs text-[#837376]">
                    {activeAppointment.department_name} · Token #{activeAppointment.token_number}
                  </div>
                  <div className="text-xs font-semibold text-[#83505B] dark:text-[#C08491] pt-1">
                    Slot Time: {activeAppointment.appointment_date} ({activeAppointment.slot_time})
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#837376]">No active appointments.</div>
              )}
              <a
                href="#opd-board"
                className="w-full py-2 rounded bg-[#4A1F2B] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#70404B] transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" /> Live OPD Board
              </a>
            </div>

            {/* Card 2: Lab Diagnostics Reports */}
            <div className="p-4 rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#837376] uppercase tracking-wider">Verified Lab Reports</span>
                <FlaskConical className="w-4 h-4 text-[#3F6B52]" />
              </div>
              {data?.labOrders && data.labOrders.length > 0 ? (
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#1D1B1B] dark:text-white">
                    {data.labOrders[0].test_name}
                  </div>
                  <div className="text-xs text-[#837376]">
                    Status: <span className="text-[#3F6B52] font-semibold">● {data.labOrders[0].status.toUpperCase()}</span>
                  </div>
                  <div className="text-xs font-semibold text-[#1D1B1B] dark:text-white pt-1">
                    Result: {data.labOrders[0].result_value || "Processing"}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#837376]">No lab reports on file.</div>
              )}
              <button
                onClick={() => setSelectedUhid(patientUhid)}
                className="w-full py-2 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#E7E1E1] transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> View Diagnostic Dossier
              </button>
            </div>

            {/* Card 3: Active Prescription */}
            <div className="p-4 rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#837376] uppercase tracking-wider">Active E-Prescription</span>
                <Pill className="w-4 h-4 text-[#83505B] dark:text-[#C08491]" />
              </div>
              {data?.prescriptions && data.prescriptions.length > 0 ? (
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#1D1B1B] dark:text-white">
                    {data.prescriptions[0].rx_number}
                  </div>
                  <div className="text-xs text-[#837376]">
                    {data.prescriptions[0].items?.length || 3} Medications Prescribed
                  </div>
                  <div className="text-xs text-[#3F6B52] font-semibold pt-1">
                    Status: Ready for Collection
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#837376]">No active prescriptions.</div>
              )}
              <button
                onClick={() => setSelectedUhid(patientUhid)}
                className="w-full py-2 rounded bg-[#4A1F2B] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#70404B] transition-colors"
              >
                <FileText className="w-3.5 h-3.5" /> View Digital Prescription
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs text-[#837376] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#3F6B52] shrink-0" />
            <span>Health records protected by ABDM Ayushman Bharat digital security standards and role-based clinical isolation.</span>
          </div>
        </div>
      )}
    </div>
  );
}
