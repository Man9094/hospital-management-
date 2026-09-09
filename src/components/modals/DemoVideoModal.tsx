"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortal } from "@/context/PortalContext";
import { X, Play, Shield, Activity, Users, Database, Zap } from "lucide-react";

export default function DemoVideoModal() {
  const { isDemoVideoOpen, setIsDemoVideoOpen } = usePortal();
  const [activeBookmark, setActiveBookmark] = useState(0);

  if (!isDemoVideoOpen) return null;

  const bookmarks = [
    { title: "0:00 - Enterprise Overview", icon: Activity, desc: "Global multi-branch dashboard & live bed matrix" },
    { title: "1:45 - Doctor OPD & EHR Vitals", icon: Users, desc: "AI-assisted clinical note taking & e-prescriptions" },
    { title: "3:30 - Pharmacy & Stock Automation", icon: Zap, desc: "Barcode stock scanner & auto-reorder thresholds" },
    { title: "5:10 - HIPAA Security & Audit Logs", icon: Shield, desc: "Role permissions & 256-bit automated encryption" },
    { title: "6:50 - Patient Portal & Telemedicine", icon: Database, desc: "Self-service scheduling & lab report downloads" }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#0F6CBD]/10 text-[#0F6CBD] dark:text-[#4CC9F0]">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-poppins text-slate-900 dark:text-white">
                  MedCore Enterprise Product Walkthrough
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Full 8-minute interactive demonstration for Chief Medical Officers & IT Directors
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDemoVideoOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Mockup Area */}
          <div className="relative aspect-video bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0F6CBD]/30 via-transparent to-[#00C896]/20" />
            <div className="relative z-10 text-center p-6 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#0F6CBD] text-white flex items-center justify-center shadow-xl shadow-[#0F6CBD]/40 border-4 border-white/20 animate-pulse">
                <Play className="w-10 h-10 fill-current ml-1" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">
                  Playing: {bookmarks[activeBookmark].title}
                </h4>
                <p className="text-sm text-slate-300 max-w-md mx-auto mt-1">
                  {bookmarks[activeBookmark].desc}
                </p>
              </div>
            </div>

            {/* Video Timeline Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
              <div className="h-full bg-gradient-to-r from-[#0F6CBD] via-[#4CC9F0] to-[#00C896] w-2/5 animate-pulse" />
            </div>
          </div>

          {/* Interactive Bookmark Chapters */}
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {bookmarks.map((bm, index) => {
              const Icon = bm.icon;
              return (
                <button
                  key={index}
                  onClick={() => setActiveBookmark(index)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left border transition-all ${
                    activeBookmark === index
                      ? "bg-[#0F6CBD]/10 border-[#0F6CBD] text-[#0F6CBD] dark:text-[#4CC9F0]"
                      : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold">{bm.title}</div>
                    <div className="text-[10px] opacity-75 truncate max-w-[160px]">{bm.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
