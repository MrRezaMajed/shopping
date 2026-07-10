"use client";
import { FaInfoCircle, FaChevronLeft } from "react-icons/fa";
import Link from "next/link";
import { FC } from "react";

const IdentityBox: FC = () => {
  return (
    <div className="
      flex flex-col lg:flex-row items-start lg:items-center justify-between py-4 px-5 gap-4
      bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/85
      rounded-3xl shadow-sm mx-5 lg:mx-0 transition-all duration-300
    ">
      
      {/* پیام راهنما */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/25 text-amber-500 flex items-center justify-center shrink-0">
          <FaInfoCircle className="text-lg" />
        </div>
        <span className="text-slate-600 dark:text-slate-350 text-xs sm:text-sm leading-relaxed mt-1 text-right">
          با تایید هویت می‌توانید امنیت حساب کاربری‌تان را افزایش دهید و از امکان «خرید اعتباری» نیز استفاده کنید.
        </span>
      </div>

      {/* دکمه اقدام تایید هویت */}
      <Link 
        href="#"
        className="
          flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 
          hover:text-blue-700 dark:hover:text-blue-300 shrink-0 self-end lg:self-center
          bg-blue-50/50 dark:bg-blue-950/25 px-4 py-2 rounded-xl transition duration-200
        "
      >
        <span>تایید هویت</span>
        <FaChevronLeft className="text-[10px]" />
      </Link>
    </div>
  );
};

export default IdentityBox;