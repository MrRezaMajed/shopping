// منوی تغییر تعداد آیتم در صفحه

import React from "react";
import { toPersianNumber } from "@/lib/utils/persianNumbers";

const LIMIT_OPTIONS = [5, 10, 15, 20, 50];

interface LimitSelectorProps {
  limit: number;
  total: number;
  startRange: number;
  endRange: number;
  onLimitChange?: (limit: number) => void;
}

export const LimitSelector = React.memo(function LimitSelector({
  limit,
  total,
  startRange,
  endRange,
  onLimitChange,
}: LimitSelectorProps) {
  if (!onLimitChange) return null;

  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap flex-wrap justify-center md:justify-start">
      <label htmlFor="crud-list-limit" className="shrink-0">
        نمایش
      </label>
      <select
        id="crud-list-limit"
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="
          rounded-xl
          border border-slate-200 dark:border-[#1f2235]
          bg-white dark:bg-[#121420]
          text-slate-700 dark:text-slate-200
          px-3 py-1.5 text-xs font-semibold
          focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40
          transition-all duration-200
          hover:border-indigo-500/40
          cursor-pointer
        "
      >
        {LIMIT_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {toPersianNumber(opt)}
          </option>
        ))}
      </select>
      <span>
        مورد (نمایش {toPersianNumber(startRange)} تا {toPersianNumber(endRange)} از{" "}
        {toPersianNumber(total)})
      </span>
    </div>
  );
});