// دکمه‌های عملیاتی سطر جدول

import React from "react";
import { Button } from "@/components/ui/Button";

export const ACTION_STYLES = {
  edit: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/20 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 hover:border-indigo-500 dark:hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20",
  restore: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/20 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 hover:border-emerald-500 dark:hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20",
  delete: "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/20 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 hover:border-rose-500 dark:hover:border-rose-600 hover:shadow-lg hover:shadow-rose-500/20",
  permanent: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100/50 dark:border-red-900/20 hover:bg-red-600 hover:text-white dark:hover:bg-red-700 hover:border-red-600 dark:hover:border-red-700 hover:shadow-lg hover:shadow-red-500/20",
} as const;

export type ActionKind = keyof typeof ACTION_STYLES;

interface RowActionButtonProps {
  kind: ActionKind;
  title: string;
  onClick: () => void;
  icon: React.ReactNode;
}

export const RowActionButton = React.memo(function RowActionButton({
  kind,
  title,
  onClick,
  icon,
}: RowActionButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      title={title}
      aria-label={title}
      withRipple
      className={`h-9 w-9 p-0 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-[#121420] ${ACTION_STYLES[kind]}`}
    >
      {icon}
    </Button>
  );
});