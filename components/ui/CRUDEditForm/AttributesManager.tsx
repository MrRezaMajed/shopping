// مدیریت مشخصات و ویژگی‌های فنی محصول

import React, { useCallback } from "react";
import { useFormikContext } from "formik";
import { FiCpu, FiTrash2, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { SectionPanel } from "./SectionPanel";
import { EmptyState } from "./EmptyState";
import { INPUT_IDLE } from "./constants";

interface AttributesManagerProps {
  name: string;
}

export const AttributesManager = React.memo(function AttributesManager({ name }: AttributesManagerProps) {
  const { values, setFieldValue } = useFormikContext<any>();
  const list: any[] = values[name] || [];

  const handleAdd = useCallback(() => setFieldValue(name, [...list, { key: "", value: "" }]), [list, name, setFieldValue]);
  const handleRemove = useCallback((idx: number) => setFieldValue(name, list.filter((_, i) => i !== idx)), [list, name, setFieldValue]);
  const handleChange = useCallback(
    (idx: number, key: string, val: string) => {
      const updated = [...list];
      updated[idx] = { ...updated[idx], [key]: val };
      setFieldValue(name, updated);
    },
    [list, name, setFieldValue]
  );

  return (
    <SectionPanel icon={<FiCpu className="w-4 h-4" />} title="ویژگی‌های فنی محصول" accent="indigo">
      {list.length === 0 && <EmptyState label="هنوز ویژگی‌ای ثبت نشده است" />}

      <AnimatePresence initial={false}>
        {list.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="flex gap-3 items-center"
          >
            <input
              type="text"
              placeholder="نام ویژگی (مثال: ظرفیت باتری)"
              value={item.key}
              onChange={(e) => handleChange(idx, "key", e.target.value)}
              className={`flex-1 p-3 text-xs sm:text-sm font-semibold border rounded-xl ${INPUT_IDLE}`}
            />
            <input
              type="text"
              placeholder="مقدار ویژگی (مثال: 5000 میلی‌آمپر)"
              value={item.value}
              onChange={(e) => handleChange(idx, "value", e.target.value)}
              className={`flex-1 p-3 text-xs sm:text-sm font-semibold border rounded-xl ${INPUT_IDLE}`}
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              aria-label="حذف ویژگی"
              className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full py-3.5 border-2 border-dashed border-slate-200 dark:border-[#1f2235]/50 hover:border-indigo-500 dark:hover:border-indigo-500/50 rounded-xl bg-slate-50/30 hover:bg-indigo-500/5 dark:bg-[#121420]/10 dark:hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold"
      >
        <FiPlus className="w-4.5 h-4.5" /> افزودن ویژگی فنی جدید
      </button>
    </SectionPanel>
  );
});