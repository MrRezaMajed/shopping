// سلول آمار انبار محصول (Stock Cell)

import React from "react";
import { toPersianNumber } from "@/lib/utils/persianNumbers";

interface ProductStockCellProps {
  stock?: number;
}

export const ProductStockCell = React.memo(function ProductStockCell({
  stock: rawStock,
}: ProductStockCellProps) {
  const stock = Number(rawStock) || 0;

  let badgeClass = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100/30 dark:border-emerald-900/30";
  if (stock < 2) {
    badgeClass = "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100/30 dark:border-rose-900/30";
  } else if (stock < 4) {
    badgeClass = "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100/30 dark:border-amber-900/30";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${badgeClass}`}>
      {toPersianNumber(stock.toLocaleString("en-US"))} عدد
    </span>
  );
});