// components/Notification/CloseButton.tsx

interface CloseButtonProps {
  onClick: () => void;
}

export default function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        flex-shrink-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 
        transition-all duration-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60
        hover:rotate-90 hover:scale-105 active:scale-95
      "
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}