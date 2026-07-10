"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

type Notification = {
  name: string;
  time: string;
  img: string;
  status: "success" | "error";
};

// انیمیشن فیزیکی لرزش زنگوله
const bellVariants = {
  idle: { rotate: 0 },
  ring: {
    rotate: [0, -15, 12, -10, 8, -4, 0],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatDelay: 5 // هر ۵ ثانیه یکبار به طور خودکار می‌لرزد تا توجه را جلب کند
    }
  },
  hover: {
    rotate: [0, -18, 15, -12, 8, -4, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notifying, setNotifying] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const notifications: Notification[] = [
    { name: "Terry Franci", time: "5 دقیقه پیش", img: "/images/user/user-02.jpg", status: "success" },
    { name: "Alena Franci", time: "8 دقیقه پیش", img: "/images/user/user-03.jpg", status: "success" },
    { name: "Jocelyn Kenter", time: "15 دقیقه پیش", img: "/images/user/user-04.jpg", status: "success" },
    { name: "Brandon Philips", time: "1 ساعت پیش", img: "/images/user/user-05.jpg", status: "error" },
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
  
    mediaQuery.addEventListener("change", handleChange);
    const timeout = setTimeout(() => setIsMobile(mediaQuery.matches), 0);
  
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      clearTimeout(timeout);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsOpen(true);
      setNotifying(false);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => setIsOpen(false), 250);
    }
  };

  const handleClick = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
      setNotifying(false);
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95, pointerEvents: "none" },
    visible: { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" },
    exit: { opacity: 0, y: -10, scale: 0.95, pointerEvents: "none" },
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
    if (e.key === "Escape") setIsOpen(false);
  };

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        ref={buttonRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="
          relative flex items-center justify-center h-11 w-11 rounded-full
          bg-white/40 dark:bg-[#121420]/30 backdrop-blur-xl
          border border-slate-200/60 dark:border-[#1f2235]/65
          hover:border-indigo-500/40 dark:hover:border-indigo-500/50
          hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]
          transition-all duration-300 group
        "
      >
        {/* نقطه درخشان نئونی و متحرک نوتیفیکیشن جدید */}
        {notifying && (
          <span className="absolute right-0.5 top-0.5 z-10 h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}

        {/* المان زنگوله مجهز به لرزش پویا */}
        <motion.div
          variants={bellVariants}
          animate={notifying && !isOpen ? "ring" : "idle"}
          whileHover="hover"
          className="flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
        >
          <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
            <path fillRule="evenodd" clipRule="evenodd" d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z" fill="currentColor" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            key="dropdown"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            transition={{ duration: 0.25, ease: "easeOut" }}
            /* اصلاح موقعیت به صورت ایمن جهت عدم خروج از کادر صفحه */
            className="absolute -left-12 sm:left-0 mt-3 flex h-[320px] w-[350px] flex-col rounded-2xl border border-slate-200/80 bg-white p-3 shadow-lg dark:border-[#1f2235]/65 dark:bg-[#0c0d14]/95 backdrop-blur-xl z-50 sm:w-[361px] origin-top-left"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-[#1f2235]/50">
              <h5 className="font-bold text-slate-800 dark:text-slate-200">اعلان‌ها</h5>
            </div>

            <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar space-y-1">
              {notifications.map((item, idx) => (
                <li key={idx}>
                  <DropdownItem
                    onItemClick={() => setIsOpen(false)}
                    className="flex gap-3 rounded-lg border-b border-slate-100/50 p-3 px-4.5 py-3 hover:bg-slate-100/50 dark:border-[#1f2235]/30 dark:hover:bg-[#121420]/30"
                  >
                    <span className="relative block w-10 h-10 rounded-full shrink-0">
                      <Image
                        width={40}
                        height={40}
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                      <span className={`absolute bottom-0 right-0 z-10 h-2.5 w-2.5 rounded-full border-[1.5px] border-white ${item.status === "success" ? "bg-green-500" : "bg-red-500"} dark:border-slate-900`}></span>
                    </span>
                    <span className="block text-right">
                      <span className="mb-1.5 block space-x-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-extrabold text-slate-800 dark:text-white">{item.name}</span>
                        <span>درخواست تایید هویت در سیستم ثبت کرد.</span>
                      </span>
                      <span className="flex items-center gap-2 text-slate-500 text-[10px] dark:text-slate-500">
                        <span>سیستم</span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                        <span>{item.time}</span>
                      </span>
                    </span>
                  </DropdownItem>
                </li>
              ))}
            </ul>

            <Link
              href="/"
              className="block px-4 py-2 mt-3 text-sm font-semibold text-center text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 dark:border-[#1f2235]/80 dark:bg-[#121420] dark:text-slate-350 dark:hover:bg-[#1b1e30]"
            >
              مشاهده همه اعلان‌ها
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}