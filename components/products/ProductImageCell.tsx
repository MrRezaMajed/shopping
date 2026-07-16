// سلول تصویر شاخص محصول (Image Cell)

import React from "react";

interface ProductImageCellProps {
  imageUrl?: string;
  title: string;
}

export const ProductImageCell = React.memo(function ProductImageCell({
  imageUrl,
  title,
}: ProductImageCellProps) {
  return imageUrl ? (
    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200/80 dark:border-zinc-800/80 bg-slate-100 dark:bg-zinc-900 shadow-sm flex-shrink-0 flex items-center justify-center">
      <img
        src={imageUrl}
        alt={title || "تصویر محصول"}
        className="w-full h-full object-cover"
      />
    </div>
  ) : (
    <div className="w-12 h-12 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/20 flex items-center justify-center text-[10px] text-slate-400 dark:text-zinc-600 font-semibold select-none flex-shrink-0">
      فاقد تصویر
    </div>
  );
});