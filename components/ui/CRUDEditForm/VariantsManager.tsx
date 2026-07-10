// مدیریت تنوع‌ها (رنگ، قیمت، موجودی) و گارانتی‌ها

import React, { useCallback } from "react";
import { useFormikContext } from "formik";
import { FiLayers, FiTrash2, FiEdit3, FiTag, FiBox, FiShield, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toPersianNumber } from "@/lib/utils/persianNumbers";
import { SectionPanel } from "./SectionPanel";
import { EmptyState } from "./EmptyState";
import { INPUT_IDLE } from "./constants";
import { formatNumericInput } from "./utils";

const EMPTY_VARIANT = { color: "", price: "", stock: "", warranty: { title: "", periodMonths: 12, description: "" } };

interface VariantsManagerProps {
  name: string;
}

export const VariantsManager = React.memo(function VariantsManager({ name }: VariantsManagerProps) {
  const { values, setFieldValue } = useFormikContext<any>();
  const list: any[] = values[name] || [];

  const handleAdd = useCallback(() => setFieldValue(name, [...list, { ...EMPTY_VARIANT, warranty: { ...EMPTY_VARIANT.warranty } }]), [list, name, setFieldValue]);
  const handleRemove = useCallback((idx: number) => setFieldValue(name, list.filter((_, i) => i !== idx)), [list, name, setFieldValue]);

  const handleChange = useCallback(
    (idx: number, field: string, value: any) => {
      const updated = [...list];
      if (field.startsWith("warranty.")) {
        const subField = field.split(".")[1];
        updated[idx] = { ...updated[idx], warranty: { ...(updated[idx].warranty || {}), [subField]: value } };
      } else {
        updated[idx] = { ...updated[idx], [field]: value };
      }
      setFieldValue(name, updated);
    },
    [list, name, setFieldValue]
  );

  return (
    <SectionPanel icon={<FiLayers className="w-4 h-4" />} title="لیست تنوع‌ها و گارانتی‌های محصول" accent="violet">
      {list.length === 0 && <EmptyState label="هنوز تنوعی تعریف نشده است" />}

      <AnimatePresence initial={false}>
        {list.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="rounded-2xl border border-slate-200/60 dark:border-[#1f2235]/50 bg-white/50 dark:bg-[#121420]/30 overflow-hidden"
          >
            <div className="flex justify-between items-center px-4 py-3 bg-slate-50/60 dark:bg-[#0c0d14]/40 border-b border-slate-100 dark:border-[#1f2235]/40">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-500 flex items-center justify-center text-[10px] font-extrabold">
                  {toPersianNumber(idx + 1)}
                </span>
                واریانت
              </span>
              {list.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold"
                >
                  <FiTrash2 className="w-3.5 h-3.5" /> حذف تنوع
                </button>
              )}
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-bold">رنگ / ویژگی</label>
                  <div className="relative flex items-center">
                    <FiEdit3 className="absolute right-3 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      placeholder="مثال: نقره‌ای"
                      value={item.color || ""}
                      onChange={(e) => handleChange(idx, "color", e.target.value)}
                      className={`w-full p-2.5 pr-9 text-xs font-semibold border rounded-lg ${INPUT_IDLE}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-bold">قیمت (تومان)</label>
                  <div className="relative flex items-center">
                    <FiTag className="absolute right-3 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="قیمت..."
                      value={item.price}
                      onChange={(e) => handleChange(idx, "price", formatNumericInput(e.target.value))}
                      className={`w-full p-2.5 pr-9 text-xs font-bold border rounded-lg ${INPUT_IDLE}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-bold">موجودی انبار</label>
                  <div className="relative flex items-center">
                    <FiBox className="absolute right-3 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="تعداد..."
                      value={item.stock}
                      onChange={(e) => handleChange(idx, "stock", formatNumericInput(e.target.value))}
                      className={`w-full p-2.5 pr-9 text-xs font-bold border rounded-lg ${INPUT_IDLE}`}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-slate-100 dark:border-[#1f2235]/50 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <FiShield className="w-3.5 h-3.5" /> گارانتی این تنوع
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-1">عنوان گارانتی</label>
                    <input
                      type="text"
                      placeholder="مثال: گارانتی مایکروتل"
                      value={item.warranty?.title || ""}
                      onChange={(e) => handleChange(idx, "warranty.title", e.target.value)}
                      className={`w-full p-2.5 text-xs font-semibold border rounded-lg ${INPUT_IDLE}`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">مدت زمان (ماه)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="۱۲"
                      value={item.warranty?.periodMonths ?? 12}
                      onChange={(e) => handleChange(idx, "warranty.periodMonths", parseInt(e.target.value, 10) || 0)}
                      className={`w-full p-2.5 text-xs font-semibold border rounded-lg ${INPUT_IDLE}`}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">توضیحات و شرایط گارانتی</label>
                    <textarea
                      rows={2}
                      placeholder="مواردی نظیر قطعات تحت پوشش، شرایط ابطال گارانتی و شرایط تعویض دستگاه را در این کادر توضیح دهید..."
                      value={item.warranty?.description || ""}
                      onChange={(e) => handleChange(idx, "warranty.description", e.target.value)}
                      className={`w-full p-2.5 text-xs font-semibold border rounded-lg resize-none ${INPUT_IDLE}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-[#1f2235]/50 hover:border-violet-500 dark:hover:border-violet-500/50 rounded-2xl bg-slate-50/30 hover:bg-violet-500/5 dark:bg-[#121420]/10 dark:hover:bg-violet-500/10 text-slate-400 hover:text-violet-600 dark:text-slate-500 dark:hover:text-violet-400 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold"
      >
        <FiPlus className="w-5 h-5" /> افزودن تنوع و گارانتی جدید
      </button>
    </SectionPanel>
  );
});