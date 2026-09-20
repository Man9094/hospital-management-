"use client";

import React from "react";
import ClinicalBadge from "./ClinicalBadge";
import { AlertTriangle, User, Heart, ShieldAlert, FileText, Phone } from "lucide-react";

interface PatientHeaderBannerProps {
  patient: {
    uhid: string;
    full_name: string;
    age?: number;
    gender?: string;
    blood_group?: string;
    allergies?: string;
    mobile?: string;
    insurance_provider?: string;
    cabin_number?: string;
    case_number?: number;
    doctor_name?: string;
  };
  onViewDossier?: () => void;
}

export default function PatientHeaderBanner({ patient, onViewDossier }: PatientHeaderBannerProps) {
  const hasAllergies = Boolean(patient.allergies && patient.allergies.trim() && patient.allergies.toLowerCase() !== "none");

  return (
    <div className="bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Primary Demographic Ribbon */}
      <div className="px-4 py-3 bg-[#FAF7F6] dark:bg-[#1F1924] border-b border-[#E3DFDB] dark:border-[#3B3041] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-md bg-[#4A1F2B] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            {patient.full_name ? patient.full_name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base text-[#1D1B1B] dark:text-[#FEF8F7] truncate">
                {patient.full_name}
              </h2>
              <span className="font-mono text-xs font-bold text-[#4A1F2B] dark:text-[#C08491] px-2 py-0.5 rounded bg-[#F3E9EB] dark:bg-[#32293D] border border-[#E3DFDB] dark:border-[#4C3C54]">
                {patient.uhid}
              </span>
              {patient.case_number && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#4A1F2B] text-white">
                  Case #{patient.case_number}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#514346] dark:text-[#D5C2C5] mt-0.5 flex-wrap">
              <span>{patient.age ? `${patient.age} Yrs` : "Age N/A"}</span>
              <span>•</span>
              <span>{patient.gender || "Other"}</span>
              <span>•</span>
              <span className="font-semibold text-[#A33A35] dark:text-[#FFB4AB]">Blood: {patient.blood_group || "N/A"}</span>
              {patient.cabin_number && (
                <>
                  <span>•</span>
                  <span className="font-semibold text-[#4A1F2B] dark:text-[#C08491]">{patient.cabin_number}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {patient.mobile && (
            <div className="hidden md:flex items-center gap-1 text-xs text-[#514346] dark:text-[#D5C2C5] font-medium mr-2">
              <Phone className="w-3.5 h-3.5 text-[#837376]" />
              <span>{patient.mobile}</span>
            </div>
          )}
          {onViewDossier && (
            <button
              onClick={onViewDossier}
              className="h-[28px] px-3 rounded text-xs font-semibold bg-white dark:bg-[#2E2434] border border-[#E3DFDB] dark:border-[#3B3041] text-[#1D1B1B] dark:text-[#FEF8F7] hover:bg-[#F7F6F3] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#70404B]" />
              <span>Full Dossier</span>
            </button>
          )}
        </div>
      </div>

      {/* Secondary Ribbon: Clinical Safeguards & Critical Allergies */}
      <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase font-semibold text-[#837376]">Primary Payer:</span>
            <span className="font-medium text-[#1D1B1B] dark:text-[#FEF8F7]">
              {patient.insurance_provider || "Self-Pay / Cash"}
            </span>
          </div>
          {patient.doctor_name && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] uppercase font-semibold text-[#837376]">Attending:</span>
              <span className="font-medium text-[#1D1B1B] dark:text-[#FEF8F7]">{patient.doctor_name}</span>
            </div>
          )}
        </div>

        {/* CRITICAL ALLERGY SHIELD */}
        <div className="flex items-center gap-1.5">
          {hasAllergies ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FFDAD6] dark:bg-[#410002] border border-[#BA1A1A]/40 text-[#93000A] dark:text-[#FFDAD6] font-semibold text-xs animate-in fade-in">
              <AlertTriangle className="w-3.5 h-3.5 text-[#BA1A1A] shrink-0" />
              <span className="uppercase text-[10px] tracking-wider font-bold">Critical Allergies:</span>
              <span className="font-bold underline decoration-[#BA1A1A]">{patient.allergies}</span>
            </div>
          ) : (
            <ClinicalBadge variant="success" dot>
              No Known Drug Allergies (NKDA)
            </ClinicalBadge>
          )}
        </div>
      </div>
    </div>
  );
}
