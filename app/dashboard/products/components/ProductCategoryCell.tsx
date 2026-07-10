// سلول دسته‌بندی محصول (Category Cell)

import React from "react";

interface ProductCategoryCellProps {
  categoryId: number;
  flatCategories: any[];
}

export const ProductCategoryCell = React.memo(function ProductCategoryCell({
  categoryId,
  flatCategories,
}: ProductCategoryCellProps) {
  const cat = flatCategories.find((c) => Number(c.id) === Number(categoryId));
  return cat ? (
    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30">
      {cat.name}
    </span>
  ) : (
    <span className="text-slate-400">-</span>
  );
});