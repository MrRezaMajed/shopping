// components/dashboard/AppHeader.tsx
"use client";

import { ThemeToggleButton } from "./common/ThemeToggleButton";
import { AccentColorPicker } from "./common/AccentColorPicker";
import NotificationDropdown from "./header/NotificationDropdown";
import UserDropdown from "./header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

type Accent = "indigo" | "emerald" | "rose" | "amber";

const hamburgerVariants = {
  top: { closed: { d: "M 4 6 L 20 6" }, open: { d: "M 5 5 L 19 19" } },
  middle: { closed: { d: "M 4 12 L 15 12", opacity: 1 }, open: { d: "M 12 12 L 12 12", opacity: 0 } },
  bottom: { closed: { d: "M 4 18 L 20 18" }, open: { d: "M 5 19 L 19 5" } }
};

const chevronVariants = {
  expanded: { d: "M 8 6 L 14 12 L 8 18" },
  collapsed: { d: "M 14 6 L 8 12 L 14 18" }
};

// استفاده از کدهای رنگی انتخابگر برای ساختار افکت‌های دکمه‌ها و فوکوس ورودی هدر
const headerAccentStyles: Record<Accent, { text: string; buttonHover: string; inputFocus: string }> = {
  indigo: {
    text: "text-[#465fff]",
    buttonHover: "hover:border-[#465fff]/40 dark:hover:border-[#465fff]/30 hover:text-[#465fff] dark:hover:text-[#465fff] hover:shadow-[0_0_15px_rgba(70,95,255,0.12)]",
    inputFocus: "focus:border-[#465fff] focus:ring-[#465fff]/10"
  },
  emerald: {
    text: "text-[#10b981]",
    buttonHover: "hover:border-[#10b981]/40 dark:hover:border-[#10b981]/30 hover:text-[#10b981] dark:hover:text-[#10b981] hover:shadow-[0_0_15px_rgba(16,185,129,0.12)]",
    inputFocus: "focus:border-[#10b981] focus:ring-[#10b981]/10"
  },
  rose: {
    text: "text-[#f43f5e]",
    buttonHover: "hover:border-[#f43f5e]/40 dark:hover:border-[#f43f5e]/30 hover:text-[#f43f5e] dark:hover:text-[#f43f5e] hover:shadow-[0_0_15px_rgba(244,63,94,0.12)]",
    inputFocus: "focus:border-[#f43f5e] focus:ring-[#f43f5e]/10"
  },
  amber: {
    text: "text-[#f59e0b]",
    buttonHover: "hover:border-[#f59e0b]/40 dark:hover:border-[#f59e0b]/30 hover:text-[#f59e0b] dark:hover:text-[#f59e0b] hover:shadow-[0_0_15px_rgba(245,158,11,0.12)]",
    inputFocus: "focus:border-[#f59e0b] focus:ring-[#f59e0b]/10"
  }
};

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState<boolean>(false);
  const { isExpanded, isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { accent } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const styles = headerAccentStyles[accent as Accent] || headerAccentStyles.indigo;

  return (
    <header className="sticky top-0 flex w-full bg-white/80 dark:bg-[#090a10]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-[#1f2235]/40 z-45">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-slate-200 dark:border-[#1f2235]/40 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          
          {/* دکمه موبایل */}
          <button
            className={`flex lg:hidden items-center justify-center w-10 h-10 rounded-xl z-50 bg-white/20 dark:bg-[#121420]/30 backdrop-blur-md text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-[#1f2235]/50 transition-all duration-300 shrink-0 ${styles.buttonHover}`}
            onClick={handleToggle}
            aria-label="تغییر وضعیت منوی موبایل"
            type="button"
          >
            <motion.svg 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              initial={isMobileOpen ? "open" : "closed"}
              animate={isMobileOpen ? "open" : "closed"}
            >
              <motion.path 
                variants={hamburgerVariants.top} 
                d="M 4 6 L 20 6"
                transition={{ type: "spring", stiffness: 200, damping: 14 }} 
              />
              <motion.path 
                variants={hamburgerVariants.middle} 
                d="M 4 12 L 15 12"
                style={{ opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 14 }} 
              />
              <motion.path 
                variants={hamburgerVariants.bottom} 
                d="M 4 18 L 20 18"
                transition={{ type: "spring", stiffness: 200, damping: 14 }} 
              />
            </motion.svg>
          </button>

          {/* دکمه دسکتاپ */}
          <button
            className={`hidden lg:flex items-center justify-center h-11 w-11 rounded-xl z-50 bg-white/20 dark:bg-[#121420]/30 backdrop-blur-md text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-[#1f2235]/50 transition-all duration-300 shrink-0 ${styles.buttonHover}`}
            onClick={handleToggle}
            aria-label="تغییر وضعیت سایدبار دسکتاپ"
            type="button"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="5" x2="18" y2="19" className="opacity-80" />
              <motion.path 
                variants={chevronVariants} 
                d={isExpanded ? "M 8 6 L 14 12 L 8 18" : "M 14 6 L 8 12 L 14 18"}
                initial={false}
                animate={mounted && isExpanded ? "expanded" : "collapsed"} 
                transition={{ type: "spring", stiffness: 240, damping: 14 }} 
              />
            </svg>
          </button>

          {/* متن برند */}
          <Link href="/dashboard" className="lg:hidden">
            <span className={`${styles.text} font-extrabold text-sm`}>پنل آمازون</span>
          </Link>

          {/* منوی موبایل (سه نقطه) */}
          <button onClick={toggleApplicationMenu} className="flex items-center justify-center w-10 h-10 text-slate-700 rounded-lg z-50 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-[#121420] lg:hidden" type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM11.999 10.4951C12.8275 10.4951 13.499 11.1667 13.499 11.9951V12.0051C13.499 12.8335 12.8275 13.5051 11.999 13.5051C11.1706 13.5051 10.499 12.8335 10.499 12.0051V11.9951C10.499 11.1667 11.1706 10.4951 11.999 10.4951Z" 
                fill="currentColor" 
              />
            </svg>
          </button>

          <div className="hidden lg:block">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                  <svg className="fill-slate-500 dark:fill-slate-400" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" />
                  </svg>
                </span>
                <input 
                  ref={inputRef} 
                  type="text" 
                  placeholder="جستجو یا وارد کردن دستور..." 
                  className={`h-11 w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pr-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-3 dark:border-[#1f2235]/65 dark:bg-[#121420]/60 dark:text-white dark:placeholder:text-slate-500 xl:w-[430px] ${styles.inputFocus}`} 
                />
              </div>
            </form>
          </div>
        </div>

        <div className={`${isApplicationMenuOpen ? "flex" : "hidden"} items-center justify-between w-full gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0`}>
          <div className="flex items-center gap-2 2xsm:gap-3">
            <AccentColorPicker />
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;