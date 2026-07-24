"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CRUDListProps } from "./types";
import { CRUDListHeader } from "./CRUDListHeader";
import { CRUDListRow } from "./CRUDListRow";
import { SkeletonRow } from "./SkeletonRow";
import { EmptyState } from "./EmptyState";
import { CRUDListFooter } from "./CRUDListFooter";
import { MobileCard } from "./MobileCard";
import { toPersianNumber } from "@/lib/utils/persianNumbers";

function CRUDListInner<T extends { id: number }>({
  columns,
  data,
  total,
  page,
  limit,
  loading = false,
  selectedIds,
  onSelectedIdsChange,
  bulkActionNode,
  renderActions,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
  onPermanentDelete,
  onRestore,
  hiddenOnMobile = [],
}: CRUDListProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startRange = total === 0 ? 0 : (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, total);

  const isAllSelected = data.length > 0 && data.every((item) => selectedIds?.includes(item.id));
  
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectedIdsChange) return;
    if (checked) {
      const pageIds = data.map((item) => item.id);
      const uniqueIds = Array.from(new Set([...(selectedIds || []), ...pageIds]));
      onSelectedIdsChange(uniqueIds);
    } else {
      const pageIds = data.map((item) => item.id);
      onSelectedIdsChange((selectedIds || []).filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    if (!onSelectedIdsChange) return;
    if (checked) {
      onSelectedIdsChange([...(selectedIds || []), id]);
    } else {
      onSelectedIdsChange((selectedIds || []).filter((itemIds) => itemIds !== id));
    }
  };

  return (
    <div className="relative w-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <div className="relative rounded-[24px] p-[1.5px] bg-gray-200/30 dark:bg-gray-dark/50 transition-colors duration-300">
          
          <div
            className="absolute inset-0 pointer-events-none rounded-[inherit] border-[2px] border-transparent animate-border-beam z-0 motion-reduce:hidden"
            style={{
              background: "conic-gradient(from var(--border-angle), transparent 60%, var(--brand-300) 75%, var(--brand-500) 90%, var(--brand-300) 100%) border-box",
              WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              filter: "drop-shadow(0 0 10px var(--brand-500)) opacity(0.7)",
            }}
          />

          <div
            className="
              relative w-full rounded-[23px] z-10
              bg-white/95 dark:bg-gray-950/98 backdrop-blur-3xl
              shadow-[0_12px_45px_rgba(0,0,0,0.02)]
              dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]
              border border-gray-200/50 dark:border-gray-800/40
              overflow-hidden
              transition-all duration-300
            "
          >
            {/* نمای دسکتاپ */}
            <div className="hidden md:block overflow-x-auto">
              <div className="pt-3 px-4 pb-1 sm:pt-4 sm:px-5">
                <table className="w-full text-sm border-separate border-spacing-y-1">
                  <CRUDListHeader
                    columns={columns}
                    hiddenOnMobile={hiddenOnMobile}
                    showCheckbox={!!onSelectedIdsChange}
                    isAllSelected={isAllSelected}
                    onSelectAll={handleSelectAll}
                  />

                  <tbody>
                    {loading ? (
                      <SkeletonRow
                        columns={columns}
                        hiddenOnMobile={hiddenOnMobile}
                        showCheckbox={!!onSelectedIdsChange}
                      />
                    ) : data.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length + (onSelectedIdsChange ? 3 : 2)} className="p-0">
                          <EmptyState />
                        </td>
                      </tr>
                    ) : (
                      <AnimatePresence mode="popLayout" initial={false}>
                        {data.map((item, idx) => (
                          <CRUDListRow
                            key={item.id}
                            item={item}
                            idx={idx}
                            columns={columns}
                            page={page}
                            limit={limit}
                            hiddenOnMobile={hiddenOnMobile}
                            selected={!!selectedIds?.includes(item.id)}
                            onSelect={(checked) => handleSelectRow(item.id, checked)}
                            showCheckbox={!!onSelectedIdsChange}
                            renderActions={renderActions}
                            onEdit={onEdit}
                            onRestore={onRestore}
                            onDelete={onDelete}
                            onPermanentDelete={onPermanentDelete}
                          />
                        ))}
                      </AnimatePresence>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* نمای موبایل */}
            <div className="block md:hidden p-3">
              {loading ? (
                <div className="space-y-2.5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-50/20 dark:bg-gray-dark/5 animate-pulse rounded-xl border border-gray-200/50 dark:border-gray-800/40" />
                  ))}
                </div>
              ) : data.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {data.map((item, idx) => (
                      <MobileCard
                        key={item.id}
                        item={item}
                        idx={idx}
                        columns={columns}
                        selected={!!selectedIds?.includes(item.id)}
                        onSelect={(checked) => handleSelectRow(item.id, checked)}
                        showCheckbox={!!onSelectedIdsChange}
                        renderActions={renderActions}
                        onEdit={onEdit}
                        onRestore={onRestore}
                        onDelete={onDelete}
                        onPermanentDelete={onPermanentDelete}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {total > 0 && (
              <CRUDListFooter
                total={total}
                limit={limit}
                page={page}
                startRange={startRange}
                endRange={endRange}
                totalPages={totalPages}
                onLimitChange={onLimitChange}
                onPageChange={onPageChange}
              />
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedIds && selectedIds.length > 0 && bulkActionNode && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 30, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-1/2 z-50 flex items-center gap-4 bg-white/95 dark:bg-slate-950/98 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-2xl px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold"
          >
            <span className="text-slate-600 dark:text-slate-300">
              {toPersianNumber(selectedIds.length)} مورد انتخاب شده
            </span>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2">
              {bulkActionNode}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const CRUDList = React.memo(CRUDListInner) as <T extends { id: number }>(
  props: CRUDListProps<T>
) => React.JSX.Element;

export default CRUDList;