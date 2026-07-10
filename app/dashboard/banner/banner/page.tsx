// app/dashboard/banners/page.tsx
"use client";

import CRUDPage from "@/components/ui/CRUDPage/CRUDPage";
import { tableFields, formFields, filterFields } from "./constants/fields";
import { bannerValidationSchema } from "./constants/validation";

export default function BannerPage() {
  return (
    <CRUDPage
      model="banner"
      modelName="بنر"
      fields={tableFields}
      formFields={formFields}
      filterFields={filterFields}
      validationSchema={bannerValidationSchema}
      enableStatusToggle={true}
      hiddenOnMobile={["url", "status", "createdAt"]}
      filterTranslations={{
        keys: {
          search: "جستجو بنرها",
          status: "وضعیت نمایش",
          position: "موقعیت نمایش",
        },
        values: {
          ACTIVE: "فعال",
          INACTIVE: "غیرفعال",
          TOP: "بالا",
          DOWN: "پایین",
          RIGHT: "راست",
        },
      }}
    />
  );
}