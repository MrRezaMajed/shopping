'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Notification, useNotification } from '@/context/NotificationContext';
import { typeStyles } from './constants';

import NotificationStyles from './NotificationStyles';
import AmbientGlow from './AmbientGlow';
import NotificationIcon from './NotificationIcon';
import NotificationContent from './NotificationContent';
import CloseButton from './CloseButton';
import ProgressBar from './ProgressBar';

export default function NotificationItem({ notification }: { notification: Notification }) {
  const { removeNotification } = useNotification();
  const [isClosing, setIsClosing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const duration = notification.duration || 4000;
  
  // حفظ دقیق زمان باقیمانده بدون تحمیل رندرهای اضافی به ری‌اکت
  const timeLeftRef = useRef(duration);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isPaused) {
      if (startTimeRef.current > 0) {
        const elapsed = Date.now() - startTimeRef.current;
        timeLeftRef.current = Math.max(0, timeLeftRef.current - elapsed);
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    } else {
      startTimeRef.current = Date.now();
      timeoutIdRef.current = setTimeout(() => {
        handleClose();
      }, timeLeftRef.current);
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [isPaused]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 280); // هماهنگ با انیمیشن خروج کارت
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`
        pointer-events-auto relative overflow-hidden flex items-center gap-4.5 p-4.5 rounded-2xl border backdrop-blur-2xl ring-1 ring-inset ring-white/10 dark:ring-white/5
        transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) w-full max-w-sm group
        hover:scale-[1.025] hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)]
        ${typeStyles[notification.type]}
        ${isClosing ? 'swal2-animate-toast-hide-modern' : 'swal2-animate-toast-show-modern'}
      `}
    >
      {/* استایل‌های مربوط به انیمیشن‌ها */}
      <NotificationStyles />

      {/* هاله پشت کارت */}
      <AmbientGlow type={notification.type} />

      {/* بخش آیکون داینامیک */}
      <NotificationIcon type={notification.type} />

      {/* بخش متنی با عنوان و متن پیام */}
      <NotificationContent title={notification.title} message={notification.message} />

      {/* دکمه خروج دستی */}
      <CloseButton onClick={handleClose} />

      {/* نوار زمان‌سنج پیشرفت */}
      <ProgressBar type={notification.type} duration={duration} isPaused={isPaused} />
    </div>
  );
}