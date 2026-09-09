"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ECGPulse from "@/components/ui/ECGPulse";
import { Activity, AlertTriangle, ArrowLeft, Home, RefreshCw } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center space-y-6 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 animate-pulse" /> Diagnostic Error: 404 Page Asystole
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="text-6xl font-extrabold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-[#0F6CBD]">
            404
          </div>
          
          <div className="text-sm font-semibold text-slate-300">
            Clinical Record / Route Not Found
          </div>

          <ECGPulse color="#E63946" className="h-12 my-2" />

          <p className="text-xs text-slate-400 leading-relaxed">
            The requested medical resource or portal URL could not be located in the MedCore active directory. The endpoint may have been archived or reassigned.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#0F6CBD] to-[#00C896] text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Return to Main Landing
          </Link>
          <Link
            href="/app"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4 text-[#4CC9F0]" /> Command Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
