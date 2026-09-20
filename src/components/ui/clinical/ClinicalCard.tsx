"use client";

import React from "react";

interface ClinicalCardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
}

export default function ClinicalCard({
  title,
  subtitle,
  badge,
  icon,
  actions,
  children,
  className = "",
  bodyClassName = "",
  noPadding = false,
}: ClinicalCardProps) {
  const hasHeader = Boolean(title || subtitle || badge || icon || actions);

  return (
    <div
      className={`bg-white dark:bg-[#241D29] border border-[#E3DFDB] dark:border-[#3B3041] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-all ${className}`}
    >
      {hasHeader && (
        <div className="px-4 py-3 border-b border-[#E3DFDB] dark:border-[#3B3041] flex flex-wrap items-center justify-between gap-2 bg-[#FAF7F6] dark:bg-[#201A25]">
          <div className="flex items-center gap-2 min-w-0">
            {icon && <div className="text-[#4A1F2B] dark:text-[#C08491] shrink-0">{icon}</div>}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {typeof title === "string" ? (
                  <h3 className="font-semibold text-sm text-[#1D1B1B] dark:text-[#FEF8F7] truncate">
                    {title}
                  </h3>
                ) : (
                  title
                )}
                {badge}
              </div>
              {subtitle && (
                <p className="text-[11px] text-[#514346] dark:text-[#D5C2C5] truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-1.5 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? bodyClassName : `p-4 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}
