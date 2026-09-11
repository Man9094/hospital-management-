"use client";

import React, { useState, useEffect } from "react";
import {
  Monitor,
  Volume2,
  VolumeX,
  Maximize2,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Activity,
  RefreshCw,
  Stethoscope
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
        fetch("/api/appointments")
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
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";

      // Note 1: High tone
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      // Note 2: Lower tone
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
    setAnnouncement(`🔔 Token ${tokenNum} (Case #${caseNum}), please proceed to ${cabin}`);
    setTimeout(() => setAnnouncement(null), 8000);
  };

  return (
    <div className="min-h-[85vh] flex flex-col space-y-6">
      
      {/* OPD Digital Signage Display Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0D1527] via-[#1D2A4D] to-[#0F365F] text-white border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#13C5DD]/20 border border-[#13C5DD]/40 flex items-center justify-center text-[#13C5DD] text-2xl font-black shadow-lg animate-pulse">
            <Monitor className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-extrabold tracking-widest text-[#13C5DD] uppercase">
                Apex MedCore • Central OPD Live Queue Display
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-poppins text-white mt-0.5 tracking-tight">
              Out-Patient Department Cabin & Token Monitor
            </h1>
          </div>
        </div>

        {/* Live Clock & Audio Controls */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-black/40 border border-slate-700/60 text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Current Hospital Time</div>
            <div className="text-xl font-black font-mono text-[#13C5DD]">{currentTime || "--:--:--"}</div>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-3 rounded-2xl border transition-all ${
              soundEnabled
                ? "bg-[#13C5DD]/20 border-[#13C5DD] text-[#13C5DD]"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
            title={soundEnabled ? "Mute Chime" : "Enable Chime"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={loadData}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-colors"
            title="Refresh Live Data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Audio Announcement Banner */}
      {announcement && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500 text-amber-900 dark:text-amber-200 text-sm font-black flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            <span>{announcement}</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-900 text-xs font-black">
            ANNOUNCING
          </span>
        </div>
      )}

      {/* Main Grid: Doctor Cabins Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {doctors.map((doc, idx) => {
          // Find active in_consultation appointment for this doctor
          const docApts = appointments.filter((a) => a.doctor_id === doc.doctor_id);
          const activeApt = docApts.find((a) => a.status === "in_consultation");
          const waitingApts = docApts.filter((a) => a.status === "waiting" || a.status === "scheduled");
          const nextApt = waitingApts[0];

          // Calculate average consultation duration
          const completedApts = docApts.filter((a) => a.status === "completed" && a.duration_minutes > 0);
          const avgDuration =
            completedApts.length > 0
              ? (completedApts.reduce((acc, curr) => acc + curr.duration_minutes, 0) / completedApts.length).toFixed(1)
              : "12.0";

          const isLate = doc.delay_minutes > 0;
          const statusBg =
            doc.status === "in_cabin"
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-500"
              : doc.status === "running_late" || isLate
              ? "bg-amber-500/15 border-amber-500/30 text-amber-500"
              : doc.status === "on_rounds"
              ? "bg-blue-500/15 border-blue-500/30 text-blue-500"
              : "bg-slate-500/15 border-slate-500/30 text-slate-400";

          return (
            <div
              key={doc.doctor_id || `doc-${idx}`}
              className="flex flex-col justify-between rounded-3xl bg-white dark:bg-[#1D2A4D] border-2 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden hover:border-[#13C5DD]/50 transition-all"
            >
              {/* Doctor & Cabin Banner */}
              <div className="p-5 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-black uppercase text-[#13C5DD] tracking-wider">
                      {doc.cabin_number || "Cabin 104"} • {doc.department_name || "Specialty OPD"}
                    </div>
                    <h2 className="text-lg font-black font-poppins text-slate-900 dark:text-white mt-0.5">
                      {doc.doctor_name}
                    </h2>
                    <div className="text-[11px] text-slate-400 font-medium truncate max-w-[220px]">
                      {doc.qualification}
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${statusBg}`}>
                    ● {doc.status === "in_cabin" ? "In Cabin" : doc.status === "running_late" || isLate ? `Late +${doc.delay_minutes}m` : doc.status.replace("_", " ")}
                  </span>
                </div>

                {/* Doctor Delay Alert Banner */}
                {isLate && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      Doctor Delayed by <strong>+{doc.delay_minutes} mins</strong>
                      {doc.delay_reason && ` (${doc.delay_reason})`}
                    </span>
                  </div>
                )}
              </div>

              {/* CURRENTLY IN CABIN (NOW SERVING) */}
              <div className="p-6 text-center space-y-3 flex-1 flex flex-col justify-center bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-900/30">
                <div className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center justify-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  NOW SERVING IN CABIN
                </div>

                {activeApt ? (
                  <div className="space-y-2 animate-in zoom-in-95">
                    {/* Big Case Number Highlight */}
                    <div className="flex items-center justify-center gap-3">
                      <div className="px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                        <span className="text-xs font-bold block">CASE</span>
                        <span className="text-3xl font-black font-poppins">#{activeApt.case_number || 1}</span>
                      </div>
                      <div className="px-5 py-2 rounded-2xl bg-[#13C5DD] text-[#1D2A4D] shadow-md">
                        <span className="text-xs font-bold block text-slate-800">TOKEN</span>
                        <span className="text-3xl font-black font-poppins">{activeApt.token_number}</span>
                      </div>
                    </div>

                    <div className="text-base font-extrabold text-slate-900 dark:text-white pt-1">
                      {activeApt.patient_name}
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      In Consultation ({activeApt.slot_time})
                    </div>
                  </div>
                ) : (
                  <div className="py-6 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs space-y-1">
                    <div className="font-bold text-slate-500 dark:text-slate-300">Cabin Ready For Next Case</div>
                    <div className="text-[10px]">No active consultation inside cabin at this moment.</div>
                  </div>
                )}
              </div>

              {/* NEXT IN LINE (UPCOMING CASE) */}
              <div className="p-4 bg-slate-100/80 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>NEXT PATIENTS IN LINE</span>
                  <span>{waitingApts.length} in Queue</span>
                </div>

                {nextApt ? (
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-purple-500/15 text-purple-500 font-black flex items-center justify-center text-xs">
                        #{nextApt.case_number || 2}
                      </span>
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white">
                          Token {nextApt.token_number} • {nextApt.patient_name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Scheduled: {nextApt.slot_time} {nextApt.has_delay && <span className="text-amber-500 font-bold">→ Est: {nextApt.adjusted_slot_time}</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => triggerCallSimulation(nextApt.case_number || 2, nextApt.token_number, doc.cabin_number || "Cabin 104")}
                      className="px-2.5 py-1 rounded-xl bg-[#13C5DD]/15 text-[#13C5DD] text-[10px] font-black uppercase hover:bg-[#13C5DD]/25 transition-colors"
                      title="Play announcement chime"
                    >
                      Call Bell 🔔
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2 text-[11px] text-slate-400">
                    Queue is clear. No waiting patients.
                  </div>
                )}

                {/* Avg Consultation Time Footer */}
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-medium border-t border-slate-200 dark:border-slate-800">
                  <span>Avg Duration: <strong>{avgDuration} mins/patient</strong></span>
                  <span>Total Today: <strong>{docApts.length} Cases</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom OPD Running Ticker */}
      <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 text-xs font-bold flex items-center justify-between overflow-hidden shadow-lg">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-xl bg-[#13C5DD] text-[#1D2A4D] font-black text-[10px] uppercase shrink-0">
            OPD INSTRUCTIONS
          </span>
          <p className="text-slate-300 truncate">
            Please watch the live token screen. When your Case Number is called, proceed directly to the designated Doctor Cabin room. In case of doctor delay, adjusted slot times are displayed above.
          </p>
        </div>
        <div className="shrink-0 text-[#13C5DD] font-mono text-[11px] hidden sm:block">
          ● REAL-TIME SYNCHRONIZED
        </div>
      </div>

    </div>
  );
}
