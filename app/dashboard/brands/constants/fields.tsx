// app/dashboard/brands/constants/fields.tsx
import Link from "next/link";
import { CRUDField } from "@/components/ui/CRUDPage/types";
import { FilterField } from "@/components/ui/GenericFilterBar/types";
import { toPersianNumber } from "@/lib/utils/persianNumbers";
import { generateSlug } from "@/lib/slug/generateSlug";

export const tableFields: CRUDField[] = [
  { 
    name: "name", 
    label: "نام برند" 
  },
  { 
    name: "slug", 
    label: "نامک (Slug)",
    cellRenderer: (item: any) => (
      <span className="font-mono text-xs text-slate-500 dark:text-zinc-400 bg-slate-5-0 dark:bg-zinc-900/60 px-2 py-1 rounded-lg border border-slate-100 dark:border-zinc-800">
        {item.slug || "-"}
      </span>
    ),
  },
  {
    name: "productsCount",
    label: "تعداد محصولات",
    cellRenderer: (item: any) => {
      const count = item._count?.products ?? 0;
      
      if (count > 0) {
        return (
          <Link 
            href={`/dashboard/products?brandId=${item.id}`}
            title="مشاهده لیست محصولات این برند"
            className="
              inline-flex items-center justify-center 
              bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60
              text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300
              border border-indigo-150 hover:border-indigo-200 dark:border-indigo-900/30 dark:hover:border-indigo-850/60
              px-3 py-1 rounded-xl text-xs font-black min-w-8 
              shadow-sm hover:shadow transition-all duration-200 hover:scale-105 active:scale-95
            "
          >
            {toPersianNumber(count)} مورد
          </Link>
        );
      }

      return (
        <span className="inline-flex items-center justify-center bg-slate-100 dark:bg-zinc-900/60 text-slate-400 dark:text-zinc-500 px-3 py-1 rounded-xl text-xs font-bold min-w-8 border border-slate-200/40 dark:border-zinc-800/40 select-none">
          {toPersianNumber(count)} مورد
        </span>
      );
    }
  },
  {
    name: "status",
    label: "وضعیت",
  },
  { 
    name: "createdAt", 
    label: "تاریخ ایجاد", 
    cellRenderer: (item: any) => {
      if (!item.createdAt) return "-";
      return (
        <span className="inline-flex items-center text-[11px] font-bold text-slate-500 dark:text-zinc-400 bg-slate-100/40 dark:bg-zinc-900/40 border border-slate-200/30 dark:border-zinc-800/30 px-2.5 py-1 rounded-xl">
          {toPersianNumber(new Date(item.createdAt).toLocaleDateString("fa-IR"))}
        </span>
      );
    }
  },
];

export const formFields: CRUDField[] = [
  { 
    name: "name", 
    label: "نام برند", 
    type: "text" 
  },
  { 
    name: "slug", 
    label: "نامک (Slug)", 
    type: "text",
    disabled: true, 
    deps: ["name"], 
    trigger: "blur", 
    compute: (values: any, initialValues: any) => {
      if (values.name === initialValues.name) {
        return initialValues.slug || "";
      }
      return generateSlug(values.name, values.slug); 
    }
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
];

export const filterFields: FilterField[] = [
  { 
    type: "search", 
    key: "search", 
    placeholder: "جستجو برند..." 
  },
  {
    type: "select",
    key: "status",
    placeholder: "وضعیت",
    options: [
      { value: "ACTIVE", label: "فعال" },
      { value: "INACTIVE", label: "غیرفعال" },
    ],
  },
];