// باکس هشدار زرد رنگ انتهای فاکتور

import { FiInfo } from "react-icons/fi";

export default function CartSummaryNotice() {
  return (
    <div className="flex gap-2.5 text-xs leading-6 bg-amber-50/60 dark:bg-amber-950/10 border border-amber-100/60 dark:border-amber-900/20 p-3.5 rounded-xl text-amber-800 dark:text-amber-300">
      <FiInfo className="shrink-0 mt-0.5" size={15} />
      <p>
        کاربر گرامی خرید شما هنوز نهایی نشده است. برای ثبت نهایی و ارسال، مراحل خرید را تکمیل کنید.
      </p>
    </div>
  );
}