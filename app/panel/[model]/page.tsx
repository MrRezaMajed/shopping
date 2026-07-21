// @/app/dashboard/[model]/page.tsx

"use client";

import { useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import CRUDPage from "@/components/ui/CRUDPage/CRUDPage";
import { useDynamicOptions } from "./hooks/useDynamicOptions";
import { modelRegistry } from "./confing/registry";

const CategoryLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
          در حال بارگذاری ساختار داده...
        </p>
      </div>
    </div>
  );
};

const normalizeModelParam = (param: string): string => {
  const map: Record<string, string> = {
    category: "categories",
    categories: "categories",
    product: "products",
    products: "products",
    brand: "brands",
    brands: "brands",
    banner: "banners",
    banners: "banners",
    post: "posts",
    posts: "posts"
  };
  return map[param.toLowerCase()] || param;
};

export default function GenericModelPage() {
  const params = useParams();
  const rawModelParam = String(params?.model || "");
  
  const modelParam = useMemo(() => normalizeModelParam(rawModelParam), [rawModelParam]);

  const config = useMemo(() => {
    return modelRegistry[modelParam] || null;
  }, [modelParam]);

  if (!config) {
    notFound();
  }

  const {
    flatCategories,
    flatBrands,
    loadingOptions,
    dynamicOptions,
  } = useDynamicOptions(config.modelKey);

  const tableFields = useMemo(() => {
    return config.getFields({ 
      flatCategories, 
      flatBrands
    });
  }, [config, flatCategories, flatBrands]);

  if (loadingOptions) {
    return <CategoryLoading />;
  }

  return (
    <CRUDPage
      model={config.modelKey}
      modelName={config.modelName}
      fields={tableFields}
      filterFields={config.filterFields}
      enableStatusToggle={config.enableStatusToggle}
      dynamicOptions={dynamicOptions}
      hiddenOnMobile={config.hiddenOnMobile}
      filterTranslations={config.filterTranslations}
    />
  );
}