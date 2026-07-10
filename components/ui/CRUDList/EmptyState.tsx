// حالت خالی بودن لیست

import React from "react";
import { FiInbox } from "react-icons/fi";
import { motion } from "framer-motion";

export const EmptyState = React.memo(function EmptyState() {
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