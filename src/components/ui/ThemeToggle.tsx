"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      aria-label={`Toggle Dark and Light Mode (current: ${theme})`}
      title={`Theme: ${theme === "dark" ? "Dark" : "Light"}`}
      data-theme={theme}
      className="relative p-2 rounded-md bg-[#F8F2F2] text-[#514346] hover:bg-[#F3E9EB] hover:text-[#4A1F2B] transition-colors border border-[#E3DFDB] shadow-xs"
    >
      <Moon className="w-4 h-4 text-[#4A1F2B]" />
    </motion.button>
  );
}
