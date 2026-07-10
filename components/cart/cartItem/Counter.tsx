'use client';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';

interface CounterProps {
  count: number;
  stock: number;
  onInc: () => void;
  onDec: () => void;
  onDelete: () => void;
}

export default function Counter({ count, stock, onInc, onDec, onDelete }: CounterProps) {
  // تبدیل عدد شمارشگر به فارسی
  const persianCount = count.toLocaleString('fa-IR');

  return (
    <div
      className="
        flex items-center gap-1.5
        p-1
        border border-zinc-200 dark:border-zinc-800
        rounded-xl
        bg-zinc-50/50 dark:bg-zinc-950/20
        w-fit
        transition-all duration-300
      "
    >
      {/* دکمه افزایش */}
      <button
        onClick={onInc}
        disabled={count >= stock}
        className="
          w-8 h-8 flex items-center justify-center
          rounded-lg
          text-zinc-700 dark:text-zinc-300
          hover:bg-white dark:hover:bg-zinc-800
          hover:shadow-sm
          disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none
          active:scale-90
          transition-all duration-200
        "
        aria-label="افزایش تعداد"
      >
        <FiPlus size={16} />
      </button>

      {/* نمایش عدد به فارسی */}
      <span className="px-3 select-none text-sm font-bold text-zinc-800 dark:text-zinc-100 min-w-6 text-center">
        {persianCount}
      </span>

      {/* دکمه کاهش یا حذف */}
      {count > 1 ? (
        <button
          onClick={onDec}
          className="
            w-8 h-8 flex items-center justify-center
            rounded-lg
            text-zinc-700 dark:text-zinc-300
            hover:bg-white dark:hover:bg-zinc-800
            hover:shadow-sm
            active:scale-90
            transition-all duration-200
          "
          aria-label="کاهش تعداد"
        >
          <FiMinus size={16} />
        </button>
      ) : (
        <button
          onClick={onDelete}
          className="
            w-8 h-8 flex items-center justify-center
            rounded-lg
            text-rose-600 dark:text-rose-400
            hover:bg-rose-50 dark:hover:bg-rose-950/30
            active:scale-90
            transition-all duration-200
          "
          aria-label="حذف از سبد خرید"
        >
          <FiTrash2 size={15} />
        </button>
      )}
    </div>
  );
}