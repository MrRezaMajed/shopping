// سلول برند محصول (Brand Cell)

import React from "react";

interface ProductBrandCellProps {
  brandId?: number | null;
  flatBrands: any[];
}

export const ProductBrandCell = React.memo(function ProductBrandCell({
  brandId,
  flatBrands,
}: ProductBrandCellProps) {
  const brand = flatBrands.find((b) => Number(b.id) === Number(brandId));
  return brand ? (
    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-100/30 dark:border-violet-900/30">
      {brand.name}
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-zinc-900/30 text-slate-400 dark:text-zinc-500 border border-dashed border-slate-200 dark:border-zinc-800/80">
      بدون برند
    </span>
  );
});