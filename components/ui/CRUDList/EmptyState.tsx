import React from "react";
import { motion } from "framer-motion";
import { FaInbox } from "react-icons/fa";

export const EmptyState = React.memo(function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-18 text-center">
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/2 blur-2xl rounded-full" />
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850"
        >
          <FaInbox className="text-4xl sm:text-5xl text-slate-300 dark:text-slate-600 stroke-[1.5]" />
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
        <h3 className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300">هیچ داده‌ای یافت نشد</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
          لیست در حال حاضر خالی است. برای نمایش اطلاعات، فیلدهای جدید اضافه کنید.
        </p>
      </motion.div>
    </div>
  );
});