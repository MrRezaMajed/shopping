import React from "react";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

interface FilterSelectInputProps {
  fieldKey: string;
  placeholder?: string;
  options: { label: string; value: string | number }[];
  value: string | number;
  onChange: (value: string) => void;
  idx: number;
}

export const FilterSelectInput = React.memo(function FilterSelectInput({
  fieldKey,
  placeholder,
  options,
  value,
  onChange,
  idx,
}: FilterSelectInputProps) {
  return (
    <motion.div
      key={fieldKey}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15, delay: idx * 0.03 }}
      className="relative w-full md:w-44 group"
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          appearance-none w-full h-9 pl-9 pr-4 py-1 rounded-lg text-xs font-semibold
          border border-slate-200 dark:border-zinc-800/80
          bg-white/50 dark:bg-zinc-950/30 backdrop-blur-sm
          text-slate-700 dark:text-slate-300 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500/40
          hover:border-slate-300 dark:hover:border-zinc-700/80
          transition-all duration-200
        "
      >
        <option value="" className="bg-white dark:bg-zinc-950 text-slate-500">{placeholder || "انتخاب کنید"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-zinc-950 text-slate-700 dark:text-slate-300">
            {opt.label}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none text-xs transition-all duration-200 group-focus-within:rotate-180 group-focus-within:text-brand-500" />
    </motion.div>
  );
});