"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ECGPulse from "@/components/ui/ECGPulse";
import { Activity, AlertTriangle, ArrowLeft, Home, RefreshCw } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#18141C] text-[#ECE5E7] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg w-full text-center space-y-6 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#5C2329]/25 border border-[#8C3A45]/40 text-[#F497A4] text-xs font-semibold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-[#E2838E]" /> Diagnostic Error: 404 Page Asystole
        </div>

        <div className="p-6 rounded-lg bg-[#242026] border border-[#3E3842] shadow-[0_4px_16px_rgba(0,0,0,0.2)] space-y-4">
          <div className="text-6xl font-bold font-sans text-[#F3E9EB] tracking-tight">
            404
          </div>
          
          <div className="text-sm font-semibold text-[#D1C3C6]">
            Clinical Record / Route Not Found
          </div>

          <ECGPulse color="#8C3A45" className="h-10 my-2" />

          <p className="text-xs text-[#9B8E92] leading-relaxed">
            The requested medical resource or portal URL could not be located in the MedCore active directory. The endpoint may have been archived or reassigned.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-[#4A1F2B] hover:bg-[#5E2737] text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Return to Main Landing
          </Link>
          <Link
            href="/app"
            className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-[#2D2732] hover:bg-[#38313D] text-[#ECE5E7] font-medium text-xs border border-[#3E3842] transition-colors flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4 text-[#D1C3C6]" /> Command Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
