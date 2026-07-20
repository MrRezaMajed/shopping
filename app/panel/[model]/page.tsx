// @/app/dashboard/[model]/page.tsx (یا مسیر مشابه شما)

"use client";

import { useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import CRUDPage from "@/components/ui/CRUDPage/CRUDPage";
import { useDynamicOptions } from "./hooks/useDynamicOptions";
import { modelRegistry } from "./confing/registry";

// تعریف مستقیم کامپوننت لودینگ به صورت کاملاً خودکفا (Inline)
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

// تابع نرمالایزر برای مپ کردن هوشمند حالت‌های مفرد و جمع آدرس‌ها
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
    post: "posts",        // اضافه شده برای مدل پست
    posts: "posts"        // اضافه شده برای مدل پست
  };
  return map[param.toLowerCase()] || param;
};

export default function GenericModelPage() {
  const params = useParams();
  const rawModelParam = String(params?.model || "");
  
  // تبدیل هوشمند پارامتر آدرس
  const modelParam = useMemo(() => normalizeModelParam(rawModelParam), [rawModelParam]);

  // بررسی تطابق با مدل‌های ثبت‌شده در رجیستری پنل
  const config = useMemo(() => {
    return modelRegistry[modelParam] || null;
  }, [modelParam]);

  // در صورت عدم وجود پیکربندی معتبر، رندر ۴۰۴ استاندارد نکست‌جی‌اس
  if (!config) {
    notFound();
  }

  // لود خودکار پویای ساختار درختی و گزینه‌های مورد نیاز فیلدها
  const {
    flatCategories,
    flatBrands,
    loadingOptions,
    dynamicOptions,
  } = useDynamicOptions(config.modelKey);

  // لود ستون‌های جدول
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
      formFields={config.formFields}
      filterFields={config.filterFields}
      validationSchema={config.validationSchema}
      enableStatusToggle={config.enableStatusToggle}
      dynamicOptions={dynamicOptions}
      hiddenOnMobile={config.hiddenOnMobile}
      filterTranslations={config.filterTranslations}
    />
  );
}