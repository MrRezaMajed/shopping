import React from "react";
import { Button } from "@/components/ui/Button";

export const ACTION_STYLES = {
  edit: `
    bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 
    border border-indigo-100/60 dark:border-indigo-900/30 
    hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white
    hover:shadow-md hover:shadow-indigo-500/10
  `,
  restore: `
    bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 
    border border-emerald-100/60 dark:border-emerald-900/30 
    hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white
    hover:shadow-md hover:shadow-emerald-500/10
  `,
  delete: `
    bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 
    border border-rose-100/60 dark:border-rose-900/30 
    hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white
    hover:shadow-md hover:shadow-rose-500/10
  `,
  permanent: `
    bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 
    border border-red-100/60 dark:border-red-900/30 
    hover:bg-red-750 hover:text-white dark:hover:bg-red-700 dark:hover:text-white
    hover:shadow-md hover:shadow-red-500/10
  `,
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
      className={`
        h-8 w-8 p-0 rounded-xl transition-all duration-200 
        hover:scale-[1.03] active:scale-[0.97] 
        focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-offset-1 
        dark:focus-visible:ring-offset-[#0c0d14] ${ACTION_STYLES[kind]}
      `}
    >
      {icon}
    </Button>
  );
});