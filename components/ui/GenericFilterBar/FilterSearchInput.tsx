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
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15, delay: idx * 0.03 }}
      className="relative flex-1 w-full group"
    >
      <FiSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-brand-500 transition-colors duration-200 text-xs" />
      <input
        type="text"
        placeholder={placeholder || "جستجو..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full h-9 pr-10 pl-4 py-1 rounded-lg text-xs font-medium
          border border-slate-200 dark:border-zinc-800/80
          bg-white/50 dark:bg-zinc-950/30 backdrop-blur-sm 
          text-slate-700 dark:text-slate-300
          placeholder:text-slate-400 dark:placeholder:text-zinc-600
          focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500/40
          hover:border-slate-300 dark:hover:border-zinc-700/80
          transition-all duration-200
        "
      />
    </motion.div>
  );
});