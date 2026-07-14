import React from "react";
import { Column } from "./types";

interface SkeletonRowProps<T> {
  columns: Column<T>[];
  hiddenOnMobile: string[];
}

function SkeletonRowInner<T>({ columns, hiddenOnMobile }: SkeletonRowProps<T>) {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <tr key={i} className="relative overflow-hidden">
          {/* ستون شماره ردیف */}
          <td className="p-3.5 rounded-r-2xl bg-gray-50/20 dark:bg-gray-dark/5 border-y border-r border-transparent relative overflow-hidden">
            {/* موج نوری شیمر با استفاده از کلاسی که در CSS خود دارید */}
            <div className="absolute inset-0 before:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="h-3.5 w-5 bg-gray-100 dark:bg-gray-800 rounded-md mx-auto" />
          </td>
          
          {/* ستون‌های داده */}
          {columns.map((c) => (
            <td
              key={String(c.key)}
              className={`p-3.5 bg-gray-50/20 dark:bg-gray-dark/5 border-y border-transparent relative overflow-hidden ${
                hiddenOnMobile.includes(String(c.key)) ? "hidden lg:table-cell" : ""
              }`}
            >
              <div className="absolute inset-0 before:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="h-3.5 bg-gray-100 dark:bg-gray-800 rounded-md w-2/3" />
            </td>
          ))}
          
          {/* ستون عملیات */}
          <td className="p-3.5 rounded-l-2xl bg-gray-50/20 dark:bg-gray-dark/5 border-y border-l border-transparent relative overflow-hidden">
            <div className="absolute inset-0 before:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="h-3.5 w-20 bg-gray-100 dark:bg-gray-800 rounded-md mx-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}

export const SkeletonRow = React.memo(SkeletonRowInner) as <T>(
  props: SkeletonRowProps<T>
) => React.JSX.Element;