// @/components/ui/CRUDPage/KeyboardHelpLegend.tsx

import React from "react";
import { FiHelpCircle } from "react-icons/fi";

interface KeyboardHelpLegendProps {
  disableCreate?: boolean; // 👈 اضافه شدن پروپ دریافتی جهت پنهان‌سازی مشروط
}

export const KeyboardHelpLegend = React.memo(function KeyboardHelpLegend({
  disableCreate = false, // 👈 مقدار پیش‌فرض
}: KeyboardHelpLegendProps) {
  return (
    <div className="fixed bottom-6 left-6 z-50 group/legend">
      <div className="relative">
        <div className="
          absolute bottom-0 left-0 p-4 w-60 rounded-2xl
          bg-white/95 dark:bg-[#0c0d14]/95 backdrop-blur-xl
          border border-slate-200 dark:border-[#1f2235]/80
          shadow-2xl transition-all duration-300 origin-bottom-left
          opacity-0 translate-y-4 pointer-events-none scale-90
          group-hover/legend:opacity-100 group-hover/legend:translate-y-0 group-hover/legend:pointer-events-auto group-hover/legend:scale-100
          text-right space-y-3
        ">
          <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-[#1f2235]/50 pb-2 flex items-center justify-between">
            <span>میانبرهای کیبورد</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
          </h4>
          <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-2 font-medium">
            {/* 👈 بررسی مشروط نمایش دکمه میانبر کیبورد */}
            {!disableCreate && (
              <li className="flex justify-between items-center">
                <span>ایجاد مورد جدید</span>
                <kbd className="px-1.5 py-0.5 rounded border border-slate-200/60 bg-slate-50 dark:bg-[#121420] font-mono text-[9px] font-bold">C</kbd>
              </li>
            )}
            <li className="flex justify-between items-center">
              <span>همگام‌سازی و بروزرسانی</span>
              <kbd className="px-1.5 py-0.5 rounded border border-slate-200/60 bg-slate-50 dark:bg-[#121420] font-mono text-[9px] font-bold">R</kbd>
            </li>
            <li className="flex justify-between items-center">
              <span>سوئیچ سطل زباله</span>
              <kbd className="px-1.5 py-0.5 rounded border border-slate-200/60 bg-slate-50 dark:bg-[#121420] font-mono text-[9px] font-bold">T</kbd>
            </li>
            <li className="flex justify-between items-center">
              <span>بستن فرم / انصراف</span>
              <kbd className="px-1.5 py-0.5 rounded border border-slate-200/60 bg-slate-50 dark:bg-[#121420] font-mono text-[9px] font-bold">Esc</kbd>
            </li>
            <li className="flex justify-between items-center text-indigo-500">
              <span>جستجوی پیشرفته</span>
              <kbd className="px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-950 bg-indigo-50 dark:bg-indigo-950/20 font-mono text-[9px] font-bold">Ctrl+K</kbd>
            </li>
          </ul>
        </div>
        
        <button
          aria-label="نمایش راهنمای میانبرهای کیبورد"
          className="
          p-3 rounded-full shadow-lg
          bg-white dark:bg-[#0c0d14] text-slate-400 dark:text-slate-500
          hover:text-slate-700 dark:hover:text-slate-300
          border border-slate-200 dark:border-[#1f2235]/80
          backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50
        ">
          <FiHelpCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
});