"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom"; // <--- رندر پورتال در ریشه سند (Body) جهت حفظ یکپارچگی ابعاد ردیف‌ها
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiX, FiEdit } from "react-icons/fi";
import { toPersianNumber, toEnglishNumber, formatPersianNumber } from "@/lib/utils/persianNumbers";
import { quickUpdateVariantPrices } from "@/app/actions/crud/write";

interface Variant {
  id: number;
  color?: string | null;
  price: number;
  stock: number;
}

interface ProductPriceCellProps {
  productId: number;
  minPrice: number;
  maxPrice: number;
  variants: Variant[];
  onRefresh: () => void; // برای رفرش خودکار جدول پس از ثبت موفق
}

export const ProductPriceCell = React.memo(function ProductPriceCell({
  productId,
  minPrice,
  maxPrice,
  variants = [],
  onRefresh,
}: ProductPriceCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localPrices, setLocalPrices] = useState<Record<number, string>>({});
  const [mounted, setMounted] = useState(false); // <--- برای جلوگیری از تداخل Hydration در Next.js

  const triggerRef = useRef<HTMLDivElement>(null); // رفرنس المان فعال‌کننده جهت محاسبه مختصات شناور
  const popoverRef = useRef<HTMLDivElement>(null); // رفرنس خود پاپ‌اور در پورتال

  // ذخیره مختصات فلوتینگ پورتال روی صفحه اسکرول
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const hasMultipleVariants = variants.length > 1;
  const singleVariantId = variants[0]?.id;

  // اطمینان از سوار شدن کامل کامپوننت روی مرورگر قبل از فعال کردن پورتال
  useEffect(() => {
    setMounted(true);
  }, []);

  // محاسبه موقعیت دقیق پاپ‌اور متناسب با جهت راست‌به‌چپ (RTL) پروژه
  useEffect(() => {
    if (isEditing && hasMultipleVariants && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popoverWidth = 260; // عرض پاپ‌اور چندتنوعی
      
      // محاسبه لبه سمت راست دکمه نسبت به صفحه برای همتراز کردن لبه راست پاپ‌اور با دکمه
      const rightEdge = rect.right + window.scrollX;
      const calculatedLeft = rightEdge - popoverWidth;

      setCoords({
        top: rect.bottom + window.scrollY + 8, // قرارگیری با فاصله ۸ پیکسلی زیر سلول
        left: calculatedLeft,
      });
    }
  }, [isEditing, hasMultipleVariants]);

  // لود قیمت‌های فعلی هنگام باز شدن پاپ‌اور
  useEffect(() => {
    if (isEditing) {
      const initialPrices: Record<number, string> = {};
      variants.forEach((v) => {
        initialPrices[v.id] = formatPersianNumber(String(v.price));
      });
      setLocalPrices(initialPrices);
    }
  }, [isEditing, variants]);

  // بستن حالت ویرایش در صورت کلیک روی محیط خارج از کامپوننت و پورتال
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
      }
    }
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  const handleInputChange = (variantId: number, rawValue: string) => {
    const englishDigits = toEnglishNumber(rawValue).replace(/[^0-9]/g, "");
    setLocalPrices((prev) => ({
      ...prev,
      [variantId]: formatPersianNumber(englishDigits),
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updates = Object.entries(localPrices).map(([id, formattedPrice]) => ({
        id: Number(id),
        price: Number(toEnglishNumber(formattedPrice).replace(/[^0-9]/g, "")) || 0,
      }));

      const res = await quickUpdateVariantPrices(productId, updates);
      if (res.success) {
        setIsEditing(false);
        onRefresh(); // بروزرسانی زنده اطلاعات جدول در کل صفحه
      } else {
        alert("خطا در بروزرسانی قیمت‌ها: " + res.error);
      }
    } catch (e: any) {
      alert("خطا رخ داد: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (minPrice === 0) {
    return <span className="text-slate-400 dark:text-zinc-650">فاقد قیمت</span>;
  }

  // سناریو اول: محصول تک قیمتی (تک تنوع) -> ویرایش کاملاً مستقیم و درون‌خطی در همان لحظه در خود سلول
  if (!hasMultipleVariants) {
    if (isEditing) {
      return (
        <div ref={triggerRef} className="flex items-center justify-end gap-1 w-full max-w-[150px] mr-auto">
          <input
            type="text"
            disabled={loading}
            autoFocus
            value={localPrices[singleVariantId] || ""}
            onChange={(e) => handleInputChange(singleVariantId, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setIsEditing(false);
            }}
            className="
              w-24 p-1.5 text-xs font-bold text-center text-slate-800 dark:text-slate-200 border rounded-lg
              border-emerald-500 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20
              disabled:opacity-50
            "
          />
          {loading ? (
            <span className="text-[10px] text-slate-400">...</span>
          ) : (
            <button 
              type="button" 
              onClick={handleSave} 
              className="p-1 text-emerald-600 hover:text-emerald-700 transition"
              title="ذخیره"
            >
              <FiCheck className="w-4 h-4" />
            </button>
          )}
        </div>
      );
    }

    return (
      <div 
        ref={triggerRef}
        onClick={() => !loading && setIsEditing(true)}
        className="group/price inline-flex items-center gap-1.5 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-zinc-800/40 px-2 py-1.5 rounded-xl transition duration-200"
        title="کلیک برای ویرایش سریع قیمت"
      >
        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
          {toPersianNumber(minPrice.toLocaleString("en-US"))}
        </span>
        <FiEdit className="opacity-0 group-hover/price:opacity-100 text-slate-400 dark:text-zinc-500 w-3.5 h-3.5 transition-all" />
      </div>
    );
  }

  // سناریو دوم: محصول چند قیمتی -> نمایش بازه قیمتی با کلیک و باز شدن پاپ‌اور از طریق پورتال در body
  return (
    <div className="inline-block text-right">
      {/* دکمه بازکننده پاپ‌اور */}
      <div 
        ref={triggerRef}
        onClick={() => !loading && setIsEditing(true)}
        className="group/price flex items-center gap-1.5 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-zinc-800/40 px-2 py-1.5 rounded-xl transition duration-200"
        title="ویرایش سریع قیمت تنوع‌ها"
      >
        <span className="font-extrabold text-xs inline-flex items-center gap-1" dir="ltr">
          <span className="text-emerald-600 dark:text-emerald-400">
            {toPersianNumber(minPrice.toLocaleString("en-US"))}
          </span>
          <span className="text-slate-400 dark:text-zinc-600 font-medium">-</span>
          <span className="text-rose-600 dark:text-rose-400">
            {toPersianNumber(maxPrice.toLocaleString("en-US"))}
          </span>
        </span>
        <FiEdit className="opacity-0 group-hover/price:opacity-100 text-slate-400 dark:text-zinc-500 w-3.5 h-3.5 transition-all" />
      </div>

      {/* پورتال برای رندر ایمن بدون تغییر در ابعاد سطرها */}
      {mounted && createPortal(
        <AnimatePresence>
          {isEditing && (
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              style={{ 
                position: "absolute",
                top: coords.top, 
                left: coords.left,
                width: "260px",
                zIndex: 99999, // تضمین قرارگیری پاپ‌اور روی بقیه لایه‌ها
              }}
              className="
                p-4 rounded-2xl
                bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl
                border border-slate-200 dark:border-slate-800/60
                shadow-[0_15px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.6)]
                space-y-3 text-right
              "
            >
              <h4 className="text-[11px] font-extrabold text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-slate-800/50 pb-2">
                بروزرسانی قیمت تنوع‌ها
              </h4>

              <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                {variants.map((v) => (
                  <div key={v.id} className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">
                      تنوع: <span className="text-indigo-500">{v.color || "پیش‌فرض"}</span>
                    </span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        disabled={loading}
                        value={localPrices[v.id] || ""}
                        onChange={(e) => handleInputChange(v.id, e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSave()}
                        className="
                          w-full p-2 text-xs font-bold text-slate-800 dark:text-slate-200 border rounded-xl text-left pl-14
                          border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50
                          focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                          disabled:opacity-50
                        "
                        placeholder="قیمت..."
                      />
                      <span className="absolute left-2.5 text-[9px] font-bold text-slate-400 dark:text-zinc-500 select-none">تومان</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSave}
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-extrabold flex items-center justify-center gap-1 transition"
                >
                  {loading ? "..." : <><FiCheck /> ثبت سریع</>}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsEditing(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 text-xs transition"
                  title="انصراف"
                >
                  <FiX />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body // رندر مستقیم درون تگ body با حفظ افکت انیمیشن
      )}
    </div>
  );
});