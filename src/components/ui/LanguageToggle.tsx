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
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0F6CBD] transition-all"
      >
        <Globe className="w-4 h-4 text-[#0F6CBD] dark:text-[#4CC9F0]" />
        <span>{currentLang.label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </motion.button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            ભાષા પસંદ કરો / भाषा चुनें / Select Language
          </div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                setLanguage(lang.id);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                language === lang.id
                  ? "bg-[#0F6CBD]/10 text-[#0F6CBD] dark:text-[#4CC9F0] font-bold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <div>
                  <div className="font-bold">{lang.label}</div>
                  <div className="text-[10px] text-slate-400">{lang.subLabel}</div>
                </div>
              </div>
              {language === lang.id && <Check className="w-4 h-4 text-[#00C896]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
