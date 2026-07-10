"use client";

import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const iconVariants = {
  initial: { scale: 0, rotate: -180, opacity: 0 },
  animate: { 
    scale: 1, 
    rotate: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 220, damping: 13 } 
  },
  exit: { 
    scale: 0, 
    rotate: 180, 
    opacity: 0,
    transition: { duration: 0.18 } 
  }
};

const starVariants = {
  animate: (delay: number) => ({
    opacity: [0.1, 0.9, 0.1],
    scale: [0.7, 1.2, 0.7],
    transition: {
      duration: 2 + delay,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }
  })
};

export const ThemeToggleButton = () => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="تغییر تم رنگی"
      className="
        relative flex items-center justify-center h-11 w-11 rounded-full overflow-hidden
        bg-white/40 dark:bg-[#121420]/30 backdrop-blur-xl
        border border-slate-200/60 dark:border-[#1f2235]/65
        /* تغییر رنگ هاور از زرد/بنفش ثابت به رنگ‌مایه پویا */
        hover:border-brand-400/50 dark:hover:border-brand-500/50
        shadow-[0_4px_12px_rgba(0,0,0,0.01)]
        hover:shadow-[0_0_20px_var(--brand-500)]/15
        dark:hover:shadow-[0_0_20px_var(--brand-500)]/20
        text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white
        transition-all duration-300 group
      "
    >
      <AnimatePresence>
        {isDark && (
          <div className="absolute inset-0 pointer-events-none z-0">
            <motion.span
              custom={0.2}
              variants={starVariants}
              animate="animate"
              className="absolute top-2.5 right-3 w-0.5 h-0.5 rounded-full bg-brand-200"
            />
            <motion.span
              custom={0.8}
              variants={starVariants}
              animate="animate"
              className="absolute bottom-3 left-3 w-0.5 h-0.5 rounded-full bg-white"
            />
            <motion.span
              custom={1.4}
              variants={starVariants}
              animate="animate"
              className="absolute top-7 left-2.5 w-[1px] h-[1px] rounded-full bg-brand-300"
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
                fill="url(#moon-glow-grad)"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="moon-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f5f7ff" />
                  <stop offset="50%" stopColor="#cbd5e1" />
                  {/* اعمال رنگ متغیر به گرادینت به جای رنگ ثابت بنفش */}
                  <stop offset="100%" stopColor="var(--brand-500)" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10"
          >
            <svg
              className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="4"
                fill="url(#sun-glow-grad)"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M6.34 17.66L4.93 19.07M19.07 4.93L17.66 6.34"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <radialGradient id="sun-glow-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ea580c" />
                </radialGradient>
              </defs>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};