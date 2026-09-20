"use client";

import React, { useState, useEffect } from "react";
import { usePortal } from "@/context/PortalContext";
import {
  X,
  User,
  Activity,
  Calendar,
  FileText,
  FlaskConical,
  Pill,
  CreditCard,
  Bed,
  Clock,
  AlertTriangle,
  Download,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Heart,
  Droplets,
  Loader2,
  Stethoscope,
  Eye,
  ShieldAlert
} from "lucide-react";

export default function PatientDossierModal() {
  const { selectedUhid, setSelectedUhid } = usePortal();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"timeline" | "emr" | "rx" | "lab" | "rad" | "ipd" | "billing">("timeline");

  useEffect(() => {
    if (!selectedUhid) {
      setData(null);
      return;
    }

    async function loadDossier() {
      setLoading(true);
      try {
        const res = await fetch(`/api/patients/${selectedUhid}`);
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load dossier:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDossier();
  }, [selectedUhid]);

  if (!selectedUhid) return null;

  const patient = data?.patient;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-[0_4px_16px_rgba(41,39,39,0.08)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Banner */}
        <div className="bg-[#4A1F2B] p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white text-xl font-bold shadow-xs">
              {patient?.full_name ? patient.full_name.charAt(0) : "P"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white">{patient?.full_name || "Loading Patient..."}</h2>
                <span className="px-2 py-0.5 rounded bg-white/15 text-[#F7B5C3] font-mono font-bold text-xs">
                  {patient?.uhid}
                </span>
                {patient?.status === "inpatient" && (
                  <span className="px-2 py-0.5 rounded bg-[#BA1A1A] text-white font-bold text-[10px] tracking-wider uppercase">
                    ● INPATIENT
                  </span>
                )}
              </div>
              <div className="text-xs text-[#EDE7E6] mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span>{patient?.gender}, {patient?.age} Yrs</span>
                <span>• Blood: <strong className="text-white font-bold">{patient?.blood_group || "N/A"}</strong></span>
                <span>• ABHA: <strong className="text-[#F7B5C3]">{patient?.abha_id || "Not Linked"}</strong></span>
                <span>• Mobile: {patient?.mobile}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedUhid(null)}
              className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clinical Alert Ribbon */}
        {patient?.allergies && (
          <div className="bg-[#FFDAD6] border-b border-[#BA1A1A]/30 px-5 py-2 text-xs text-[#93000A] font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#BA1A1A] shrink-0" />
            <span>
              <strong>CRITICAL ALLERGIES:</strong> {patient.allergies} | <strong>CHRONIC CONDITIONS:</strong> {patient.chronic_conditions || "None declared"}
            </span>
          </div>
        )}

        {/* Dossier Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 pt-2 border-b border-[#EDE7E6] dark:border-[#32293D] bg-[#F8F2F2] dark:bg-[#18141C] overflow-x-auto text-xs font-semibold">
          {[
            { id: "timeline", label: "Patient Timeline", icon: Clock },
            { id: "emr", label: "Clinical EMR & Vitals", icon: Stethoscope },
            { id: "rx", label: "Prescriptions (Rx)", icon: Pill },
            { id: "lab", label: "Lab Reports", icon: FlaskConical },
            { id: "rad", label: "Radiology (RIS)", icon: Eye },
            { id: "ipd", label: "IPD Admissions", icon: Bed },
            { id: "billing", label: "Invoices & Claims", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-[#4A1F2B] dark:border-[#F7B5C3] text-[#4A1F2B] dark:text-[#F7B5C3] font-bold"
                    : "border-transparent text-[#837376] hover:text-[#1D1B1B] dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-16 text-center space-y-2">
              <Loader2 className="w-7 h-7 text-[#4A1F2B] dark:text-[#C08491] animate-spin mx-auto" />
              <p className="text-xs text-[#837376]">Aggregating complete patient history across modules...</p>
            </div>
          ) : !data ? (
            <div className="py-12 text-center text-xs text-[#837376]">Unable to load patient dossier.</div>
          ) : (
            <>
              {/* TAB 1: TIMELINE */}
              {activeTab === "timeline" && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#1D1B1B] dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-[#4A1F2B] dark:text-[#C08491]" /> Chronological Healthcare Journey
                  </h3>

                  <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EDE7E6] dark:before:bg-[#32293D]">
                    {data.timeline && data.timeline.length > 0 ? (
                      data.timeline.map((item: any, idx: number) => (
                        <div key={idx} className="relative group">
                          <div className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full bg-[#4A1F2B] border-2 border-white dark:border-[#241D29] shadow-xs" />
                          <div className="p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-[#837376]">
                              <span className="font-bold text-[#4A1F2B] dark:text-[#F7B5C3]">{item.module}</span>
                              <span>{item.timestamp}</span>
                            </div>
                            <div className="text-xs font-bold text-[#1D1B1B] dark:text-white">{item.action}</div>
                            <p className="text-xs text-[#514346] dark:text-[#A89CA0]">{item.details}</p>
                            <div className="text-[10px] text-[#837376]">Logged by {item.user_name} ({item.role})</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-[#837376] italic">No timeline entries yet for this patient.</div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: EMR & VITALS */}
              {activeTab === "emr" && (
                <div className="space-y-4">
                  {/* Latest Vitals */}
                  <div>
                    <h4 className="text-xs font-bold text-[#1D1B1B] dark:text-white mb-2 uppercase tracking-wider">Vitals Trend</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {data.vitals && data.vitals.length > 0 ? (
                        <>
                          <div className="p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-center">
                            <div className="text-[10px] font-semibold text-[#837376] uppercase">Blood Pressure</div>
                            <div className="text-base font-bold tabular-nums text-[#1D1B1B] dark:text-white mt-0.5">
                              {data.vitals[0].bp_systolic}/{data.vitals[0].bp_diastolic} <span className="text-[10px] font-normal text-[#837376]">mmHg</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-center">
                            <div className="text-[10px] font-semibold text-[#837376] uppercase">Heart Rate</div>
                            <div className="text-base font-bold tabular-nums text-[#1D1B1B] dark:text-white mt-0.5">
                              {data.vitals[0].heart_rate} <span className="text-[10px] font-normal text-[#837376]">BPM</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-center">
                            <div className="text-[10px] font-semibold text-[#837376] uppercase">Oxygen (SpO2)</div>
                            <div className="text-base font-bold tabular-nums text-[#3F6B52] mt-0.5">
                              {data.vitals[0].spo2}%
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-center">
                            <div className="text-[10px] font-semibold text-[#837376] uppercase">Body Temp</div>
                            <div className="text-base font-bold tabular-nums text-[#1D1B1B] dark:text-white mt-0.5">
                              {data.vitals[0].temperature}°F
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="col-span-4 p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] text-xs text-[#837376] text-center">
                          No vitals recorded yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Clinical Consultation Notes */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-[#1D1B1B] dark:text-white uppercase tracking-wider">Doctor Consultation Notes</h4>
                    {data.clinicalNotes && data.clinicalNotes.length > 0 ? (
                      data.clinicalNotes.map((note: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] space-y-2">
                          <div className="flex items-center justify-between pb-1.5 border-b border-[#EDE7E6] dark:border-[#32293D]">
                            <div>
                              <div className="text-xs font-bold text-[#4A1F2B] dark:text-[#F7B5C3]">{note.doctor_name || "Consultant Doctor"}</div>
                              <div className="text-[10px] text-[#837376]">{note.visit_date}</div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#83505B] dark:text-[#C08491] text-[10px] font-bold">
                              ICD-10: {note.icd10_code || "J20.9"}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-[#837376] font-semibold block text-[10px] uppercase">Chief Complaint:</span>
                              <span className="text-[#1D1B1B] dark:text-white">{note.chief_complaint}</span>
                            </div>
                            <div>
                              <span className="text-[#837376] font-semibold block text-[10px] uppercase">Clinical Diagnosis:</span>
                              <span className="font-bold text-[#3F6B52]">{note.diagnosis}</span>
                            </div>
                          </div>

                          {note.treatment_plan && (
                            <div className="p-2.5 rounded bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] text-xs">
                              <span className="text-[#4A1F2B] dark:text-[#F7B5C3] font-bold block mb-0.5 text-[11px]">Treatment Plan &amp; Advice:</span>
                              <pre className="font-sans whitespace-pre-wrap text-[#514346] dark:text-[#A89CA0] text-xs">{note.treatment_plan}</pre>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] text-xs text-[#837376] text-center">
                        No clinical notes recorded.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: PRESCRIPTIONS */}
              {activeTab === "rx" && (
                <div className="space-y-3">
                  {data.prescriptions && data.prescriptions.length > 0 ? (
                    data.prescriptions.map((rx: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
                          <div>
                            <div className="text-xs font-bold text-[#4A1F2B] dark:text-[#F7B5C3] font-mono">{rx.rx_number}</div>
                            <div className="text-[10px] text-[#837376]">Prescribed by {rx.doctor_name} • {rx.created_at}</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rx.status === "dispensed" ? "bg-[#3F6B52]/15 text-[#3F6B52]" : "bg-[#4A1F2B]/15 text-[#4A1F2B] dark:text-[#F7B5C3]"
                          }`}>
                            ● {rx.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead>
                              <tr className="bg-white dark:bg-[#241D29] text-[#837376] font-semibold uppercase text-[10px] border-b border-[#EDE7E6] dark:border-[#32293D]">
                                <th className="p-2">Medicine Name</th>
                                <th className="p-2">Dosage</th>
                                <th className="p-2">Frequency</th>
                                <th className="p-2">Timing</th>
                                <th className="p-2">Duration</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EDE7E6] dark:divide-[#32293D]">
                              {rx.items?.map((item: any, i: number) => (
                                <tr key={i}>
                                  <td className="p-2 font-bold text-[#1D1B1B] dark:text-white">
                                    {item.medicine_name}
                                    <span className="block text-[10px] font-normal text-[#837376]">{item.generic_name}</span>
                                  </td>
                                  <td className="p-2">{item.dosage}</td>
                                  <td className="p-2 font-bold text-[#4A1F2B] dark:text-[#F7B5C3]">{item.frequency}</td>
                                  <td className="p-2">{item.timing}</td>
                                  <td className="p-2 tabular-nums">{item.duration_days} Days ({item.quantity} Qty)</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] text-xs text-[#837376] text-center">
                      No prescriptions on file.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: LAB REPORTS */}
              {activeTab === "lab" && (
                <div className="space-y-3">
                  {data.labOrders && data.labOrders.length > 0 ? (
                    data.labOrders.map((lab: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] space-y-2">
                        <div className="flex items-center justify-between pb-1.5 border-b border-[#EDE7E6] dark:border-[#32293D]">
                          <div>
                            <div className="text-xs font-bold text-[#1D1B1B] dark:text-white">{lab.test_name}</div>
                            <div className="text-[10px] text-[#837376] font-mono">Order #{lab.order_number} · Barcode: {lab.sample_barcode}</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            lab.status === "verified" ? "bg-[#3F6B52]/15 text-[#3F6B52]" : "bg-[#9A6A25]/15 text-[#9A6A25]"
                          }`}>
                            ● {lab.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="p-3 rounded bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[#837376]">Observed Value:</span>
                            <span className={`font-bold tabular-nums ${lab.is_critical ? "text-[#BA1A1A]" : "text-[#1D1B1B] dark:text-white"}`}>
                              {lab.result_value || "Pending Processing"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-[#837376]">
                            <span>Reference Range:</span>
                            <span>{lab.reference_range || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] text-xs text-[#837376] text-center">
                      No laboratory orders on file.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: RADIOLOGY */}
              {activeTab === "rad" && (
                <div className="space-y-3">
                  {data.radiologyOrders && data.radiologyOrders.length > 0 ? (
                    data.radiologyOrders.map((rad: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] space-y-2">
                        <div className="flex items-center justify-between pb-1.5 border-b border-[#EDE7E6] dark:border-[#32293D]">
                          <div>
                            <div className="text-xs font-bold text-[#1D1B1B] dark:text-white">{rad.modality} — {rad.body_part}</div>
                            <div className="text-[10px] text-[#837376] font-mono">Order #{rad.order_number} · Prescribed by {rad.doctor_name}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-[#3F6B52]/15 text-[#3F6B52] text-[10px] font-bold">
                            ● VERIFIED
                          </span>
                        </div>

                        <div className="p-3 rounded bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] text-xs space-y-1.5">
                          <div>
                            <span className="text-[#837376] text-[10px] uppercase font-semibold block">Findings:</span>
                            <p className="text-[#1D1B1B] dark:text-white mt-0.5">{rad.findings}</p>
                          </div>
                          <div>
                            <span className="text-[#4A1F2B] dark:text-[#F7B5C3] text-[10px] uppercase font-bold block">Impression:</span>
                            <p className="font-bold text-[#1D1B1B] dark:text-white mt-0.5">{rad.impression}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] text-xs text-[#837376] text-center">
                      No radiology studies recorded.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: IPD & BED */}
              {activeTab === "ipd" && (
                <div className="space-y-3">
                  {data.ipdAdmissions && data.ipdAdmissions.length > 0 ? (
                    data.ipdAdmissions.map((adm: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] space-y-2">
                        <div className="flex items-center justify-between pb-1.5 border-b border-[#EDE7E6] dark:border-[#32293D]">
                          <div>
                            <div className="text-xs font-bold text-[#1D1B1B] dark:text-white">Admission #{adm.admission_number}</div>
                            <div className="text-[10px] text-[#837376]">Admitted on {adm.admission_date}</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            adm.status === "admitted" ? "bg-[#BA1A1A]/15 text-[#BA1A1A]" : "bg-[#3F6B52]/15 text-[#3F6B52]"
                          }`}>
                            ● {adm.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                          <div className="p-2.5 rounded bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041]">
                            <span className="text-[#837376] text-[10px] uppercase font-semibold block">Ward</span>
                            <span className="font-bold text-[#1D1B1B] dark:text-white">{adm.ward_name || "ICU Ward"}</span>
                          </div>
                          <div className="p-2.5 rounded bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041]">
                            <span className="text-[#837376] text-[10px] uppercase font-semibold block">Bed</span>
                            <span className="font-bold text-[#4A1F2B] dark:text-[#F7B5C3]">{adm.bed_number || adm.bed_id}</span>
                          </div>
                          <div className="p-2.5 rounded bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041]">
                            <span className="text-[#837376] text-[10px] uppercase font-semibold block">Doctor</span>
                            <span className="font-bold text-[#1D1B1B] dark:text-white">{adm.doctor_name}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] text-xs text-[#837376] text-center">
                      No inpatient hospitalizations recorded.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: BILLING */}
              {activeTab === "billing" && (
                <div className="space-y-3">
                  {data.invoices && data.invoices.length > 0 ? (
                    data.invoices.map((inv: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] space-y-2">
                        <div className="flex items-center justify-between pb-1.5 border-b border-[#EDE7E6] dark:border-[#32293D]">
                          <div>
                            <div className="text-xs font-bold text-[#1D1B1B] dark:text-white font-mono">{inv.invoice_number} ({inv.bill_type})</div>
                            <div className="text-[10px] text-[#837376]">{inv.created_at}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-[#3F6B52]/15 text-[#3F6B52] text-[10px] font-bold">
                            ● {inv.payment_status.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs">
                          {inv.items?.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between text-[#514346] dark:text-[#A89CA0]">
                              <span>{item.item_description} (x{item.quantity})</span>
                              <span className="font-bold tabular-nums">₹{item.total_price.toLocaleString("en-IN")}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-[#EDE7E6] dark:border-[#32293D] flex justify-between items-center text-xs font-bold">
                          <span className="text-[#1D1B1B] dark:text-white">Total Amount</span>
                          <span className="text-sm text-[#4A1F2B] dark:text-[#F7B5C3] tabular-nums">₹{inv.total_amount.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] text-xs text-[#837376] text-center">
                      No invoices on file.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#F8F2F2] dark:bg-[#18141C] border-t border-[#EDE7E6] dark:border-[#32293D] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#837376]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3F6B52]" />
            <span>Audited health record under ABDM-aligned security standards</span>
          </div>
          <button
            onClick={() => setSelectedUhid(null)}
            className="px-3.5 py-1.5 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white text-xs font-semibold hover:bg-[#E7E1E1] transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
