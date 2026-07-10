// نمایش مسیر فعال در شاخه دسته‌بندی

import React from "react";
import { motion } from "framer-motion";

interface ActivePathTrailProps {
  path: string[];
}

export const ActivePathTrail = React.memo(function ActivePathTrail({
  path,
}: ActivePathTrailProps) {
  if (path.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="flex flex-wrap items-center gap-1 p-2 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 rounded-xl text-[11px] font-bold text-indigo-600 dark:text-indigo-400"
    >
      <span>مسیر فعال:</span>
      {path.map((name, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-slate-300 dark:text-[#1f2235]">➔</span>}
          <span className="bg-white/60 dark:bg-[#121420]/40 px-1.5 py-0.5 rounded border border-slate-100 dark:border-[#1f2235]">
            {name}
          </span>
        </span>
      ))}
    </motion.div>
  );
});