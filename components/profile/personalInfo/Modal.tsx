// components/profile/Modal.tsx
"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom"; // 👈 استفاده از پورتال برای فرار از محدوده Z-Index والد
import { FaTimes } from "react-icons/fa";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ open, title, children, onClose }) => {
  const [mounted, setMounted] = useState(false);

  // تضمین لود شدن کلاینت و جلوگیری از تداخل هیدریشن در Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  // قفل کردن اسکرول صفحه پشت مودال در زمان باز بودن
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !mounted) return null;

  // بستن مودال در صورت کلیک روی فضای خالی بیرونی
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      onClick={handleBackdropClick}
      /* 👈 ایجاد دیواره نامرئی برای ممانعت کامل از کلیک روی منوها و هدر سراسری */
      className="fixed inset-0 bg-transparent z-[99999] flex items-center justify-center p-4 pointer-events-auto select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()} // جلوگیری از انتشار کلیک به بیرون کارت
        /* 👈 سایه عمیق تضمینی دو لایه جهت شناورسازی و تفکیک بصری کامل در حالت شفاف */
        style={{
          boxShadow: "0 30px 100px rgba(0, 0, 0, 0.25), 0 10px 40px rgba(0, 0, 0, 0.1)"
        }}
        className="
          bg-white dark:bg-slate-900
          text-slate-900 dark:text-slate-100
          rounded-3xl p-6 w-11/12 max-w-md
          border border-slate-100 dark:border-slate-800/80
          relative animate-fadeUp text-right select-text
        "
      >
        {/* دکمه بستن در بالا سمت چپ */}
        <button
          onClick={onClose}
          className="
            absolute top-4 left-4 w-8 h-8 rounded-xl flex items-center justify-center
            bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400
            transition-colors duration-200
          "
        >
          <FaTimes className="text-sm" />
        </button>

        {/* عنوان مودال */}
        <h2 className="text-base font-extrabold mb-4 text-slate-850 dark:text-slate-150 pl-8">
          {title}
        </h2>

        {/* بدنه مودال */}
        <div className="mt-3">
          {children}
        </div>

        {/* دکمه انصراف زیرین */}
        <button
          onClick={onClose}
          className="
            mt-4 px-5 py-2.5 rounded-xl w-full
            bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750
            text-slate-700 dark:text-slate-200 dark:hover:text-gray-800 text-xs font-semibold transition
          "
        >
          انصراف و بازگشت
        </button>
      </div>
    </div>,
    document.body // 👈 الحاق مستقیم به انتهای تگ body جهت پوشش کامل همه‌ی هدرها و منوهای پروژه
  );
};

export default Modal;