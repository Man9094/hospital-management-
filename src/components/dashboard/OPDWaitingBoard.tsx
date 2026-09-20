"use client";

import React, { useState, useEffect } from "react";
import {
  Monitor,
  Volume2,
  VolumeX,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Activity,
  RefreshCw,
  Stethoscope,
  Bell
} from "lucide-react";

export default function OPDWaitingBoard() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  // Live Digital Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [docRes, aptRes] = await Promise.all([
        fetch("/api/doctor-status"),
        fetch("/api/appointments"),
      ]);
      const docJson = await docRes.json();
      const aptJson = await aptRes.json();

      if (docJson.success) setDoctors(docJson.doctors || []);
      if (aptJson.success) setAppointments(aptJson.appointments || []);
    } catch (err) {
      console.error("Failed to load OPD display data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Poll every 8 seconds for live waiting screen
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio API Ding-Dong Chime Simulation
  const playHospitalChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime + 0.35); // C5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc1.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc1.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.error("Chime error:", e);
    }
  };

  const triggerCallSimulation = (caseNum: number, tokenNum: string, cabin: string) => {
    playHospitalChime();
    setAnnouncement(`Token ${tokenNum} (Case #${caseNum}), please proceed to ${cabin}`);
    setTimeout(() => setAnnouncement(null), 8000);
  };

  return (
    <div className="min-h-[85vh] flex flex-col space-y-4">
      {/* OPD Digital Signage Display Header */}
      <div className="p-5 rounded-lg bg-[#4A1F2B] text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white text-xl font-bold shadow-xs">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3F6B52] border border-white animate-ping" />
              <span className="text-[10px] font-bold tracking-widest text-[#F7B5C3] uppercase">
                Apex MedCore · Central OPD Live Queue Display
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-poppins text-white mt-0.5 tracking-tight">
              Out-Patient Department Cabin &amp; Token Monitor
            </h1>
          </div>
        </div>

        {/* Live Clock & Audio Controls */}
        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-lg bg-black/25 border border-white/15 text-right">
            <div className="text-[9px] uppercase font-semibold text-[#F7B5C3]">Hospital Time</div>
            <div className="text-lg font-bold font-mono tabular-nums text-white">{currentTime || "--:--:--"}</div>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled
                ? "bg-white/15 border-white/30 text-white"
                : "bg-black/20 border-white/10 text-white/50"
            }`}
            title={soundEnabled ? "Mute Chime" : "Enable Chime"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={loadData}
            className="p-2 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-colors"
            title="Refresh Live Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Audio Announcement Banner */}
      {announcement && (
        <div className="p-3 rounded-lg bg-[#9A6A25]/15 border border-[#9A6A25]/40 text-[#9A6A25] dark:text-[#E8BD68] text-xs font-bold flex items-center justify-between shadow-xs animate-pulse">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#9A6A25]" />
            <span>{announcement}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#9A6A25] text-white text-[10px] font-bold">
            ANNOUNCING
          </span>
        </div>
      )}

      {/* Main Grid: Doctor Cabins Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        {doctors.map((doc, idx) => {
          const docApts = appointments.filter((a) => a.doctor_id === doc.doctor_id);
          const activeApt = docApts.find((a) => a.status === "in_consultation");
          const waitingApts = docApts.filter((a) => a.status === "waiting" || a.status === "scheduled");
          const nextApt = waitingApts[0];

          const completedApts = docApts.filter((a) => a.status === "completed" && a.duration_minutes > 0);
          const avgDuration =
            completedApts.length > 0
              ? (completedApts.reduce((acc, curr) => acc + curr.duration_minutes, 0) / completedApts.length).toFixed(1)
              : "12.0";

          const isLate = doc.delay_minutes > 0;
          const statusBg =
            doc.status === "in_cabin"
              ? "bg-[#3F6B52]/15 text-[#3F6B52]"
              : doc.status === "running_late" || isLate
              ? "bg-[#9A6A25]/15 text-[#9A6A25]"
              : "bg-[#83505B]/15 text-[#83505B]";

          return (
            <div
              key={doc.doctor_id || `doc-${idx}`}
              className="flex flex-col justify-between rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-xs overflow-hidden hover:border-[#4A1F2B] transition-all"
            >
              {/* Doctor & Cabin Banner */}
              <div className="p-4 bg-[#F8F2F2] dark:bg-[#18141C] border-b border-[#EDE7E6] dark:border-[#32293D]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-[#83505B] dark:text-[#C08491] tracking-wider">
                      {doc.cabin_number || "Cabin 104"} · {doc.department_name || "Specialty OPD"}
                    </div>
                    <h2 className="text-base font-bold text-[#1D1B1B] dark:text-white mt-0.5">
                      {doc.doctor_name}
                    </h2>
                    <div className="text-[11px] text-[#514346] dark:text-[#A89CA0] truncate max-w-[220px]">
                      {doc.qualification}
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusBg}`}>
                    ● {doc.status === "in_cabin" ? "In Cabin" : doc.status === "running_late" || isLate ? `Late +${doc.delay_minutes}m` : doc.status.replace("_", " ")}
                  </span>
                </div>

                {isLate && (
                  <div className="mt-2.5 p-2 rounded bg-[#9A6A25]/15 border border-[#9A6A25]/30 text-[#9A6A25] dark:text-[#E8BD68] text-[11px] font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Doctor Delayed by <strong>+{doc.delay_minutes} mins</strong>
                      {doc.delay_reason && ` (${doc.delay_reason})`}
                    </span>
                  </div>
                )}
              </div>

              {/* CURRENTLY IN CABIN (NOW SERVING) */}
              <div className="p-5 text-center space-y-2.5 flex-1 flex flex-col justify-center bg-white dark:bg-[#241D29]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#3F6B52] flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3F6B52] animate-pulse" />
                  NOW SERVING IN CABIN
                </div>

                {activeApt ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2.5">
                      <div className="px-3.5 py-1.5 rounded-lg bg-[#3F6B52]/15 border border-[#3F6B52]/30 text-[#3F6B52]">
                        <span className="text-[10px] font-semibold block">CASE</span>
                        <span className="text-2xl font-bold tabular-nums">#{activeApt.case_number || 1}</span>
                      </div>
                      <div className="px-4 py-1.5 rounded-lg bg-[#4A1F2B] text-white shadow-xs">
                        <span className="text-[10px] font-semibold block text-[#F7B5C3]">TOKEN</span>
                        <span className="text-2xl font-bold tabular-nums font-mono">{activeApt.token_number}</span>
                      </div>
                    </div>

                    <div className="text-sm font-bold text-[#1D1B1B] dark:text-white pt-0.5">
                      {activeApt.patient_name}
                    </div>

                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EDE7E6] dark:bg-[#32293D] text-[#83505B] dark:text-[#C08491] text-[11px] font-semibold">
                      <Clock className="w-3 h-3" />
                      In Consultation ({activeApt.slot_time})
                    </div>
                  </div>
                ) : (
                  <div className="py-4 px-3 rounded-lg border border-dashed border-[#EDE7E6] dark:border-[#32293D] text-[#837376] text-xs space-y-0.5">
                    <div className="font-semibold text-[#1D1B1B] dark:text-white">Cabin Ready For Next Case</div>
                    <div className="text-[10px]">No active consultation inside cabin currently.</div>
                  </div>
                )}
              </div>

              {/* NEXT IN LINE */}
              <div className="p-3.5 bg-[#F8F2F2] dark:bg-[#18141C] border-t border-[#EDE7E6] dark:border-[#32293D] space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold text-[#837376] text-[10px] uppercase">
                  <span>Next Patients in Line</span>
                  <span>{waitingApts.length} in Queue</span>
                </div>

                {nextApt ? (
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-[#F3E9EB] text-[#4A1F2B] dark:bg-[#4A1F2B] dark:text-white font-bold flex items-center justify-center text-xs">
                        #{nextApt.case_number || 2}
                      </span>
                      <div>
                        <div className="font-bold text-[#1D1B1B] dark:text-white">
                          Token {nextApt.token_number} · {nextApt.patient_name}
                        </div>
                        <div className="text-[10px] text-[#837376]">
                          Scheduled: {nextApt.slot_time} {nextApt.has_delay && <span className="text-[#9A6A25] font-bold">→ Est: {nextApt.adjusted_slot_time}</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => triggerCallSimulation(nextApt.case_number || 2, nextApt.token_number, doc.cabin_number || "Cabin 104")}
                      className="px-2 py-1 rounded bg-[#4A1F2B] text-white text-[10px] font-semibold hover:bg-[#70404B] transition-colors"
                      title="Play announcement chime"
                    >
                      Call Bell 🔔
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-1 text-[11px] text-[#837376]">
                    Queue is clear. No waiting patients.
                  </div>
                )}

                {/* Avg Duration Footer */}
                <div className="pt-1.5 flex items-center justify-between text-[10px] text-[#837376] border-t border-[#EDE7E6] dark:border-[#32293D]">
                  <span>Avg Duration: <strong>{avgDuration} mins</strong></span>
                  <span>Today: <strong>{docApts.length} Cases</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom OPD Running Ticker */}
      <div className="p-3 rounded-lg bg-[#18141C] text-white border border-[#3B3041] text-xs font-semibold flex items-center justify-between overflow-hidden shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded bg-[#4A1F2B] text-white font-bold text-[10px] uppercase shrink-0">
            OPD INSTRUCTIONS
          </span>
          <p className="text-[#A89CA0] truncate text-[11px]">
            Please watch the live token screen. When your Token Number is called, proceed directly to the designated Doctor Cabin. In case of doctor delay, adjusted slot times are displayed above.
          </p>
        </div>
        <div className="shrink-0 text-[#F7B5C3] font-mono text-[10px] hidden sm:block">
          ● REAL-TIME SYNCHRONIZED
        </div>
      </div>
    </div>
  );
}
