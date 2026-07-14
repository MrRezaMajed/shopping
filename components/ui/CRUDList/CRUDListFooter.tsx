import React from "react";
import Pagination from "@/components/ui/DataTable/Pagination";
import { toPersianNumber } from "@/lib/utils/persianNumbers";
import { LimitSelector } from "./LimitSelector";

interface CRUDListFooterProps {
  total: number;
  limit: number;
  page: number;
  startRange: number;
  endRange: number;
  totalPages: number;
  onLimitChange?: (limit: number) => void;
  onPageChange: (page: number) => void;
}

export const CRUDListFooter = React.memo(function CRUDListFooter({
  total,
  limit,
  page,
  startRange,
  endRange,
  totalPages,
  onLimitChange,
  onPageChange,
}: CRUDListFooterProps) {
  return (
    <div
      className="
        grid grid-cols-1 md:grid-cols-3 items-center gap-5 p-5 sm:p-6
        bg-slate-50/50 dark:bg-[#0c0d14]/40
        border-t border-slate-100 dark:border-slate-800/40
        text-xs sm:text-sm text-slate-500 dark:text-slate-400
      "
    >
      <div className="justify-self-center md:justify-self-start">
        <LimitSelector
          limit={limit}
          total={total}
          startRange={startRange}
          endRange={endRange}
          onLimitChange={onLimitChange}
        />
      </div>

      <div className="justify-self-center flex justify-center">
        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
        )}
      </div>

      <div className="hidden md:block justify-self-end text-xs font-medium text-slate-400 dark:text-slate-500">
        مجموع کل: <span className="font-semibold text-slate-700 dark:text-slate-300">{toPersianNumber(total)}</span> مورد
      </div>
    </div>
  );
});