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
  Eye,
  Monitor,
  Clock,
  User,
  Check
} from "lucide-react";

export default function ReceptionPanel() {
  const { setSelectedUhid } = usePortal();
  const [activeTab, setActiveTab] = useState<"token" | "register" | "search">("token");
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
    doctor_id: "3",
    department_id: "DEP-MED",
    slot_time: "10:30 AM",
    chief_complaint: "General OPD Consultation",
    cabin_number: "Cabin 104",
  });

  const [issuedToken, setIssuedToken] = useState<any>(null);

  const loadReceptionData = async () => {
    try {
      const [pRes, aRes, dRes] = await Promise.all([
        fetch(`/api/patients${searchQuery ? `?query=${searchQuery}` : ""}`),
        fetch("/api/appointments"),
        fetch("/api/doctor-status"),
      ]);
      const pJson = await pRes.json();
      const aJson = await aRes.json();
      const dJson = await dRes.json();

      if (pJson.success) setPatients(pJson.patients || []);
      if (aJson.success) setAppointments(aJson.appointments || []);
      if (dJson.success) setDoctors(dJson.doctors || []);
    } catch (err) {
      console.error("Failed to load reception data:", err);
    }
  };

  useEffect(() => {
    loadReceptionData();
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
        loadReceptionData();
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
      const selectedDoc = doctors.find((d) => d.doctor_id === parseInt(tokenData.doctor_id));

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
          cabin_number: selectedDoc?.cabin_number || "Cabin 104",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIssuedToken(json);
        setFeedback(`Case #${json.case_number} (Token ${json.token_number}) generated successfully!`);
        loadReceptionData();
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
    <div className="space-y-4">
      {/* Title Strip */}
      <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#4A1F2B] text-white flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#83505B] dark:text-[#C08491] uppercase tracking-wider">
              FRONT DESK &amp; PATIENT REGISTRATION
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#1D1B1B] dark:text-[#FEF8F7]">
              Reception Desk · UHID Generation &amp; OPD Token Dispatcher
            </h1>
          </div>
        </div>

        {/* Tab Controls & Waiting Board Quick Link */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041]">
            <button
              onClick={() => setActiveTab("token")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "token" ? "bg-[#4A1F2B] text-white shadow-xs" : "text-[#514346] dark:text-[#A89CA0] hover:text-[#1D1B1B] dark:hover:text-white"
              }`}
            >
              Issue Token
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "register" ? "bg-[#4A1F2B] text-white shadow-xs" : "text-[#514346] dark:text-[#A89CA0] hover:text-[#1D1B1B] dark:hover:text-white"
              }`}
            >
              + New Patient
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "search" ? "bg-[#4A1F2B] text-white shadow-xs" : "text-[#514346] dark:text-[#A89CA0] hover:text-[#1D1B1B] dark:hover:text-white"
              }`}
            >
              Directory Search
            </button>
          </div>

          <a
            href="#opd-board"
            className="px-3 py-1.5 rounded-lg bg-[#EDE7E6] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white border border-[#E3DFDB] dark:border-[#3B3041] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#E7E1E1] transition-colors"
          >
            <Monitor className="w-3.5 h-3.5 text-[#83505B] dark:text-[#C08491]" />
            <span>Digital Board</span>
          </a>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg bg-[#3F6B52]/15 border border-[#3F6B52]/30 text-[#3F6B52] dark:text-[#7FD1A5] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#3F6B52] shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Form Area (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-4 shadow-xs space-y-3">
          {/* TAB 1: ISSUE TOKEN */}
          {activeTab === "token" && (
            <form onSubmit={handleIssueToken} className="space-y-3 text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
                <Ticket className="w-4 h-4 text-[#4A1F2B] dark:text-[#C08491]" />
                <h2 className="text-sm font-bold text-[#1D1B1B] dark:text-white">
                  Dispense Live OPD Consultation Token &amp; Case Slot
                </h2>
              </div>

              <div>
                <label className="block font-semibold text-[#514346] dark:text-[#A89CA0] mb-1">
                  Select Existing Patient or Enter UHID *
                </label>
                <select
                  value={tokenData.patient_uhid}
                  onChange={(e) => setTokenData({ ...tokenData, patient_uhid: e.target.value })}
                  className="w-full h-9 px-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white font-semibold focus:outline-none focus:border-[#4A1F2B]"
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
                  <label className="block font-semibold text-[#514346] dark:text-[#A89CA0] mb-1">
                    Assigned Specialty Doctor *
                  </label>
                  <select
                    value={tokenData.doctor_id}
                    onChange={(e) => setTokenData({ ...tokenData, doctor_id: e.target.value })}
                    className="w-full h-9 px-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white focus:outline-none focus:border-[#4A1F2B]"
                  >
                    <option value="3">Dr. Rajesh Patel (General Medicine - Cabin 104)</option>
                    <option value="4">Dr. Sneha Shah (Cardiology - Cabin 201)</option>
                    <option value="5">Dr. Amit Mehta (Orthopedics - Cabin 108)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#514346] dark:text-[#A89CA0] mb-1">
                    Preferred Slot Time
                  </label>
                  <input
                    type="text"
                    value={tokenData.slot_time}
                    onChange={(e) => setTokenData({ ...tokenData, slot_time: e.target.value })}
                    className="w-full h-9 px-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white focus:outline-none focus:border-[#4A1F2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#514346] dark:text-[#A89CA0] mb-1">
                  Chief Presenting Complaint
                </label>
                <input
                  type="text"
                  value={tokenData.chief_complaint}
                  onChange={(e) => setTokenData({ ...tokenData, chief_complaint: e.target.value })}
                  placeholder="e.g. Fever, dry cough for 3 days"
                  className="w-full h-9 px-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white focus:outline-none focus:border-[#4A1F2B]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-9 rounded bg-[#4A1F2B] hover:bg-[#70404B] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ticket className="w-3.5 h-3.5" />}
                <span>Generate &amp; Print Case Slot Token</span>
              </button>

              {issuedToken && (
                <div className="p-4 rounded-lg bg-[#3F6B52]/10 border border-[#3F6B52]/30 text-center space-y-1.5 animate-in zoom-in-95">
                  <div className="text-[10px] text-[#3F6B52] font-bold uppercase tracking-wider">Token Issued Successfully!</div>
                  <div className="flex items-center justify-center gap-2.5">
                    <span className="px-3 py-1 rounded bg-[#3F6B52]/20 text-[#3F6B52] font-bold text-sm">
                      CASE #{issuedToken.case_number}
                    </span>
                    <span className="text-3xl font-bold font-mono text-[#1D1B1B] dark:text-white tracking-wider">
                      {issuedToken.token_number}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#837376]">
                    Allocated to <strong>{issuedToken.cabin_number || "Cabin 104"}</strong> · Direct patient to OPD waiting lounge
                  </div>
                </div>
              )}
            </form>
          )}

          {/* TAB 2: REGISTER NEW PATIENT */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterPatient} className="space-y-3 text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
                <Plus className="w-4 h-4 text-[#4A1F2B] dark:text-[#C08491]" />
                <h2 className="text-sm font-bold text-[#1D1B1B] dark:text-white">
                  Register New Patient &amp; Generate Unique UHID
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#514346] dark:text-[#A89CA0] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar Patel"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full h-8 px-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#514346] dark:text-[#A89CA0] mb-1">Age (Years) *</label>
                  <input
                    type="number"
                    required
                    placeholder="45"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full h-8 px-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#514346] dark:text-[#A89CA0] mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full h-8 px-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#514346] dark:text-[#A89CA0] mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98250 00000"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full h-8 px-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#514346] dark:text-[#A89CA0] mb-1">Blood Group</label>
                  <select
                    value={formData.blood_group}
                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                    className="w-full h-8 px-2 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#4A1F2B] dark:text-[#F7B5C3] font-bold"
                  >
                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                    <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#514346] dark:text-[#A89CA0] mb-1">ABHA Health ID</label>
                  <input
                    type="text"
                    placeholder="91-0000-0000-0000"
                    value={formData.abha_id}
                    onChange={(e) => setFormData({ ...formData, abha_id: e.target.value })}
                    className="w-full h-8 px-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#514346] dark:text-[#A89CA0] mb-1">Insurance / PM-JAY Provider</label>
                  <input
                    type="text"
                    placeholder="Star Health / PM-JAY Ayushman"
                    value={formData.insurance_provider}
                    onChange={(e) => setFormData({ ...formData, insurance_provider: e.target.value })}
                    className="w-full h-8 px-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#514346] dark:text-[#A89CA0] mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="Area, Street, City"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full h-8 px-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-9 rounded bg-[#4A1F2B] hover:bg-[#70404B] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
                <span>Create Patient &amp; Generate UHID</span>
              </button>
            </form>
          )}

          {/* TAB 3: SEARCH DIRECTORY */}
          {activeTab === "search" && (
            <div className="space-y-3 text-xs">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#837376]" />
                <input
                  type="text"
                  placeholder="Search by UHID, Name, Phone, or ABHA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-9 pr-3 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs text-[#1D1B1B] dark:text-white focus:outline-none focus:border-[#4A1F2B]"
                />
              </div>

              <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
                {patients.map((p) => (
                  <div
                    key={p.uhid}
                    className="p-3 rounded-lg bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-[#1D1B1B] dark:text-white flex items-center gap-1.5">
                        <span>{p.full_name}</span>
                        <span className="text-[10px] text-[#4A1F2B] dark:text-[#F7B5C3] font-mono">{p.uhid}</span>
                      </div>
                      <div className="text-[10px] text-[#837376] mt-0.5">
                        {p.gender}, {p.age}y · Mobile: {p.mobile} · Blood: {p.blood_group}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedUhid(p.uhid)}
                      className="px-2.5 py-1 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white font-semibold text-xs flex items-center gap-1 hover:bg-[#E7E1E1] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Dossier
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Live Waiting Monitor & Cabin Status (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
            <h2 className="text-sm font-bold text-[#1D1B1B] dark:text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#3F6B52]" /> Live Doctor Cabins &amp; Queue
            </h2>
            <span className="px-2 py-0.5 rounded bg-[#3F6B52]/15 text-[#3F6B52] text-[10px] font-bold">
              LIVE QUEUE
            </span>
          </div>

          {doctors.some((d) => d.delay_minutes > 0) && (
            <div className="p-2.5 rounded-lg bg-[#9A6A25]/15 border border-[#9A6A25]/30 text-[#9A6A25] dark:text-[#E8BD68] text-xs font-semibold space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" /> DOCTOR DELAYS ACTIVE:
              </div>
              {doctors.filter((d) => d.delay_minutes > 0).map((d) => (
                <div key={d.doctor_id} className="text-[10px]">
                  • <strong>{d.doctor_name} ({d.cabin_number})</strong>: +{d.delay_minutes} mins {d.delay_reason && `(${d.delay_reason})`}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 max-h-[480px] overflow-y-auto">
            {appointments.map((apt) => {
              const isInCabin = apt.status === "in_consultation";
              return (
                <div
                  key={apt.id}
                  className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition-all ${
                    isInCabin
                      ? "bg-[#3F6B52]/10 border-[#3F6B52]/40 shadow-xs"
                      : "bg-[#F8F2F2] dark:bg-[#18141C] border-[#E3DFDB] dark:border-[#3B3041]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg font-bold flex flex-col items-center justify-center text-[9px] shadow-xs ${
                      isInCabin ? "bg-[#3F6B52] text-white animate-pulse" : "bg-[#4A1F2B] text-white"
                    }`}>
                      <span className="text-[6px] leading-none">CASE</span>
                      <span className="text-[11px] leading-none">#{apt.case_number || 1}</span>
                    </div>
                    <div>
                      <div className="font-bold text-[#1D1B1B] dark:text-white flex items-center gap-1">
                        <span>{apt.patient_name}</span>
                        <span className="text-[10px] text-[#837376] font-mono">({apt.token_number})</span>
                      </div>
                      <div className="text-[10px] text-[#837376]">
                        {apt.doctor_name} · {apt.current_cabin_number || "Cabin 104"} · Slot {apt.slot_time}
                        {apt.has_delay && <span className="text-[#9A6A25] font-bold ml-1">(Est: {apt.adjusted_slot_time})</span>}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    apt.status === "completed" ? "bg-[#3F6B52]/15 text-[#3F6B52]" :
                    isInCabin ? "bg-[#3F6B52] text-white" :
                    "bg-[#EDE7E6] dark:bg-[#32293D] text-[#83505B] dark:text-[#C08491]"
                  }`}>
                    ● {isInCabin ? "IN CABIN" : apt.status.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
