"use client";

import React from "react";

export type BadgeVariant = 
  | "success" 
  | "warning" 
  | "danger" 
  | "critical" 
  | "info" 
  | "brand" 
  | "neutral";

interface ClinicalBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export default function ClinicalBadge({
  variant = "neutral",
  children,
  icon,
  className = "",
  dot = false,
}: ClinicalBadgeProps) {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dot: string }> = {
    success: {
      bg: "bg-[#EEF4F0] dark:bg-[#1C2C22]",
      text: "text-[#3F6B52] dark:text-[#7ADDB0]",
      border: "border-[#D4E3D9] dark:border-[#2C4A38]",
      dot: "bg-[#3F6B52]",
    },
    warning: {
      bg: "bg-[#FAF4EB] dark:bg-[#2C2417]",
      text: "text-[#9A6A25] dark:text-[#E8B96F]",
      border: "border-[#F0E2CD] dark:border-[#4D3C23]",
      dot: "bg-[#9A6A25]",
    },
    danger: {
      bg: "bg-[#FDF1F0] dark:bg-[#301A1B]",
      text: "text-[#A33A35] dark:text-[#E06D67]",
      border: "border-[#F7D7D5] dark:border-[#522528]",
      dot: "bg-[#A33A35]",
    },
    critical: {
      bg: "bg-[#FFDAD6] dark:bg-[#410002]",
      text: "text-[#93000A] dark:text-[#FFB4AB]",
      border: "border-[#FFB4AB]/60 dark:border-[#93000A]",
      dot: "bg-[#BA1A1A] animate-ping",
    },
    info: {
      bg: "bg-[#F4F2F5] dark:bg-[#25202E]",
      text: "text-[#665C72] dark:text-[#C5BED1]",
      border: "border-[#DDD9E1] dark:border-[#3D354A]",
      dot: "bg-[#665C72]",
    },
    brand: {
      bg: "bg-[#F3E9EB] dark:bg-[#32293D]",
      text: "text-[#4A1F2B] dark:text-[#F7B5C3]",
      border: "border-[#E3DFDB] dark:border-[#4C3C54]",
      dot: "bg-[#4A1F2B]",
    },
    neutral: {
      bg: "bg-[#F2EDEC] dark:bg-[#231D27]",
      text: "text-[#514346] dark:text-[#D5C2C5]",
      border: "border-[#E3DFDB] dark:border-[#3B3041]",
      dot: "bg-[#837376]",
    },
  };

  const style = variantStyles[variant] || variantStyles.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${style.bg} ${style.text} ${style.border} tracking-wide ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />}
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  );
}
