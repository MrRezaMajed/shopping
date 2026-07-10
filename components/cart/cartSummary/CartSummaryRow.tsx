// برای رندر داینامیک سطرهای فاکتور بدون کدهای تکراری

interface CartSummaryRowProps {
  label: string;
  value: string;
  isDiscount?: boolean;
}

export default function CartSummaryRow({
  label,
  value,
  isDiscount = false,
}: CartSummaryRowProps) {
  const valueColorClass = isDiscount
    ? "text-brand-600 dark:text-brand-400 font-bold"
    : "text-zinc-800 dark:text-zinc-200 font-semibold";

  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className={valueColorClass}>
        {value} <span className="text-[10px] font-normal text-zinc-500">تومان</span>
      </span>
    </div>
  );
}