import React from "react";
import { motion } from "framer-motion";
import { toPersianNumber } from "@/lib/utils/persianNumbers";
import { Column } from "./types";
import { RowActionsDropdown } from "./RowActionsDropdown";

interface CRUDListRowProps<T> {
  item: T;
  idx: number;
  columns: Column<T>[];
  page: number;
  limit: number;
  hiddenOnMobile: string[];
  selected?: boolean;
  onSelect?: (checked: boolean) => void;
  showCheckbox?: boolean;
  renderActions?: (item: T) => React.ReactNode;
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
  selected = false,
  onSelect,
  showCheckbox = false,
  renderActions,
  onEdit,
  onRestore,
  onDelete,
  onPermanentDelete,
}: CRUDListRowProps<T>) {
  const isHidden = (key: string) => hiddenOnMobile.includes(key);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, delay: Math.min(idx, 8) * 0.01 }}
      className={`
        group relative transition-all duration-200
        ${selected ? "bg-brand-50/25 dark:bg-brand-950/10" : "bg-transparent"}
        hover:bg-brand-50/30 dark:hover:bg-brand-950/15
      `}
    >
      {showCheckbox && (
        <td className="py-1.5 px-3 text-center rounded-r-[14px] border-y border-r border-transparent group-hover:border-brand-100 dark:group-hover:border-brand-900/20">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect?.(e.target.checked)}
            className="rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500/30 h-3.5 w-3.5 cursor-pointer"
          />
        </td>
      )}

      <td 
        className={`
          py-1.5 px-3 text-center text-gray-400 dark:text-gray-500 font-medium relative overflow-hidden transition-all duration-200
          border-y border-transparent
          ${!showCheckbox ? "rounded-r-[14px] border-r" : ""}
          group-hover:border-brand-100 dark:group-hover:border-brand-900/20
        `}
      >
        <div 
          className="
            absolute right-0 top-[15%] bottom-[15%] w-[3.5px] 
            bg-gradient-to-b from-brand-400 via-brand-500 to-brand-600
            rounded-l-full origin-right
            opacity-0 scale-y-0 translate-x-1.5
            group-hover:opacity-100 group-hover:scale-y-100 group-hover:translate-x-0
            transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            z-20
          " 
        />
        <span className="relative z-10 text-[12px]">{toPersianNumber((page - 1) * limit + idx + 1)}</span>
      </td>

      {columns.map((c) => {
        const value = item[c.key as keyof T];
        return (
          <td
            key={`${item.id}-${String(c.key)}`}
            className={`
              py-1.5 px-3 text-gray-700 dark:text-gray-300 text-[12.5px] transition-all duration-200 
              border-y border-transparent
              group-hover:border-y-brand-100 dark:group-hover:border-y-brand-900/20
              ${isHidden(String(c.key)) ? "hidden lg:table-cell" : ""}
            `}
          >
            {c.render ? c.render(item) : String(value ?? "-")}
          </td>
        );
      })}

      <td 
        className="
          py-1.5 px-3 rounded-l-[14px] transition-all duration-200 text-center
          border-y border-l border-transparent
          group-hover:border-brand-100 dark:group-hover:border-brand-900/20
        "
      >
        {renderActions ? (
          renderActions(item)
        ) : (
          <RowActionsDropdown
            item={item}
            onEdit={onEdit}
            onRestore={onRestore}
            onDelete={onDelete}
            onPermanentDelete={onPermanentDelete}
          />
        )}
      </td>
    </motion.tr>
  );
}

export const CRUDListRow = React.memo(CRUDListRowInner) as <T extends { id: number }>(
  props: CRUDListRowProps<T>
) => React.JSX.Element;