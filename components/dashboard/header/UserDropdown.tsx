"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useTheme } from "../../../context/ThemeContext";
import { FiUser, FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";

type Accent = "indigo" | "emerald" | "rose" | "amber";

// استایل‌های پویا مجهز به کلاس‌های مهم (important) جهت اعمال بی‌واسطه رنگ در لایت و دارک بر روی لایه‌های داخلی
const userDropdownAccentStyles: Record<Accent, { hoverBg: string; hoverBorder: string; ringColor: string; groupHoverText: string }> = {
  indigo: {
    hoverBg: "hover:bg-[#465fff]/8 dark:hover:bg-[#465fff]/10",
    hoverBorder: "hover:border-[#465fff]",
    ringColor: "ring-[#465fff]",
    groupHoverText: "group-hover:!text-[#465fff]"
  },
  emerald: {
    hoverBg: "hover:bg-[#10b981]/8 dark:hover:bg-[#10b981]/10",
    hoverBorder: "hover:border-[#10b981]",
    ringColor: "ring-[#10b981]",
    groupHoverText: "group-hover:!text-[#10b981]"
  },
  rose: {
    hoverBg: "hover:bg-[#f43f5e]/8 dark:hover:bg-[#f43f5e]/10",
    hoverBorder: "hover:border-[#f43f5e]",
    ringColor: "ring-[#f43f5e]",
    groupHoverText: "group-hover:!text-[#f43f5e]"
  },
  amber: {
    hoverBg: "hover:bg-[#f59e0b]/8 dark:hover:bg-[#f59e0b]/10",
    hoverBorder: "hover:border-[#f59e0b]",
    ringColor: "ring-[#f59e0b]",
    groupHoverText: "group-hover:!text-[#f59e0b]"
  }
};

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const { accent } = useTheme();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
  
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => setIsOpen(false), 220);
    }
  };

  const handleClick = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.93, 
      y: -12, 
      rotateX: -10,
      perspective: 1000,
      pointerEvents: "none" as const
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      rotateX: 0,
      pointerEvents: "auto" as const,
      transition: { 
        type: "spring", 
        stiffness: 350, 
        damping: 24,
        mass: 0.9,
        staggerChildren: 0.05,
        delayChildren: 0.02
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -8, 
      rotateX: -6,
      pointerEvents: "none" as const,
      transition: { 
        duration: 0.15,
        ease: "easeIn" 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 12 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 22 
      } 
    }
  };

  const menuItems = [
    { label: "ویرایش حساب", href: "/profile", icon: <FiUser className="w-4 h-4" /> },
    { label: "تنظیمات کاربری", href: "/settings", icon: <FiSettings className="w-4 h-4" /> },
    { label: "پشتیبانی", href: "/support", icon: <FiHelpCircle className="w-4 h-4" /> },
  ];

  const styles = userDropdownAccentStyles[accent as Accent] || userDropdownAccentStyles.indigo;

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
          if (e.key === "Escape") setIsOpen(false);
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        /* تضمین و تثبیت کنتراست متن دکمه اصلی با کلاس‌های مهم اولویت‌دار */
        className="flex items-center !text-slate-700 dark:!text-slate-300 hover:!text-slate-900 dark:hover:!text-white transition-colors group"
      >
        <span className={`mr-3 overflow-hidden rounded-full h-11 w-11 border transition-all duration-300 transform group-hover:scale-105 ${
          isOpen 
            ? `ring-2 ring-offset-2 dark:ring-offset-[#0c0d14] ${styles.ringColor}` 
            : 'border-slate-200/50 dark:border-[#1f2235]/60'
        }`}>
          <Image
            width={44}
            height={44}
            src="/images/user/owner.jpg"
            alt="User"
            className="object-cover w-full h-full"
          />
        </span>
        <span className="block mr-1 font-bold text-sm transition-colors group-hover:!text-slate-950 dark:group-hover:!text-white">پیام</span>
        <svg
          className={`stroke-slate-500 dark:stroke-slate-400 transition-transform duration-300 ${
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
            className="absolute left-0 mt-3 w-58 flex flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:border-[#1f2235] dark:bg-[#0c0d14] backdrop-blur-3xl z-50 text-right origin-top-left"
          >
            {/* کارت مشخصات کاربر با تحکیم و اجبار اولویت رنگ متون */}
            <div className="bg-slate-50/50 dark:bg-[#121420]/60 p-2.5 rounded-xl border border-slate-100 dark:border-[#1f2235]/40 mb-2.5">
              <span className="block font-extrabold !text-slate-800 dark:!text-slate-100 text-[13px]">
                پیام پورفرجی
              </span>
              <span className="mt-0.5 block text-[11px] font-semibold !text-slate-400 dark:!text-slate-400">
                payam@gmail.com
              </span>
            </div>

            {/* لیست گزینه‌های منو */}
            <ul className="flex flex-col gap-1 pb-2 border-b border-slate-100 dark:border-[#1f2235]/50">
              {menuItems.map((item) => (
                <motion.li key={item.label} variants={itemVariants}>
                  <DropdownItem
                    onItemClick={() => setIsOpen(false)}
                    tag="a"
                    href={item.href}
                    className={`
                      group flex items-center gap-3 px-3 py-2.5 rounded-xl border-r-2 border-transparent transition-all duration-200
                      ${styles.hoverBg} ${styles.hoverBorder}
                    `}
                  >
                    {/* اجبار تغییر رنگ آیکون به رنگ‌های روشن در حالت دارک‌مود و تغییر رنگ با هاور گروه */}
                    <span className={`opacity-75 transition-colors duration-200 !text-slate-400 dark:!text-slate-400 ${styles.groupHoverText}`}>
                      {item.icon}
                    </span>
                    {/* اجبار خوانایی کامل متن گزینه‌ها با لغو استایل‌های پیش‌فرض احتمالی کامپوننت DropdownItem */}
                    <span className={`font-semibold text-xs sm:text-sm transition-colors duration-200 !text-slate-600 dark:!text-slate-300 ${styles.groupHoverText}`}>
                      {item.label}
                    </span>
                  </DropdownItem>
                </motion.li>
              ))}
            </ul>

            {/* دکمه خروج */}
            <motion.div variants={itemVariants} className="mt-2">
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="
                  flex items-center gap-3 px-3 py-2.5 font-bold rounded-xl text-xs sm:text-sm transition-all duration-200
                  !text-[#f43f5e] border-r-2 border-transparent
                  hover:bg-[#f43f5e]/10 dark:hover:bg-[#f43f5e]/10 
                  hover:border-[#f43f5e] hover:!text-[#f43f5e]
                "
              >
                <FiLogOut className="w-4 h-4 opacity-80" />
                <span>خروج از حساب</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}