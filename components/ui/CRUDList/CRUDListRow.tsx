// ردیف تکی داده‌ها

import React from "react";
import { FiEdit, FiTrash2, FiRotateCcw, FiTrash } from "react-icons/fi";
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

export const CRUDListRow = React.memo(function CRUDListRow<T extends { id: number }>({
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
      key={item.id}
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{
        type: "spring",
        stiffness: 140,
        damping: 15,
        delay: Math.min(idx, 12) * 0.02,
      }}
      className="
        group
        relative
        bg-white/80 dark:bg-[#121420]/60
        hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10
        transition-all duration-200
      "
    >
      <td className="p-4 text-center text-slate-500 dark:text-slate-400 font-semibold rounded-r-2xl border-y border-r border-slate-100 dark:border-[#1f2235]/50 group-hover:border-indigo-100 dark:group-hover:border-indigo-900/30 relative overflow-hidden transition-all duration-200">
        <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center" />
        <span className="relative z-10">{toPersianNumber((page - 1) * limit + idx + 1)}</span>
      </td>

      {columns.map((c) => (
        <td
          key={`${item.id}-${String(c.key)}`}
          className={`p-4 text-slate-700 dark:text-slate-200 text-[14px] leading-relaxed border-y border-slate-100 dark:border-[#1f2235]/50 group-hover:border-indigo-100 dark:group-hover:border-indigo-900/30 transition-all duration-200 ${
            isHidden(String(c.key)) ? "hidden lg:table-cell" : ""
          }`}
        >
          {c.render ? c.render(item) : String(item[c.key] ?? "-")}
        </td>
      ))}

      <td className="p-4 rounded-l-2xl border-y border-l border-slate-100 dark:border-[#1f2235]/50 group-hover:border-indigo-100 dark:group-hover:border-indigo-900/30 transition-all duration-200">
        <div className="flex justify-center gap-2">
          {onEdit && (
            <RowActionButton
              kind="edit"
              title="ویرایش"
              onClick={() => onEdit(item)}
              icon={<FiEdit className="w-4 h-4" />}
            />
          )}
          {onRestore && (
            <RowActionButton
              kind="restore"
              title="بازگردانی"
              onClick={() => onRestore(item)}
              icon={<FiRotateCcw className="w-4 h-4" />}
            />
          )}
          {onDelete && (
            <RowActionButton
              kind="delete"
              title="حذف موقت"
              onClick={() => onDelete(item)}
              icon={<FiTrash2 className="w-4 h-4" />}
            />
          )}
          {onPermanentDelete && (
            <RowActionButton
              kind="permanent"
              title="حذف دائمی"
              onClick={() => onPermanentDelete(item)}
              icon={<FiTrash className="w-4 h-4" />}
            />
          )}
        </div>
      </td>
    </motion.tr>
  );
}) as <T extends { id: number }>(props: CRUDListRowProps<T>) => React.ReactElement;