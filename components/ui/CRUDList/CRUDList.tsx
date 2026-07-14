"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CRUDListProps } from "./types";
import { CRUDListHeader } from "./CRUDListHeader";
import { CRUDListRow } from "./CRUDListRow";
import { SkeletonRow } from "./SkeletonRow";
import { EmptyState } from "./EmptyState";
import { CRUDListFooter } from "./CRUDListFooter";

function CRUDListInner<T extends { id: number }>({
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
        
        {/* کانتینر بیرونی - حذف overflow-hidden برای اجازه به انتشار ملایم نور نئونی به بیرون از جدول */}
        <div className="relative rounded-[24px] p-[1.5px] bg-gray-200/30 dark:bg-gray-dark/50 transition-colors duration-300">
          
          {/* پرتو لیزری چرخان (Border Beam) دور کل جدول متصل به Accent Color فعال سیستم */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[inherit] border-[2px] border-transparent animate-border-beam z-0 motion-reduce:hidden"
            style={{
              /* ایجاد شیب رنگی متغیر بر اساس رنگ تم فعال کاربر */
              background: "conic-gradient(from var(--border-angle), transparent 60%, var(--brand-300) 75%, var(--brand-500) 90%, var(--brand-300) 100%) border-box",
              
              /* ماسک کردن داخل جدول به روش مدرن برای نمایش نور فقط روی خط بوردر خارجی */
              WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              
              /* تابش هاله ملایم نئونی متناسب با رنگ تم فعال کاربر */
              filter: "drop-shadow(0 0 10px var(--brand-500)) opacity(0.7)",
            }}
          />

          {/* محفظه اصلی جدول شیشه‌ای دکوراتیو */}
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

export const CRUDList = React.memo(CRUDListInner) as <T extends { id: number }>(
  props: CRUDListProps<T>
) => React.JSX.Element;

export default CRUDList;