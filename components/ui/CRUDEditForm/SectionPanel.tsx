// پوسته پنل‌های گروهی (اطلاعات چند مقداری)


import React from "react";
import { PANEL_ACCENTS } from "./constants";

interface SectionPanelProps {
  icon: React.ReactNode;
  title: string;
  accent?: keyof typeof PANEL_ACCENTS;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const SectionPanel = React.memo(function SectionPanel({
  icon,
  title,
  accent = "indigo",
  action,
  children,
}: SectionPanelProps) {
  const tone = PANEL_ACCENTS[accent];
  return (
    <div className="space-y-4 p-5 rounded-2xl border border-slate-100 dark:border-[#1f2235]/40 bg-slate-50/20 dark:bg-[#121420]/10 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 ${tone.glow} rounded-full blur-3xl pointer-events-none`} />
      <div className="flex items-center justify-between gap-3 relative z-10">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span className={tone.icon}>{icon}</span> {title}
        </span>
        {action}
      </div>
      <div className="relative z-10 space-y-3">{children}</div>
    </div>
  );
});