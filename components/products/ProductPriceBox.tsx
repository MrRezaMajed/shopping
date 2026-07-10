'use client';
import { FC } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const ProductPriceBox: FC = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-5 transition-colors">
      <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 pb-2 border-b border-zinc-100 dark:border-zinc-800">
        خلاصه فاکتور خرید
      </h3>

      {/* قیمت کالا */}
      <div className="flex justify-between items-center text-sm text-zinc-600 dark:text-zinc-400">
        <p>قیمت کالا</p>
        <p className="font-semibold text-zinc-800 dark:text-zinc-200">1,326,000 <span className="text-[11px] font-normal">تومان</span></p>
      </div>

      {/* تخفیف */}
      <div className="flex justify-between items-center text-sm">
        <p className="text-zinc-600 dark:text-zinc-400">تخفیف فروشگاه</p>
        <p className="font-bold text-rose-600 dark:text-rose-400">260,000- <span className="text-[11px] font-normal">تومان</span></p>
      </div>

      <div className="border-b border-zinc-100 dark:border-zinc-800"></div>

      {/* قیمت نهایی */}
      <div className="flex justify-between items-center py-1">
        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">مبلغ قابل پرداخت:</span>
        <div className="text-left">
          <span className="text-xl font-black text-zinc-900 dark:text-white">
            1,066,000
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mr-1">تومان</span>
        </div>
      </div>

      {/* دکمه خرید نهایی */}
      <button className="w-full bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white py-3.5 rounded-xl flex items-center justify-center gap-2 text-base font-bold shadow-lg shadow-rose-600/10 hover:shadow-rose-600/25 transition-all">
        <FaShoppingCart className="animate-pulse" size={18} />
        افزودن به سبد خرید
      </button>

      <p className="text-[11px] text-center text-zinc-400 dark:text-zinc-500">
        ۷ روز ضمانت بازگشت کالا • پشتیبانی ۲۴ ساعته
      </p>
    </div>
  );
};

export default ProductPriceBox;