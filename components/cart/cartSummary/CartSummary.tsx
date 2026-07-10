"use client";
import { FiArrowLeft, FiShoppingBag } from "react-icons/fi";
import CartSummaryRow from "./CartSummaryRow";
import CartSummaryNotice from "./CartSummaryNotice";

interface CartSummaryProps {
  itemCount: number;
  totalPrice: number;
  discount?: number;
  shipping?: number;
  canContinue?: boolean;
}

export default function CartSummary({
  itemCount,
  totalPrice,
  discount = 0,
  shipping = 0,
  canContinue = false,
}: CartSummaryProps) {
  const finalPrice = totalPrice - discount + shipping;

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm space-y-5 text-right transition-colors">
      <h3 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 pb-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
        <FiShoppingBag size={16} />
        خلاصه سبد خرید
      </h3>

      <div className="space-y-4">
        <CartSummaryRow
          label={`قیمت کالاها (${itemCount.toLocaleString("fa-IR")})`}
          value={totalPrice.toLocaleString("fa-IR")}
        />

        {discount > 0 && (
          <CartSummaryRow
            label="تخفیف کالاها"
            value={discount.toLocaleString("fa-IR")}
            isDiscount
          />
        )}

        {shipping > 0 && (
          <CartSummaryRow
            label="هزینه ارسال"
            value={shipping.toLocaleString("fa-IR")}
          />
        )}
      </div>

      <hr className="border-zinc-100 dark:border-zinc-800" />

      {/* بخش مبلغ نهایی قابل پرداخت */}
      <div className="flex justify-between items-center py-1">
        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
          مبلغ قابل پرداخت:
        </span>
        <div className="text-zinc-900 dark:text-white">
          <span className="text-xl font-black">{finalPrice.toLocaleString("fa-IR")}</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mr-1">تومان</span>
        </div>
      </div>

      <CartSummaryNotice />

      <button
        className={`
          w-full py-3.5 px-4 rounded-xl mt-2
          font-bold text-sm
          flex items-center justify-center gap-2
          transition-all duration-350 active:scale-[0.98]
          ${
            canContinue
              ? "bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white shadow-lg shadow-brand-600/10 hover:shadow-brand-600/20"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
          }
        `}
        disabled={!canContinue}
      >
        <span>تکمیل فرآیند خرید</span>
        <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
      </button>
    </div>
  );
}