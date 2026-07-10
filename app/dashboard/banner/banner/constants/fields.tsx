// app/dashboard/banners/constants/fields.tsx
import Image from "next/image";
import { CRUDField } from "@/components/ui/CRUDPage/types";
import { FilterField } from "@/components/GenericFilterBar";
import { toPersianNumber } from "@/lib/utils/persianNumbers";

export const tableFields: CRUDField[] = [
  {
    name: "title",
    label: "عنوان",
  },
  {
    name: "image",
    label: "تصویر",
    cellRenderer: (item: any) =>
      item.image ? (
        <div className="w-16 h-10 relative rounded-lg overflow-hidden border border-slate-100 dark:border-zinc-800 shadow-sm bg-slate-100 dark:bg-zinc-900">
          <Image
            src={item.image}
            alt={item.title || "تصویر بنر"}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
      ) : (
        <span className="text-slate-400 dark:text-zinc-600">-</span>
      ),
  },
  {
    name: "url",
    label: "لینک",
    cellRenderer: (item: any) => (
      <span className="font-mono text-xs text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-900/60 px-2 py-1 rounded-lg border border-slate-100 dark:border-zinc-800 max-w-[200px] inline-block truncate">
        {item.url || "-"}
      </span>
    ),
  },
  {
    name: "position",
    label: "موقعیت",
    cellRenderer: (item: any) => {
      const positionMap: Record<string, { label: string; color: string }> = {
        TOP: {
          label: "بالا",
          color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30"
        },
        DOWN: {
          label: "پایین",
          color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30"
        },
        RIGHT: {
          label: "راست",
          color: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30"
        },
      };
      const pos = item.position;
      const { label, color } = positionMap[pos] || {
        label: pos || "-",
        color: "bg-slate-50 text-slate-600 dark:bg-zinc-900/60 dark:text-zinc-400 border border-slate-100 dark:border-zinc-800"
      };
      return (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${color}`}>
          {label}
        </span>
      );
    },
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
    },
  },
];

export const formFields: CRUDField[] = [
  {
    name: "title",
    label: "عنوان",
    type: "text",
  },
  {
    name: "url",
    label: "لینک",
    type: "text",
  },
  {
    name: "position",
    label: "موقعیت",
    type: "select",
    options: [
      { value: "TOP", label: "بالا" },
      { value: "DOWN", label: "پایین" },
      { value: "RIGHT", label: "راست" },
    ],
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
  {
    name: "image",
    label: "تصویر",
    type: "file",
  },
];

export const filterFields: FilterField[] = [
  {
    key: "search",
    label: "جستجو",
    type: "search",
    placeholder: "جستجوی بنر...",
  },
  {
    key: "position",
    label: "موقعیت",
    type: "select",
    placeholder: "موقعیت",
    options: [
      { value: "TOP", label: "بالا" },
      { value: "DOWN", label: "پایین" },
      { value: "RIGHT", label: "راست" },
    ],
  },
  {
    key: "status",
    label: "وضعیت",
    type: "select",
    placeholder: "وضعیت",
    options: [
      { value: "ACTIVE", label: "فعال" },
      { value: "INACTIVE", label: "غیرفعال" },
    ],
  },
];