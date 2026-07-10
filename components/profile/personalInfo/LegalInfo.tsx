"use client";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { FC } from "react";

const LegalInfo: FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-sm overflow-hidden text-right">
      
      {/* هدر بخش حقوقی */}
      <div className="px-6 sm:px-8 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-red-500 rounded-full" />
          <p className="text-base font-extrabold text-slate-800 dark:text-slate-100">
            اطلاعات حقوقی
          </p>
        </div>
      </div>

      {/* محتوا */}
      <div className="px-6 sm:px-8 pb-6 pt-5 flex flex-col items-start gap-4">
        <span className="text-slate-500 dark:text-slate-450 text-xs sm:text-sm leading-relaxed">
          این گزینه مخصوص نمایندگان یا کسانی است که نیاز به فاکتور خرید رسمی و سازمانی دارند.
        </span>

        <Link 
          href="#" 
          className="
            flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 
            hover:text-blue-700 dark:hover:text-blue-300
            bg-blue-50/50 dark:bg-blue-950/25 px-4 py-2 rounded-xl transition duration-200
          "
        >
          <span>ثبت اطلاعات حقوقی</span>
          <FaChevronLeft className="text-[10px]" />
        </Link>
      </div>
    </div>
  );
};

export default LegalInfo;