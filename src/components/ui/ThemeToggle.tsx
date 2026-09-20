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
      className="relative p-2 rounded-md bg-[#F8F2F2] dark:bg-[#18141C] text-[#514346] dark:text-[#D5C2C5] hover:bg-[#F3E9EB] dark:hover:bg-[#32293D] hover:text-[#4A1F2B] dark:hover:text-[#FEF8F7] transition-colors border border-[#E3DFDB] dark:border-[#3B3041] shadow-xs"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-[#F7B5C3]" />
      ) : (
        <Moon className="w-4 h-4 text-[#4A1F2B]" />
      )}
    </motion.button>
  );
}
