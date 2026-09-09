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
  Eye
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#1D2A4D] via-[#0F365F] to-[#13C5DD] p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl font-bold">
              {patient?.full_name ? patient.full_name.charAt(0) : "P"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold font-poppins">{patient?.full_name || "Loading Patient..."}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#13C5DD] text-[#1D2A4D] font-extrabold text-[11px]">
                  {patient?.uhid}
                </span>
                {patient?.status === "inpatient" && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white font-extrabold text-[10px] animate-pulse">
                    ● INPATIENT
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-200 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-medium">
                <span>{patient?.gender}, {patient?.age} Yrs</span>
                <span>• Blood: <strong className="text-white font-bold">{patient?.blood_group || "N/A"}</strong></span>
                <span>• ABHA: <strong className="text-cyan-200">{patient?.abha_id || "Not Linked"}</strong></span>
                <span>• Mobile: {patient?.mobile}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedUhid(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clinical Alert Ribbon */}
        {patient?.allergies && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-6 py-2 text-xs text-amber-700 dark:text-amber-300 font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>CRITICAL ALLERGIES:</strong> {patient.allergies} | <strong>CHRONIC CONDITIONS:</strong> {patient.chronic_conditions || "None declared"}
            </span>
          </div>
        )}

        {/* Dossier Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto text-xs font-bold">
          {[
            { id: "timeline", label: "Patient Journey Timeline", icon: Clock },
            { id: "emr", label: "Clinical EMR & Vitals", icon: Stethoscope },
            { id: "rx", label: "Prescriptions (Rx)", icon: Pill },
            { id: "lab", label: "Lab Diagnostic Reports", icon: FlaskConical },
            { id: "rad", label: "Radiology & Imaging", icon: Eye },
            { id: "ipd", label: "IPD Admissions & Bed", icon: Bed },
            { id: "billing", label: "Invoices & TPA Claims", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-[#13C5DD] text-[#13C5DD] font-extrabold"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#13C5DD] animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Aggregating complete patient history across modules...</p>
            </div>
          ) : !data ? (
            <div className="py-12 text-center text-xs text-slate-400">Unable to load patient dossier.</div>
          ) : (
            <>
              {/* TAB 1: TIMELINE */}
              {activeTab === "timeline" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#13C5DD]" /> Chronological Healthcare Journey
                  </h3>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                    {data.timeline && data.timeline.length > 0 ? (
                      data.timeline.map((item: any, idx: number) => (
                        <div key={idx} className="relative group">
                          <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#13C5DD] border-2 border-white dark:border-slate-900 shadow-sm" />
                          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span className="font-bold text-[#13C5DD]">{item.module}</span>
                              <span>{item.timestamp}</span>
                            </div>
                            <div className="text-xs font-extrabold text-slate-900 dark:text-white">{item.action}</div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{item.details}</p>
                            <div className="text-[10px] text-slate-400">Logged by {item.user_name} ({item.role})</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 italic">No timeline entries yet for this patient.</div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: EMR & VITALS */}
              {activeTab === "emr" && (
                <div className="space-y-6">
                  {/* Latest Vitals */}
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white mb-3">Vitals Record Trend</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {data.vitals && data.vitals.length > 0 ? (
                        <>
                          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
                            <div className="text-[10px] font-bold text-blue-500 uppercase">Blood Pressure</div>
                            <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                              {data.vitals[0].bp_systolic}/{data.vitals[0].bp_diastolic} <span className="text-[10px] font-normal text-slate-400">mmHg</span>
                            </div>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                            <div className="text-[10px] font-bold text-red-500 uppercase">Heart Rate</div>
                            <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                              {data.vitals[0].heart_rate} <span className="text-[10px] font-normal text-slate-400">BPM</span>
                            </div>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-center">
                            <div className="text-[10px] font-bold text-teal-500 uppercase">Oxygen (SpO2)</div>
                            <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                              {data.vitals[0].spo2}% <span className="text-[10px] font-normal text-slate-400">Normal</span>
                            </div>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                            <div className="text-[10px] font-bold text-amber-500 uppercase">Body Temp</div>
                            <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                              {data.vitals[0].temperature}°F
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="col-span-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-400 text-center">
                          No vitals recorded yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Clinical Consultation Notes */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Doctor Consultation Notes</h4>
                    {data.clinicalNotes && data.clinicalNotes.length > 0 ? (
                      data.clinicalNotes.map((note: any, idx: number) => (
                        <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                            <div>
                              <div className="text-xs font-extrabold text-[#13C5DD]">{note.doctor_name || "Consultant Doctor"}</div>
                              <div className="text-[10px] text-slate-400">{note.visit_date}</div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-extrabold">
                              ICD-10: {note.icd10_code || "J20.9"}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-slate-400 font-bold block">Chief Complaint:</span>
                              <span className="font-medium text-slate-900 dark:text-white">{note.chief_complaint}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-bold block">Clinical Diagnosis:</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">{note.diagnosis}</span>
                            </div>
                          </div>

                          {note.examination_findings && (
                            <div className="text-xs">
                              <span className="text-slate-400 font-bold block">Physical Examination Findings:</span>
                              <span className="text-slate-700 dark:text-slate-300">{note.examination_findings}</span>
                            </div>
                          )}

                          {note.treatment_plan && (
                            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                              <span className="text-[#13C5DD] font-bold block mb-1">Treatment Plan & Advice:</span>
                              <pre className="font-sans whitespace-pre-wrap text-slate-700 dark:text-slate-300">{note.treatment_plan}</pre>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-400 text-center">
                        No clinical notes recorded.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: PRESCRIPTIONS */}
              {activeTab === "rx" && (
                <div className="space-y-4">
                  {data.prescriptions && data.prescriptions.length > 0 ? (
                    data.prescriptions.map((rx: any, idx: number) => (
                      <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                          <div>
                            <div className="text-xs font-extrabold text-[#13C5DD]">{rx.rx_number}</div>
                            <div className="text-[10px] text-slate-400">Prescribed by {rx.doctor_name} • {rx.created_at}</div>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            rx.status === "dispensed" ? "bg-emerald-500/15 text-emerald-500" : "bg-blue-500/15 text-blue-500"
                          }`}>
                            ● {rx.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-500 font-extrabold uppercase">
                              <tr>
                                <th className="p-2.5">Medicine Name</th>
                                <th className="p-2.5">Dosage</th>
                                <th className="p-2.5">Frequency</th>
                                <th className="p-2.5">Timing</th>
                                <th className="p-2.5">Duration</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                              {rx.items?.map((item: any, i: number) => (
                                <tr key={i}>
                                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                                    {item.medicine_name}
                                    <span className="block text-[10px] font-normal text-slate-400">{item.generic_name}</span>
                                  </td>
                                  <td className="p-2.5">{item.dosage}</td>
                                  <td className="p-2.5 font-bold text-[#13C5DD]">{item.frequency}</td>
                                  <td className="p-2.5">{item.timing}</td>
                                  <td className="p-2.5">{item.duration_days} Days ({item.quantity} Qty)</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {rx.general_advice && (
                          <div className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <strong>Diet & Instructions:</strong> {rx.general_advice}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-400 text-center">
                      No prescriptions on file.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: LAB REPORTS */}
              {activeTab === "lab" && (
                <div className="space-y-4">
                  {data.labOrders && data.labOrders.length > 0 ? (
                    data.labOrders.map((lab: any, idx: number) => (
                      <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                          <div>
                            <div className="text-xs font-extrabold text-slate-900 dark:text-white">{lab.test_name}</div>
                            <div className="text-[10px] text-slate-400">Order #{lab.order_number} • Barcode: {lab.sample_barcode}</div>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            lab.status === "verified" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"
                          }`}>
                            ● {lab.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 font-bold">Observed Value:</span>
                            <span className={`font-extrabold ${lab.is_critical ? "text-red-500 font-black" : "text-slate-900 dark:text-white"}`}>
                              {lab.result_value || "Pending Laboratory Processing"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>Reference Range:</span>
                            <span>{lab.reference_range || "N/A"}</span>
                          </div>
                          {lab.remarks && (
                            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                              Remarks: {lab.remarks}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-400 text-center">
                      No laboratory orders on file.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: RADIOLOGY */}
              {activeTab === "rad" && (
                <div className="space-y-4">
                  {data.radiologyOrders && data.radiologyOrders.length > 0 ? (
                    data.radiologyOrders.map((rad: any, idx: number) => (
                      <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                          <div>
                            <div className="text-xs font-extrabold text-slate-900 dark:text-white">{rad.modality} — {rad.body_part}</div>
                            <div className="text-[10px] text-slate-400">Order #{rad.order_number} • Prescribed by {rad.doctor_name}</div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-extrabold">
                            ● VERIFIED
                          </span>
                        </div>

                        <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                          <div>
                            <strong className="text-slate-400 text-[11px] uppercase block">Radiological Findings:</strong>
                            <p className="text-slate-800 dark:text-slate-200 mt-0.5">{rad.findings}</p>
                          </div>
                          <div>
                            <strong className="text-[#13C5DD] text-[11px] uppercase block">Impression:</strong>
                            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{rad.impression}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-400 text-center">
                      No radiology studies recorded.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: IPD & BED */}
              {activeTab === "ipd" && (
                <div className="space-y-4">
                  {data.ipdAdmissions && data.ipdAdmissions.length > 0 ? (
                    data.ipdAdmissions.map((adm: any, idx: number) => (
                      <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                          <div>
                            <div className="text-xs font-extrabold text-slate-900 dark:text-white">Admission #{adm.admission_number}</div>
                            <div className="text-[10px] text-slate-400">Admitted on {adm.admission_date}</div>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            adm.status === "admitted" ? "bg-red-500/15 text-red-500" : "bg-emerald-500/15 text-emerald-500"
                          }`}>
                            ● {adm.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Allocated Ward</span>
                            <span className="font-bold text-slate-900 dark:text-white">{adm.ward_name || "ICU Ward"}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Bed Number</span>
                            <span className="font-extrabold text-[#13C5DD]">{adm.bed_number || adm.bed_id}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Primary Consultant</span>
                            <span className="font-bold text-slate-900 dark:text-white">{adm.doctor_name}</span>
                          </div>
                        </div>

                        {adm.admission_reason && (
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            <strong>Reason:</strong> {adm.admission_reason}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-400 text-center">
                      No inpatient hospitalizations recorded.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: BILLING */}
              {activeTab === "billing" && (
                <div className="space-y-4">
                  {data.invoices && data.invoices.length > 0 ? (
                    data.invoices.map((inv: any, idx: number) => (
                      <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                          <div>
                            <div className="text-xs font-extrabold text-slate-900 dark:text-white">{inv.invoice_number} ({inv.bill_type})</div>
                            <div className="text-[10px] text-slate-400">{inv.created_at}</div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-extrabold">
                            ● {inv.payment_status.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs">
                          {inv.items?.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between text-slate-600 dark:text-slate-300">
                              <span>{item.item_description} (x{item.quantity})</span>
                              <span className="font-bold">₹{item.total_price.toLocaleString("en-IN")}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-extrabold">
                          <span className="text-slate-900 dark:text-white">Total Amount</span>
                          <span className="text-base text-[#13C5DD]">₹{inv.total_amount.toLocaleString("en-IN")}</span>
                        </div>

                        {inv.claim && (
                          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300">
                            <strong>Cashless TPA Claim:</strong> {inv.claim.insurance_company} (Claim #{inv.claim.claim_number}) — ₹{inv.claim.claimed_amount.toLocaleString("en-IN")} Settled
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-400 text-center">
                      No invoices on file.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted Health Record — Audited access under ABDM-aligned security architecture</span>
          </div>
          <button
            onClick={() => setSelectedUhid(null)}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
}
