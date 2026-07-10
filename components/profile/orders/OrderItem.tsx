"use client";

import Image from "next/image";
import { FaCalendarAlt, FaIdCardAlt, FaClock, FaCheckCircle, FaTimesCircle, FaShippingFast } from "react-icons/fa";
import { motion } from "framer-motion";
import { toPersianNumber } from "@/lib/utils/persianNumbers";
import Link from "next/link";

type OrderItemProps = {
  date: string;
  code: string | number;
  status: string;
  images: string[];
};

// تابع کمکی برای تشخیص هوشمند استایل و آیکون وضعیت بر اساس متن ورودی
const getStatusConfig = (status: string) => {
  const s = status.trim();
  
  if (s.includes("انتظار") || s.includes("نشده") || s.includes("PENDING")) {
    return {
      classes: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20 ring-amber-500/5",
      icon: <FaClock className="text-xs shrink-0" />
    };
  }
  
  if (s.includes("پرداخت شده") || s.includes("موفق") || s.includes("تایید") || s.includes("SUCCESS") || s.includes("PAID")) {
    return {
      classes: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 ring-emerald-500/5",
      icon: <FaCheckCircle className="text-xs shrink-0" />
    };
  }

  if (s.includes("ارسال") || s.includes("تحویل") || s.includes("SHIPPED") || s.includes("DELIVERED")) {
    return {
      classes: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20 ring-sky-500/5",
      icon: <FaShippingFast className="text-xs shrink-0" />
    };
  }

  if (s.includes("لغو") || s.includes("ناموفق") || s.includes("FAILED") || s.includes("CANCELED")) {
    return {
      classes: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20 ring-rose-500/5",
      icon: <FaTimesCircle className="text-xs shrink-0" />
    };
  }

  // وضعیت پیش‌فرض
  return {
    classes: "text-slate-600 dark:text-zinc-400 bg-slate-500/10 border-slate-500/20 ring-slate-500/5",
    icon: <FaClock className="text-xs shrink-0" />
  };
};

// تابع تشخیص متن دکمه اقدام بر اساس پرداخت شدن فاکتور
const getButtonLabel = (status: string) => {
  const s = status.trim();
  const isPaid = s.includes("پرداخت شده") || s.includes("موفق") || s.includes("تحویل") || s.includes("SUCCESS") || s.includes("PAID") || s.includes("DELIVERED");
  return isPaid ? "مشاهده جزئیات" : "پرداخت سفارش";
};

// تابع تشخیص استایل دکمه اقدام
const getButtonClass = (status: string) => {
  const s = status.trim();
  const isPaid = s.includes("پرداخت شده") || s.includes("موفق") || s.includes("تحویل") || s.includes("SUCCESS") || s.includes("PAID") || s.includes("DELIVERED");
  
  if (isPaid) {
    return `
      text-slate-600 dark:text-zinc-300 
      bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/80
      border border-slate-200/40 dark:border-zinc-800/60
    `;
  }
  return `
    text-blue-600 dark:text-blue-400 
    bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/35 dark:hover:bg-blue-900/45
    border border-blue-200/30 dark:border-blue-900/30
    shadow-sm shadow-blue-500/5
  `;
};

export default function OrderItem({ date, code, status, images }: OrderItemProps) {
  const statusConfig = getStatusConfig(status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="
        p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-5
        transition-all duration-300 border
        border-slate-150 dark:border-zinc-800/80
        bg-white/80 dark:bg-zinc-950/40 backdrop-blur-xl
        hover:border-slate-300 dark:hover:border-zinc-700
        hover:shadow-[0_12px_30px_rgba(0,0,0,0.02)] dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)]
        relative group
      "
    >
      {/* سمت راست: جزییات متنی فاکتور و آلبوم تصاویر کالاها */}
      <div className="space-y-4 text-right flex-1 w-full">
        
        {/* ردیف اول: مشخصات عددی با تبدیل خودکار به ارقام پارسی */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-semibold text-slate-500 dark:text-zinc-400 select-none">
          <p className="flex items-center gap-1.5 transition-colors duration-200 hover:text-slate-800 dark:hover:text-zinc-200">
            <FaCalendarAlt className="text-slate-400 shrink-0" />
            <span>تاریخ: {toPersianNumber(date)}</span>
          </p>

          <p className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300 font-extrabold transition-colors duration-200 hover:text-slate-900 dark:hover:text-zinc-100">
            <FaIdCardAlt className="text-slate-400 shrink-0" />
            <span>کد سفارش: {toPersianNumber(code)}</span>
          </p>
        </div>

        {/* تگ وضعیت درخشان نئونی هوشمند */}
        <div className="flex items-center select-none">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl border ring-4 ring-inset ring-transparent ${statusConfig.classes}`}>
            {statusConfig.icon}
            {status}
          </span>
        </div>

        {/* گالری تصاویر محصولات سفارش با انیمیشن چرخش الاستیک هاور */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          {images.map((img, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? 3 : -3 }}
              whileTap={{ scale: 0.94 }}
              className="w-12 h-12 rounded-xl overflow-hidden border border-slate-150 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-900 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 flex-shrink-0"
            >
              <Image
                src={img}
                width={48}
                height={48}
                alt="تصویر محصول"
                className="object-cover w-full h-full"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* سمت چپ: دکمه داینامیک پرداخت یا مشاهده جزئیات فاکتور */}
      <motion.div 
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="shrink-0 self-end md:self-center mt-2 md:mt-0 w-full md:w-auto"
      >
        <Link
          href="#"
          className={`
            inline-flex items-center justify-center px-5.5 py-3 text-xs font-extrabold
            rounded-xl transition-all duration-300 w-full md:w-auto
            ${getButtonClass(status)}
          `}
        >
          {getButtonLabel(status)}
        </Link>
      </motion.div>
    </motion.div>
  );
}