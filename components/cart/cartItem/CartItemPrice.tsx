// مسئول محاسبات و نمایش بخش قیمت و تخفیف با فرمت فارسی

interface CartItemPriceProps {
  price: number;
  discount?: number;
}

export default function CartItemPrice({ price, discount }: CartItemPriceProps) {
  return (
    <div className="text-left flex flex-col justify-end items-end shrink-0 gap-1 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100 dark:border-zinc-800">
      {discount && (
        <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-md">
          {discount.toLocaleString("fa-IR")} تومان تخفیف
        </span>
      )}

      <div className="text-zinc-800 dark:text-zinc-100">
        <span className="font-black text-lg sm:text-xl">
          {price.toLocaleString("fa-IR")}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400 mr-1">تومان</span>
      </div>
    </div>
  );
}