'use client';
import { useEffect, useState } from 'react';
import { ConfirmModalProps } from './types';
import { getThemeColors } from './theme';
import ModalIcon from './sub-confirm-modal/ModalIcon';
import ModalHeader from './sub-confirm-modal/ModalHeader';
import ModalActions from './sub-confirm-modal/ModalActions';

export default function ConfirmModal({ options, onClose }: ConfirmModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleConfirm = () => {
    setIsProcessing(true);
    onClose(true);
  };

  const handleCancel = () => {
    setIsMounted(false);
    setTimeout(() => {
      onClose(false);
    }, 200);
  };

  const theme = getThemeColors(options.type);

  return (
    <div
      dir="rtl"
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent
        transition-all duration-300
        ${isMounted ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div
        className={`
          w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800/80
          transition-all duration-300 transform
          ${isMounted ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4'}
        `}
      >
        <div className="flex flex-col items-center text-center">
          <ModalIcon theme={theme} />
          
          <ModalHeader 
            title={options.title} 
            message={options.message} 
          />
          
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
    </div>
  );
}