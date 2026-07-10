// components/Notification/NotificationContent.tsx
import React from 'react';

interface NotificationContentProps {
  title: string;
  message?: string;
}

export default function NotificationContent({ title, message }: NotificationContentProps) {
  return (
    <div className="flex-grow min-w-0 pr-0.5">
      <h4 className="text-[13.5px] font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-snug">
        {title}
      </h4>
      {message && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          {message}
        </p>
      )}
    </div>
  );
}