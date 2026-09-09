"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Building2,
  Users,
  Activity,
  Server,
  Lock,
  Search,
  Filter,
  Loader2,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function SuperAdminPanel() {
  const [logs, setLogs] = useState<any[]>([]);
  const [moduleFilter, setModuleFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAuditLogs() {
      setLoading(true);
      try {
        const res = await fetch(`/api/audit${moduleFilter ? `?module=${moduleFilter}` : ''}`);
        const json = await res.json();
        if (json.success && json.logs) {
          setLogs(json.logs);
        }
      } catch (err) {
        console.error("Failed to load audit logs:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAuditLogs();
  }, [moduleFilter]);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> SUPER ADMIN & SECURITY GOVERNANCE
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
            Enterprise SaaS Platform Telemetry & Immutable Audit Trail
          </h1>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-extrabold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> System Integrity 100%
        </div>
      </div>

      {/* Enterprise Architecture Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Primary Hospital Facility</span>
            <Building2 className="w-4 h-4 text-[#13C5DD]" />
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            Apex MedCore Multispeciality
          </div>
          <div className="text-[11px] text-slate-400">
            Reg: <span className="font-mono">GJ-AHM-MED-2024-8841</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Security Architecture</span>
            <Lock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
            ABDM & HIPAA Aligned
          </div>
          <div className="text-[11px] text-slate-400">
            AES-256 GCM Payload Encryption
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Active Staff Sessions</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            12 Role-Segregated Users
          </div>
          <div className="text-[11px] text-slate-400">
            Strict RBAC & API Authorization
          </div>
        </div>
      </div>

      {/* Immutable Security Audit Log Viewer */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#13C5DD]" /> Immutable System Audit Log
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Tamper-evident logs of medical consultations, drug dispensing, payments & patient access.</p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
            >
              <option value="">All Hospital Modules</option>
              <option value="Reception">Reception Desk</option>
              <option value="OPD">OPD Queue</option>
              <option value="EMR">Doctor EMR</option>
              <option value="LIS">Laboratory (LIS)</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Billing">Billing Desk</option>
              <option value="IPD Admission">IPD Admission</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-6 h-6 text-[#13C5DD] animate-spin mx-auto" />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">No audit log records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-mono">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-extrabold uppercase">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User & Role</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Patient UHID</th>
                  <th className="p-3">Details & Telemetry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white font-sans">{log.user_name || "System"}</div>
                      <div className="text-[10px] text-[#13C5DD] uppercase">{log.role}</div>
                    </td>
                    <td className="p-3 font-bold text-slate-700 dark:text-slate-300 font-sans">{log.module}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-extrabold text-[#13C5DD]">{log.patient_uhid || "—"}</td>
                    <td className="p-3 font-sans text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {log.details}
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
