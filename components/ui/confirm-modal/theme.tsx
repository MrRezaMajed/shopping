// components/confirm-modal/theme.tsx

import { ModalTheme } from './types';
import { FiAlertTriangle, FiTrash2, FiInfo, FiCheckCircle } from 'react-icons/fi';

export const getThemeColors = (type: 'warning' | 'error' | 'danger' | 'info' | 'success' = 'warning'): ModalTheme => {
  switch (type) {
    case 'error':
    case 'danger':
      return {
        type,
        // ۱. خنثی کردن پس‌زمینه کارت (تغییر از قرمز گرادیانی به سفید/دارک خنثی)
        cardBg: 'bg-white dark:bg-[#0c0d14] text-slate-800 dark:text-slate-100 shadow-xl border border-slate-100 dark:border-[#1f2235]/60',
        bg: 'bg-rose-50 dark:bg-rose-500/10',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-100 dark:border-rose-500/20',
        titleText: 'text-slate-800 dark:text-slate-100',
        messageText: 'text-slate-500 dark:text-slate-450',
        // ۲. دکمه تایید (حذف دائم) قرمز پررنگ باقی می‌ماند
        btn: 'bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white shadow-md shadow-rose-600/20 font-bold',
        // ۳. دکمه انصراف کاملاً خاکستری و خنثی می‌شود (دیگر قرمز دیده نخواهد شد)
        cancelBtn: 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300',
        icon: <FiTrash2 className="w-6 h-6 sm:w-7 sm:h-7" />,
      };
    case 'success':
      return {
        type,
        cardBg: 'bg-white dark:bg-[#0c0d14] text-slate-800 dark:text-slate-100 shadow-xl border border-slate-100 dark:border-[#1f2235]/60',
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-100 dark:border-emerald-500/20',
        titleText: 'text-slate-800 dark:text-slate-100',
        messageText: 'text-slate-500 dark:text-slate-450',
        btn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 font-bold',
        cancelBtn: 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300',
        icon: <FiCheckCircle className="w-6 h-6 sm:w-7 sm:h-7" />,
      };
    case 'info':
      return {
        type,
        cardBg: 'bg-white dark:bg-[#0c0d14] text-slate-800 dark:text-slate-100 shadow-xl border border-slate-100 dark:border-[#1f2235]/60',
        bg: 'bg-sky-50 dark:bg-sky-500/10',
        text: 'text-sky-600 dark:text-sky-400',
        border: 'border-sky-100 dark:border-sky-500/20',
        titleText: 'text-slate-800 dark:text-slate-100',
        messageText: 'text-slate-500 dark:text-slate-450',
        btn: 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-500/20 font-bold',
        cancelBtn: 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300',
        icon: <FiInfo className="w-6 h-6 sm:w-7 sm:h-7" />,
      };
    case 'warning':
    default:
      return {
        type: 'warning',
        cardBg: 'bg-white dark:bg-[#0c0d14] text-slate-800 dark:text-slate-100 shadow-xl border border-slate-100 dark:border-[#1f2235]/60',
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-100 dark:border-amber-500/20',
        titleText: 'text-slate-800 dark:text-slate-100',
        messageText: 'text-slate-500 dark:text-slate-450',
        btn: 'bg-amber-500 hover:bg-amber-400 text-white shadow-md shadow-amber-500/20 font-bold',
        cancelBtn: 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300',
        icon: <FiAlertTriangle className="w-6 h-6 sm:w-7 sm:h-7" />,
      };
  }
};