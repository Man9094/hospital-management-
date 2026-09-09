"use client";

import React, { useState, useEffect } from "react";
import { usePortal } from "@/context/PortalContext";
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
  Search
} from "lucide-react";

export default function DoctorPanel() {
  const { setSelectedUhid } = usePortal();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [labCatalog, setLabCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [aptRes, labRes] = await Promise.all([
          fetch("/api/appointments"),
          fetch("/api/lab?catalog=true")
        ]);
        const aptJson = await aptRes.json();
        const labJson = await labRes.json();

        if (aptJson.success && aptJson.appointments) {
          setAppointments(aptJson.appointments);
          if (aptJson.appointments.length > 0) {
            selectPatient(aptJson.appointments[0]);
          }
        }
        if (labJson.success && labJson.tests) {
          setLabCatalog(labJson.tests);
        }
      } catch (err) {
        console.error("Failed to load doctor console:", err);
      } finally {
        setLoading(false);
      }
    }

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

    try {
      const res = await fetch("/api/emr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_uhid: selectedApt.patient_uhid,
          appointment_id: selectedApt.id,
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
        setSuccessMessage("Consultation recorded, e-prescription created & lab investigations ordered!");
        // Refresh appointment list
        const aptRes = await fetch("/api/appointments");
        const aptJson = await aptRes.json();
        if (aptJson.success) setAppointments(aptJson.appointments);
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

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4" /> CLINICAL EMR CONSOLE • OPD QUEUE
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
            Doctor Clinical Consultation & E-Prescription Desk
          </h1>
        </div>
        {selectedApt && (
          <button
            onClick={() => setSelectedUhid(selectedApt.patient_uhid)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#13C5DD] to-[#0F6CBD] text-white text-xs font-extrabold uppercase shadow-md flex items-center gap-2 hover:opacity-95 transition-opacity"
          >
            <Eye className="w-4 h-4" /> View Full Dossier ({selectedApt.patient_uhid})
          </button>
        )}
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid: Queue & EMR Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: OPD Queue List */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs font-bold pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-900 dark:text-white">Today's Patient Queue ({appointments.length})</span>
            <span className="text-[#13C5DD] font-extrabold">Active OPD</span>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-6 h-6 text-[#13C5DD] animate-spin mx-auto" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No active appointments in queue.</div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {appointments.map((apt) => {
                const isSelected = selectedApt?.id === apt.id;
                return (
                  <div
                    key={apt.id}
                    onClick={() => selectPatient(apt)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#13C5DD]/10 border-[#13C5DD] shadow-sm"
                        : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#13C5DD] text-[#1D2A4D] font-extrabold flex items-center justify-center text-xs shadow-sm">
                          {apt.token_number}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white">{apt.patient_name}</div>
                          <div className="text-[10px] text-slate-400">{apt.patient_uhid} • {apt.gender}, {apt.age}y</div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        apt.status === "completed" ? "bg-emerald-500/20 text-emerald-500" :
                        apt.status === "in_consultation" ? "bg-blue-500/20 text-blue-500 animate-pulse" :
                        "bg-amber-500/20 text-amber-500"
                      }`}>
                        {apt.status === "in_consultation" ? "In Room" : apt.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Active EMR Consultation Writer */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {selectedApt ? (
            <form onSubmit={handleSaveConsultation} className="space-y-6">
              
              {/* Active Patient Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
                <div>
                  <div className="text-base font-extrabold font-poppins text-slate-900 dark:text-white flex items-center gap-2">
                    {selectedApt.patient_name}
                    <span className="text-xs font-bold text-[#13C5DD]">({selectedApt.patient_uhid})</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Blood: <strong className="text-slate-700 dark:text-slate-200">{selectedApt.blood_group || "N/A"}</strong> | Slot: {selectedApt.slot_time} | Token: {selectedApt.token_number}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Patient
                  </span>
                </div>
              </div>

              {/* Vitals Recording Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase">Consultation Vitals</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5 font-bold">BP (Sys/Dia mmHg)</label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        value={vitals.bp_systolic}
                        onChange={(e) => setVitals({ ...vitals, bp_systolic: parseInt(e.target.value) || 0 })}
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                      />
                      <input
                        type="number"
                        value={vitals.bp_diastolic}
                        onChange={(e) => setVitals({ ...vitals, bp_diastolic: parseInt(e.target.value) || 0 })}
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5 font-bold">Heart Rate (BPM)</label>
                    <input
                      type="number"
                      value={vitals.heart_rate}
                      onChange={(e) => setVitals({ ...vitals, heart_rate: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5 font-bold">SpO2 (%)</label>
                    <input
                      type="number"
                      value={vitals.spo2}
                      onChange={(e) => setVitals({ ...vitals, spo2: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5 font-bold">Temp (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={vitals.temperature}
                      onChange={(e) => setVitals({ ...vitals, temperature: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* SOAP Clinical Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Chief Complaints & Duration
                  </label>
                  <textarea
                    rows={2}
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#13C5DD]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Clinical Diagnosis *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acute Bronchitis / Type 2 Diabetes"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#13C5DD] font-bold"
                  />
                </div>
              </div>

              {/* E-Prescriptions Module */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-[#13C5DD]" /> Electronic Prescription (Rx)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddRxItem}
                    className="px-3 py-1.5 rounded-xl bg-[#13C5DD]/15 text-[#13C5DD] text-xs font-extrabold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Medicine
                  </button>
                </div>

                <div className="space-y-2">
                  {rxItems.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-12 gap-2 text-xs items-center">
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="Medicine name"
                          value={item.medicine_name}
                          onChange={(e) => {
                            const updated = [...rxItems];
                            updated[idx].medicine_name = e.target.value;
                            setRxItems(updated);
                          }}
                          className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Dosage (500mg)"
                          value={item.dosage}
                          onChange={(e) => {
                            const updated = [...rxItems];
                            updated[idx].dosage = e.target.value;
                            setRxItems(updated);
                          }}
                          className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={item.frequency}
                          onChange={(e) => {
                            const updated = [...rxItems];
                            updated[idx].frequency = e.target.value;
                            setRxItems(updated);
                          }}
                          className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                        >
                          <option>1-0-1 (Twice)</option>
                          <option>1-1-1 (Thrice)</option>
                          <option>1-0-0 (Morning)</option>
                          <option>0-0-1 (Night)</option>
                          <option>SOS (As Needed)</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="Duration (5 Days)"
                          value={item.duration_days}
                          onChange={(e) => {
                            const updated = [...rxItems];
                            updated[idx].duration_days = e.target.value;
                            setRxItems(updated);
                          }}
                          className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveRxItem(idx)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Investigation Orders Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-[#13C5DD]" /> Order Diagnostic Investigations
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {labCatalog.map((test) => {
                    const isChecked = selectedLabs.includes(test.id);
                    return (
                      <label
                        key={test.id}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                          isChecked
                            ? "bg-[#13C5DD]/15 border-[#13C5DD] text-[#1D2A4D] dark:text-white font-bold"
                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLabs([...selectedLabs, test.id]);
                            } else {
                              setSelectedLabs(selectedLabs.filter((id) => id !== test.id));
                            }
                          }}
                          className="accent-[#13C5DD]"
                        />
                        <span className="truncate">{test.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Action Submit Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#13C5DD] to-[#0F6CBD] text-white font-extrabold text-xs shadow-lg uppercase flex items-center gap-2 disabled:opacity-50 hover:opacity-95 transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving Consultation...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Consultation & Issue Rx
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            <div className="py-20 text-center text-xs text-slate-400">
              Select a patient from the OPD queue on the left to begin consultation.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
