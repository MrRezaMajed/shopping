"use client";

import { FC } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

interface NavigationButtonsProps {
  prevBtnClass: string;
  nextBtnClass: string;
}

const NavigationButtons: FC<NavigationButtonsProps> = ({ prevBtnClass, nextBtnClass }) => {
  return (
    <>
      {/* دکمه ناوبری راست */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${prevBtnClass} absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-xl bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border border-slate-200/50 dark:border-zinc-800/50 text-slate-700 dark:text-zinc-200 shadow-sm opacity-0 group-hover/suggestions:opacity-100 transition-all duration-300 hover:scale-105 hover:bg-white dark:hover:bg-zinc-900 hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-500/30 active:scale-95`}
      >
        <FiChevronRight size={18} className="stroke-[2.5px]" />
      </motion.button>

      {/* دکمه ناوبری چپ */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${nextBtnClass} absolute left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-xl bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border border-slate-200/50 dark:border-zinc-800/50 text-slate-700 dark:text-zinc-200 shadow-sm opacity-0 group-hover/suggestions:opacity-100 transition-all duration-300 hover:scale-105 hover:bg-white dark:hover:bg-zinc-900 hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-500/30 active:scale-95`}
      >
        <FiChevronLeft size={18} className="stroke-[2.5px]" />
      </motion.button>
    </>
  );
};

export default NavigationButtons;