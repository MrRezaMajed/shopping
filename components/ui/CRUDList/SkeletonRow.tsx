// ردیف‌های اسکلتی حالت لودینگ

import React from "react";
import { Column } from "./types";

interface SkeletonRowProps<T> {
  columns: Column<T>[];
  hiddenOnMobile: string[];
}

export const SkeletonRow = React.memo(function SkeletonRow<T>({
  columns,
  hiddenOnMobile,
}: SkeletonRowProps<T>) {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="p-4 rounded-r-2xl bg-white dark:bg-[#121420]/50 border-y border-r border-slate-100 dark:border-[#1f2235]/50">
            <div className="h-4 w-6 bg-slate-200 dark:bg-[#1b1e30] rounded-md mx-auto" />
          </td>
          {columns.map((c) => (
            <td
              key={String(c.key)}
              className={`p-4 bg-white dark:bg-[#121420]/50 border-y border-slate-100 dark:border-[#1f2235]/50 ${
                hiddenOnMobile.includes(String(c.key)) ? "hidden lg:table-cell" : ""
              }`}
            >
              <div className="h-4 bg-slate-200 dark:bg-[#1b1e30] rounded-md w-3/4" />
            </td>
          ))}
          <td className="p-4 rounded-l-2xl bg-white dark:bg-[#121420]/50 border-y border-l border-slate-100 dark:border-[#1f2235]/50">
            <div className="h-4 w-24 bg-slate-200 dark:bg-[#1b1e30] rounded-md mx-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}) as <T>(props: SkeletonRowProps<T>) => React.ReactElement;