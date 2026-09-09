"use client";

import React, { useState, useEffect } from "react";
import { usePortal } from "@/context/PortalContext";
import {
  UserCheck,
  Ticket,
  Search,
  Plus,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  QrCode,
  Loader2,
  Eye
} from "lucide-react";

export default function ReceptionPanel() {
  const { setSelectedUhid } = usePortal();
  const [activeTab, setActiveTab] = useState<"register" | "token" | "search">("token");
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Patient Form
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    gender: "Male",
    mobile: "",
    email: "",
    blood_group: "B+",
    abha_id: "",
    address: "",
    city: "Ahmedabad",
    insurance_provider: "",
    insurance_policy_number: "",
  });

  // Token Issuance Form
  const [tokenData, setTokenData] = useState({
    patient_uhid: "",
    doctor_id: "3", // Dr. Rajesh Patel
    department_id: "DEP-MED",
    slot_time: "10:30 AM",
    chief_complaint: "General OPD Consultation",
  });

  const [issuedToken, setIssuedToken] = useState<any>(null);

  const loadPatientsAndQueue = async () => {
    try {
      const [pRes, aRes] = await Promise.all([
        fetch(`/api/patients${searchQuery ? `?query=${searchQuery}` : ''}`),
        fetch("/api/appointments")
      ]);
      const pJson = await pRes.json();
      const aJson = await aRes.json();
      if (pJson.success) setPatients(pJson.patients);
      if (aJson.success) setAppointments(aJson.appointments);
    } catch (err) {
      console.error("Failed to load reception data:", err);
    }
  };

  useEffect(() => {
    loadPatientsAndQueue();
  }, [searchQuery]);

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setFeedback(`Patient registered successfully! UHID: ${json.uhid}`);
        setTokenData({ ...tokenData, patient_uhid: json.uhid });
        setActiveTab("token");
        loadPatientsAndQueue();
      } else {
        alert(json.error || "Failed to register patient");
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleIssueToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenData.patient_uhid) {
      alert("Please enter or select a Patient UHID");
      return;
    }

    setSubmitting(true);
    setIssuedToken(null);
    setFeedback(null);

    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_uhid: tokenData.patient_uhid,
          doctor_id: parseInt(tokenData.doctor_id),
          department_id: tokenData.department_id,
          appointment_date: today,
          slot_time: tokenData.slot_time,
          chief_complaint: tokenData.chief_complaint,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIssuedToken(json);
        setFeedback(`Token ${json.token_number} generated successfully!`);
        loadPatientsAndQueue();
      } else {
        alert(json.error || "Failed to issue token");
      }
    } catch (err) {
      console.error(err);
      alert("Token issuance failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> FRONT DESK & PATIENT REGISTRATION
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
            Reception Desk • UHID Generation & OPD Token Dispatcher
          </h1>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("token")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "token" ? "bg-[#13C5DD] text-[#1D2A4D] shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Issue OPD Token
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "register" ? "bg-[#13C5DD] text-[#1D2A4D] shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            + New Patient (UHID)
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "search" ? "bg-[#13C5DD] text-[#1D2A4D] shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Search Directory
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form Area */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          
          {/* TAB 1: ISSUE TOKEN */}
          {activeTab === "token" && (
            <form onSubmit={handleIssueToken} className="space-y-4">
              <h2 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#13C5DD]" /> Dispense Live OPD Consultation Token
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Existing Patient or Enter UHID *
                  </label>
                  <select
                    value={tokenData.patient_uhid}
                    onChange={(e) => setTokenData({ ...tokenData, patient_uhid: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold"
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map((p) => (
                      <option key={p.uhid} value={p.uhid}>
                        {p.full_name} ({p.uhid}) — {p.mobile}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Assigned Specialty Doctor *
                    </label>
                    <select
                      value={tokenData.doctor_id}
                      onChange={(e) => setTokenData({ ...tokenData, doctor_id: e.target.value })}
                      className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    >
                      <option value="3">Dr. Rajesh Patel (General Medicine)</option>
                      <option value="4">Dr. Sneha Shah (Cardiology)</option>
                      <option value="5">Dr. Amit Mehta (Orthopedics)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Slot Time
                    </label>
                    <input
                      type="text"
                      value={tokenData.slot_time}
                      onChange={(e) => setTokenData({ ...tokenData, slot_time: e.target.value })}
                      className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Chief Presenting Complaint
                  </label>
                  <input
                    type="text"
                    value={tokenData.chief_complaint}
                    onChange={(e) => setTokenData({ ...tokenData, chief_complaint: e.target.value })}
                    placeholder="e.g. Fever, cough for 3 days"
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#13C5DD] to-[#0F6CBD] text-white font-extrabold text-xs shadow-md uppercase disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ticket className="w-4 h-4" />}
                Generate & Print Token
              </button>

              {issuedToken && (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-in zoom-in-95">
                  <div className="text-xs text-emerald-500 font-extrabold uppercase">Token Issued Successfully!</div>
                  <div className="text-5xl font-black font-poppins text-slate-900 dark:text-white tracking-wider">
                    {issuedToken.token_number}
                  </div>
                  <div className="text-xs text-slate-400">
                    Appointment #{issuedToken.appointment_number} • Direct patient to OPD Consultation Wing
                  </div>
                </div>
              )}
            </form>
          )}

          {/* TAB 2: REGISTER NEW PATIENT */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterPatient} className="space-y-4">
              <h2 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#13C5DD]" /> Register New Patient & Generate Unique UHID
              </h2>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar Patel"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Age (Years) *</label>
                    <input
                      type="number"
                      required
                      placeholder="45"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98250 00000"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                    <select
                      value={formData.blood_group}
                      onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-[#13C5DD]"
                    >
                      <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                      <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ABHA Health ID (Ayushman)</label>
                    <input
                      type="text"
                      placeholder="91-0000-0000-0000"
                      value={formData.abha_id}
                      onChange={(e) => setFormData({ ...formData, abha_id: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Insurance / PM-JAY Provider</label>
                    <input
                      type="text"
                      placeholder="Star Health / PM-JAY Ayushman"
                      value={formData.insurance_provider}
                      onChange={(e) => setFormData({ ...formData, insurance_provider: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Residential Address</label>
                  <input
                    type="text"
                    placeholder="Area, Street, City"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#13C5DD] to-[#0F6CBD] text-white font-extrabold text-xs shadow-md uppercase disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                Create Patient & Generate UHID
              </button>
            </form>
          )}

          {/* TAB 3: SEARCH DIRECTORY */}
          {activeTab === "search" && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by UHID (e.g. MC-2026-000101), Name, Phone, or ABHA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                />
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {patients.map((p) => (
                  <div
                    key={p.uhid}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        {p.full_name}
                        <span className="text-[10px] text-[#13C5DD] font-mono">{p.uhid}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {p.gender}, {p.age}y • Mobile: {p.mobile} • Blood: {p.blood_group}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedUhid(p.uhid)}
                      className="px-3 py-1.5 rounded-xl bg-[#13C5DD]/15 text-[#13C5DD] font-bold text-xs flex items-center gap-1 hover:bg-[#13C5DD]/25 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Dossier
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Live Waiting Monitor */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#00C896]" /> Live OPD Waiting Display
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-extrabold">
              LIVE QUEUE
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#13C5DD] text-[#1D2A4D] font-black flex items-center justify-center text-xs shadow-sm">
                    {apt.token_number}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white">{apt.patient_name}</div>
                    <div className="text-[10px] text-slate-400">{apt.doctor_name} • Slot {apt.slot_time}</div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                  apt.status === "completed" ? "bg-emerald-500/15 text-emerald-500" :
                  apt.status === "in_consultation" ? "bg-blue-500/15 text-blue-500" :
                  "bg-amber-500/15 text-amber-500"
                }`}>
                  ● {apt.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
