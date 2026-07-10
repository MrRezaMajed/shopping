// بخش هدر فیلتر در موبایل (کلاپس یا بازشو)


import React from "react";
import { motion } from "framer-motion";
import { FiFilter, FiChevronDown } from "react-icons/fi";

interface MobileFilterHeaderProps {
  showFilters: boolean;
  onClick: () => void;
}

export const MobileFilterHeader = React.memo(function MobileFilterHeader({
  showFilters,
  onClick,
}: MobileFilterHeaderProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 md:hidden cursor-pointer hover:bg-white/30 dark:hover:bg-[#121420]/30 transition rounded-t-3xl"
    >
      <div className="flex items-center gap-2">
        <FiFilter className="text-slate-500 dark:text-slate-400" />
        <span className="font-medium text-slate-700 dark:text-slate-200">فیلترها</span>
      </div>
      <motion.div
        animate={{ rotate: showFilters ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <FiChevronDown className="text-slate-500 dark:text-slate-400" />
      </motion.div>
    </div>
  );
});