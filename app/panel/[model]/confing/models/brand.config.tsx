import * as Yup from "yup";
import Link from "next/link";
import { CRUDField } from "@/components/ui/CRUDPage/types";

import { generateSlug } from "@/lib/slug/generateSlug";
import { toPersianNumber } from "@/lib/utils/persianNumbers";

export const brandConfig = {
  modelKey: "brand" as const,
  modelName: "برند",
  enableStatusToggle: true,
  hiddenOnMobile: ["slug", "status", "createdAt"],
  validationSchema: Yup.object().shape({
    name: Yup.string().required("نام برند الزامی است"),
    slug: Yup.string().required("نامک الزامی است"),
    status: Yup.string().required("انتخاب وضعیت الزامی است"),
  }),
  getFields: (): CRUDField[] => [
    { name: "name", label: "نام برند" },
    {
      name: "slug",
      label: "نامک (Slug)",
      cellRenderer: (item: any) => (
        <span className="font-mono text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
          {item.slug || "-"}
        </span>
      ),
    },
    {
      name: "productsCount",
      label: "تعداد محصولات",
      cellRenderer: (item: any) => {
        const count = item._count?.products ?? 0;
        return count > 0 ? (
          <Link
            href={`/dashboard/products?brandId=${item.id}`}
            className="inline-flex items-center justify-center bg-indigo-50 text-indigo-600 px-3 py-1 rounded-xl text-xs font-black"
          >
            {toPersianNumber(count)} مورد
          </Link>
        ) : (
          <span className="text-xs text-slate-400">{toPersianNumber(count)} مورد</span>
        );
      },
    },
    { name: "status", label: "وضعیت" },
  ],
  formFields: [
    { name: "name", label: "نام برند", type: "text" },
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
  ],
  filterFields: [
    { key: "search", type: "search", placeholder: "جستجو برند..." },
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