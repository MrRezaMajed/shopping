"use client";

import React from "react";
import CRUDPage from "@/components/ui/CRUDPage/CRUDPage";
import { useProductOptions } from "./hooks/useProductOptions";
import { productValidationSchema } from "./utils/validation";
import { getTableFields, formFields, filterFields } from "./config/fields";
import { EnrichedProduct } from "./types";

export default function ProductsPage() {
  const {
    flatCategories,
    flatBrands,
    loadingOptions,
    dynamicOptions,
  } = useProductOptions();

  // ساختار ستون‌های جدول با ارسال داده‌های دریافتی برای سلول‌های کستوم
  const tableFields = React.useMemo(
    () => getTableFields(flatCategories, flatBrands),
    [flatCategories, flatBrands]
  );

  if (loadingOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-zinc-455">
            در حال همگام‌سازی ساختار داده‌ها...
          </p>
        </div>
      </div>
    );
  }

  return (
    <CRUDPage<EnrichedProduct>
      model="product"
      modelName="محصول"
      fields={tableFields}
      formFields={formFields}
      filterFields={filterFields}
      validationSchema={productValidationSchema}
      enableStatusToggle={true}
      dynamicOptions={dynamicOptions}
      hiddenOnMobile={["brandId", "createdAt"]}
    />
  );
}