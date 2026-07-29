// components/confirm-modal/sub-confirm-modal/ModalIcon.tsx

import { ModalTheme } from '../types';

interface ModalIconProps {
  theme: ModalTheme;
}

export default function ModalIcon({ theme }: ModalIconProps) {
  // نقشه‌راه رنگ پالس متناسب با هر نوع تم برای لایت و دارک مود
  const pulseColorMap: Record<string, string> = {
    danger: 'bg-rose-500 dark:bg-rose-400',
    error: 'bg-rose-500 dark:bg-rose-400',
    success: 'bg-emerald-500 dark:bg-emerald-400',
    info: 'bg-sky-500 dark:bg-sky-400',
    warning: 'bg-amber-500 dark:bg-amber-400',
  };

  const pulseColor = pulseColorMap[theme.type] || 'bg-slate-500';

  return (
    <div className="relative mb-4 flex items-center justify-center">
      {/* پالس بیرونی هماهنگ با تم (باعث ایجاد افکت ضربان قلب در هر دو حالت لایت و دارک می‌شود) */}
      <div 
        className={`
          absolute inset-0 rounded-2xl animate-ping opacity-25
          ${pulseColor}
        `}
        style={{ animationDuration: '2.5s' }}
      />
      
      <div 
        className={`
          relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border
          transition-all duration-300
          ${theme.bg} ${theme.text} ${theme.border}
          shadow-sm
        `}
      >
        {theme.icon}
      </div>
    </div>
  );
}