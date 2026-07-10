// بنر مشترک پیام‌ها و هشدارهای آبی‌رنگ

import { FaInfoCircle } from "react-icons/fa";

interface InfoBannerProps {
  message: string;
}

export default function InfoBanner({ message }: InfoBannerProps) {
  return (
    <div className="flex items-start gap-2.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/80 dark:border-blue-900/40 p-3.5 rounded-2xl text-blue-700 dark:text-blue-400 text-xs leading-relaxed text-right" dir="rtl">
      <FaInfoCircle className="text-sm shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}