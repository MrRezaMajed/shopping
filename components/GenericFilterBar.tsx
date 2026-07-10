"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX, FiFilter, FiChevronDown } from "react-icons/fi";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Button } from "./ui/Button";

export type FilterField =
  | { type: "search"; key: string; placeholder?: string }
  | {
      type: "select";
      key: string;
      placeholder?: string;
      options: { label: string; value: string | number }[];
    };

interface GenericFilterBarProps<T extends Record<string, any>> {
  fields: FilterField[];
  filters: T;
  onChange: (filters: T) => void;
  className?: string;
}

export default function GenericFilterBar<T extends Record<string, any>>({
  fields,
  filters,
  onChange,
  className = "",
}: GenericFilterBarProps<T>) {
  const [localFilters, setLocalFilters] = useState(filters);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [showFilters, setShowFilters] = useState(true);
  const debounceTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const debouncedOnChange = useCallback((newFilters: T) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onChange(newFilters);
    }, 300);
  }, [onChange]);

  useEffect(() => {
    debouncedOnChange(localFilters);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [localFilters, debouncedOnChange]);

  const handleChange = useCallback((key: string, value: unknown) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value === "" || value === undefined ? undefined : value,
    }));
  }, []);

  const handleReset = useCallback(() => {
    const cleared = Object.fromEntries(fields.map(f => [f.key, undefined])) as T;
    setLocalFilters(cleared);
  }, [fields]);

  const shouldShowFilters = isDesktop || showFilters;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative mb-8 rounded-3xl border border-slate-200/50 dark:border-[#1f2235]/40 bg-white/60 dark:bg-[#0c0d14]/40 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.02)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.45)] transition-all duration-300 ${className}`}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/5 to-indigo-500/5 pointer-events-none" />

      {/* هدر موبایل */}
      <div
        onClick={() => setShowFilters(prev => !prev)}
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

      <AnimatePresence initial={false}>
        {shouldShowFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="relative flex flex-col md:flex-row gap-5 items-center p-6">
              {fields.map((field, idx) => {
                if (field.type === "search") {
                  return (
                    <motion.div
                      key={field.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="relative flex-1 w-full group"
                    >
                      <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 transition-colors duration-300" />
                      <input
                        type="text"
                        placeholder={field.placeholder || "جستجو..."}
                        value={localFilters[field.key] ?? ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-full pr-11 pl-4 py-3 rounded-2xl border border-slate-200 dark:border-[#1f2235] bg-white/70 dark:bg-[#121420]/70 backdrop-blur-md text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 hover:bg-white/80 dark:hover:bg-[#1b1e30] hover:border-cyan-400/70 dark:hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/20 transition-all duration-300 shadow-sm"
                      />
                    </motion.div>
                  );
                }

                if (field.type === "select") {
                  return (
                    <motion.div
                      key={field.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="relative w-full md:w-auto group"
                    >
                      <select
                        value={localFilters[field.key] ?? ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="appearance-none w-full pl-10 pr-5 py-3 rounded-2xl border border-slate-200 dark:border-[#1f2235] bg-white/70 dark:bg-[#121420]/70 backdrop-blur-md text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 hover:bg-white/80 dark:hover:bg-[#1b1e30] hover:border-indigo-400/70 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 transition-all duration-300 shadow-sm cursor-pointer"
                      >
                        <option value="" className="bg-white dark:bg-[#121420]">{field.placeholder || "انتخاب کنید"}</option>
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#121420]">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none transition-all duration-300 group-focus-within:rotate-180 group-focus-within:text-indigo-500" />
                    </motion.div>
                  );
                }

                return null;
              })}

              <Button
                variant="secondary"
                size="md"
                onClick={handleReset}
                withRipple
                iconLeft={<FiX className="text-base" />}
                className="w-full md:w-auto px-5 bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-[#1b1e30] dark:text-slate-200 dark:hover:bg-[#25283d] transition-colors duration-200"
              >
                ریست
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}