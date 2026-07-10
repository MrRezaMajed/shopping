"use client";
import { FC, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

const SearchBox: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="w-full">
      <div className="flex items-center gap-2.5 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl px-4 py-2.5 bg-slate-50/80 dark:bg-zinc-900/40 focus-within:bg-white dark:focus-within:bg-zinc-950 focus-within:border-red-500/50 focus-within:ring-4 focus-within:ring-red-500/5 focus-within:shadow-[0_0_25px_rgba(239,68,68,0.06)] transition-all duration-300 group">
        <motion.span 
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 3, repeatType: "reverse" }}
          className="text-slate-400 group-focus-within:text-red-500 transition-colors duration-300"
        >
          <FaSearch className="text-base" />
        </motion.span>
        
        <input
          ref={inputRef}
          id="search"
          type="text"
          placeholder="جستجو در تمام دسته‌بندی‌ها..."
          autoComplete="off"
          className="w-full bg-transparent outline-none border-none text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 font-medium"
        />

        {/* دکمه میانبر مدرن و چشم‌نواز کیبورد */}
        <div className="hidden sm:flex items-center gap-0.5 px-2 py-1 bg-slate-200/40 dark:bg-zinc-800/40 border border-slate-300/30 dark:border-zinc-700/30 rounded-xl text-[10px] font-bold text-slate-400 dark:text-zinc-500 font-mono select-none">
          <span>⌘</span>
          <span>K</span>
        </div>
      </div>
    </section>
  );
};

export default SearchBox;