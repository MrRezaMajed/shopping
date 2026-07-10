'use client';

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
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm text-right border border-slate-100 dark:border-slate-800/80 space-y-4">
      
      <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm">
        <span className="font-medium">قیمت کالاها</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{cartPrice.toLocaleString()} تومان</span>
      </div>

      <div className="flex justify-between items-center text-rose-600 dark:text-rose-400 font-bold text-sm">
        <span>تخفیف کالاها</span>
        <span>{discount.toLocaleString()}- تومان</span>
      </div>

      <hr className="border-slate-100 dark:border-slate-800" />

      <div className="flex justify-between items-center font-bold text-slate-800 dark:text-slate-100 text-sm">
        <span>جمع سبد خرید</span>
        <span>{(cartPrice - discount).toLocaleString()} تومان</span>
      </div>

      <div className="flex justify-between items-center text-amber-600 dark:text-amber-400 font-bold text-sm">
        <span>هزینه ارسال</span>
        <span>{shipping.toLocaleString()} تومان</span>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-normal bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl">
        کالاها بر اساس نوع ارسال انتخاب شده ارسال خواهند شد.
      </p>

      <hr className="border-slate-100 dark:border-slate-800" />

      <div className="flex justify-between items-center font-extrabold text-lg text-slate-900 dark:text-white">
        <span>مبلغ قابل پرداخت</span>
        <span>{total.toLocaleString()} تومان</span>
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