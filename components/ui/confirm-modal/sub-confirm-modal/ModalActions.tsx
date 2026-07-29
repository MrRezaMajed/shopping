// components/confirm-modal/sub-confirm-modal/ModalActions.tsx

import { ModalTheme } from '../types';

interface ModalActionsProps {
  theme: ModalTheme;
  confirmText?: string;
  cancelText?: string;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ModalActions({
  theme,
  confirmText,
  cancelText,
  isProcessing,
  onConfirm,
  onCancel,
}: ModalActionsProps) {
  const isDanger = theme.type === 'error' || theme.type === 'danger';

  return (
    <div className="flex gap-3 w-full">
      {/* دکمه تایید */}
      <button
        onClick={onConfirm}
        disabled={isProcessing}
        className={`
          flex-grow-[2] py-2.5 sm:py-3 px-4 rounded-xl text-xs font-extrabold cursor-pointer
          transition-all duration-200 flex items-center justify-center gap-2
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          ${isDanger ? 'focus-visible:ring-white' : 'focus-visible:ring-indigo-500'}
          ${theme.btn}
          ${isProcessing ? 'opacity-80 cursor-not-allowed' : 'active:scale-[0.97]'}
        `}
      >
        {isProcessing ? (
          <span className="flex items-center gap-1.5">
            <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            در حال حذف...
          </span>
        ) : (
          confirmText || 'تایید'
        )}
      </button>
      
      {/* دکمه انصراف */}
      <button
        onClick={onCancel}
        disabled={isProcessing}
        className={`
          flex-1 py-2.5 sm:py-3 px-4 rounded-xl text-xs font-extrabold cursor-pointer
          transition-all duration-200 active:scale-[0.97]
          focus-visible:outline-none focus-visible:ring-2
          ${isDanger ? 'focus-visible:ring-white/50' : 'focus-visible:ring-indigo-500/50'}
          ${theme.cancelBtn}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {cancelText || 'انصراف'}
      </button>
    </div>
  );
}