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
        const res = await fetch(`/api/audit${moduleFilter ? `?module=${moduleFilter}` : ""}`);
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
    <div className="space-y-4">
      {/* Title */}
      <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#4A1F2B] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#83505B] dark:text-[#C08491] uppercase tracking-wider">
              SUPER ADMIN &amp; SECURITY GOVERNANCE
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#1D1B1B] dark:text-[#FEF8F7]">
              Enterprise Platform Telemetry &amp; Immutable Audit Trail
            </h1>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-[#3F6B52]/15 text-[#3F6B52] text-xs font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#3F6B52] animate-pulse" />
          <span>System Integrity 100% Verified</span>
        </div>
      </div>

      {/* Enterprise Architecture Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-[#837376] font-semibold uppercase tracking-wider">
            <span>Primary Facility</span>
            <Building2 className="w-4 h-4 text-[#83505B] dark:text-[#C08491]" />
          </div>
          <div className="text-base font-bold text-[#1D1B1B] dark:text-white">
            Apex MedCore Multispeciality
          </div>
          <div className="text-[11px] text-[#837376]">
            Reg: <span className="font-mono">GJ-AHM-MED-2024-8841</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-[#837376] font-semibold uppercase tracking-wider">
            <span>Security Architecture</span>
            <Lock className="w-4 h-4 text-[#3F6B52]" />
          </div>
          <div className="text-base font-bold text-[#3F6B52]">
            ABDM &amp; HIPAA Aligned
          </div>
          <div className="text-[11px] text-[#837376]">
            AES-256 GCM Payload Encryption
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-[#837376] font-semibold uppercase tracking-wider">
            <span>Active Staff Sessions</span>
            <Users className="w-4 h-4 text-[#83505B] dark:text-[#C08491]" />
          </div>
          <div className="text-base font-bold text-[#1D1B1B] dark:text-white">
            12 Role-Segregated Users
          </div>
          <div className="text-[11px] text-[#837376]">
            Strict RBAC &amp; API Authorization
          </div>
        </div>
      </div>

      {/* Immutable Security Audit Log Viewer */}
      <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#EDE7E6] dark:border-[#32293D]">
          <div>
            <h2 className="text-sm font-bold text-[#1D1B1B] dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#4A1F2B] dark:text-[#C08491]" /> Immutable System Audit Log
            </h2>
            <p className="text-[11px] text-[#837376] mt-0.5">Tamper-evident logs of consultations, drug dispensing, payments &amp; access.</p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#837376]" />
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="h-8 px-2.5 rounded bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs text-[#1D1B1B] dark:text-white font-semibold focus:outline-none focus:border-[#4A1F2B]"
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
            <Loader2 className="w-6 h-6 text-[#4A1F2B] dark:text-[#C08491] animate-spin mx-auto" />
            <span className="block text-xs text-[#837376] mt-2">Loading immutable audit logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#837376]">No audit log records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-mono">
              <thead>
                <tr className="bg-[#F8F2F2] dark:bg-[#18141C] text-[#837376] uppercase text-[10px] font-semibold border-b border-[#EDE7E6] dark:border-[#32293D]">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User &amp; Role</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Patient UHID</th>
                  <th className="p-3">Details &amp; Telemetry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE7E6] dark:divide-[#32293D] text-xs font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8F2F2]/60 dark:hover:bg-[#18141C]/60 transition-colors">
                    <td className="p-3 text-[#837376] whitespace-nowrap text-[11px]">{log.timestamp}</td>
                    <td className="p-3 font-sans">
                      <div className="font-bold text-[#1D1B1B] dark:text-white">{log.user_name || "System"}</div>
                      <div className="text-[10px] text-[#83505B] dark:text-[#C08491] uppercase">{log.role}</div>
                    </td>
                    <td className="p-3 font-bold text-[#1D1B1B] dark:text-white font-sans">{log.module}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-[#EDE7E6] dark:bg-[#32293D] text-[#1D1B1B] dark:text-white font-semibold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-[#4A1F2B] dark:text-[#F7B5C3]">{log.patient_uhid || "—"}</td>
                    <td className="p-3 font-sans text-[#514346] dark:text-[#A89CA0] max-w-xs truncate">
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
