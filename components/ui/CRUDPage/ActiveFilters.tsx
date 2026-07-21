// @/components/ui/CRUDPage/ActiveFilters.tsx

import React from "react";
import { FiFilter, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { FilterField } from "@/components/GenericFilterBar";

interface ActiveFiltersProps {
  filters: Record<string, any>;
  filterFields: FilterField[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
  filterTranslations?: {
    keys?: Record<string, string>;
    values?: Record<string, string>;
  };
}

const FILTER_KEY_TRANSLATIONS: Record<string, string> = {
  search: "جستجو",
  status: "وضعیت",
  parentId: "والد",
  categoryId: "دسته‌بندی",
  brandId: "برند",
  position: "موقعیت",
  role: "نقش کاربری", // 👈 اضافه شد
};

const FILTER_VALUE_TRANSLATIONS: Record<string, string> = {
  ACTIVE: "فعال",
  INACTIVE: "غیرفعال",
  TOP: "بالا",
  DOWN: "پایین",
  RIGHT: "راست",
  ADMIN: "مدیر کل",        // 👈 اضافه شد
  SUPPORT: "پشتیبان سیستم",  // 👈 اضافه شد
  WRITER: "نویسنده",       // 👈 اضافه شد
  USER: "کاربر عادی",      // 👈 اضافه شد
};

export const ActiveFilters = React.memo(function ActiveFilters({
  filters,
  filterFields,
  onRemove,
  onClearAll,
  filterTranslations,
}: ActiveFiltersProps) {
  const activeFilters = React.useMemo(() => {
    return Object.entries(filters).filter(
      ([_, value]) => value !== undefined && value !== "" && value !== null
    );
  }, [filters]);

  if (activeFilters.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: -10 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={{ opacity: 0, height: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden"
    >
      <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-2xl bg-slate-100/40 dark:bg-[#121420]/40 border border-slate-200/60 dark:border-[#1f2235]/60 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-330">
          <FiFilter className="h-3.5 w-3.5" />
          فیلترهای فعال:
        </span>
        
        {activeFilters.map(([key, value]) => {
          const filterField = filterFields.find((f) => f.key === key);
          const displayKey = filterTranslations?.keys?.[key] || FILTER_KEY_TRANSLATIONS[key] || filterField?.placeholder || filterField?.label || key;
          let displayValue = filterTranslations?.values?.[String(value)] || FILTER_VALUE_TRANSLATIONS[String(value)] || String(value);

          if (filterField?.options) {
            const option = filterField.options.find((opt) => String(opt.value) === String(value));
            if (option) {
              displayValue = option.label;
            }
          }

          return (
            <div 
              key={key}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#0c0d14] border border-slate-200 dark:border-[#1f2235] shadow-sm text-xs font-semibold"
            >
              <span>{displayKey}: {displayValue}</span>
              <button
                onClick={() => onRemove(key)}
                className="p-0.5 rounded-md hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                title="حذف فیلتر"
              >
                <FiX className="h-3 w-3" />
              </button>
            </div>
          );
        })}

        <button
          onClick={onClearAll}
          className="mr-auto text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-extrabold transition-colors hover:underline text-xs"
        >
          پاکسازی همه فیلترها
        </button>
      </div>
    </motion.div>
  );
});