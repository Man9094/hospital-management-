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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl overflow-hidden rounded-lg bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-[0_4px_16px_rgba(41,39,39,0.08)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E3DFDB] dark:border-[#3B3041] bg-[#FAF7F6] dark:bg-[#1F1924]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-[#F3E9EB] dark:bg-[#32293D] text-[#4A1F2B] dark:text-[#F7B5C3]">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1D1B1B] dark:text-[#FEF8F7]">
                  MedCore Enterprise Product Walkthrough
                </h3>
                <p className="text-xs text-[#686563] dark:text-[#D5C2C5]">
                  Full 8-minute interactive demonstration for Chief Medical Officers &amp; IT Directors
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDemoVideoOpen(false)}
              className="p-1.5 rounded-md text-[#837376] hover:text-[#1D1B1B] dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Mockup Area */}
          <div className="relative aspect-video bg-[#18141C] flex flex-col items-center justify-center overflow-hidden">
            <div className="relative z-10 text-center p-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#4A1F2B] text-white flex items-center justify-center shadow-lg border-2 border-white/20">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  Playing: {bookmarks[activeBookmark].title}
                </h4>
                <p className="text-xs text-stone-300 max-w-md mx-auto mt-1">
                  {bookmarks[activeBookmark].desc}
                </p>
              </div>
            </div>

            {/* Video Timeline Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-stone-800">
              <div className="h-full bg-[#4A1F2B] dark:bg-[#C08491] w-2/5" />
            </div>
          </div>

          {/* Interactive Bookmark Chapters */}
          <div className="p-4 sm:p-5 bg-[#F7F6F3] dark:bg-[#18141C] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {bookmarks.map((bm, index) => {
              const Icon = bm.icon;
              return (
                <button
                  key={index}
                  onClick={() => setActiveBookmark(index)}
                  className={`flex items-center gap-3 p-2.5 rounded-md text-left border transition-all ${
                    activeBookmark === index
                      ? "bg-[#F3E9EB] dark:bg-[#32293D] border-[#4A1F2B] dark:border-[#C08491] text-[#4A1F2B] dark:text-[#F7B5C3] font-semibold"
                      : "bg-white dark:bg-[#241D29] border-[#E3DFDB] dark:border-[#3B3041] text-[#514346] dark:text-[#D5C2C5] hover:border-[#837376]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-[#83505B] dark:text-[#C08491]" />
                  <div>
                    <div className="text-xs font-semibold">{bm.title}</div>
                    <div className="text-[10px] text-[#837376] truncate max-w-[160px]">{bm.desc}</div>
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
