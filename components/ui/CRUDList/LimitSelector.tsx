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
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 whitespace-nowrap flex-wrap justify-center md:justify-start">
      <label htmlFor="crud-list-limit" className="shrink-0 text-xs">
        نمایش
      </label>
      <select
        id="crud-list-limit"
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="
          rounded-lg
          border border-slate-200 dark:border-slate-800
          bg-white dark:bg-slate-950
          text-slate-700 dark:text-slate-200
          px-2.5 py-1 text-xs font-semibold
          focus:outline-none focus:ring-1.5 focus:ring-indigo-500/30
          transition-colors duration-200
          hover:border-slate-300 dark:hover:border-slate-700
          cursor-pointer
        "
      >
        {LIMIT_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {toPersianNumber(opt)}
          </option>
        ))}
      </select>
      <span className="text-xs">
        مورد (نمایش {toPersianNumber(startRange)} تا {toPersianNumber(endRange)} از{" "}
        {toPersianNumber(total)})
      </span>
    </div>
  );
});