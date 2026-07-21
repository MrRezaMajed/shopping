"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronDown as FiChevronDownMobile,
  FiX,
  FiShoppingBag,
  FiPercent,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { DIGIKALA_CATEGORIES } from "./categories-data";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [activeCat, setActiveCat] = useState<number>(0);

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [mobileCat, setMobileCat] = useState<number | null>(null);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // مدیریت اسکرول پس‌زمینه زمان باز شدن منوی موبایل
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openMenu = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  const closeMenu = () => {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
    }, 180);
  };

  return (
    <>
      {/* هدر دسکتاپ و نوار افقی بالای صفحه */}
      <div
        dir="rtl"
        className={`
          relative w-full
          bg-white/80 dark:bg-zinc-950/80
          backdrop-blur-xl
          border-b border-slate-100 dark:border-zinc-900/60
          transition-all duration-300
          /* پنهان کردن کامل نوار هدر روی موبایل زمان باز شدن منوی موبایل */
          ${mobileOpen ? "hidden md:block z-[9999]" : "z-40"}
        `}
      >
        <div className="max-w-[1440px] mx-auto py-1 px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
          <div className="flex items-center gap-6">
            {/* دکمه منوی همبرگری موبایل با افکت چرخشی */}
            <button
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 dark:text-zinc-200 dark:hover:text-zinc-100 active:scale-90 transition-all focus:outline-none"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
            >
              <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                <span className={`block h-0.5 w-5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                <span className={`block h-0.5 w-5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 translate-x-2" : ""}`} />
                <span className={`block h-0.5 w-5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
              </div>
            </button>

            {/* هدر دسکتاپ */}
            <nav className="hidden md:flex gap-6 items-center font-semibold text-sm text-slate-700 dark:text-zinc-300">
              {/* منوی دسته‌بندی مگامنو */}
              <div onPointerEnter={openMenu} onPointerLeave={closeMenu} className="relative">
                <button
                  className={`
                    flex items-center gap-1.5 px-4 py-2.5 rounded-xl
                    transition-all duration-300 text-xs font-extrabold ring-1 ring-transparent
                    ${open 
                      ? "bg-brand-50/70 dark:bg-brand-950/15 text-brand-600 dark:text-brand-400 ring-brand-500/10" 
                      : "hover:bg-slate-50 dark:hover:bg-zinc-900/60"
                    }
                  `}
                >
                  دسته‌بندی کالاها
                  <FiChevronDown className={`transition-transform duration-300 ${open ? "rotate-180 text-brand-500" : "text-slate-400"}`} />
                </button>

                {/* ناحیه خالی برای جلوگیری از بسته شدن مگامنو زمان حرکت ماوس */}
                {open && <div className="absolute top-full right-0 h-4 w-full z-50" />}

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.99 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="
                        absolute top-[calc(100%+8px)] right-0
                        w-[780px] lg:w-[920px] max-w-[95vw]
                        bg-white/95 dark:bg-zinc-950/95
                        backdrop-blur-2xl rounded-2xl 
                        shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]
                        border border-slate-150/80 dark:border-zinc-800/80
                        flex overflow-hidden z-50
                      "
                      onPointerEnter={openMenu}
                      onPointerLeave={closeMenu}
                    >
                      {/* ستون کناری دسته‌بندی‌ها */}
                      <div className="w-56 lg:w-64 p-3.5 space-y-1.5 bg-slate-50/50 dark:bg-zinc-950/45 border-l border-slate-100 dark:border-zinc-900/80 flex-shrink-0 relative">
                        {DIGIKALA_CATEGORIES.map((cat, i) => (
                          <button
                            key={cat.title}
                            onPointerEnter={() => setActiveCat(i)}
                            className={`
                              w-full flex justify-between items-center relative
                              py-3 px-4 rounded-xl transition-all duration-300 text-right text-xs z-10
                              ${
                                activeCat === i
                                  ? "text-brand-600 dark:text-brand-400 font-extrabold" 
                                  : "text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-50 font-semibold"
                              }
                            `}
                          >
                            {/* کپسول پس‌زمینه الاستیک متحرک */}
                            {activeCat === i && (
                              <motion.div
                                layoutId="activeCategoryBg"
                                className="absolute inset-0 bg-brand-50/60 dark:bg-brand-950/20 border-r-2 border-brand-500 rounded-xl -z-10 shadow-sm"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              />
                            )}
                            <div className="flex items-center gap-3">
                              <span className="text-lg transition-transform duration-300 group-hover:scale-110">{cat.icon}</span>
                              <span className="truncate">{cat.title}</span>
                            </div>
                            <FiChevronLeft className={`text-xs transition-transform duration-300 ${activeCat === i ? "translate-x-1 opacity-100 text-brand-500" : "opacity-40"}`} />
                          </button>
                        ))}
                      </div>

                      {/* محتوای مگامنو */}
                      <div className="flex-1 p-6 grid grid-cols-2 lg:grid-cols-3 gap-6 bg-white dark:bg-zinc-950 max-h-[460px] overflow-y-auto">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeCat}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 4 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="col-span-full grid grid-cols-2 lg:grid-cols-3 gap-6"
                          >
                            {DIGIKALA_CATEGORIES[activeCat].groups.map((group) => (
                              <div key={group.title} className="space-y-3.5 group/group">
                                <h4 className="font-extrabold text-xs text-slate-900 dark:text-zinc-50 border-r-2 border-brand-500 pr-2.5 transition-all duration-300 group-hover/group:pr-3.5">
                                  {group.title}
                                </h4>

                                <ul className="space-y-2 pr-2.5 border-r border-slate-100 dark:border-zinc-900/60">
                                  {group.items.map((item) => (
                                    <li key={item}>
                                      <Link
                                        href="#"
                                        className="block text-[11px] font-semibold text-slate-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200" 
                                      >
                                        {item}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* لینک‌های معمولی منو */}
              <Link href="#" className="relative py-2 group flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-300">
                <FiShoppingBag className="text-slate-400 group-hover:text-brand-500 transition-colors duration-300" />
                <span>سوپرمارکت</span>
                <span className="absolute mt-12 right-0 left-0 h-[2px] bg-brand-500 rounded-full scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </Link>

              <Link href="#" className="relative py-2 group flex items-center gap-1.5 text-brand-500 dark:text-brand-400 hover:text-brand-600 transition-colors duration-300 font-extrabold">
                <FiPercent className="text-brand-500 transition-transform duration-300 group-hover:rotate-12" />
                <span>تخفیف‌ها و پیشنهادها</span>
                <span className="absolute mt-12 right-0 left-0 h-[2px] bg-brand-500 dark:bg-brand-400 rounded-full scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* کشوی منوی موبایل (به عنوان تگ مستقل و بدون وابستگی چیدمان به هدر در زمان باز بودن) */}
      <AnimatePresence>
        {mobileOpen && (
          <div dir="rtl" className="relative">
            {/* لایه تیره پس‌زمینه با افکت بلور شیشه‌ای سراسری */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[9998] h-[100dvh]"
            />

            {/* بدنه شیشه‌ای منو موبایل با پوشش ۱۰۰٪ واقعی ارتفاع صفحه */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="fixed top-0 right-0 bottom-0 h-[100dvh] w-[290px] max-w-[85vw] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl z-[9999] shadow-2xl flex flex-col border-l border-slate-150/40 dark:border-zinc-900/60"
            >
              {/* هدر منوی موبایل */}
              <div className="p-4 border-b border-slate-100 dark:border-zinc-900/80 flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900 dark:text-zinc-50">دسته‌بندی‌ها</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 dark:text-zinc-400 active:scale-90 transition-transform"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              {/* بدنه و ناوبری‌های موبایل با متد تاشونده آکاردئونی */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                <div className="space-y-1.5">
                  {DIGIKALA_CATEGORIES.map((cat, i) => {
                    const isExpanded = mobileCat === i;
                    return (
                      <div key={cat.title} className="rounded-xl overflow-hidden border border-transparent dark:border-transparent">
                        <button
                          onClick={() => setMobileCat(isExpanded ? null : i)}
                          className={`
                            w-full flex justify-between items-center py-3 px-3.5 rounded-xl transition-all duration-300
                            ${isExpanded 
                              ? "bg-brand-50/70 dark:bg-brand-950/15 text-brand-600 dark:text-brand-400 font-extrabold" 
                              : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900/40 font-semibold"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-base">{cat.icon}</span>
                            <span className="text-xs">{cat.title}</span>
                          </div>
                          <FiChevronDownMobile className={`text-xs transition-transform duration-300 ${isExpanded ? "rotate-180 text-brand-500" : "text-slate-400"}`} />
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden bg-slate-50/40 dark:bg-zinc-950/20 pr-4 pl-2 space-y-3 border-r-2 border-brand-500/20 mt-1"
                            >
                              <div className="py-2.5 space-y-4">
                                {cat.groups.map((group) => (
                                  <div key={group.title} className="space-y-2">
                                    <h5 className="font-extrabold text-[11px] text-slate-800 dark:text-zinc-300 pr-1.5 border-r border-brand-500">
                                      {group.title}
                                    </h5>
                                    <div className="flex flex-col gap-1.5 pr-2.5">
                                      {group.items.map((item) => (
                                        <Link
                                          key={item}
                                          href="#"
                                          onClick={() => setMobileOpen(false)}
                                          className="text-[10px] font-semibold text-slate-500 hover:text-brand-500 dark:text-zinc-400 transition-colors"
                                        >
                                          {item}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                <div className="h-[1px] bg-slate-100 dark:bg-zinc-900/80 my-2" />

                {/* ناوبری‌های اضافی موبایل */}
                <div className="flex flex-col gap-1.5">
                  <Link
                    href="#"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 px-3.5 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-colors"
                  >
                    <FiShoppingBag className="text-base text-slate-400" />
                    <span>سوپرمارکت</span>
                  </Link>

                  <Link
                    href="#"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 px-3.5 rounded-xl text-xs font-extrabold text-brand-500 dark:text-brand-400 hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-colors"
                  >
                    <FiPercent className="text-base" />
                    <span>تخفیف‌ها و پیشنهادها</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}