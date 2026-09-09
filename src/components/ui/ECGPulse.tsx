"use client";

import React from "react";

interface ECGPulseProps {
  className?: string;
  color?: string;
}

export default function ECGPulse({ className = "h-12 w-full", color = "#00C896" }: ECGPulseProps) {
  return (
    <div className={`relative overflow-hidden flex items-center ${className}`}>
      <svg
        viewBox="0 0 500 80"
        className="w-full h-full stroke-current"
        style={{ color }}
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Background faint line */}
        <path
          d="M0 40 L120 40 L130 15 L140 65 L150 25 L160 45 L170 40 L220 40 L230 10 L245 70 L260 20 L275 50 L285 40 L340 40 L350 20 L360 60 L370 40 L500 40"
          strokeOpacity="0.2"
        />
        {/* Animated line */}
        <path
          d="M0 40 L120 40 L130 15 L140 65 L150 25 L160 45 L170 40 L220 40 L230 10 L245 70 L260 20 L275 50 L285 40 L340 40 L350 20 L360 60 L370 40 L500 40"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="animate-[ecgBeat_3s_ease-in-out_infinite]"
        />
      </svg>
      <div 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full shadow-[0_0_12px_#00C896] animate-ping"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
