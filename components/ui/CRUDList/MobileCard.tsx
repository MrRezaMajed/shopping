import React from "react";
import { motion } from "framer-motion";
import { Column } from "./types";
import { RowActionsDropdown } from "./RowActionsDropdown";

interface MobileCardProps<T> {
  item: T;
  idx: number;
  columns: Column<T>[];
  selected?: boolean;
  onSelect?: (checked: boolean) => void;
  showCheckbox?: boolean;
  renderActions?: (item: T) => React.ReactNode;
  onEdit?: (item: T) => void;
  onRestore?: (item: T) => void;
  onDelete?: (item: T) => void;
  onPermanentDelete?: (item: T) => void;
}

export function MobileCardInner<T extends { id: number }>({
  item,
  idx,
  columns,
  selected = false,
  onSelect,
  showCheckbox = false,
  renderActions,
  onEdit,
  onRestore,
  onDelete,
  onPermanentDelete,
}: MobileCardProps<T>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, delay: Math.min(idx, 5) * 0.015 }}
      className={`
        p-4 rounded-xl border transition-all duration-200 flex flex-col gap-3 relative
        ${selected 
          ? "bg-brand-50/15 dark:bg-brand-950/10 border-brand-200/50 dark:border-brand-900/30 shadow-md shadow-brand-500/5" 
          : "bg-white/95 dark:bg-[#07080c]/95 border-slate-200/40 dark:border-slate-900/40"
        }
        hover:shadow-md dark:hover:shadow-black/25
      `}
    >
      {/* هدر کارت موبایل */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900/30 pb-2">
        <div className="flex items-center gap-2">
          {showCheckbox && (
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => onSelect?.(e.target.checked)}
              className="rounded-md border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500/20 h-4 w-4 cursor-pointer"
            />
          )}
          <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500">
            ID: #{item.id}
          </span>
        </div>

        <div>
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
        </div>
      </div>

      {/* بدنه اطلاعاتی کارت موبایل */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
        {columns.map((c) => {
          const value = item[c.key as keyof T];
          return (
            <div key={String(c.key)} className="flex flex-col gap-0.5">
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-medium tracking-tight">
                {c.label}
              </span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold truncate leading-relaxed">
                {c.render ? c.render(item) : String(value ?? "-")}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export const MobileCard = React.memo(MobileCardInner) as <T extends { id: number }>(
  props: MobileCardProps<T>
) => React.JSX.Element;