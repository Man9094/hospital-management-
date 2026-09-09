"use client";

import React from "react";
import { Building2, ShieldCheck, Activity, DollarSign, Users, Database, Globe, TrendingUp, AlertTriangle } from "lucide-react";

export default function SuperAdminPanel() {
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white">
            Super Admin Global Command Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Multi-tenant telemetry, SaaS licensing, server infrastructure & global security policy center
          </p>
        </div>
        <span className="self-start px-3 py-1 rounded-full bg-[#00C896]/15 text-[#00C896] text-xs font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00C896] animate-ping" /> Global Tenant Health: Optimal
        </span>
      </div>

      {/* Top Telemetry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-medium">Total Multi-Hospital Tenants</div>
          <div className="text-3xl font-extrabold font-poppins text-slate-900 dark:text-white">520 Nodes</div>
          <div className="text-[11px] text-[#00C896] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14 Networks Onboarded
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-medium">SaaS Monthly ARR</div>
          <div className="text-3xl font-extrabold font-poppins text-slate-900 dark:text-white">$482,500</div>
          <div className="text-[11px] text-[#0F6CBD] dark:text-[#4CC9F0] font-semibold">
            99.8% Annual Renewal Rate
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-medium">Cloud Database Write Latency</div>
          <div className="text-3xl font-extrabold font-poppins text-[#00C896]">1.2 ms</div>
          <div className="text-[11px] text-slate-400 font-medium">AWS / Azure Bio-Cloud Vault</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-medium">HIPAA Encryption Status</div>
          <div className="text-3xl font-extrabold font-poppins text-blue-500">AES-256</div>
          <div className="text-[11px] text-[#00C896] font-semibold">Zero PHI Vulnerabilities</div>
        </div>
      </div>

      {/* Hospital Tenants Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-poppins text-slate-900 dark:text-white">
            Active Multi-Branch SaaS Tenants
          </h2>
          <button className="px-3 py-1.5 rounded-xl bg-[#0F6CBD] text-white text-xs font-bold">
            + Provision New Hospital Node
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="pb-3">Hospital Organization</th>
                <th className="pb-3">Plan Tier</th>
                <th className="pb-3">Active Doctors</th>
                <th className="pb-3">IPD Beds</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">SLA Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3 font-bold text-slate-900 dark:text-white">St. Jude Health System</td>
                <td><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">Enterprise</span></td>
                <td>142 Doctors</td>
                <td>500 Beds</td>
                <td><span className="text-[#00C896] font-bold">Active</span></td>
                <td>99.999% SLA</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900 dark:text-white">Mayo Specialist Network</td>
                <td><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">Enterprise</span></td>
                <td>280 Doctors</td>
                <td>850 Beds</td>
                <td><span className="text-[#00C896] font-bold">Active</span></td>
                <td>100% SLA</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900 dark:text-white">Metro City Clinic</td>
                <td><span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-500 font-bold">Professional</span></td>
                <td>18 Doctors</td>
                <td>40 Beds</td>
                <td><span className="text-[#00C896] font-bold">Active</span></td>
                <td>99.98% SLA</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
