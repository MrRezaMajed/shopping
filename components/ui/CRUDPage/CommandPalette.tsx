// پنل پیشرفته میانبرهای کیبورد (CMD + K Command Palette)

import React from "react";
import { FiSearch, FiCornerDownLeft, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

interface CommandItem {
  id: string;
  label: string;
  shortcut: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  filteredCommands: CommandItem[];
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const CommandPalette = React.memo(function CommandPalette({
  isOpen,
  onClose,
  query,
  onQueryChange,
  filteredCommands,
  selectedIndex,
  onSelectedIndexChange,
  inputRef,
}: CommandPaletteProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -10 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="
          relative w-full max-w-[550px] mx-4 rounded-2xl overflow-hidden text-right
          bg-white/95 dark:bg-[#0c0d14]/95 backdrop-blur-xl
          border border-slate-200 dark:border-[#1f2235]
          shadow-[0_24px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)]
          z-10
        "
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-[#1f2235]/50">
          <FiSearch className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            aria-label="جستجوی دستورات"
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value);
              onSelectedIndexChange(0);
            }}
            placeholder="عملیات یا میانبری را جستجو کنید..."
            className="
              w-full bg-transparent border-none outline-none text-sm
              text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600
              focus:ring-0
            "
          />
          <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#1f2235] bg-slate-50 dark:bg-[#121420] text-[9px] font-mono text-slate-400">Esc</kbd>
        </div>

        <div className="p-2 max-h-[300px] overflow-y-auto space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-600 font-semibold">
              دستوری با این عنوان یافت نشد
            </div>
          ) : (
            filteredCommands.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => onSelectedIndexChange(idx)}
                  className={`
                    flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? "bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-400/20" 
                      : "text-slate-600 dark:text-slate-400 border border-transparent hover:bg-slate-50 dark:hover:bg-[#1b1e30]/50"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={isSelected ? "text-indigo-500" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {isSelected && (
                      <span className="text-[10px] text-indigo-400 dark:text-indigo-500 flex items-center gap-0.5 font-bold">
                        <FiCornerDownLeft className="h-3 w-3" />
                        اجرا
                      </span>
                    )}
                    <kbd className={`
                      px-1.5 py-0.5 rounded text-[9px] font-mono font-bold
                      ${isSelected 
                        ? "border border-indigo-300 dark:border-indigo-800 bg-indigo-500/5 text-indigo-500" 
                        : "border border-slate-200 dark:border-[#1f2235] bg-slate-50 dark:bg-[#121420] text-slate-400"
                      }
                    `}>
                      {item.shortcut}
                    </kbd>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50/50 dark:bg-[#121420]/20 border-t border-slate-100 dark:border-[#1f2235]/50 flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-550 font-bold">
          <span>برای حرکت از جهت‌نماها و برای انتخاب از Enter استفاده کنید</span>
          <span>CMD+K</span>
        </div>
      </motion.div>
    </div>
  );
});