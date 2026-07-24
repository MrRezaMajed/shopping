"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/Button";

import { GenericFilterBarProps } from "./types";
import { MobileFilterHeader } from "./MobileFilterHeader";
import { FilterSearchInput } from "./FilterSearchInput";
import { FilterSelectInput } from "./FilterSelectInput";

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

  // بررسی فعال بودن فیلترها جهت نمایش هوشمند دکمه ریست
  const hasActiveFilter = useMemo(() => {
    return Object.values(localFilters).some(val => val !== undefined && val !== "");
  }, [localFilters]);

  const shouldShowFilters = isDesktop || showFilters;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        relative rounded-xl border border-slate-200/50 dark:border-zinc-800/50 
        bg-white/50 dark:bg-zinc-950/40 backdrop-blur-md 
        transition-all duration-300 ${className}
      `}
    >
      <MobileFilterHeader 
        showFilters={showFilters} 
        onClick={() => setShowFilters(prev => !prev)} 
      />

      <AnimatePresence initial={false}>
        {shouldShowFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* کاهش پدینگ داخلی از p-6 به p-3 در دسکتاپ جهت فشرده‌سازی ارتفاع */}
            <div className="relative flex flex-col md:flex-row gap-2.5 items-center p-3 sm:px-4">
              {fields.map((field, idx) => {
                if (field.type === "search") {
                  return (
                    <FilterSearchInput
                      key={field.key}
                      fieldKey={field.key}
                      placeholder={field.placeholder}
                      value={localFilters[field.key] ?? ""}
                      onChange={(val) => handleChange(field.key, val)}
                      idx={idx}
                    />
                  );
                }

                if (field.type === "select") {
                  return (
                    <FilterSelectInput
                      key={field.key}
                      fieldKey={field.key}
                      placeholder={field.placeholder}
                      options={field.options}
                      value={localFilters[field.key] ?? ""}
                      onChange={(val) => handleChange(field.key, val)}
                      idx={idx}
                    />
                  );
                }

                return null;
              })}

              {/* دکمه ریست مینیاتوری و فوق‌العاده مدرن (نمایش فقط در صورت لزوم) */}
              <AnimatePresence>
                {hasActiveFilter && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.15 }}
                    className="w-full md:w-auto"
                  >
                    <Button
                      variant="ghost"
                      onClick={handleReset}
                      withRipple
                      iconLeft={<FiX className="text-sm" />}
                      className="
                        w-full md:w-auto h-9 px-3.5 rounded-lg text-xs font-semibold
                        bg-slate-100 dark:bg-zinc-900 
                        text-slate-600 dark:text-zinc-300 
                        hover:bg-slate-200 dark:hover:bg-zinc-800
                        transition-all duration-150
                      "
                    >
                      ریست
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}