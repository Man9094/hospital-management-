"use client";

import React from "react";

export type ButtonVariant = 
  | "primary" 
  | "secondary" 
  | "danger" 
  | "ghost" 
  | "pill" 
  | "outline";

export type ButtonSize = "sm" | "md" | "lg";

interface ClinicalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  active?: boolean;
}

export default function ClinicalButton({
  variant = "primary",
  size = "md",
  icon,
  active = false,
  children,
  className = "",
  disabled,
  ...props
}: ClinicalButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-1.5 font-semibold transition-all select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-[26px] px-2.5 text-[11px] rounded",
    md: "h-[32px] px-3.5 text-xs rounded-md",
    lg: "h-[38px] px-5 text-sm rounded-md",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-[#4A1F2B] hover:bg-[#70404B] text-white shadow-xs border border-transparent focus:ring-2 focus:ring-[#4A1F2B] focus:ring-offset-1",
    secondary: "bg-white dark:bg-[#241D29] hover:bg-[#F7F6F3] dark:hover:bg-[#2E2434] text-[#1D1B1B] dark:text-[#FEF8F7] border border-[#E3DFDB] dark:border-[#3B3041] shadow-xs",
    danger: "bg-[#BA1A1A] hover:bg-[#8C1313] text-white shadow-xs border border-transparent focus:ring-2 focus:ring-[#BA1A1A]",
    ghost: "bg-transparent hover:bg-[#F3E9EB] dark:hover:bg-[#32293D] text-[#70404B] dark:text-[#F7B5C3]",
    outline: "bg-transparent border border-[#4A1F2B] text-[#4A1F2B] hover:bg-[#F3E9EB] dark:border-[#C08491] dark:text-[#C08491] dark:hover:bg-[#32293D]",
    pill: active 
      ? "rounded-full bg-[#4A1F2B] text-white shadow-xs" 
      : "rounded-full bg-[#F2EDEC] dark:bg-[#231D27] text-[#514346] dark:text-[#D5C2C5] hover:bg-[#EDE7E6] dark:hover:bg-[#2F2734]",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
}
