// شامل ثابت‌ها، رنگ‌ها، گرادیان‌ها

import { Notification } from '@/context/NotificationContext';

// هماهنگ‌سازی خودکار تایپ با Context پروژه
export type NotificationType = Notification['type'];

export const typeStyles: Record<NotificationType, string> = {
  // موفقیت: پس‌زمینه لایت ۹۵٪ کدر و پس‌زمینه دارک ۹۰٪ کدر (سبز زمردی تیره و منسجم)
  success: 'border-emerald-500/15 dark:border-emerald-500/35 bg-white/95 dark:bg-emerald-950/90 hover:border-emerald-500/35 dark:hover:border-emerald-500/55',
  
  // خطا: پس‌زمینه لایت ۹۵٪ کدر و پس‌زمینه دارک ۹۵٪ کدر (تقریباً کاملاً مات)
  error: 'border-rose-500/15 bg-white/95 dark:bg-slate-950/95 hover:border-rose-500/35',
  
  // هشدار: پس‌زمینه لایت ۹۵٪ کدر و پس‌زمینه دارک ۹۵٪ کدر
  warning: 'border-amber-500/15 bg-white/95 dark:bg-slate-950/95 hover:border-amber-500/35',
  
  // اطلاعات: پس‌زمینه لایت ۹۵٪ کدر و پس‌زمینه دارک ۹۵٪ کدر
  info: 'border-sky-500/15 bg-white/95 dark:bg-slate-950/95 hover:border-sky-500/35',
};

export const glowColors: Record<NotificationType, string> = {
  success: 'rgba(16, 185, 129, 0.65)',
  error: 'rgba(244, 63, 94, 0.45)',
  warning: 'rgba(245, 158, 11, 0.45)',
  info: 'rgba(14, 165, 233, 0.45)',
};

export const progressGradients: Record<NotificationType, string> = {
  success: 'bg-gradient-to-l from-emerald-500 via-teal-400 to-transparent shadow-[0_0_12px_rgba(16,185,129,0.6)]',
  error: 'bg-gradient-to-l from-rose-500 via-orange-400 to-transparent shadow-[0_0_12px_rgba(244,63,94,0.6)]',
  warning: 'bg-gradient-to-l from-amber-500 via-yellow-400 to-transparent shadow-[0_0_12px_rgba(245,158,11,0.6)]',
  info: 'bg-gradient-to-l from-sky-500 via-indigo-400 to-transparent shadow-[0_0_12px_rgba(14,165,233,0.6)]',
};