// سربرگ اصلی صفحه کدهای CRUD

import React from "react";
import { FiDatabase, FiRefreshCw } from "react-icons/fi";

interface CRUDPageHeaderProps {
  modelName: string;
  loading: boolean;
  showTrash: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
}

export const CRUDPageHeader = React.memo(function CRUDPageHeader({
  modelName,
  loading,
  showTrash,
  onRefresh,
  children,
}: CRUDPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100/80 dark:border-[#1f2235]/40">
      <div className="space-y-1.5 text-right">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="hidden sm:flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_4px_20px_rgba(99,102,241,0.35)] shrink-0">
            <FiDatabase className="h-4.5 w-4.5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            مدیریت {modelName}
          </h1>
          
          <button
            onClick={onRefresh}
            disabled={loading}
            title="به‌روزرسانی همزمان اطلاعات (R)"
            aria-label="به‌روزرسانی لیست"
            className="p-2 rounded-xl border border-slate-200/60 dark:border-[#1f2235]/50 bg-white/50 dark:bg-[#121420]/40 hover:bg-slate-100 dark:hover:bg-[#1b1e30] transition-all duration-300 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
          >
            <FiRefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-indigo-500" : ""}`} />
            <kbd className="hidden sm:inline-flex items-center justify-center px-1 py-0.5 rounded border border-slate-200 dark:border-[#1f2235] bg-slate-50 dark:bg-[#121420] text-[8px] font-mono">R</kbd>
          </button>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
          {showTrash 
            ? `سطل زباله / بازگردانی یا حذف نهایی رکوردهای ${modelName}` 
            : `ایجاد، ویرایش، حذف و کنترل تمام اطلاعات مربوط به ${modelName}`}
        </p>
      </div>
      
      <div className="flex gap-3 flex-wrap items-center ml-1">
        {children}
      </div>
    </div>
  );
});