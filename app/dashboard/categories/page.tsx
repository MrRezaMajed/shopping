// app/dashboard/categories/page.tsx
"use client";

import CRUDPage from "@/components/ui/CRUDPage/CRUDPage";
import { useCategoryOptions } from "./hooks/useCategoryOptions";
import { tableFields, formFields, filterFields } from "./constants/fields";
import { categoryValidationSchema } from "./constants/validation";
import { CategoryLoading } from "./components/CategoryLoading";

export default function CategoriesPage() {
  const { dynamicOptions, loadingOptions } = useCategoryOptions();

  if (loadingOptions) {
    return <CategoryLoading />;
  }

  return (
    <CRUDPage
      model="category"
      modelName="دسته‌بندی"
      fields={tableFields}
      formFields={formFields}
      filterFields={filterFields}
      validationSchema={categoryValidationSchema}
      enableStatusToggle={true}
      dynamicOptions={dynamicOptions}
      hiddenOnMobile={["slug", "createdAt", "productsCount"]}
      filterTranslations={{
        keys: {
          search: "جستجو در دسته‌ها",
          status: "وضعیت نمایش",
          parentId: "دسته‌بندی والد",
        },
        values: {
          ACTIVE: "فعال",
          INACTIVE: "غیرفعال",
        },
      }}
    />
  );
}