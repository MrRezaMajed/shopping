import React from "react";
import { Column } from "./types";

interface SkeletonRowProps<T> {
  columns: Column<T>[];
  hiddenOnMobile: string[];
  showCheckbox?: boolean;
}

function SkeletonRowInner<T>({ columns, hiddenOnMobile, showCheckbox = false }: SkeletonRowProps<T>) {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <tr key={i} className="relative overflow-hidden">
          {showCheckbox && (
            <td className="py-1.5 px-3 rounded-r-xl bg-gray-50/20 dark:bg-gray-dark/5 border-y border-r border-transparent relative overflow-hidden">
              <div className="absolute inset-0 before:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="h-3.5 w-3.5 bg-gray-100 dark:bg-gray-800 rounded mx-auto" />
            </td>
          )}

          <td className={`py-1.5 px-3 bg-gray-50/20 dark:bg-gray-dark/5 border-y border-transparent relative overflow-hidden ${!showCheckbox ? "rounded-r-xl border-r" : ""}`}>
            <div className="absolute inset-0 before:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="h-3 w-4 bg-gray-100 dark:bg-gray-800 rounded mx-auto" />
          </td>
          
          {columns.map((c) => (
            <td
              key={String(c.key)}
              className={`py-1.5 px-3 bg-gray-50/20 dark:bg-gray-dark/5 border-y border-transparent relative overflow-hidden ${
                hiddenOnMobile.includes(String(c.key)) ? "hidden lg:table-cell" : ""
              }`}
            >
              <div className="absolute inset-0 before:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
            </td>
          ))}
          
          <td className="py-1.5 px-3 rounded-l-xl bg-gray-50/20 dark:bg-gray-dark/5 border-y border-l border-transparent relative overflow-hidden">
            <div className="absolute inset-0 before:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="h-3 w-8 bg-gray-100 dark:bg-gray-800 rounded mx-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}

export const SkeletonRow = React.memo(SkeletonRowInner) as <T>(
  props: SkeletonRowProps<T>
) => React.JSX.Element;