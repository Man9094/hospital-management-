"use client";

import React, { useState, useEffect } from "react";
import PortalLayout from "@/components/dashboard/PortalLayout";
import { usePortal } from "@/context/PortalContext";
import { useAuth } from "@/context/AuthContext";
import SuperAdminPanel from "@/components/dashboard/panels/SuperAdminPanel";
import HospitalAdminPanel from "@/components/dashboard/panels/HospitalAdminPanel";
import DoctorPanel from "@/components/dashboard/panels/DoctorPanel";
import PatientPanel from "@/components/dashboard/panels/PatientPanel";
import ReceptionPanel from "@/components/dashboard/panels/ReceptionPanel";
import LabPanel from "@/components/dashboard/panels/LabPanel";
import PharmacyPanel from "@/components/dashboard/panels/PharmacyPanel";
import OPDWaitingBoard from "@/components/dashboard/OPDWaitingBoard";
import {
  Calendar,
  Users,
  Bed,
  FlaskConical,
  Pill,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  FileText,
  TrendingUp,
  Download,
  AlertTriangle,
  Loader2,
  Stethoscope,
  Heart,
  Eye,
  Activity,
  QrCode,
  Sparkles
} from "lucide-react";

export default function SaaSAppPage() {
  const { activeRole, setSelectedUhid } = usePortal();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const handleHash = () => {
      setHash(window.location.hash || "");
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#13C5DD] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Authenticating MedCore Hospital Workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PortalLayout>
      {/* Route according to URL Hash Anchor */}
      {hash === "" && (
        <>
          {activeRole === "super_admin" && <SuperAdminPanel />}
          {activeRole === "hospital_admin" && <HospitalAdminPanel />}
          {activeRole === "doctor" && <DoctorPanel />}
          {activeRole === "nurse" && <NursingStationView />}
          {activeRole === "patient" && <PatientPanel />}
          {activeRole === "reception" && <ReceptionPanel />}
          {activeRole === "lab" && <LabPanel />}
          {activeRole === "radiology" && <RadiologyView />}
          {activeRole === "pharmacist" && <PharmacyPanel />}
          {activeRole === "billing" && <BillingClaimsView />}
        </>
      )}

      {/* #opd-board: Fullscreen Digital Signage OPD Waiting Display */}
      {hash === "#opd-board" && <OPDWaitingBoard />}

      {/* #patients: Full Patient & UHID Directory */}
      {hash === "#patients" && <PatientDirectoryView />}

      {/* #appointments: OPD Appointments Queue */}
      {hash === "#appointments" && <ReceptionPanel />}

      {/* #emr: Clinical Doctor EMR */}
      {hash === "#emr" && <DoctorPanel />}

      {/* #beds: IPD Bed Status Matrix */}
      {hash === "#beds" && <HospitalAdminPanel />}

      {/* #nursing: Nursing Station */}
      {hash === "#nursing" && <NursingStationView />}

      {/* #emergency: Emergency ER Command Center */}
      {hash === "#emergency" && <EmergencyCommandView />}

      {/* #lab: Laboratory LIS */}
      {hash === "#lab" && <LabPanel />}

      {/* #radiology: Radiology RIS */}
      {hash === "#radiology" && <RadiologyView />}

      {/* #pharmacy: Pharmacy POS & FEFO */}
      {hash === "#pharmacy" && <PharmacyPanel />}

      {/* #billing: Billing & TPA Claims */}
      {hash === "#billing" && <BillingClaimsView />}

      {/* #security: Security & Audit Logs */}
      {hash === "#security" && <SuperAdminPanel />}
    </PortalLayout>
  );
}

// ─────────────────────────────────────────────────────────────
// VIEW 1: Patient Directory & UHID Explorer
// ─────────────────────────────────────────────────────────────
function PatientDirectoryView() {
  const { setSelectedUhid } = usePortal();
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      setLoading(true);
      try {
        const res = await fetch(`/api/patients${search ? `?query=${search}` : ''}`);
        const json = await res.json();
        if (json.success) setPatients(json.patients);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4" /> CENTRAL PATIENT MASTER DIRECTORY
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
            Unique Hospital Identification (UHID) & ABHA Records
          </h1>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by UHID, Name, Mobile (+91), or ABHA ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
          />
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-6 h-6 text-[#13C5DD] animate-spin mx-auto" />
          </div>
        ) : patients.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">No patients found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-extrabold uppercase">
                <tr>
                  <th className="p-3">UHID</th>
                  <th className="p-3">Patient Name</th>
                  <th className="p-3">Age / Gender</th>
                  <th className="p-3">Contact & ABHA</th>
                  <th className="p-3">Blood / Allergies</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {patients.map((p) => (
                  <tr key={p.uhid} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-mono font-extrabold text-[#13C5DD]">{p.uhid}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{p.full_name}</td>
                    <td className="p-3">{p.age} Yrs • {p.gender}</td>
                    <td className="p-3">
                      <div>{p.mobile}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ABHA: {p.abha_id || "None"}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-red-500">{p.blood_group}</span>
                      {p.allergies && <span className="block text-[10px] text-amber-500 font-bold truncate max-w-[120px]">Allergy: {p.allergies}</span>}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === "inpatient" ? "bg-red-500/15 text-red-500" : "bg-emerald-500/15 text-emerald-500"
                      }`}>
                        ● {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedUhid(p.uhid)}
                        className="px-3 py-1.5 rounded-xl bg-[#13C5DD]/15 text-[#13C5DD] font-extrabold text-xs hover:bg-[#13C5DD]/25 transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Full Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// VIEW 2: Nursing Station & Inpatient Vitals Monitoring
// ─────────────────────────────────────────────────────────────
function NursingStationView() {
  const { setSelectedUhid } = usePortal();
  const [inpatients, setInpatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordingUhid, setRecordingUhid] = useState<string | null>(null);
  const [nurseNotes, setNurseNotes] = useState("");
  const [vitals, setVitals] = useState({ bp_systolic: 120, bp_diastolic: 80, heart_rate: 76, temperature: 98.6, spo2: 98 });
  const [submitting, setSubmitting] = useState(false);

  const loadNursingData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/nursing");
      const json = await res.json();
      if (json.success) setInpatients(json.inpatients || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNursingData();
  }, []);

  const handleSaveNurseNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordingUhid || !nurseNotes) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/nursing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_uhid: recordingUhid,
          shift: "Morning",
          notes: nurseNotes,
          vitals,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setRecordingUhid(null);
        setNurseNotes("");
        loadNursingData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-4 h-4" /> NURSING STATION & WARD ROSTER
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
            Inpatient Vitals Monitoring, IV Infusions & Medication Rounds
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inpatients.map((pat) => (
          <div
            key={pat.admission_id}
            className="p-5 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{pat.patient_name}</h3>
                <div className="text-xs text-slate-400">{pat.patient_uhid} • Age {pat.patient_age}</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#13C5DD]/15 text-[#13C5DD] text-xs font-black">
                {pat.bed_number}
              </span>
            </div>

            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
              <div><strong>Ward:</strong> {pat.ward_name} ({pat.ward_type})</div>
              <div><strong>Primary Doctor:</strong> {pat.doctor_name}</div>
              <div><strong>Diagnosis:</strong> {pat.initial_diagnosis}</div>
              {pat.allergies && (
                <div className="text-red-500 font-bold">⚠️ Allergies: {pat.allergies}</div>
              )}
            </div>

            {/* Latest Vitals Bar */}
            {pat.latest_vitals && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold">BP</div>
                  <div className="font-bold text-slate-900 dark:text-white">{pat.latest_vitals.bp_systolic}/{pat.latest_vitals.bp_diastolic}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold">HR</div>
                  <div className="font-bold text-slate-900 dark:text-white">{pat.latest_vitals.heart_rate} BPM</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold">SpO2</div>
                  <div className="font-bold text-emerald-500">{pat.latest_vitals.spo2}%</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setRecordingUhid(pat.patient_uhid)}
                className="flex-1 py-2 rounded-xl bg-[#13C5DD] text-[#1D2A4D] text-xs font-black uppercase shadow-sm"
              >
                + Record Vitals & Log
              </button>
              <button
                onClick={() => setSelectedUhid(pat.patient_uhid)}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Record Vitals Modal */}
      {recordingUhid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white">
              Record Shift Observation & Vitals ({recordingUhid})
            </h3>
            <form onSubmit={handleSaveNurseNote} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">BP Systolic / Diastolic</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={vitals.bp_systolic}
                      onChange={(e) => setVitals({ ...vitals, bp_systolic: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border"
                    />
                    <input
                      type="number"
                      value={vitals.bp_diastolic}
                      onChange={(e) => setVitals({ ...vitals, bp_diastolic: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">SpO2 (%) & HR</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={vitals.spo2}
                      onChange={(e) => setVitals({ ...vitals, spo2: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border"
                    />
                    <input
                      type="number"
                      value={vitals.heart_rate}
                      onChange={(e) => setVitals({ ...vitals, heart_rate: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nursing Shift Notes & Medication Administered *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. IV Ceftriaxone 1g administered. Patient comfortable. Urine output 450ml."
                  value={nurseNotes}
                  onChange={(e) => setNurseNotes(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRecordingUhid(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#13C5DD] text-[#1D2A4D] font-black uppercase"
                >
                  Save Shift Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// VIEW 3: Emergency Command Center
// ─────────────────────────────────────────────────────────────
function EmergencyCommandView() {
  const { setSelectedUhid } = usePortal();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadER() {
      setLoading(true);
      try {
        const res = await fetch("/api/emergency");
        const json = await res.json();
        if (json.success) setCases(json.cases || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadER();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-red-600 text-white shadow-xl">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-red-200">
            <AlertTriangle className="w-4 h-4 animate-ping" /> 24/7 EMERGENCY & TRAUMA COMMAND CENTER
          </div>
          <h1 className="text-2xl font-extrabold font-poppins mt-1">
            Emergency Triage Desk, Red Code Alerts & ICU Dispositions
          </h1>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white">
          Active Emergency Triage Queue ({cases.length})
        </h2>

        <div className="space-y-3">
          {cases.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase ${
                  c.triage_color === "Red" ? "bg-red-500 text-white animate-pulse" :
                  c.triage_color === "Orange" ? "bg-orange-500 text-white" :
                  c.triage_color === "Yellow" ? "bg-yellow-500 text-slate-900" :
                  "bg-emerald-500 text-white"
                }`}>
                  {c.triage_color} PRIORITY
                </span>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    {c.patient_name}
                    <span className="text-xs font-mono text-[#13C5DD]">({c.patient_uhid})</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Reason: <strong className="text-slate-700 dark:text-slate-300">{c.triage_reason}</strong> • Mode: {c.arrival_mode} • Bay: {c.bed_allocated}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedUhid(c.patient_uhid)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#13C5DD]/15 text-[#13C5DD] font-bold text-xs hover:bg-[#13C5DD]/25"
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" /> View Dossier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// VIEW 4: Radiology & PACS Studies
// ─────────────────────────────────────────────────────────────
function RadiologyView() {
  const { setSelectedUhid } = usePortal();
  const [studies, setStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRad() {
      setLoading(true);
      try {
        const res = await fetch("/api/radiology");
        const json = await res.json();
        if (json.success) setStudies(json.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRad();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-4 h-4" /> RADIOLOGY INFORMATION SYSTEM (RIS)
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
            X-Ray, CT, MRI Studies & Radiologist Diagnostic Reporting
          </h1>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white">
          Active Imaging Studies ({studies.length})
        </h2>

        <div className="space-y-4">
          {studies.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {s.modality} — {s.body_part}
                  </div>
                  <div className="text-[10px] text-slate-400">{s.order_number} • Patient: {s.patient_name} ({s.patient_uhid})</div>
                </div>
                <button
                  onClick={() => setSelectedUhid(s.patient_uhid)}
                  className="px-3 py-1 rounded-xl bg-[#13C5DD]/15 text-[#13C5DD] font-bold text-xs"
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" /> Dossier
                </button>
              </div>

              <div className="text-xs space-y-1">
                <div><strong>Indication:</strong> {s.clinical_indication}</div>
                <div><strong>Findings:</strong> {s.findings}</div>
                <div className="text-[#13C5DD]"><strong>Impression:</strong> {s.impression}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// VIEW 5: Billing & TPA Claims
// ─────────────────────────────────────────────────────────────
function BillingClaimsView() {
  const { setSelectedUhid } = usePortal();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBilling() {
      setLoading(true);
      try {
        const res = await fetch("/api/billing");
        const json = await res.json();
        if (json.success) {
          setInvoices(json.invoices || []);
          setSummary(json.summary);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBilling();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-4 h-4" /> GST BILLING & CASHLESS TPA CLAIMS
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
            Itemized Invoicing, Instant UPI Payments & PM-JAY Settlements
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-bold uppercase">Total Billed Revenue</div>
          <div className="text-2xl font-black font-poppins text-slate-900 dark:text-white mt-1">
            ₹{(summary?.total_revenue || 71584).toLocaleString("en-IN")}
          </div>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-bold uppercase">Collected Collections</div>
          <div className="text-2xl font-black font-poppins text-emerald-500 mt-1">
            ₹{(summary?.total_collected || 11584).toLocaleString("en-IN")}
          </div>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="text-xs text-slate-400 font-bold uppercase">Insurance / TPA Receivables</div>
          <div className="text-2xl font-black font-poppins text-blue-500 mt-1">
            ₹{(summary?.total_insurance_claims || 60000).toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white">
          Itemized Hospital Invoices ({invoices.length})
        </h2>

        <div className="space-y-3">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  {inv.invoice_number}
                  <span className="text-xs text-[#13C5DD]">• {inv.patient_name} ({inv.patient_uhid})</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Type: {inv.bill_type} • Insurance: {inv.insurance_provider || "Direct Cash/UPI"}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900 dark:text-white">₹{inv.total_amount.toLocaleString("en-IN")}</div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">
                    ● {inv.payment_status.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedUhid(inv.patient_uhid)}
                  className="px-3 py-1.5 rounded-xl bg-[#13C5DD]/15 text-[#13C5DD] font-bold text-xs"
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" /> Dossier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
