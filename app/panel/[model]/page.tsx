"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import CRUDPage from "@/components/ui/CRUDPage/CRUDPage";
import { useDynamicOptions } from "./hooks/useDynamicOptions";
import { modelRegistry } from "./confing/registry";
import { getItems } from "@/app/actions/crud/crudActions"; // 👈 ایمپورت اکشن خواندن برای سنجش تعداد رکوردها

const CategoryLoading = () => {
  return (
    <div className="w-full flex-grow flex items-center justify-center min-h-[300px] py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400 animate-pulse">
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
    posts: "posts",
    user: "users",
    users: "users",
    "post-category": "postCategories",
    "post-categories": "postCategories",
    postcategory: "postCategories",
    postcategories: "postCategories",
    "post-comment": "postComments",
    "post-comments": "postComments",
    postcomment: "postComments",
    postcomments: "postComments",
    "product-faq": "productFAQs",
    "product-faqs": "productFAQs",
    productfaq: "productFAQs",
    productfaqs: "productFAQs",
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

  const [hasExistingRecord, setHasExistingRecord] = useState(false);
  const [checkingRecord, setCheckingRecord] = useState(false);

  // 👈 بررسی هوشمند تعداد رکوردهای موجود برای مدل‌های سینگلتون (تک‌رکوردی)
  useEffect(() => {
    if (!config) return;

    if (config.isSingleton) {
      setCheckingRecord(true);
      getItems(config.modelKey, 1, 1)
        .then((res) => {
          if (res.success && res.data && res.data.length > 0) {
            setHasExistingRecord(true); // اگر رکورد از قبل موجود بود
          } else {
            setHasExistingRecord(false);
          }
        })
        .catch(() => setHasExistingRecord(false))
        .finally(() => setCheckingRecord(false));
    } else {
      setHasExistingRecord(false);
    }
  }, [config]);

  const {
    flatCategories,
    flatBrands,
    loadingOptions,
    dynamicOptions,
  } = useDynamicOptions(config?.modelKey || "");

  const tableFields = useMemo(() => {
    if (!config) return [];
    return config.getFields({ 
      flatCategories, 
      flatBrands
    });
  }, [config, flatCategories, flatBrands]);

  if (!config) {
    notFound();
  }

  if (loadingOptions || checkingRecord) {
    return <CategoryLoading />;
  }

  // 👈 در صورتی که مدل سینگلتون باشد و از قبل رکوردی ثبت شده باشد، دکمه ایجاد موقتا غیرفعال می‌شود
  const shouldDisableCreate = config.disableCreate || (config.isSingleton && hasExistingRecord);

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
      
      // ارسال ویژگی‌های عدم نمایش دکمه‌ها به صورت کاملاً پویا
      disableCreate={shouldDisableCreate}
      disableEdit={config.disableEdit}
    />
  );
}