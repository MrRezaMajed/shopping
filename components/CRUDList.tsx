"use client";

import React from "react";
import { FiEdit, FiTrash2, FiInbox, FiRotateCcw, FiTrash } from "react-icons/fi";
import Pagination from "@/components/ui/DataTable/Pagination";
import { motion, AnimatePresence } from "framer-motion";
import { toPersianNumber } from "@/lib/utils/persianNumbers";
import { Button } from "./ui/Button";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface CRUDListProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;
  page: number;
  limit: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onPermanentDelete?: (item: T) => void;
  onRestore?: (item: T) => void;
  hiddenOnMobile?: string[];
}

const LIMIT_OPTIONS = [5, 10, 15, 20, 50];

// پیکربندی ظاهری هر نوع دکمه عملیات، یک‌بار در سطح ماژول تعریف شده
// تا در هر رندر ردیف از نو ساخته نشود و چهار بلوک تکراری Button جمع شود.
const ACTION_STYLES = {
  edit: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/20 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 hover:border-indigo-500 dark:hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20",
  restore: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/20 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 hover:border-emerald-500 dark:hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20",
  delete: "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/20 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 hover:border-rose-500 dark:hover:border-rose-600 hover:shadow-lg hover:shadow-rose-500/20",
  permanent: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100/50 dark:border-red-900/20 hover:bg-red-600 hover:text-white dark:hover:bg-red-700 hover:border-red-600 dark:hover:border-red-700 hover:shadow-lg hover:shadow-red-500/20",
} as const;

type ActionKind = keyof typeof ACTION_STYLES;

interface RowActionButtonProps {
  kind: ActionKind;
  title: string;
  onClick: () => void;
  icon: React.ReactNode;
}

const RowActionButton = React.memo(function RowActionButton({ kind, title, onClick, icon }: RowActionButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      title={title}
      aria-label={title}
      withRipple
      className={`h-9 w-9 p-0 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-[#121420] ${ACTION_STYLES[kind]}`}
    >
      {icon}
    </Button>
  );
});

const SkeletonRow = React.memo(function SkeletonRow<T>({
  columns,
  hiddenOnMobile = [],
}: {
  columns: Column<T>[];
  hiddenOnMobile?: string[];
}) {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="p-4 rounded-r-2xl bg-white dark:bg-[#121420]/50 border-y border-r border-slate-100 dark:border-[#1f2235]/50">
            <div className="h-4 w-6 bg-slate-200 dark:bg-[#1b1e30] rounded-md mx-auto" />
          </td>
          {columns.map((c) => (
            <td
              key={String(c.key)}
              className={`p-4 bg-white dark:bg-[#121420]/50 border-y border-slate-100 dark:border-[#1f2235]/50 ${
                hiddenOnMobile.includes(String(c.key)) ? "hidden lg:table-cell" : ""
              }`}
            >
              <div className="h-4 bg-slate-200 dark:bg-[#1b1e30] rounded-md w-3/4" />
            </td>
          ))}
          <td className="p-4 rounded-l-2xl bg-white dark:bg-[#121420]/50 border-y border-l border-slate-100 dark:border-[#1f2235]/50">
            <div className="h-4 w-24 bg-slate-200 dark:bg-[#1b1e30] rounded-md mx-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}) as <T>(props: { columns: Column<T>[]; hiddenOnMobile?: string[] }) => React.ReactElement;

const EmptyState = React.memo(function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 sm:py-32 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl rounded-full" />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative p-6 rounded-full bg-white dark:bg-[#121420] border border-slate-100 dark:border-[#1f2235]/80"
        >
          <FiInbox className="text-5xl sm:text-6xl text-slate-400 dark:text-slate-500" />
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-350">هیچ داده‌ای یافت نشد</h3>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
          لیست در حال حاضر خالی است. برای نمایش اطلاعات، فیلدهای جدید اضافه کنید.
        </p>
      </motion.div>
    </div>
  );
});

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
  const isHidden = (key: string) => hiddenOnMobile.includes(key);

  const startRange = total === 0 ? 0 : (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, total);

  return (
    <div className="relative w-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        {/* کانتینر با کنترل‌کننده افکت نور شتاب‌دهنده نئونی */}
        <div className="relative rounded-[24px] p-[2px] overflow-hidden bg-slate-200/30 dark:bg-[#1a1c29]/50">
          {/* افکت چرخش لبه با نور نرم بنفش-نیلی دیجیتال (فقط وقتی داده در حال بارگذاری یا موجود است روشن می‌شود) */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square animate-[spin_6s_linear_infinite] pointer-events-none opacity-80 dark:opacity-60 z-0 motion-reduce:animate-none"
            style={{
              background:
                "conic-gradient(from 90deg at 50% 50%, #6366f1 0%, #a855f7 25%, transparent 50%, transparent 100%)",
            }}
          />

          {/* محفظه اصلی جدول با پس‌زمینه پایدار شیشه‌ای ابریشمی */}
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
                  <thead>
                    <tr className="text-slate-400 dark:text-slate-400 text-xs font-semibold tracking-wider">
                      <th className="pb-4 px-4 text-center w-14">#</th>
                      {columns.map((c) => (
                        <th
                          key={String(c.key)}
                          className={`pb-4 px-4 text-right whitespace-nowrap ${
                            isHidden(String(c.key)) ? "hidden lg:table-cell" : ""
                          }`}
                        >
                          {c.label}
                        </th>
                      ))}
                      <th className="pb-4 px-4 text-center w-36">عملیات</th>
                    </tr>
                  </thead>

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
                            {/* شناسه اندیس با نوار نشانگر در سمت راست */}
                            <td className="p-4 text-center text-slate-500 dark:text-slate-400 font-semibold rounded-r-2xl border-y border-r border-slate-100 dark:border-[#1f2235]/50 group-hover:border-indigo-100 dark:group-hover:border-indigo-900/30 relative overflow-hidden transition-all duration-200">
                              <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center" />
                              <span className="relative z-10">{toPersianNumber((page - 1) * limit + idx + 1)}</span>
                            </td>

                            {/* سلول‌های محتوا */}
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

                            {/* بخش دکمه‌های عملیات شیک و شیشه‌ای */}
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
                        ))}
                      </AnimatePresence>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* بخش فوتر کنترل صفحه */}
            {total > 0 && (
              <div
                className="
                grid grid-cols-1 md:grid-cols-3 items-center gap-4 p-5 sm:p-6
                bg-slate-100/30 dark:bg-[#121420]/30
                border-t border-slate-150 dark:border-[#1f2235]/40
                text-xs sm:text-sm text-slate-500 dark:text-slate-400
              "
              >
                <div className="justify-self-center md:justify-self-start">
                  {onLimitChange && (
                    <div className="flex items-center gap-2.5 whitespace-nowrap flex-wrap justify-center md:justify-start">
                      <label htmlFor="crud-list-limit" className="shrink-0">
                        نمایش
                      </label>
                      <select
                        id="crud-list-limit"
                        value={limit}
                        onChange={(e) => onLimitChange(Number(e.target.value))}
                        className="
                          rounded-xl
                          border border-slate-200 dark:border-[#1f2235]
                          bg-white dark:bg-[#121420]
                          text-slate-700 dark:text-slate-200
                          px-3 py-1.5 text-xs font-semibold
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40
                          transition-all duration-200
                          hover:border-indigo-500/40
                          cursor-pointer
                        "
                      >
                        {LIMIT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {toPersianNumber(opt)}
                          </option>
                        ))}
                      </select>
                      <span>
                        مورد (نمایش {toPersianNumber(startRange)} تا {toPersianNumber(endRange)} از{" "}
                        {toPersianNumber(total)})
                      </span>
                    </div>
                  )}
                </div>

                <div className="justify-self-center flex justify-center">
                  {totalPages > 1 && (
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
                  )}
                </div>

                <div className="hidden md:block justify-self-end text-xs font-semibold text-slate-400 dark:text-slate-500">
                  مجموع کل: {toPersianNumber(total)} مورد
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default React.memo(CRUDList) as typeof CRUDList;
