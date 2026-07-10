// 
import React from 'react';
import { NotificationType } from './constants';

const icons: Record<NotificationType, React.ReactNode> = {
  success: (
    <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 dark:text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
      <svg className="w-5.5 h-5.5 overflow-visible" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <circle 
          cx="12" cy="12" r="10" 
          className="swal2-success-circle"
          strokeDasharray="63" strokeDashoffset="63"
        />
        <path 
          strokeLinecap="round" strokeLinejoin="round" 
          d="M6 12.5l4 4 8-9" 
          className="swal2-success-check"
          strokeDasharray="20" strokeDashoffset="20"
        />
      </svg>
    </div>
  ),
  error: (
    <div className="swal2-error-container relative flex items-center justify-center w-11 h-11 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 text-rose-400 dark:text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path 
          strokeLinecap="round" strokeLinejoin="round" 
          d="M6 6l12 12" 
          className="swal2-error-line-1"
          strokeDasharray="18" strokeDashoffset="18"
        />
        <path 
          strokeLinecap="round" strokeLinejoin="round" 
          d="M18 6L6 18" 
          className="swal2-error-line-2"
          strokeDasharray="18" strokeDashoffset="18"
        />
      </svg>
    </div>
  ),
  warning: (
    <div className="swal2-warning-container relative flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-400 dark:text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5h.008v.008H12v-.008z" />
      </svg>
    </div>
  ),
  info: (
    <div className="swal2-info-container relative flex items-center justify-center w-11 h-11 rounded-xl bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/20 text-sky-400 dark:text-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    </div>
  ),
};

interface NotificationIconProps {
  type: NotificationType;
}

export default function NotificationIcon({ type }: NotificationIconProps) {
  return (
    <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
      {icons[type]}
    </div>
  );
}