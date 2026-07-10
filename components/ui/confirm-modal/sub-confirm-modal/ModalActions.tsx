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
  return (
    <div className="flex gap-3 w-full">
      <button
        onClick={onConfirm}
        disabled={isProcessing}
        className={`
          flex-grow-[2] py-3 rounded-xl text-xs font-bold shadow-md cursor-pointer 
          active:scale-[0.98] transition-all flex items-center justify-center gap-2
          ${theme.btn} 
          ${isProcessing ? 'opacity-80 cursor-not-allowed' : ''}
        `}
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            در حال حذف...
          </>
        ) : (
          confirmText || 'تایید'
        )}
      </button>
      
      <button
        onClick={onCancel}
        disabled={isProcessing}
        className="
          flex-1 py-3 rounded-xl text-xs font-bold 
          bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 
          text-slate-600 dark:text-slate-300 cursor-pointer active:scale-[0.98] transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {cancelText || 'انصراف'}
      </button>
    </div>
  );
}