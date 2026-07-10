// components/CategorySelect.tsx
"use client";

import { useField } from "formik";
import { FiChevronDown, FiFolder } from "react-icons/fi";

interface CategoryNode {
  id: number;
  name: string;
  parentId: number | null;
  children?: CategoryNode[];
}

interface CategorySelectProps {
  name: string;
  label?: string;
  categories: CategoryNode[];
  placeholder?: string;
}

const buildFlatOptions = (
  categories: CategoryNode[],
  prefix = "",
  level = 0
): { value: number; label: string; level: number }[] => {
  let options: { value: number; label: string; level: number }[] = [];

  categories.forEach((cat) => {
    options.push({
      value: cat.id,
      label: `${prefix}${cat.name}`,
      level,
    });
    if (cat.children && cat.children.length > 0) {
      options = options.concat(
        buildFlatOptions(cat.children, `${prefix}— `, level + 1)
      );
    }
  });

  return options;
};

export default function CategorySelect({
  name,
  label,
  categories,
  placeholder = "انتخاب دسته‌بندی والد",
}: CategorySelectProps) {
  const [field, meta] = useField(name);
  const options = buildFlatOptions(categories);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide block">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          {...field}
          className={`
            w-full p-3.5 rounded-xl border text-sm font-semibold transition-all duration-300
            outline-none focus:ring-4 appearance-none
            ${meta.touched && meta.error
              ? "border-rose-400 dark:border-rose-500/50 bg-rose-500/5 focus:ring-rose-500/10 text-rose-900 dark:text-rose-200"
              : "border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20 text-slate-800 dark:text-zinc-100 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-indigo-500/5 focus:bg-white dark:focus:bg-zinc-950"
            }
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none w-4 h-4" />
      </div>
      {meta.touched && meta.error && (
        <p className="text-rose-500 dark:text-rose-400 text-xs font-bold mt-1.5 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0" />
          {meta.error}
        </p>
      )}
    </div>
  );
}