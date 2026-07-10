// مسئول نمایش مشخصات (رنگ، گارانتی، وضعیت موجودی)

import { FiShield, FiCheckCircle } from "react-icons/fi";

interface CartItemDetailsProps {
  title: string;
  color?: string;
  colorName?: string;
  warranty?: string;
}

export default function CartItemDetails({
  title,
  color,
  colorName,
  warranty,
}: CartItemDetailsProps) {
  return (
    <div className="space-y-2 text-right">
      <h3 className="font-bold text-sm sm:text-base text-zinc-800 dark:text-zinc-100 leading-7">
        {title}
      </h3>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
        {/* رنگ انتخابی */}
        <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
          <span
            className="w-3.5 h-3.5 rounded-full border border-zinc-300 dark:border-zinc-600 block shadow-sm"
            style={{ backgroundColor: color || "#523e02" }}
          />
          <span>{colorName ?? "قهوه‌ای"}</span>
        </span>

        {/* گارانتی */}
        {warranty && (
          <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <FiShield className="text-zinc-400 dark:text-zinc-500" size={14} />
            <span>{warranty}</span>
          </span>
        )}

        {/* وضعیت موجودی */}
        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
          <FiCheckCircle size={14} />
          <span>موجود در انبار</span>
        </span>
      </div>
    </div>
  );
}