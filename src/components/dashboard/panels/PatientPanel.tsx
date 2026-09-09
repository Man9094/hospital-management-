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
  Loader2
} from "lucide-react";

export default function PatientPanel() {
  const { setSelectedUhid } = usePortal();
  const patientUhid = "MC-2026-000106"; // Default demo patient Alexander Vance
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatientData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/patients/${patientUhid}`);
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load patient portal:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPatientData();
  }, [patientUhid]);

  const patient = data?.patient;

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
            <Eye className="w-4 h-4 text-[#13C5DD]" /> View Complete Health Dossier
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#13C5DD] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Loading your encrypted health passport...</p>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Active Appointment */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Scheduled Appointment</span>
              <Calendar className="w-4 h-4 text-[#13C5DD]" />
            </div>
            {data?.appointments && data.appointments.length > 0 ? (
              <div className="space-y-1">
                <div className="text-base font-extrabold text-slate-900 dark:text-white">
                  {data.appointments[0].doctor_name}
                </div>
                <div className="text-xs text-slate-400">
                  {data.appointments[0].department_name} • Token #{data.appointments[0].token_number}
                </div>
                <div className="text-xs font-bold text-[#13C5DD] pt-1">
                  Time: {data.appointments[0].appointment_date} ({data.appointments[0].slot_time})
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">No active appointments.</div>
            )}
            <button
              onClick={() => setSelectedUhid(patientUhid)}
              className="w-full py-2.5 rounded-xl bg-[#13C5DD] text-[#1D2A4D] text-xs font-black uppercase shadow-md flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" /> Check OPD Queue Status
            </button>
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
      )}

      {/* Security Privacy Notice */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>Your medical data is encrypted with AES-256 and accessible only by you and your authorized attending doctors.</span>
      </div>

    </div>
  );
}
