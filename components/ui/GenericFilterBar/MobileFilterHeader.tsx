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
      className="flex items-center justify-between p-3 md:hidden cursor-pointer hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors duration-150 rounded-t-xl"
    >
      <div className="flex items-center gap-2">
        <FiFilter className="text-slate-500 dark:text-slate-400 text-xs" />
        <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">فیلترها</span>
      </div>
      <motion.div
        animate={{ rotate: showFilters ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <FiChevronDown className="text-slate-500 dark:text-slate-400 text-xs" />
      </motion.div>
    </div>
  );
});