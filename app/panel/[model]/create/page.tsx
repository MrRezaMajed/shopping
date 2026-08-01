"use client";

import { useMemo, useState, useEffect, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { modelRegistry } from "../confing/registry";
import { useDynamicOptions } from "../hooks/useDynamicOptions";
import CRUDEditForm from "@/components/ui/CRUDEditForm/CRUDEditForm";
import { createItem } from "@/app/actions/crud/crudActions";
import { useNotification } from "@/context/NotificationContext";

const formVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 110, damping: 14 } },
  exit: { opacity: 0, scale: 0.98, y: -10, transition: { duration: 0.2 } },
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
    "post-category": "postCategories",
    "post-categories": "postCategories",
    postcategory: "postCategories",
    postcategories: "postCategories",
    "product-faq": "productFAQs",
    "product-faqs": "productFAQs",
    productfaq: "productFAQs",
    productfaqs: "productFAQs",
    
  };
  return map[param.toLowerCase()] || param;
};

export default function GenericCreatePage() {
  const params = useParams();
  const router = useRouter();
  const { addNotification } = useNotification();
  const [submitting, setSubmitting] = useState(false);

  const rawModelParam = String(params?.model || "");
  const modelParam = useMemo(() => normalizeModelParam(rawModelParam), [rawModelParam]);

  const config = useMemo(() => {
    return modelRegistry[modelParam] || null;
  }, [modelParam]);

  const { dynamicOptions, loadingOptions } = useDynamicOptions(config?.modelKey || "");

  // بستن صفحه با زدن دکمه Escape کیبورد
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        router.push(`/panel/${rawModelParam}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, rawModelParam]);

  const enrichedFormFields = useMemo(() => {
    if (!config) return [];
    return config.formFields.map((field) => {
      if ((field.type === "select" || field.type === "tree") && dynamicOptions[field.name]) {
        return {
          ...field,
          options: dynamicOptions[field.name],
        };
      }
      return field;
    });
  }, [config, dynamicOptions]);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center text-rose-500 font-bold" dir="rtl">
        ساختار داده برای ایجاد این مدل یافت نشد!
      </div>
    );
  }

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    const res = await createItem(config.modelKey, values);

    if (!res.success) {
      addNotification({
        type: "error",
        title: "خطا در ثبت اطلاعات",
        message: res.error || "خطا در برقراری ارتباط با سرور رخ داد.",
        duration: 4500,
      });
      setSubmitting(false);
    } else {
      addNotification({
        type: "success",
        title: "ثبت موفقیت‌آمیز",
        message: `${config.modelName} جدید با موفقیت در پایگاه داده ایجاد شد.`,
        duration: 4000,
      });
      
      // هدایت آنی به صفحه جدول بدون مواجهه با فریز شدن کلاینت
      startTransition(() => {
        router.push(`/panel/${rawModelParam}`);
      });
    }
  };

  if (loadingOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
            در حال بارگذاری ساختار داده‌های کمکی...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto">
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full"
      >
        <CRUDEditForm
          mode="create"
          title={`ایجاد ${config.modelName} جدید`}
          validationSchema={config.validationSchema}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/panel/${rawModelParam}`)}
          fields={enrichedFormFields}
        />
      </motion.div>
    </div>
  );
}