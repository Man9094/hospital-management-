"use client";

import React, { useState } from "react";
import { useLanguage, Language } from "@/context/LanguageContext";
import { Globe, ChevronDown, Check } from "lucide-react";
import { motion } from "framer-motion";

const LANGUAGES: { id: Language; label: string; subLabel: string; flag: string }[] = [
  { id: "gu", label: "ગુજરાતી", subLabel: "Gujarati", flag: "🇮🇳" },
  { id: "hi", label: "हिंदी", subLabel: "Hindi", flag: "🇮🇳" },
  { id: "en", label: "English", subLabel: "English", flag: "🌐" }
];

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F8F2F2] dark:bg-[#18141C] border border-[#E3DFDB] dark:border-[#3B3041] text-xs font-semibold text-[#1D1B1B] dark:text-[#FEF8F7] hover:border-[#4A1F2B] dark:hover:border-[#C08491] transition-all shadow-xs"
      >
        <Globe className="w-4 h-4 text-[#4A1F2B] dark:text-[#C08491]" />
        <span>{currentLang.label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#837376]" />
      </motion.button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] shadow-lg p-1.5 z-50">
          <div className="px-3 py-1.5 text-[10px] font-bold text-[#837376] uppercase tracking-wider">
            ભાષા પસંદ કરો / भाषा चुनें / Select Language
          </div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                setLanguage(lang.id);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-left text-xs transition-colors ${
                language === lang.id
                  ? "bg-[#F3E9EB] text-[#4A1F2B] dark:bg-[#32293D] dark:text-[#F7B5C3] font-bold"
                  : "text-[#1D1B1B] dark:text-[#FEF8F7] hover:bg-[#F8F2F2] dark:hover:bg-[#18141C]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <div>
                  <div className="font-bold">{lang.label}</div>
                  <div className="text-[10px] text-[#837376]">{lang.subLabel}</div>
                </div>
              </div>
              {language === lang.id && <Check className="w-4 h-4 text-[#3F6B52]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
