import * as Yup from "yup";
import React from "react";
import Link from "next/link";
import { CRUDField } from "@/components/ui/CRUDPage/types";
import { FilterField } from "@/components/ui/GenericFilterBar/types";

import { generateSlug } from "@/lib/slug/generateSlug";
import { toPersianNumber } from "@/lib/utils/persianNumbers";

export const categoryConfig = {
  modelKey: "category" as const,
  modelName: "دسته‌بندی",
  enableStatusToggle: true,
  hiddenOnMobile: ["slug", "createdAt", "productsCount"],
  validationSchema: Yup.object().shape({
    name: Yup.string().required("نام دسته‌بندی الزامی است").min(2),
    slug: Yup.string().required("نامک الزامی است"),
    status: Yup.string().required("انتخاب وضعیت الزامی است"),
    
    // اصلاح فیلد دسته‌بندی والد با هندل کردن مقدار null رشته‌ای
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
    keys: { search: "جستجو در دسته‌ها", status: "وضعیت نمایش", parentId: "دسته‌بندی والد" },
    values: { ACTIVE: "فعال", INACTIVE: "غیرفعال" },
  },
  getFields: (): CRUDField[] => [
    { name: "name", label: "نام" },
    {
      name: "slug",
      label: "نامک (Slug)",
      cellRenderer: (item: any) => (
        <span className="font-mono text-xs text-slate-500 bg-slate-50 dark:bg-zinc-900/60 px-2 py-1 rounded-lg border border-slate-100 dark:border-zinc-800">
          {item.slug || "-"}
        </span>
      ),
    },
    { name: "parentId", label: "والد" },
    { name: "status", label: "وضعیت" },
    {
      name: "productsCount",
      label: "تعداد محصولات",
      cellRenderer: (item: any) => {
        const count = item._count?.products ?? 0;
        return count > 0 ? (
          <Link
            href={`/dashboard/products?categoryId=${item.id}`}
            className="inline-flex items-center justify-center bg-indigo-50 text-indigo-600 border border-indigo-150 px-3 py-1 rounded-xl text-xs font-black"
          >
            {toPersianNumber(count)} مورد
          </Link>
        ) : (
          <span className="text-xs text-slate-400">{toPersianNumber(count)} مورد</span>
        );
      },
    },
  ],
  formFields: [
    { name: "name", label: "نام دسته‌بندی", type: "text" },
    {
      name: "slug",
      label: "نامک (Slug)",
      type: "text",
      disabled: true,
      deps: ["name"],
      trigger: "blur",
      compute: (values: any, initialValues: any) => (values.name === initialValues.name ? initialValues.slug : generateSlug(values.name)),
    },
    {
      name: "status",
      label: "وضعیت",
      type: "select",
      options: [
        { value: "ACTIVE", label: "فعال" },
        { value: "INACTIVE", label: "غیرفعال" },
      ],
    },
    { name: "parentId", label: "دسته‌بندی والد", type: "tree" },
  ],
  filterFields: [
    { key: "search", type: "search", placeholder: "جستجو در نام دسته‌بندی..." },
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