// خلاصه پرداخت نهایی

'use client';
import { FaInfoCircle } from "react-icons/fa";
import SummaryRow from "./SummaryRow";

export default function CartSummary() {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm space-y-4 text-sm h-auto border border-gray-100 dark:border-gray-800/80 text-right">
      <SummaryRow label="قیمت کالاها (۲)" value="۳۹۸,۰۰۰ تومان" />
      
      <SummaryRow 
        label="تخفیف کالاها" 
        value="۷۸,۰۰۰- تومان" 
        className="text-rose-600 dark:text-rose-400 font-bold" 
      />

      <hr className="border-gray-100 dark:border-gray-800" />

      <SummaryRow 
        label="جمع سبد خرید" 
        value="۳۲۰,۰۰۰ تومان" 
        className="font-bold text-gray-800 dark:text-gray-100" 
      />

      <SummaryRow 
        label="هزینه ارسال" 
        value="۵۴,۰۰۰ تومان" 
        className="text-amber-600 dark:text-amber-400 font-semibold" 
      />

      <SummaryRow 
        label="تخفیف اعمال شده" 
        value="۱۰۰,۰۰۰- تومان" 
        className="text-rose-500 dark:text-rose-400 font-medium" 
      />

      <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
        <FaInfoCircle className="text-gray-400 dark:text-gray-500 text-sm shrink-0 mt-0.5" />
        <span>
          کاربر گرامی، کالاها بر اساس نوع ارسالی که انتخاب می‌کنید در مدت زمان ذکر شده ارسال می‌شود.
        </span>
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      <div className="flex justify-between items-center font-extrabold text-lg text-gray-900 dark:text-white">
        <span>مبلغ قابل پرداخت</span>
        <span>۲۷۴,۰۰۰ تومان</span>
      </div>

      <button
        className="
          w-full border border-yellow-500 dark:border-yellow-400
          text-yellow-600 dark:text-yellow-400
          hover:bg-yellow-500 dark:hover:bg-yellow-450
          hover:text-white dark:hover:text-slate-950
          py-3 rounded-xl text-center font-bold text-sm mt-2
          transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]
        "
      >
        نوع پرداخت را انتخاب کنید
      </button>

      <button className="w-full bg-rose-600 dark:bg-rose-500 hover:bg-rose-700 dark:hover:bg-rose-600 text-white py-3 rounded-xl font-bold text-sm mt-2 hidden transition active:scale-[0.98]">
        ثبت سفارش و گرفتن کد رهگیری
      </button>
    </div>
  );
}