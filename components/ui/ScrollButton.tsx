// components/ui/ScrollButton.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

export default function ScrollButton() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtBottomHalf, setIsAtBottomHalf] = useState(false);
  
  const activeContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement | Document;
      if (!target) return;

      let scrollTop = 0;
      let scrollHeight = 0;
      let clientHeight = 0;

      if (target === document || target instanceof Document) {
        scrollTop = window.scrollY || document.documentElement.scrollTop;
        scrollHeight = document.documentElement.scrollHeight;
        clientHeight = window.innerHeight;
        activeContainerRef.current = null;
      } else if (target instanceof HTMLElement) {
        scrollTop = target.scrollTop;
        scrollHeight = target.scrollHeight;
        clientHeight = target.clientHeight;
        activeContainerRef.current = target;
      }

      const docHeight = scrollHeight - clientHeight;
      if (docHeight <= 0) return;

      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
      setIsVisible(scrollTop > 200);
      setIsAtBottomHalf(scrollTop > docHeight / 2);
    };

    window.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [mounted]);

  const handleScrollAction = () => {
    const container = activeContainerRef.current;

    if (container) {
      if (isAtBottomHalf) {
        container.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    } else {
      if (isAtBottomHalf) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  if (!mounted) return null;

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 15 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleScrollAction}
          className="
            fixed bottom-6 right-54 z-[999] flex items-center justify-center h-11 w-11 rounded-full 
            bg-white/80 dark:bg-[#0c0d14]/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800
            shadow-xl text-slate-500 hover:text-indigo-500 dark:text-zinc-400 dark:hover:text-indigo-400 
            transition-colors duration-300
          "
        >
          <svg className="absolute -rotate-90 w-11 h-11 pointer-events-none">
            <circle
              cx="22"
              cy="22"
              r={radius}
              className="stroke-slate-200/40 dark:stroke-zinc-800/40 fill-transparent"
              strokeWidth="2"
            />
            <motion.circle
              cx="22"
              cy="22"
              r={radius}
              className="stroke-indigo-500 dark:stroke-indigo-400 fill-transparent"
              strokeWidth="2"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.1 }}
              strokeLinecap="round"
            />
          </svg>

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {isAtBottomHalf ? (
                <motion.div
                  key="up"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <FiArrowUp className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="down"
                  initial={{ rotate: 180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -180, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <FiArrowDown className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}