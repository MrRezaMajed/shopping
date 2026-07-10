برای پیاده‌سازی **«رویکرد ترکیبی» (Hybrid Approach)**، پروژه‌ی شما را به این صورت تقسیم‌بندی می‌کنیم:

1. **بخش اختصاصی (Dedicated):** صفحه **محصولات (Products)** به دلیل پیچیدگی بالا (تنوع‌ها، گالری تصاویر مستقل و محاسبات کستوم) به صورت یک پوشه‌ی کاملاً مجزا در مسیر `app/admin/products/page.tsx` باقی می‌ماند تا آزادی کامل در توسعه داشته باشد.
2. **بخش داینامیک (Dynamic):** بقیه صفحات مانند **برندها** و **دسته‌بندی‌ها** (و بعدها بنرها، تگ‌ها و...) از طریق یک مسیر پویا در `app/admin/[model]/page.tsx` با کمک یک فایل تنظیمات مرکزی لود می‌شوند.

در ادامه، ساختار پوشه‌بندی و کدهای مربوط به این سیستم ارائه شده است:

---

### ۱. ساختار پیشنهادی پوشه‌ها (Folder Structure)

مسیرهای گوناگون را بدین صورت در پوشه `app` پروژه‌ی خود سازماندهی کنید:

```bash
app/
└── admin/
    ├── products/                 # مأموریت اختصاصی: محصولات (پیچیده)
    │   ├── components/           # سلول‌های اختصاصی محصولات
    │   ├── config/               # کانفیگ فیلدهای محصول (همان کدهای فعلی شما)
    │   ├── hooks/                # هوک اختصاصی محصول
    │   ├── utils/                # slugify و متدهای کمکی محصول
    │   ├── types.ts              # تایپ‌های محصول
    │   └── page.tsx              # صفحه اصلی اختصاصی محصولات (همان فایل شما)
    │
    ├── [model]/                  # مأموریت داینامیک: سایر صفحات (ساده)
    │   └── page.tsx              # صفحه CRUD همه‌منظوره و پویا
    │
    └── config/
        └── crudRegistry.ts       # دفترچه ثبت و پیکربندی برندها، دسته‌بندی‌ها و...
```

با توجه به ساختار بک‌اند توسعه‌یافته شما (فایل‌های `read.ts`، `write.ts`، `delete.ts` و...) که در حال حاضر متدهای اصلی مانند `getItems` و `createItem` را به صورت جنریک و بر اساس پارامتر `model: ModelKey` دریافت می‌کنند، سیستم شما پتانسیل فوق‌العاده‌ای برای پیاده‌سازی **رویکرد ترکیبی (Hybrid)** دارد.

در این پیاده‌سازی، فرض می‌شود فایل‌های بک‌اند شما در مسیر `@/app/actions/crud` قرار دارند. 

تنظیمات و کدهای لازم برای پیاده‌سازی کامل این ساختار در فرانت‌اند ارائه شده است:

---

### ۱. فایل پیکربندی مرکزی مدل‌ها (`app/admin/config/crudRegistry.ts`)
این فایل اطلاعات توصیفی مدل‌های ساده پروژه شما (`brand`، `category` و `banner`) را متناسب با فیلدها و انواع داده‌ای که در بک‌اند تعریف کرده‌اید، مدیریت می‌کند:

```typescript
// app/admin/config/crudRegistry.ts
import * as Yup from "yup";
import { FilterField } from "@/components/ui/GenericFilterBar/types";
import type { CRUDField } from "@/components/ui/CRUDPage/types";
import { ModelKey } from "@/app/actions/crud"; // ایمپورت تایپ مدل‌ها از بک‌اند شما

export interface ModelConfig<T = any> {
  modelName: string;
  fields: CRUDField<T>[];
  formFields: CRUDField<T>[];
  filterFields: FilterField[];
  validationSchema: Yup.AnyObjectSchema;
  dependsOn?: string[]; // مدل‌هایی که فیلدهای انتخابی فرم به آن‌ها وابسته است
  enableStatusToggle?: boolean;
}

export const crudRegistry: Record<Exclude<ModelKey, "product">, ModelConfig> = {
  // ۱. تنظیمات برندها
  brand: {
    modelName: "برند",
    enableStatusToggle: true,
    dependsOn: [],
    validationSchema: Yup.object().shape({
      name: Yup.string().required("وارد کردن نام برند الزامی است"),
      status: Yup.string().oneOf(["ACTIVE", "INACTIVE"]).required("انتخاب وضعیت الزامی است"),
    }),
    fields: [
      { name: "name", label: "نام برند" },
      { name: "status", label: "وضعیت" },
    ],
    formFields: [
      { name: "name", label: "نام برند تجاری", type: "text" },
      {
        name: "status",
        label: "وضعیت نمایش برند",
        type: "select",
        options: [
          { value: "ACTIVE", label: "فعال (نمایش عمومی)" },
          { value: "INACTIVE", label: "غیرفعال" },
        ],
      },
    ],
    filterFields: [
      { key: "search", label: "جستجو", type: "search", placeholder: "جستجو در نام برند..." },
    ],
  },

  // ۲. تنظیمات دسته‌بندی‌ها
  category: {
    modelName: "دسته‌بندی",
    enableStatusToggle: true,
    dependsOn: ["category"],
    validationSchema: Yup.object().shape({
      name: Yup.string().required("وارد کردن نام دسته‌بندی الزامی است"),
      parentId: Yup.number().nullable(),
      status: Yup.string().oneOf(["ACTIVE", "INACTIVE"]).required("انتخاب وضعیت الزامی است"),
    }),
    fields: [
      { name: "name", label: "نام دسته‌بندی" },
      { name: "parentId", label: "دسته‌بندی والد", cellType: "reference", referenceModel: "category" },
      { name: "status", label: "وضعیت" },
    ],
    formFields: [
      { name: "name", label: "نام دسته‌بندی", type: "text" },
      { name: "parentId", label: "دسته‌بندی والد (در صورت وجود)", type: "tree" },
      {
        name: "status",
        label: "وضعیت نمایش دسته‌بندی",
        type: "select",
        options: [
          { value: "ACTIVE", label: "فعال" },
          { value: "INACTIVE", label: "غیرفعال" },
        ],
      },
    ],
    filterFields: [
      { key: "search", label: "جستجو", type: "search", placeholder: "جستجو در نام دسته‌بندی..." },
    ],
  },

  // ۳. تنظیمات بنرها
  banner: {
    modelName: "بنر تبلیغاتی",
    enableStatusToggle: true,
    dependsOn: [],
    validationSchema: Yup.object().shape({
      title: Yup.string().required("وارد کردن عنوان بنر الزامی است"),
      status: Yup.string().oneOf(["ACTIVE", "INACTIVE"]).required(),
    }),
    fields: [
      { name: "title", label: "عنوان بنر" },
      { name: "status", label: "وضعیت" },
    ],
    formFields: [
      { name: "title", label: "عنوان یا نام بنر", type: "text" },
      {
        name: "status",
        label: "وضعیت نمایش بنر",
        type: "select",
        options: [
          { value: "ACTIVE", label: "فعال" },
          { value: "INACTIVE", label: "غیرفعال" },
        ],
      },
    ],
    filterFields: [
      { key: "search", label: "جستجو", type: "search", placeholder: "جستجو در عنوان بنر..." },
    ],
  },
};
```

---

### ۲. هوک جنریک گزینه‌های انتخابی (`hooks/useGenericOptions.ts`)
این هوک به طور مستقیم از کدهای `crudActions` شما (توابع `getCategories` و `getBrands` در فایل `read.ts`) استفاده می‌کند تا آپشن‌های فرم‌ها را به شکل داینامیک لود کند:

```typescript
// hooks/useGenericOptions.ts
import { useState, useEffect } from "react";
import { getCategories, getBrands } from "@/app/actions/crud"; // ایمپورت مستقیم از پکیج اکشن‌های شما

export function useGenericOptions(dependsOn: string[] = []) {
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(dependsOn.length > 0);

  useEffect(() => {
    if (!dependsOn || dependsOn.length === 0) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);

        const promises: Promise<any>[] = [];
        const keys: string[] = [];

        if (dependsOn.includes("category")) {
          promises.push(getCategories());
          keys.push("categoryId");
        }
        if (dependsOn.includes("brand")) {
          promises.push(getBrands());
          keys.push("brandId");
        }

        const results = await Promise.all(promises);
        const formatted: Record<string, any> = {};

        keys.forEach((key, index) => {
          const rawData = results[index] || [];
          if (key === "categoryId") {
            // ساختار درختی برای فیلدهای tree دسته‌بندی
            formatted.parentId = rawData.map((cat: any) => ({
              value: String(cat.id),
              label: cat.name,
              parentId: cat.parentId ? String(cat.parentId) : null,
            }));
            // همچنین برای فیلدهای معمولی سلکتور دسته‌بندی
            formatted.categoryId = formatted.parentId;
          } else if (key === "brandId") {
            formatted.brandId = [
              { value: "null", label: "بدون برند" },
              ...rawData.map((b: any) => ({ value: String(b.id), label: b.name })),
            ];
          }
        });

        setDynamicOptions(formatted);
      } catch (error) {
        console.error("خطا در همگام‌سازی گزینه‌های فرم جنریک:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [JSON.stringify(dependsOn)]);

  return { dynamicOptions, loading };
}
```

---

### ۳. صفحه داینامیک برای موجودیت‌های ساده (`app/admin/[model]/page.tsx`)
این مسیرِ پویا، پارامتر `[model]` را به عنوان نمونه از ورودی گرفته و با استفاده از اکشن‌های عمومی شما رندر می‌کند:

```tsx
// app/admin/[model]/page.tsx
"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import CRUDPage from "@/components/ui/CRUDPage/CRUDPage";
import { crudRegistry } from "../config/crudRegistry";
import { useGenericOptions } from "@/hooks/useGenericOptions";
import { ModelKey } from "@/app/actions/crud"; // ایمپورت تایپ از فایل بک‌اند شما

export default function DynamicCRUDPage() {
  const params = useParams();
  const modelKey = params.model as ModelKey;

  // ۱. بررسی اعتبار مدل در رجیستری (محدود به برند، دسته‌بندی، بنر)
  const config = crudRegistry[modelKey as Exclude<ModelKey, "product">];
  
  if (!config) {
    return notFound(); // اگر کاربری به آدرسی مثل /admin/invalid برود، خطای ۴۰۴ بازگردانده می‌شود
  }

  // ۲. لود داده‌های رابطه‌ای (مانند دسته‌بندی‌های والد)
  const { dynamicOptions, loading } = useGenericOptions(config.dependsOn);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">
            در حال همگام‌سازی اطلاعات بخش {config.modelName}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <CRUDPage
      model={modelKey} // پارامتر دقیقاً به عنوان کلید مدل به کامپوننت داخلی و اکشن‌ها پاس داده می‌شود
      modelName={config.modelName}
      fields={config.fields}
      formFields={config.formFields}
      filterFields={config.filterFields}
      validationSchema={config.validationSchema}
      enableStatusToggle={config.enableStatusToggle ?? true}
      dynamicOptions={dynamicOptions}
    />
  );
}
```

---

### ۴. صفحه محصولات به صورت مجزا و تفکیک‌شده (`app/admin/products/page.tsx`)
صفحه محصولات شما بدون تغییر در منطق کدهای اصلی‌اش، در یک پوشه اختصاصی باقی می‌ماند تا پیچیدگی‌های واریانت‌ها و گالری تصاویر را به صورت ایزوله مدیریت کند. این پوشه به صورت فیزیکی وجود دارد و طبق استاندارد مسیریابی Next.js، به مسیر داینامیک ترجیح داده شده و بدون تداخل باز می‌شود:

```tsx
// app/admin/products/page.tsx
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

  const tableFields = React.useMemo(
    () => getTableFields(flatCategories, flatBrands),
    [flatCategories, flatBrands]
  );

  if (loadingOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
            در حال همگام‌سازی ساختار داده‌های محصولات...
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
```

### مزیت نهایی این ادغام با اکشن‌های شما:
چون کامپوننت `<CRUDPage />` شما احتمالاً درونیاتش را از طریق توابع عمومیِ `crudActions` مدیریت می‌کند، ارسال ویژگی `model` به عنوان کلید واژه (`"brand"`, `"category"`, `"banner"`) به صورت مستقیم در بدنه کامپوننت با متدهای بک‌اند شما ارتباط برقرار می‌کند. با این روش، سیستم شما بدون بازنویسی کدهای تکراری، آماده اضافه کردن هر مدل داده‌ایِ ساده در آینده خواهد بود.