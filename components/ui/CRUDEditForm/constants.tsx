// استایل‌های پایه، آیکون‌ها و توکن‌های مشترک


import React from "react";
import { FiEdit3, FiLink, FiEye, FiTag, FiGrid, FiFileText } from "react-icons/fi";

export const INPUT_BASE =
  "w-full p-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 outline-none focus:ring-4 placeholder-slate-400 dark:placeholder-slate-600 disabled:opacity-60 disabled:cursor-not-allowed";

export const INPUT_IDLE =
  "border-slate-200 dark:border-[#1f2235]/60 bg-white/40 dark:bg-[#121420]/20 text-slate-800 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-[#121420] disabled:bg-slate-100 dark:disabled:bg-zinc-900/40";

export const INPUT_ERROR =
  "border-rose-400 dark:border-rose-500/50 bg-rose-500/5 focus:ring-rose-500/10 text-rose-900 dark:text-rose-200";

export const LABEL_CLASS = "text-xs font-bold text-slate-500 dark:text-slate-400 block";

export const PANEL_ACCENTS = {
  sky: { glow: "bg-sky-500/10", icon: "text-sky-500", ring: "focus:ring-sky-500/10" },
  indigo: { glow: "bg-indigo-500/10", icon: "text-indigo-500", ring: "focus:ring-indigo-500/10" },
  violet: { glow: "bg-violet-500/10", icon: "text-violet-500", ring: "focus:ring-violet-500/10" },
} as const;

export const FIELD_ICONS: Record<string, React.ReactNode> = {
  title: <FiEdit3 className="w-4 h-4 text-slate-400 dark:text-slate-500" />,
  slug: <FiLink className="w-4 h-4 text-slate-400 dark:text-slate-500" />,
  status: <FiEye className="w-4 h-4 text-slate-400 dark:text-slate-500" />,
  brandId: <FiTag className="w-4 h-4 text-slate-400 dark:text-slate-500" />,
  categoryId: <FiGrid className="w-4 h-4 text-slate-400 dark:text-slate-500" />,
  description: <FiFileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />,
};

export function getIconForField(name: string) {
  return FIELD_ICONS[name] ?? null;
}