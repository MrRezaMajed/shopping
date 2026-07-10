// سلول فیلتر از نوع کادر جستجو (Search Input)


import React from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

interface FilterSearchInputProps {
  fieldKey: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  idx: number;
}

export const FilterSearchInput = React.memo(function FilterSearchInput({
  fieldKey,
  placeholder,
  value,
  onChange,
  idx,
}: FilterSearchInputProps) {
  return (
    <motion.div
      key={fieldKey}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="relative flex-1 w-full group"
    >
      <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 transition-colors duration-300" />
      <input
        type="text"
        placeholder={placeholder || "جستجو..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pr-11 pl-4 py-3 rounded-2xl border border-slate-200 dark:border-[#1f2235] bg-white/70 dark:bg-[#121420]/70 backdrop-blur-md text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 hover:bg-white/80 dark:hover:bg-[#1b1e30] hover:border-cyan-400/70 dark:hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/20 transition-all duration-300 shadow-sm"
      />
    </motion.div>
  );
});