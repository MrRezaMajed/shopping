"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useTheme } from "../../../context/ThemeContext";

type Accent = "indigo" | "emerald" | "rose" | "amber";

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
      repeatDelay: 5
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

// استفاده از کدهای دقیق تم اختصاصی شما برای ساخت افکت‌های هاور و دکمه شیشه‌ای مینی‌مال
const notificationAccentStyles: Record<Accent, {
  buttonHover: string;
  iconActive: string;
  bottomButton: string;
  groupHoverText: string;
}> = {
  indigo: {
    buttonHover: "hover:border-[#465fff]/40 dark:hover:border-[#465fff]/30 hover:shadow-[0_0_15px_rgba(70,95,255,0.12)]",
    iconActive: "group-hover:text-[#465fff] dark:group-hover:text-[#465fff]",
    bottomButton: "text-[#465fff] dark:text-[#465fff] bg-[#465fff]/5 dark:bg-[#465fff]/5 border-[#465fff]/20 dark:border-[#465fff]/20 hover:bg-[#465fff]/15 dark:hover:bg-[#465fff]/15 hover:border-[#465fff]/40",
    groupHoverText: "group-hover:!text-[#465fff]"
  },
  emerald: {
    buttonHover: "hover:border-[#10b981]/40 dark:hover:border-[#10b981]/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.12)]",
    iconActive: "group-hover:text-[#10b981] dark:group-hover:text-[#10b981]",
    bottomButton: "text-[#10b981] dark:text-[#10b981] bg-[#10b981]/5 dark:bg-[#10b981]/5 border-[#10b981]/20 dark:border-[#10b981]/20 hover:bg-[#10b981]/15 dark:hover:bg-[#10b981]/15 hover:border-[#10b981]/40",
    groupHoverText: "group-hover:!text-[#10b981]"
  },
  rose: {
    buttonHover: "hover:border-[#f43f5e]/40 dark:hover:border-[#f43f5e]/30 hover:shadow-[0_0_15px_rgba(244,63,94,0.12)]",
    iconActive: "group-hover:text-[#f43f5e] dark:group-hover:text-[#f43f5e]",
    bottomButton: "text-[#f43f5e] dark:text-[#f43f5e] bg-[#f43f5e]/5 dark:bg-[#f43f5e]/5 border-[#f43f5e]/20 dark:border-[#f43f5e]/20 hover:bg-[#f43f5e]/15 dark:hover:bg-[#f43f5e]/15 hover:border-[#f43f5e]/40",
    groupHoverText: "group-hover:!text-[#f43f5e]"
  },
  amber: {
    buttonHover: "hover:border-[#f59e0b]/40 dark:hover:border-[#f59e0b]/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.12)]",
    iconActive: "group-hover:text-[#f59e0b] dark:group-hover:text-[#f59e0b]",
    bottomButton: "text-[#f59e0b] dark:text-[#f59e0b] bg-[#f59e0b]/5 dark:bg-[#f59e0b]/5 border-[#f59e0b]/20 dark:border-[#f59e0b]/20 hover:bg-[#f59e0b]/15 dark:hover:bg-[#f59e0b]/15 hover:border-[#f59e0b]/40",
    groupHoverText: "group-hover:!text-[#f59e0b]"
  }
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notifying, setNotifying] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { accent } = useTheme();

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

  // انیمیشن سه‌بعدی و نرم پاپ‌آپ منو با شتاب فنری
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

  // انیمیشن ورود تک‌تک آیتم‌ها با حرکت نرم جانبی
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

  const styles = notificationAccentStyles[accent as Accent] || notificationAccentStyles.indigo;

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
        className={`
          relative flex items-center justify-center h-11 w-11 rounded-full
          bg-white/40 dark:bg-[#121420]/35 backdrop-blur-xl
          border border-slate-200/60 dark:border-[#1f2235]/65
          ${styles.buttonHover}
          transition-all duration-300 group
        `}
      >
        {/* نقطه درخشان نئونی نوتیفیکیشن جدید */}
        {notifying && (
          <span className="absolute right-0.5 top-0.5 z-10 h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}

        {/* المان زنگوله */}
        <motion.div
          variants={bellVariants}
          animate={notifying && !isOpen ? "ring" : "idle"}
          whileHover="hover"
          className={`flex items-center justify-center text-slate-500 dark:text-slate-400 ${styles.iconActive} transition-colors`}
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
            className="absolute -left-12 sm:left-0 mt-3 flex h-[360px] w-[350px] flex-col rounded-2xl border border-slate-200/80 bg-white p-3 shadow-lg dark:border-[#1f2235] dark:bg-[#0c0d14] backdrop-blur-3xl z-50 sm:w-[361px] origin-top-left"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-[#1f2235]/50">
              <h5 className="font-bold text-slate-800 dark:text-slate-200">اعلان‌ها</h5>
            </div>

            {/* لیست اسکرول‌پذیر اعلان‌ها */}
            <ul className="flex-1 overflow-y-auto no-scrollbar space-y-1 pr-1">
              {notifications.map((item, idx) => (
                <motion.li key={idx} variants={itemVariants}>
                  <DropdownItem
                    onItemClick={() => setIsOpen(false)}
                    className="group flex gap-3 rounded-xl border-b border-slate-100/30 p-3 px-4.5 py-3 hover:bg-slate-100/50 dark:border-[#1f2235]/20 dark:hover:bg-[#121420]/30 transition-all duration-200"
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
                      {/* اجبار و تثبیت رنگ مراجع متنی با کلاس‌های ! جهت غلبه بر استایل‌های داخلی DropdownItem */}
                      <span className="mb-1 block space-x-1 text-xs !text-slate-500 dark:!text-slate-400">
                        <span className={`font-extrabold transition-colors duration-200 !text-slate-800 dark:!text-white ${styles.groupHoverText}`}>
                          {item.name}
                        </span>
                        <span>درخواست تایید هویت در سیستم ثبت کرد.</span>
                      </span>
                      <span className="flex items-center gap-2 !text-slate-500 text-[10px] dark:!text-slate-500">
                        <span>سیستم</span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                        <span>{item.time}</span>
                      </span>
                    </span>
                  </DropdownItem>
                </motion.li>
              ))}
            </ul>

            {/* پیاده‌سازی دکمه شیشه‌ای نیمه‌شفاف مطابق با پالت رنگی و تم فعال انتخاب‌شده شما */}
            <Link
              href="/"
              className={`
                block px-4 py-2.5 mt-3 text-xs font-bold text-center rounded-xl border transition-all duration-300
                ${styles.bottomButton}
                backdrop-blur-md hover:scale-[1.01] active:scale-[0.99] dark:text-gray-200!
              `}
            >
              مشاهده همه اعلان‌ها
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}