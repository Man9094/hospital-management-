"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      aria-label="Toggle Dark and Light Mode"
      className="relative p-2.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:text-[#0F6CBD] dark:hover:text-[#4CC9F0] transition-colors border border-slate-300/50 dark:border-slate-700/50 shadow-sm"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-[#4CC9F0]" />
      ) : (
        <Moon className="w-4 h-4 text-[#0F6CBD]" />
      )}
    </motion.button>
  );
}
