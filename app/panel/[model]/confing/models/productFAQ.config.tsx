// @/components/ui/CRUDPage/confing/models/productFAQ.config.tsx

import * as Yup from "yup";
import React from "react";
import { CRUDField } from "@/components/ui/CRUDPage/types";

export const productFAQConfig = {
  modelKey: "productFAQ" as const,
  modelName: "سوال متداول کالا",
  enableStatusToggle: true, // مجهز به سوئیچ سریع فعال/غیرفعال بودن در جدول
  hiddenOnMobile: ["productId", "createdAt"],
  
  // ۱. طرح‌واره اعتبارسنجی با تبدیل خودکار رشته "null" به مقدار واقعی null قبل از اعتبارسنجی عددی
  validationSchema: Yup.object().shape({
    productId: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue === "null" || originalValue === undefined || originalValue === null) {
          return null;
        }
        return Number(value);
      }),
    question: Yup.string().required("وارد کردن صورت سوال الزامی است").min(3, "سوال باید حداقل ۳ کاراکتر باشد"),
    answer: Yup.string().required("وارد کردن پاسخ الزامی است").min(3, "پاسخ باید حداقل ۳ کاراکتر باشد"),
    status: Yup.string().required("انتخاب وضعیت الزامی است"),
  }),

  filterTranslations: {
    keys: { search: "جستجو در سوال یا پاسخ", status: "وضعیت نمایش", productId: "محصول" },
    values: { ACTIVE: "فعال", INACTIVE: "غیرفعال" },
  },

  // ۲. نمایش ساختار ستون‌های جدول مدیریت
  getFields: (): CRUDField[] => [
    {
      name: "product",
      label: "محصول مربوطه",
      cellRenderer: (item: any) => (
        <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
          {item.product?.title || (
            // نمایش نشانگر شکیل شیشه‌ای برای سوالات عمومی کل سایت
            <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
              سوال عمومی کل سایت 🌐
            </span>
          )}
        </span>
      ),
    },
    { 
      name: "question", 
      label: "صورت سوال" 
    },
    {
      name: "answer",
      label: "پاسخ سوال",
      cellRenderer: (item: any) => {
        if (!item.answer) return <span className="text-xs text-slate-400">-</span>;
        const plainText = item.answer.replace(/<[^>]*>/g, "").trim();
        const words = plainText.split(/\s+/);
        const displayValue = words.length > 8 ? words.slice(0, 8).join(" ") + " ..." : plainText;
        return (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium" title={plainText}>
            {displayValue}
          </span>
        );
      },
    },
    { name: "status", label: "وضعیت" },
  ],

  // ۳. فیلدهای فرم ایجاد و ویرایش کالا
  formFields: [
    { 
      name: "productId", 
      label: "انتخاب محصول مربوطه", 
      type: "select" as const, // گزینه‌ها به صورت داینامیک از لیست محصولات فعال تغذیه می‌شوند
    },
    { 
      name: "question", 
      label: "صورت سوال متداول", 
      type: "text" as const 
    },
    {
      name: "status",
      label: "وضعیت نمایش",
      type: "select" as const,
      options: [
        { value: "ACTIVE", label: "فعال (نمایش عمومی)" },
        { value: "INACTIVE", label: "غیرفعال (عدم نمایش)" },
      ],
    },
    { 
      name: "answer", 
      label: "پاسخ سوال متداول", 
      type: "textarea" as const 
    },
  ],

  // ۴. فیلترهای ابزار بالای جدول
  filterFields: [
    { key: "search", type: "search", placeholder: "جستجو در سوال، پاسخ یا نام محصول..." },
    {
      key: "status",
      type: "select",
      placeholder: "وضعیت",
      options: [
        { value: "ACTIVE", label: "فعال" },
        { value: "INACTIVE", label: "غیرفعال" },
      ],
    },
  ],
};