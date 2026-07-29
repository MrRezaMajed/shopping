'use client';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ConfirmModalProps } from './types';
import { getThemeColors } from './theme';
import ModalHeader from './sub-confirm-modal/ModalHeader';
import ModalActions from './sub-confirm-modal/ModalActions';
import ModalIcon from './sub-confirm-modal/ModalIcon';

export default function ConfirmModal({ options, onClose }: ConfirmModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // فعال کردن انیمیشن ورود بعد از اولین رندر کلاینت
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleConfirm = useCallback(() => {
    setIsProcessing(true);
    onClose(true);
  }, [onClose]);

  const handleCancel = useCallback(() => {
    setIsMounted(false);
    // تأخیر کوتاه برای اجرای کامل انیمیشن خروج قبل از دِمانت شدن نهایی
    setTimeout(() => {
      onClose(false);
    }, 200);
  }, [onClose]);

  // ۱. پشتیبانی از کلید میانبر Escape روی کیبورد
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProcessing, handleCancel]);

  // دریافت اطلاعات تم بصری متناسب با نوع عملیات
  const theme = useMemo(() => getThemeColors(options.type), [options.type]);
  const isDanger = theme.type === 'error' || theme.type === 'danger';

  // ۲. قفل کردن حرکت کلید Tab روی دکمه‌های مودال (Focus Trap)
  useEffect(() => {
    if (!isMounted) return;

    // به صورت خودکار روی دکمه مناسب فوکوس اولیه قرار داده می‌شود
    const elements = cardRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (elements && elements.length > 0) {
      // در عملیات حساس حذفی، فوکوس اولیه روی دکمه انصراف قرار می‌گیرد تا از تایید تصادفی جلوگیری شود
      const targetFocus = isDanger ? elements[elements.length - 1] : elements[0];
      targetFocus?.focus();
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = cardRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // حرکت رو به عقب (Shift + Tab)
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // حرکت رو به جلو (Tab)
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleTabKey);
    return () => window.removeEventListener('keydown', handleTabKey);
  }, [isMounted, isDanger]);

  return (
    <motion.div
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: isMounted ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className={`
        /* لایه شفاف پشتی با مسدودسازی کلیک روی اجزای زیرین */
        fixed inset-0 z-[100] flex items-center justify-center p-4
        bg-transparent
        ${isMounted ? 'pointer-events-auto' : 'pointer-events-none'}
      `}
    >
      {/* استفاده از حرکت‌های فیزیک فنر برای بدنه مدال با ابعاد عریض‌تر و لوکس‌تر */}
      <motion.div
        ref={cardRef}
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ 
          scale: isMounted ? 1 : 0.95, 
          y: isMounted ? 0 : 15, 
          opacity: isMounted ? 1 : 0 
        }}
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
        className={`
          /* عرض به ۴۴۰ الی ۴۸۰ پیکسل ارتقا یافته و پدینگ داخلی افزایش پیدا کرده است */
          w-full max-w-[440px] sm:max-w-[480px] p-6 sm:p-8 rounded-3xl transition-transform duration-300
          ${theme.cardBg}
          ${isDanger ? 'hover:-translate-y-1' : 'hover:shadow-2xl dark:hover:shadow-indigo-950/5'}
        `}
      >
        <div className="flex flex-col items-center text-center">
          
          <ModalIcon theme={theme} />
          
          <ModalHeader 
            title={options.title} 
            message={options.message} 
            theme={theme}
          />
          
          <div className="w-full">
            <ModalActions
              theme={theme}
              confirmText={options.confirmText}
              cancelText={options.cancelText}
              isProcessing={isProcessing}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}