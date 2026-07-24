import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiMoreVertical, FiEdit3, FiRotateCcw, FiTrash2, FiTrash } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface RowActionsDropdownProps<T> {
  item: T;
  onEdit?: (item: T) => void;
  onRestore?: (item: T) => void;
  onDelete?: (item: T) => void;
  onPermanentDelete?: (item: T) => void;
}

export function RowActionsDropdownInner<T>({
  item,
  onEdit,
  onRestore,
  onDelete,
  onPermanentDelete,
}: RowActionsDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // بررسی وضعیت لود کامپوننت در سمت کلاینت (جلوگیری از خطای SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  // محاسبه پویای موقعیت دکمه سه‌نقطه برای تراز کردن دراپ‌دان
  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      
      setCoords({
        top: rect.bottom + window.scrollY + 6, // فاصله اندک ۶ پیکسلی از زیر دکمه
        left: rect.left + window.scrollX,      // تراز با لبه چپ دکمه (باعث باز شدن منو به سمت راست می‌شود)
      });
    }
  };

  // بروزرسانی مختصات هنگام اسکرول یا تغییر سایز صفحه زمانی که منو باز است
  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener("scroll", updateCoords, true);
      window.addEventListener("resize", updateCoords);
    }
    return () => {
      window.removeEventListener("scroll", updateCoords, true);
      window.removeEventListener("resize", updateCoords);
    };
  }, [isOpen]);

  // مدیریت بستن منو در صورت کلیک روی نقاط دیگر صفحه
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedInsideTrigger = triggerRef.current?.contains(target);
      const clickedInsideDropdown = dropdownRef.current?.contains(target);

      if (!clickedInsideTrigger && !clickedInsideDropdown) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const hasActions = onEdit || onRestore || onDelete || onPermanentDelete;
  if (!hasActions) return null;

  return (
    <div className="relative inline-block text-right" ref={triggerRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          h-8 w-8 p-0 rounded-xl transition-colors duration-200
          ${isOpen 
            ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200" 
            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60"
          }
        `}
      >
        <FiMoreVertical className="w-4 h-4" />
      </Button>

      {/* رندر منو در بدنه اصلی داکیومنت با استفاده از پورتال */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                top: coords.top,
                left: coords.left,
                zIndex: 9999, // تضمین قرارگیری روی تمامی بخش‌ها از جمله فوتر
              }}
              className="
                w-40 rounded-xl origin-top-left
                bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80
                shadow-xl shadow-slate-900/5 dark:shadow-black/40 p-1.5 space-y-1
              "
            >
              {onEdit && (
                <button
                  onClick={() => { onEdit(item); setIsOpen(false); }}
                  className="flex items-center gap-2 w-full text-right px-2.5 py-1.5 text-xs rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors"
                >
                  <FiEdit3 className="w-3.5 h-3.5" />
                  <span>ویرایش</span>
                </button>
              )}

              {onRestore && (
                <button
                  onClick={() => { onRestore(item); setIsOpen(false); }}
                  className="flex items-center gap-2 w-full text-right px-2.5 py-1.5 text-xs rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors"
                >
                  <FiRotateCcw className="w-3.5 h-3.5" />
                  <span>بازگردانی</span>
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => { onDelete(item); setIsOpen(false); }}
                  className="flex items-center gap-2 w-full text-right px-2.5 py-1.5 text-xs rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                  <span>حذف موقت</span>
                </button>
              )}

              {onPermanentDelete && (
                <button
                  onClick={() => { onPermanentDelete(item); setIsOpen(false); }}
                  className="flex items-center gap-2 w-full text-right px-2.5 py-1.5 text-xs rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <FiTrash className="w-3.5 h-3.5" />
                  <span>حذف دائمی</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

export const RowActionsDropdown = React.memo(RowActionsDropdownInner) as <T>(
  props: RowActionsDropdownProps<T>
) => React.JSX.Element;