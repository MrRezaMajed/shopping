// @/components/ui/CRUDPage/confing/models/postCategory.config.tsx

import * as Yup from "yup";
import { CRUDField } from "@/components/ui/CRUDPage/types";
import { generateSlug } from "@/lib/slug/generateSlug";

export const postCategoryConfig = {
  modelKey: "postCategory" as const,
  modelName: "دسته‌بندی پست",
  enableStatusToggle: true,
  hiddenOnMobile: ["slug", "parentId", "createdAt"],
  
  // طرح‌واره اعتبارسنجی منطبق بر Yup
  validationSchema: Yup.object().shape({
    name: Yup.string().required("نام دسته‌بندی الزامی است").min(2, "نام باید حداقل ۲ کاراکتر باشد"),
    slug: Yup.string().required("نامک (Slug) الزامی است"),
    status: Yup.string().required("انتخاب وضعیت الزامی است"),
    parentId: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue === "null" || originalValue === undefined) {
          return null;
        }
        return Number(value);
      }),
  }),

  filterTranslations: {
    keys: { 
      search: "جستجو در نام دسته‌بندی", 
      status: "وضعیت", 
      parentId: "دسته‌بندی والد" 
    },
    values: { 
      ACTIVE: "فعال", 
      INACTIVE: "غیرفعال" 
    },
  },

  // نمایش فیلدها در جدول مدیریت
  getFields: (): CRUDField[] => [
    { name: "name", label: "نام دسته‌بندی" },
    { name: "slug", label: "نامک (Slug)" },
    { name: "parentId", label: "والد" }, // کامپوننت CRUDPage شما این مورد را خودکار هندل می‌کند
    { name: "status", label: "وضعیت" },
  ],

  // فیلدهای فرم ایجاد و ویرایش
  formFields: [
    { name: "name", label: "نام دسته‌بندی", type: "text" },
    {
      name: "slug",
      label: "نامک (Slug)",
      type: "text",
      disabled: true,
      deps: ["name"],
      trigger: "blur",
      compute: (values: any, initialValues: any) => 
        (values.name === initialValues.name ? initialValues.slug : generateSlug(values.name)),
    },
    {
      name: "parentId",
      label: "دسته‌بندی والد",
      type: "tree", // گزینه‌ها به صورت داینامیک در CRUDPage از طریق پروپ dynamicOptions تزریق می‌شوند
    },
    {
      name: "status",
      label: "وضعیت فعال بودن",
      type: "select",
      options: [
        { value: "ACTIVE", label: "فعال" },
        { value: "INACTIVE", label: "غیرفعال" },
      ],
    },
  ],

  filterFields: [
    { key: "search", type: "search", placeholder: "جستجوی دسته‌بندی..." },
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