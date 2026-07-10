// دکمه کنترل و انتقال به سطل زباله

import React from "react";
import { FiTrash2, FiList } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

interface TrashButtonProps {
  showTrash: boolean;
  onClick: () => void;
}

export const TrashButton = React.memo(function TrashButton({ showTrash, onClick }: TrashButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={showTrash ? "secondary" : "ghost"}
      withRipple
      withGlow={!showTrash}
      iconLeft={showTrash ? <FiList className="h-4 w-4" /> : <FiTrash2 className="h-4 w-4" />}
      className={
        showTrash
          ? "bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700/50 rounded-xl px-4 py-2 text-xs font-semibold shadow-md transition-all duration-300"
          : "bg-rose-50/70 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-2 text-xs font-semibold hover:bg-rose-100/70 hover:text-rose-700 dark:hover:bg-rose-950/50 dark:hover:text-rose-300 hover:border-rose-200 dark:hover:border-rose-900/50 hover:shadow-[0_0_15px_rgba(244,63,94,0.05)] transition-all duration-300"
      }
    >
      <span className="flex items-center gap-1.5">
        {showTrash ? "بازگشت به لیست اصلی" : "مشاهده سطل زباله"}
        <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-rose-500/30 bg-rose-500/10 text-[9px] font-mono mr-1">T</kbd>
      </span>
    </Button>
  );
});