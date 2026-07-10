//  سلول بازه قیمتی محصول (Price Cell)

import React from "react";
import { toPersianNumber } from "@/lib/utils/persianNumbers";

interface ProductPriceCellProps {
  minPrice?: number;
  maxPrice?: number;
}

export const ProductPriceCell = React.memo(function ProductPriceCell({
  minPrice,
  maxPrice,
}: ProductPriceCellProps) {
  const min = Number(minPrice) || 0;
  const max = Number(maxPrice) || 0;

  if (min === 0) {
    return <span className="text-slate-400 dark:text-zinc-600">فاقد قیمت</span>;
  }

  if (min === max) {
    return (
      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
        {toPersianNumber(min.toLocaleString("en-US"))}
      </span>
    );
  }

  return (
    <span className="font-extrabold text-xs sm:text-sm inline-flex items-center gap-1.5" dir="ltr">
      <span className="text-emerald-600 dark:text-emerald-400">
        {toPersianNumber(min.toLocaleString("en-US"))}
      </span>
      <span className="text-slate-400 dark:text-zinc-600 font-medium">-</span>
      <span className="text-rose-600 dark:text-rose-400">
        {toPersianNumber(max.toLocaleString("en-US"))}
      </span>
    </span>
  );
});