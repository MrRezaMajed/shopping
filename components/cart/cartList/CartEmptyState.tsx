// کامپوننت سبد خرید خالی

import { FiInbox } from "react-icons/fi";

export default function CartEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800/80 p-6">
      <div className="p-4 bg-zinc-50 dark:bg-zinc-850 rounded-full text-zinc-400 dark:text-zinc-500">
        <FiInbox className="w-10 h-10" />
      </div>
      <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100">
        سبد خرید شما خالی است!
      </h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs leading-6">
        می‌توانید برای مشاهده محصولات و افزودن مجدد آن‌ها به سبد خرید، به صفحه اصلی فروشگاه مراجعه کنید.
      </p>
    </div>
  );
}