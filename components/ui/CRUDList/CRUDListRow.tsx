import React from "react";
import { FiEdit3, FiTrash2, FiRotateCcw, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { toPersianNumber } from "@/lib/utils/persianNumbers";
import { Column } from "./types";
import { RowActionButton } from "./RowActionButton";

interface CRUDListRowProps<T> {
  item: T;
  idx: number;
  columns: Column<T>[];
  page: number;
  limit: number;
  hiddenOnMobile: string[];
  onEdit?: (item: T) => void;
  onRestore?: (item: T) => void;
  onDelete?: (item: T) => void;
  onPermanentDelete?: (item: T) => void;
}

function CRUDListRowInner<T extends { id: number }>({
  item,
  idx,
  columns,
  page,
  limit,
  hiddenOnMobile,
  onEdit,
  onRestore,
  onDelete,
  onPermanentDelete,
}: CRUDListRowProps<T>) {
  const isHidden = (key: string) => hiddenOnMobile.includes(key);

  return (
    <motion.tr
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 25,
        delay: Math.min(idx, 8) * 0.02,
      }}
      className="
        group relative
        bg-transparent dark:bg-transparent
        
        /* اعمال بک‌گراند بسیار ملایم و شیک بر اساس رنگ اکتیو تم فعال سیستم */
        hover:bg-brand-50/30 dark:hover:bg-brand-950/15
        
        /* هاله ملایم دور کارت همرنگ با تم فعال */
        hover:shadow-[0_8px_30px_rgba(var(--brand-500),0.02)]
        
        transition-all duration-300
      "
    >
      {/* شمارشگر ردیف همراه با نوار شاخص پویا (سمت راست) */}
      <td 
        className="
          p-4 text-center text-gray-400 dark:text-gray-500 font-medium rounded-r-[18px] relative overflow-hidden transition-all duration-300
          border-y border-r border-transparent 
          
          /* هماهنگی بوردر هاور با تم انتخابی کاربر */
          group-hover:border-brand-100 dark:group-hover:border-brand-900/20
        "
      >
        {/* نوار شاخص عمودی متصل به Accent Color فعال سیستم */}
        <div 
          className="
            absolute right-0 top-[15%] bottom-[15%] w-[4px] 
            bg-gradient-to-b from-brand-400 via-brand-500 to-brand-600
            rounded-l-full origin-right
            opacity-0 
            scale-y-0 
            translate-x-1.5
            group-hover:opacity-100 
            group-hover:scale-y-100 
            group-hover:translate-x-0
            transition-all 
            duration-300 
            ease-[cubic-bezier(0.34,1.56,0.64,1)]
            z-20
          " 
        />
        <span className="relative z-10 text-[13px]">{toPersianNumber((page - 1) * limit + idx + 1)}</span>
      </td>

      {/* ستون‌های میانی جدول */}
      {columns.map((c) => {
        const value = item[c.key as keyof T];
        return (
          <td
            key={`${item.id}-${String(c.key)}`}
            className={`
              p-4 text-gray-700 dark:text-gray-300 text-[13px] transition-all duration-300 
              border-y border-transparent
              
              /* هماهنگی لبه‌های بالا و پایین با تم انتخابی کاربر */
              group-hover:border-y-brand-100 dark:group-hover:border-y-brand-900/20
              ${isHidden(String(c.key)) ? "hidden lg:table-cell" : ""}
            `}
          >
            {c.render ? c.render(item) : String(value ?? "-")}
          </td>
        );
      })}

      {/* ستون دکمه‌های عملیاتی (سمت چپ) */}
      <td 
        className="
          p-4 rounded-l-[18px] transition-all duration-300
          border-y border-l border-transparent
          
          /* هماهنگی لبه‌ی سمت چپ کارت با تم انتخابی کاربر */
          group-hover:border-brand-100 dark:group-hover:border-brand-900/20
        "
      >
        <div className="flex justify-center gap-2">
          {onEdit && (
            <RowActionButton
              kind="edit"
              title="ویرایش"
              onClick={() => onEdit(item)}
              icon={<FiEdit3 className="w-3.5 h-3.5" />}
            />
          )}
          {onRestore && (
            <RowActionButton
              kind="restore"
              title="بازگردانی"
              onClick={() => onRestore(item)}
              icon={<FiRotateCcw className="w-3.5 h-3.5" />}
            />
          )}
          {onDelete && (
            <RowActionButton
              kind="delete"
              title="حذف موقت"
              onClick={() => onDelete(item)}
              icon={<FiTrash2 className="w-3.5 h-3.5" />}
            />
          )}
          {onPermanentDelete && (
            <RowActionButton
              kind="permanent"
              title="حذف دائمی"
              onClick={() => onPermanentDelete(item)}
              icon={<FiTrash className="w-3.5 h-3.5" />}
            />
          )}
        </div>
      </td>
    </motion.tr>
  );
}

export const CRUDListRow = React.memo(CRUDListRowInner) as <T extends { id: number }>(
  props: CRUDListRowProps<T>
) => React.JSX.Element;