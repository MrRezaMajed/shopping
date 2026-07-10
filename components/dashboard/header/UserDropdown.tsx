"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // تشخیص موبایل
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
  
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Hover دسکتاپ
  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => setIsOpen(false), 250);
    }
  };

  // Click موبایل
  const handleClick = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  // انیمیشن Dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95, pointerEvents: "none" },
    visible: { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" },
    exit: { opacity: 0, y: -10, scale: 0.95, pointerEvents: "none" },
  };

  // دسترس‌پذیری کیبورد
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const menuItems = [
    { label: "ویرایش حساب", href: "/profile" },
    { label: "تنظیمات کاربری", href: "/settings" },
    { label: "پشتیبانی", href: "/support" },
  ];

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center text-slate-700 dark:text-slate-400 transition-colors"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image
            width={44}
            height={44}
            src="/images/user/owner.jpg"
            alt="User"
            className="object-cover"
          />
        </span>
        <span className="block mr-1 font-bold text-sm">پیام</span>
        <svg
          className={`stroke-slate-500 dark:stroke-slate-450 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dropdown"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            transition={{ duration: 0.25, ease: "easeOut" }}
            /* اصلاح رنگ‌بندی تیره، حاشیه و افکت سایه برای ظاهری چشم‌نواز */
            className="absolute left-0 mt-3 w-56 flex flex-col rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:border-[#1f2235] dark:bg-[#0c0d14]/98 backdrop-blur-3xl z-50 text-right origin-top-left"
          >
            {/* کارت مشخصات کاربر با پس‌زمینه شیک جهت تفکیک بصری */}
            <div className="bg-slate-50/50 dark:bg-[#121420]/30 p-2.5 rounded-xl border border-slate-100 dark:border-[#1f2235]/40 mb-2">
              <span className="block font-extrabold text-slate-800 text-[13px] dark:text-slate-100">
                پیام پورفرجی
              </span>
              <span className="mt-0.5 block text-[11px] font-semibold text-slate-400 dark:text-slate-450">
                payam@gmail.com
              </span>
            </div>

            {/* گزینه‌های منو مجهز به افکت‌های تعاملی شیشه‌ای و کنتراست بالا */}
            <ul className="flex flex-col gap-1 pb-2 border-b border-slate-150 dark:border-[#1f2235]/50">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <DropdownItem
                    onItemClick={() => setIsOpen(false)}
                    tag="a"
                    href={item.href}
                    className="
                      flex items-center gap-3 px-3 py-2.5 font-semibold rounded-xl text-xs sm:text-sm transition-all duration-200
                      text-slate-600 dark:text-slate-350
                      hover:bg-indigo-50/80 dark:hover:bg-indigo-500/10 
                      hover:text-indigo-600 dark:hover:text-indigo-400
                    "
                  >
                    {item.label}
                  </DropdownItem>
                </li>
              ))}
            </ul>

            {/* دکمه خروج مجهز به افکت هاور با شفافیت ملایم رز-گلبهی */}
            <Link
              href="/signin"
              className="
                flex items-center gap-3 px-3 py-2.5 mt-2 font-bold rounded-xl text-xs sm:text-sm transition-all duration-200
                text-rose-600 dark:text-rose-450
                hover:bg-rose-50 dark:hover:bg-rose-500/10 
                hover:text-rose-700 dark:hover:text-rose-350
              "
            >
              خروج از حساب
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}