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
import NursingPanel from "@/components/dashboard/panels/NursingPanel";
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
      <div className="min-h-screen bg-[#18141C] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#4A1F2B] dark:text-[#C08491] animate-spin mx-auto" />
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
        const res = await fetch(`/api/patients${search ? `?query=${search}` : ""}`);
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
    <div className="space-y-4">
      {/* Header Strip */}
      <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#4A1F2B] text-white flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#83505B] dark:text-[#C08491] uppercase tracking-wider">
              CENTRAL PATIENT MASTER DIRECTORY
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#1D1B1B] dark:text-[#FEF8F7]">
              Unique Hospital Identification (UHID) &amp; ABHA Master Registry
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#837376]">
            Total Registered: <strong className="text-[#1D1B1B] dark:text-white tabular-nums">{patients.length}</strong>
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#837376]" />
          <input
            type="text"
            placeholder="Search by UHID, Patient Name, Mobile (+91), or ABHA ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs text-[#1D1B1B] dark:text-white placeholder:text-[#837376] focus:outline-none focus:border-[#4A1F2B]"
          />
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-6 h-6 text-[#4A1F2B] dark:text-[#C08491] animate-spin mx-auto" />
            <span className="block text-xs text-[#837376] mt-2">Searching patient registry...</span>
          </div>
        ) : patients.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#837376]">No patients found matching your search query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#F8F2F2] dark:bg-[#18141C] text-[#837376] uppercase text-[10px] font-semibold border-b border-[#EDE7E6] dark:border-[#32293D]">
                  <th className="p-3">UHID</th>
                  <th className="p-3">Patient Name</th>
                  <th className="p-3">Age / Gender</th>
                  <th className="p-3">Contact &amp; ABHA</th>
                  <th className="p-3">Blood &amp; Allergies</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE7E6] dark:divide-[#32293D]">
                {patients.map((p) => (
                  <tr key={p.uhid} className="hover:bg-[#F8F2F2]/60 dark:hover:bg-[#18141C]/60 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#4A1F2B] dark:text-[#F7B5C3]">{p.uhid}</td>
                    <td className="p-3 font-bold text-[#1D1B1B] dark:text-white">{p.full_name}</td>
                    <td className="p-3 text-[#514346] dark:text-[#A89CA0]">{p.age} Yrs · {p.gender}</td>
                    <td className="p-3">
                      <div className="text-[#1D1B1B] dark:text-white">{p.mobile}</div>
                      <div className="text-[10px] text-[#837376] font-mono">ABHA: {p.abha_id || "None"}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-[#83505B] dark:text-[#C08491]">{p.blood_group}</span>
                      {p.allergies && (
                        <span className="block text-[10px] text-[#BA1A1A] font-bold truncate max-w-[140px]">
                          Allergy: {p.allergies}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === "inpatient" ? "bg-[#BA1A1A]/15 text-[#BA1A1A]" : "bg-[#3F6B52]/15 text-[#3F6B52]"
                      }`}>
                        ● {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedUhid(p.uhid)}
                        className="px-2.5 py-1 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white font-semibold text-xs hover:bg-[#E7E1E1] transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Dossier
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
  return <NursingPanel />;
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
    <div className="space-y-4">
      <div className="bg-[#BA1A1A] text-white rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-red-200">
            <AlertTriangle className="w-4 h-4 animate-ping" /> 24/7 EMERGENCY &amp; TRAUMA COMMAND CENTER
          </div>
          <h1 className="text-xl font-bold tracking-tight mt-1">
            Emergency Triage Desk, Red Code Alerts &amp; ICU Dispositions
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-black/20 text-[11px] font-bold">
            Live ER Census: {cases.length} Active
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
          <h2 className="text-sm font-bold text-[#1D1B1B] dark:text-white">
            Active Emergency Triage Queue ({cases.length})
          </h2>
          <span className="text-xs text-[#837376]">Prioritized by Manchester Triage System</span>
        </div>

        <div className="space-y-2.5">
          {cases.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                  c.triage_color === "Red" ? "bg-[#BA1A1A] text-white animate-pulse" :
                  c.triage_color === "Orange" ? "bg-[#9A6A25] text-white" :
                  c.triage_color === "Yellow" ? "bg-amber-100 text-amber-900" :
                  "bg-[#3F6B52] text-white"
                }`}>
                  {c.triage_color} PRIORITY
                </span>
                <div>
                  <div className="font-bold text-[#1D1B1B] dark:text-white text-sm flex items-center gap-2">
                    {c.patient_name}
                    <span className="text-xs font-mono text-[#4A1F2B] dark:text-[#F7B5C3]">({c.patient_uhid})</span>
                  </div>
                  <div className="text-[11px] text-[#514346] dark:text-[#A89CA0]">
                    Reason: <strong className="text-[#1D1B1B] dark:text-white">{c.triage_reason}</strong> · Mode: {c.arrival_mode} · Bay: {c.bed_allocated}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedUhid(c.patient_uhid)}
                  className="px-3 py-1.5 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white font-semibold text-xs hover:bg-[#E7E1E1] transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Dossier
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
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#4A1F2B] text-white flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#83505B] dark:text-[#C08491] uppercase tracking-wider">
              RADIOLOGY INFORMATION SYSTEM (RIS / PACS)
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#1D1B1B] dark:text-[#FEF8F7]">
              X-Ray, CT, MRI Studies &amp; Radiologist Diagnostic Reporting
            </h1>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
          <h2 className="text-sm font-bold text-[#1D1B1B] dark:text-white">
            Active Imaging Studies ({studies.length})
          </h2>
          <span className="text-xs text-[#837376]">DICOM Web Viewer Linked</span>
        </div>

        <div className="space-y-3">
          {studies.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] space-y-2 text-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
                <div>
                  <div className="font-bold text-sm text-[#1D1B1B] dark:text-white">
                    {s.modality} — {s.body_part}
                  </div>
                  <div className="text-[11px] text-[#837376] font-mono">
                    {s.order_number} · Patient: {s.patient_name} ({s.patient_uhid})
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUhid(s.patient_uhid)}
                  className="px-2.5 py-1 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white font-semibold text-xs hover:bg-[#E7E1E1] transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Dossier
                </button>
              </div>

              <div className="text-xs space-y-1 text-[#514346] dark:text-[#A89CA0]">
                <div><strong className="text-[#1D1B1B] dark:text-white">Indication:</strong> {s.clinical_indication}</div>
                <div><strong className="text-[#1D1B1B] dark:text-white">Findings:</strong> {s.findings}</div>
                <div className="text-[#4A1F2B] dark:text-[#F7B5C3]">
                  <strong>Impression:</strong> {s.impression}
                </div>
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
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#4A1F2B] text-white flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#83505B] dark:text-[#C08491] uppercase tracking-wider">
              GST BILLING &amp; CASHLESS TPA CLAIMS
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#1D1B1B] dark:text-[#FEF8F7]">
              Itemized Invoicing, Instant UPI Payments &amp; Insurance Settlements
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-xs">
          <div className="text-[10px] text-[#837376] font-semibold uppercase tracking-wider">Total Billed Revenue</div>
          <div className="text-2xl font-bold tabular-nums text-[#1D1B1B] dark:text-white mt-1">
            ₹{(summary?.total_revenue || 71584).toLocaleString("en-IN")}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-xs">
          <div className="text-[10px] text-[#837376] font-semibold uppercase tracking-wider">Collected Collections</div>
          <div className="text-2xl font-bold tabular-nums text-[#3F6B52] mt-1">
            ₹{(summary?.total_collected || 11584).toLocaleString("en-IN")}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-xs">
          <div className="text-[10px] text-[#837376] font-semibold uppercase tracking-wider">TPA Receivables</div>
          <div className="text-2xl font-bold tabular-nums text-[#83505B] dark:text-[#C08491] mt-1">
            ₹{(summary?.total_insurance_claims || 60000).toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
          <h2 className="text-sm font-bold text-[#1D1B1B] dark:text-white">
            Itemized Hospital Invoices ({invoices.length})
          </h2>
          <span className="text-xs text-[#837376]">SAC Code 9993 Healthcare Exemption</span>
        </div>

        <div className="space-y-2.5">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="p-3.5 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-bold text-sm text-[#1D1B1B] dark:text-white flex items-center gap-2">
                  <span className="font-mono text-[#4A1F2B] dark:text-[#F7B5C3]">{inv.invoice_number}</span>
                  <span className="text-xs text-[#514346] dark:text-[#A89CA0]">• {inv.patient_name} ({inv.patient_uhid})</span>
                </div>
                <div className="text-[11px] text-[#837376] mt-0.5">
                  Type: {inv.bill_type} · Payee: {inv.insurance_provider || "Self-Pay Direct Cash/UPI"}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-bold tabular-nums text-[#1D1B1B] dark:text-white">
                    ₹{inv.total_amount.toLocaleString("en-IN")}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#3F6B52]/15 text-[#3F6B52] text-[10px] font-bold">
                    ● {inv.payment_status.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedUhid(inv.patient_uhid)}
                  className="px-2.5 py-1 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white font-semibold text-xs hover:bg-[#E7E1E1] transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Dossier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
