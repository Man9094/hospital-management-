"use client";

import React from "react";
import { Activity, Heart, Thermometer, Wind, Droplet } from "lucide-react";

interface VitalData {
  bp_systolic?: number;
  bp_diastolic?: number;
  heart_rate?: number;
  temperature?: number;
  spo2?: number;
  blood_glucose?: number;
  recorded_at?: string;
}

export default function VitalStrip({ vitals }: { vitals: VitalData }) {
  const isBpHit = vitals.bp_systolic && (vitals.bp_systolic > 140 || vitals.bp_systolic < 90);
  const isSpo2Low = vitals.spo2 && vitals.spo2 < 95;
  const isTempHigh = vitals.temperature && vitals.temperature > 100.4;
  const isHrHigh = vitals.heart_rate && (vitals.heart_rate > 100 || vitals.heart_rate < 60);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 p-2.5 rounded-lg bg-[#FAF7F6] dark:bg-[#1F1924] border border-[#E3DFDB] dark:border-[#3B3041] tabular-nums">
      {/* Blood Pressure */}
      <div className="flex flex-col p-1.5 rounded bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041]">
        <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-[#837376]">
          <span>Blood Pressure</span>
          <Activity className="w-3 h-3 text-[#70404B]" />
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className={`text-sm font-bold ${isBpHit ? "text-[#A33A35]" : "text-[#1D1B1B] dark:text-[#FEF8F7]"}`}>
            {vitals.bp_systolic && vitals.bp_diastolic ? `${vitals.bp_systolic}/${vitals.bp_diastolic}` : "—/—"}
          </span>
          <span className="text-[10px] text-[#837376]">mmHg</span>
        </div>
      </div>

      {/* Heart Rate */}
      <div className="flex flex-col p-1.5 rounded bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041]">
        <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-[#837376]">
          <span>Pulse / HR</span>
          <Heart className="w-3 h-3 text-[#A33A35]" />
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className={`text-sm font-bold ${isHrHigh ? "text-[#A33A35]" : "text-[#1D1B1B] dark:text-[#FEF8F7]"}`}>
            {vitals.heart_rate || "—"}
          </span>
          <span className="text-[10px] text-[#837376]">bpm</span>
        </div>
      </div>

      {/* SpO2 */}
      <div className="flex flex-col p-1.5 rounded bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041]">
        <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-[#837376]">
          <span>SpO2 Saturation</span>
          <Wind className="w-3 h-3 text-[#3F6B52]" />
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className={`text-sm font-bold ${isSpo2Low ? "text-[#A33A35]" : "text-[#3F6B52] dark:text-[#7ADDB0]"}`}>
            {vitals.spo2 ? `${vitals.spo2}%` : "—"}
          </span>
          <span className="text-[10px] text-[#837376]">O2</span>
        </div>
      </div>

      {/* Temperature */}
      <div className="flex flex-col p-1.5 rounded bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041]">
        <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-[#837376]">
          <span>Temperature</span>
          <Thermometer className="w-3 h-3 text-[#9A6A25]" />
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className={`text-sm font-bold ${isTempHigh ? "text-[#A33A35]" : "text-[#1D1B1B] dark:text-[#FEF8F7]"}`}>
            {vitals.temperature ? `${vitals.temperature}°F` : "—"}
          </span>
        </div>
      </div>

      {/* Blood Glucose */}
      <div className="flex flex-col p-1.5 rounded bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-[#837376]">
          <span>Blood Glucose</span>
          <Droplet className="w-3 h-3 text-[#665C72]" />
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-sm font-bold text-[#1D1B1B] dark:text-[#FEF8F7]">
            {vitals.blood_glucose || "—"}
          </span>
          <span className="text-[10px] text-[#837376]">mg/dL</span>
        </div>
      </div>
    </div>
  );
}
