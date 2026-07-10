// بخش فوتر و صفحه‌بندی جدول

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
        grid grid-cols-1 md:grid-cols-3 items-center gap-4 p-5 sm:p-6
        bg-slate-100/30 dark:bg-[#121420]/30
        border-t border-slate-150 dark:border-[#1f2235]/40
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

      <div className="hidden md:block justify-self-end text-xs font-semibold text-slate-400 dark:text-slate-500">
        مجموع کل: {toPersianNumber(total)} مورد
      </div>
    </div>
  );
});