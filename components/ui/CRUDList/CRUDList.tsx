// کامپوننت والد و اصلی CRUDList

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CRUDListProps } from "./types";
import { CRUDListHeader } from "./CRUDListHeader";
import { CRUDListRow } from "./CRUDListRow";
import { SkeletonRow } from "./SkeletonRow";
import { EmptyState } from "./EmptyState";
import { CRUDListFooter } from "./CRUDListFooter";

function CRUDList<T extends { id: number }>({
  columns,
  data,
  total,
  page,
  limit,
  loading = false,
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

  return (
    <div className="relative w-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        {/* کانتینر با افکت چرخش نئونی حاشیه‌ها */}
        <div className="relative rounded-[24px] p-[2px] overflow-hidden bg-slate-200/30 dark:bg-[#1a1c29]/50">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square animate-[spin_6s_linear_infinite] pointer-events-none opacity-80 dark:opacity-60 z-0 motion-reduce:animate-none"
            style={{
              background:
                "conic-gradient(from 90deg at 50% 50%, #6366f1 0%, #a855f7 25%, transparent 50%, transparent 100%)",
            }}
          />

          {/* محفظه اصلی جدول شیشه‌ای دکوراتیو */}
          <div
            className="
              relative w-full rounded-[22px] z-10
              bg-white/95 dark:bg-[#0c0d14]/98 backdrop-blur-3xl
              shadow-[0_12px_45px_rgba(0,0,0,0.02)]
              dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]
              border border-slate-200/50 dark:border-[#1f2235]/40
              overflow-hidden
              transition-all duration-300
            "
          >
            <div className="overflow-x-auto">
              <div className="min-w-[640px] md:min-w-0 p-5 sm:p-6 pb-2">
                <table className="w-full text-sm border-separate border-spacing-y-3">
                  <CRUDListHeader columns={columns} hiddenOnMobile={hiddenOnMobile} />

                  <tbody>
                    {loading ? (
                      <SkeletonRow columns={columns} hiddenOnMobile={hiddenOnMobile} />
                    ) : data.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length + 2} className="p-0">
                          <EmptyState />
                        </td>
                      </tr>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {data.map((item, idx) => (
                          <CRUDListRow
                            key={item.id}
                            item={item}
                            idx={idx}
                            columns={columns}
                            page={page}
                            limit={limit}
                            hiddenOnMobile={hiddenOnMobile}
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

            {/* کنترل‌های پجینیشن و آمار انتهایی */}
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
    </div>
  );
}

export default React.memo(CRUDList) as typeof CRUDList;