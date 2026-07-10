// کارت‌های آماری سربرگ صفحه

import React from "react";
import { SpotlightCard } from "./SpotlightCard";

interface StatCardProps {
  label: string;
  value?: React.ReactNode;
  loading?: boolean;
  icon: React.ReactNode;
  glowColor: string;
  iconBg: string;
  valueClassName?: string;
}

export const StatCard = React.memo(function StatCard({
  label,
  value,
  loading,
  icon,
  glowColor,
  iconBg,
  valueClassName = "text-slate-800 dark:text-white",
}: StatCardProps) {
  return (
    <SpotlightCard glowColor={glowColor}>
      <div className="space-y-1 w-2/3">
        <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block">{label}</span>
        {loading ? (
          <div className="h-7 w-12 bg-slate-100 dark:bg-[#1b1e30] rounded-md animate-pulse" />
        ) : (
          <span className={`text-xl sm:text-2xl font-black transition-all ${valueClassName}`}>{value}</span>
        )}
      </div>
      <div className={`p-3 rounded-xl group-hover/card:scale-110 transition-transform duration-300 ${iconBg}`}>
        {icon}
      </div>
    </SpotlightCard>
  );
});