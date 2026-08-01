// @/components/ui/CRUDPage/confing/models/page.config.tsx

import * as Yup from "yup";
import { CRUDField } from "@/components/ui/CRUDPage/types";
import { generateSlug } from "@/lib/slug/generateSlug";
import { localSlugify } from "@/app/dashboard/products/utils/slugify";

export const pageConfig = {
  modelKey: "page" as const,
  modelName: "صفحه (برگه)",
  enableStatusToggle: true,
  hiddenOnMobile: ["slug", "createdAt"],

  validationSchema: Yup.object().shape({
    title: Yup.string().required("عنوان صفحه الزامی است").min(2, "حداقل ۲ کاراکتر وارد کنید"),
    slug: Yup.string().nullable(),
    content: Yup.string().nullable(),
    seoTitle: Yup.string().nullable(),
    seoDescription: Yup.string().nullable(),
    status: Yup.string().required("انتخاب وضعیت الزامی است"),
  }),

  getFields: (): CRUDField[] => [
    { name: "title", label: "عنوان صفحه" },
    {
      name: "slug",
      label: "آدرس یکتا (Slug)",
      cellRenderer: (item: any) => (
        <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 dir-ltr inline-block bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/40">
          /{item.slug}
        </span>
      ),
    },
    { name: "status", label: "وضعیت" },
  ],

  formFields: [
    { name: "title", label: "عنوان صفحه", type: "text" },
    {
      name: "slug",
      label: "نامک یکتا (سئو / آدرس صفحه)",
      type: "text",
      disabled: true,
      deps: ["title"],
      trigger: "blur",
      compute: (values: any) => {
        if (!values.title) return "";
        if (localSlugify(values.title) === values.slug?.split("-").slice(0, -1).join("-")) return values.slug;
        return generateSlug(values.title);
      },
    },
    {
      name: "status",
      label: "وضعیت انتشار",
      type: "select",
      options: [
        { value: "ACTIVE", label: "منتشر شده" },
        { value: "INACTIVE", label: "پیش‌نویس / غیرفعال" },
      ],
    },
    { name: "content", label: "محتوای صفحه (HTML / متن)", type: "jodit" },
    { name: "seoTitle", label: "عنوان سئو (SEO Title)", type: "text" },
    { name: "seoDescription", label: "توضیحات سئو (Meta Description)", type: "textarea" },
  ],

  filterFields: [
    { key: "search", type: "search", placeholder: "جستجو در عنوان صفحه..." },
    {
      key: "status",
      type: "select",
      placeholder: "همه وضعیت‌ها",
      options: [
        { value: "ACTIVE", label: "منتشر شده" },
        { value: "INACTIVE", label: "پیش‌نویس" },
      ],
    },
  ],
};