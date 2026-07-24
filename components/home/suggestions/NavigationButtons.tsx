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
      {/* دکمه ناوبری راست (قبلی در جهت راست) */}
      <motion.button 
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={`${prevBtnClass} absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/50 dark:border-zinc-800/50 text-slate-700 dark:text-zinc-200 shadow-md opacity-0 translate-x-3 group-hover/suggestions:opacity-100 group-hover/suggestions:translate-x-0 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-white dark:hover:bg-zinc-800 hover:text-brand-500 dark:hover:text-brand-400`}
      >
        <FiChevronRight size={20} className="stroke-[2.5px]" />
      </motion.button>

      {/* دکمه ناوبری چپ (بعدی در جهت چپ) */}
      <motion.button 
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={`${nextBtnClass} absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/50 dark:border-zinc-800/50 text-slate-700 dark:text-zinc-200 shadow-md opacity-0 -translate-x-3 group-hover/suggestions:opacity-100 group-hover/suggestions:translate-x-0 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-white dark:hover:bg-zinc-800 hover:text-brand-500 dark:hover:text-brand-400`}
      >
        <FiChevronLeft size={20} className="stroke-[2.5px]" />
      </motion.button>
    </>
  );
};

export default NavigationButtons;