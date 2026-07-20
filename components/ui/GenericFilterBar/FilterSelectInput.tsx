// سلول فیلتر از نوع منوی آبشاری (Select Dropdown)
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
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="relative w-full md:w-auto group"
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full pl-10 pr-5 py-3 rounded-2xl border border-slate-200 dark:border-[#1f2235] bg-white/70 dark:bg-[#121420]/70 backdrop-blur-md text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 hover:bg-white/80 dark:hover:bg-[#1b1e30] hover:border-indigo-400/70 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 transition-all duration-300 shadow-sm cursor-pointer"
      >
        <option value="" className="bg-white dark:bg-[#121420]">{placeholder || "انتخاب کنید"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#121420]">
            {opt.label}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none transition-all duration-300 group-focus-within:rotate-180 group-focus-within:text-indigo-500" />
    </motion.div>
  );
});