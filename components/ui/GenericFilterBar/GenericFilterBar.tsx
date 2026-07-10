// کامپوننت تجمیع‌کننده والد اصلی


"use client";
import { useState, useEffect, useCallback, useRef } from "react";
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

  const shouldShowFilters = isDesktop || showFilters;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative mb-8 rounded-3xl border border-slate-200/50 dark:border-[#1f2235]/40 bg-white/60 dark:bg-[#0c0d14]/40 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.02)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.45)] transition-all duration-300 ${className}`}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/5 to-indigo-500/5 pointer-events-none" />

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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="relative flex flex-col md:flex-row gap-5 items-center p-6">
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