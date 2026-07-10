"use client";

import { FC, ReactNode } from "react";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ open, title, children, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div
        className="
          bg-white dark:bg-slate-900
          text-slate-900 dark:text-slate-100
          rounded-3xl p-6 w-11/12 max-w-md
          shadow-xl border border-slate-100 dark:border-slate-800/80
          relative animate-fadeUp text-right
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

        {/* بدنه و کودکان مودال */}
        <div className="mt-3">
          {children}
        </div>

        {/* دکمه انصراف زیرین */}
        <button
          onClick={onClose}
          className="
            mt-4 px-5 py-2.5 rounded-xl w-full
            bg-slate-105 dark:bg-slate-800 hover:bg-slate-150 dark:hover:bg-slate-750
            text-slate-700 dark:text-slate-200 text-xs font-semibold transition
          "
        >
          انصراف و بازگشت
        </button>
      </div>

    </div>
  );
};

export default Modal;