import React from "react";
import { Column } from "./types";

interface CRUDListHeaderProps<T> {
  columns: Column<T>[];
  hiddenOnMobile: string[];
  showCheckbox?: boolean;
  isAllSelected?: boolean;
  onSelectAll?: (checked: boolean) => void;
}

function CRUDListHeaderInner<T>({
  columns,
  hiddenOnMobile,
  showCheckbox = false,
  isAllSelected = false,
  onSelectAll,
}: CRUDListHeaderProps<T>) {
  const isHidden = (key: string) => hiddenOnMobile.includes(key);

  return (
    <thead>
      <tr className="text-slate-400 dark:text-slate-500 text-[11px] font-bold tracking-wide uppercase">
        {/* چک‌باکس انتخاب کل ردیف‌ها */}
        {showCheckbox && (
          <th className="pb-3 px-4 text-center w-10">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => onSelectAll?.(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500/30 h-4 w-4 cursor-pointer transition-all duration-200"
            />
          </th>
        )}
        <th className="pb-3 px-4 text-center w-12 font-medium">#</th>
        {columns.map((c) => (
          <th
            key={String(c.key)}
            className={`pb-3 px-4 text-right whitespace-nowrap font-semibold ${
              isHidden(String(c.key)) ? "hidden lg:table-cell" : ""
            }`}
          >
            {c.label}
          </th>
        ))}
        <th className="pb-3 px-4 text-center w-24 font-semibold">عملیات</th>
      </tr>
    </thead>
  );
}

export const CRUDListHeader = React.memo(CRUDListHeaderInner) as <T>(
  props: CRUDListHeaderProps<T>
) => React.JSX.Element;