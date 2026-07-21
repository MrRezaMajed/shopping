"use client";

import { useMemo, useState, useEffect, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";

import CRUDEditForm from "@/components/ui/CRUDEditForm/CRUDEditForm";
import { getItems, updateItem } from "@/app/actions/crud/crudActions";
import { useNotification } from "@/context/NotificationContext";
import { modelRegistry } from "../../confing/registry";
import { useDynamicOptions } from "../../hooks/useDynamicOptions";

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
    posts: "posts"
  };
  return map[param.toLowerCase()] || param;
};

export default function GenericEditPage() {
  const params = useParams();
  const router = useRouter();
  const { addNotification } = useNotification();
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);
  const [fetchError, setFetchError] = useState("");

  const rawModelParam = String(params?.model || "");
  const idParam = Number(params?.id);
  const modelParam = useMemo(() => normalizeModelParam(rawModelParam), [rawModelParam]);

  const config = useMemo(() => {
    return modelRegistry[modelParam] || null;
  }, [modelParam]);

  const { dynamicOptions, loadingOptions } = useDynamicOptions(config?.modelKey || "");

  // دریافت اطلاعات جاری آیتم از سرور
  useEffect(() => {
    if (!config || !idParam) return;

    const loadRecord = async () => {
      try {
        const response = await getItems(config.modelKey, 1, 1, { id: idParam });
        if (response.success && response.data?.length > 0) {
          setInitialData(response.data[0]);
        } else {
          setFetchError("رکورد مورد نظر یافت نشد.");
        }
      } catch (err) {
        setFetchError("خطا در همگام‌سازی اطلاعات قبلی.");
      } finally {
        setFetching(false);
      }
    };

    loadRecord();
  }, [config, idParam]);

  // کنترل میانبر انصراف (Escape)
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
        ساختار داده برای ویرایش این مدل یافت نشد!
      </div>
    );
  }

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    const res = await updateItem(config.modelKey, idParam, values);

    if (!res.success) {
      addNotification({
        type: "error",
        title: "خطا در ثبت تغییرات",
        message: res.error || "خطا در برقراری ارتباط با سرور رخ داد.",
        duration: 4500,
      });
      setSubmitting(false);
    } else {
      addNotification({
        type: "success",
        title: "ویرایش موفقیت‌آمیز",
        message: `اطلاعات ${config.modelName} با موفقیت به‌روزرسانی شد.`,
        duration: 4000,
      });
      
      // هدایت امن به صفحه جدول مدل بدون معطلی و فریز در کلاینت
      startTransition(() => {
        router.push(`/panel/${rawModelParam}`);
      });
    }
  };

  if (fetching || loadingOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
            در حال همگام‌سازی اطلاعات رکورد جاری...
          </p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-rose-500 font-bold" dir="rtl">
        {fetchError}
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
          mode="edit"
          title={`ویرایش اطلاعات ${config.modelName}`}
          initialValues={initialData}
          validationSchema={config.validationSchema}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/panel/${rawModelParam}`)}
          fields={enrichedFormFields}
        />
      </motion.div>
    </div>
  );
}