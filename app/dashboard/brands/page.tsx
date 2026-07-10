// app/dashboard/brands/page.tsx
"use client";

import CRUDPage from "@/components/ui/CRUDPage/CRUDPage";
import { tableFields, formFields, filterFields } from "./constants/fields";
import { brandValidationSchema } from "./constants/validation";

export default function BrandPage() {
  return (
    <CRUDPage
      model="brand"
      modelName="برند"
      fields={tableFields}
      formFields={formFields}
      filterFields={filterFields}
      validationSchema={brandValidationSchema}
      enableStatusToggle={true}
      hiddenOnMobile={["slug", "status", "createdAt"]}
      filterTranslations={{
        keys: {
          search: "جستجو برندها",
          status: "وضعیت نمایش"
        },
        values: {
          ACTIVE: "فعال",
          INACTIVE: "غیرفعال"
        }
      }}
    />
  );
}