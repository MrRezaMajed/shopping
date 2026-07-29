// components/confirm-modal/sub-confirm-modal/ModalHeader.tsx

import { ModalTheme } from '../types';

interface ModalHeaderProps {
  title: string;
  message?: string;
  theme: ModalTheme;
}

export default function ModalHeader({ title, message, theme }: ModalHeaderProps) {
  return (
    <div className="mb-6 space-y-2">
      <h3 className={`text-base sm:text-lg font-black tracking-tight leading-snug ${theme.titleText}`}>
        {title}
      </h3>
      {message && (
        <p className={`
          text-[11px] sm:text-xs leading-relaxed font-semibold mx-auto 
          /* افزایش محدودیت عرض متن متناسب با عرض جدید کارت مودال */
          max-w-[340px] sm:max-w-[400px] 
          ${theme.messageText}
        `}>
          {message}
        </p>
      )}
    </div>
  );
}