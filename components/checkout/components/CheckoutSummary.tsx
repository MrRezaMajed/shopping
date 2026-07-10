// خلاصه سبد خرید مرحله اول

'use client';
import SummaryRow from "./SummaryRow";

interface CheckoutSummaryProps {
  cartPrice: number;
  discount: number;
  shipping: number;
  total: number;
  canContinue: boolean;
}

export default function CheckoutSummary({
  cartPrice,
  discount,
  shipping,
  total,
  canContinue,
}: CheckoutSummaryProps) {
  // فرمت‌دهی مقادیر عددی به فونت فارسی به همراه درج کلمه تومان
  const formattedCartPrice = cartPrice.toLocaleString("fa-IR") + " تومان";
  const formattedDiscount = discount.toLocaleString("fa-IR") + "- تومان";
  const formattedSubtotal = (cartPrice - discount).toLocaleString("fa-IR") + " تومان";
  const formattedShipping = shipping.toLocaleString("fa-IR") + " تومان";
  const formattedTotal = total.toLocaleString("fa-IR") + " تومان";

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm text-right border border-slate-100 dark:border-slate-800/80 space-y-4" dir="rtl">
      
      {/* سطر قیمت اصلی کالاها */}
      <SummaryRow 
        label="قیمت کالاها" 
        value={formattedCartPrice} 
      />
      
      {/* سطر تخفیف با استایل قرمز رنگ */}
      <SummaryRow 
        label="تخفیف کالاها" 
        value={formattedDiscount} 
        className="text-rose-600 dark:text-rose-400 font-bold" 
      />

      <hr className="border-slate-100 dark:border-slate-800" />

      {/* سطر جمع سبد خرید با فونت پررنگ */}
      <SummaryRow 
        label="جمع سبد خرید" 
        value={formattedSubtotal} 
        className="font-bold text-slate-800 dark:text-slate-100" 
      />

      {/* سطر هزینه ارسال با استایل زرد/نارنجی رنگ */}
      <SummaryRow 
        label="هزینه ارسال" 
        value={formattedShipping} 
        className="text-amber-600 dark:text-amber-400 font-bold" 
      />

      <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-normal bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl">
        کالاها بر اساس نوع ارسال انتخاب شده ارسال خواهند شد.
      </p>

      <hr className="border-slate-100 dark:border-slate-800" />

      {/* بخش نهایی قابل پرداخت فاکتور */}
      <div className="flex justify-between items-center font-extrabold text-lg text-slate-900 dark:text-white">
        <span>مبلغ قابل پرداخت</span>
        <span>{formattedTotal}</span>
      </div>

      {canContinue ? (
        <a
          href="/payment"
          className="block bg-rose-600 dark:bg-rose-500 hover:bg-rose-700 dark:hover:bg-rose-600 text-white text-center py-3 rounded-xl font-bold text-sm mt-3 transition shadow-sm active:scale-[0.98]"
        >
          ادامه فرآیند خرید
        </a>
      ) : (
        <button
          className="
            border-2 border-yellow-500/80 text-yellow-600 dark:text-yellow-400 dark:border-yellow-450/70
            w-full py-2.5 rounded-xl font-bold text-xs mt-3
            hover:bg-yellow-500 hover:text-white dark:hover:bg-yellow-400 dark:hover:text-slate-950
            transition duration-200 active:scale-[0.98]
          "
        >
          آدرس و نحوه ارسال را انتخاب کنید
        </button>
      )}
    </div>
  );
}