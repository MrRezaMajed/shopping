"use client";

import Image from "next/image";
import { FaTrashAlt, FaStoreAlt, FaShieldAlt } from "react-icons/fa";

type FavoriteItemProps = {
  item: {
    id: number | string;
    title: string;
    image: string;
    colorName: string;
    colorCode: string;
    warranty: string;
    stock: string;
    discount?: number;
    price: number;
  };
  onRemoveAction: (id: number | string) => void;
};

export default function FavoriteItem({ item, onRemoveAction }: FavoriteItemProps) {
  return (
    <section className="
      p-5 rounded-2xl relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all duration-300 border text-right
      border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 
      hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm
    ">

      {/* تصویر کالا و مشخصات سمت راست */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 w-full">
        {/* تصویر کالا با کادر بهینه شده */}
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 shrink-0 border border-slate-100 dark:border-slate-850">
          <Image
            src={item.image}
            alt={item.title}
            width={96}
            height={96}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* اطلاعات کالا */}
        <div className="space-y-2 text-right">
          <p className="font-bold text-slate-850 dark:text-slate-150 text-sm sm:text-base leading-relaxed">
            {item.title}
          </p>

          {/* تگ دایره‌ای رنگ کالا */}
          <div className="flex items-center mt-1">
            <span
              style={{ backgroundColor: item.colorCode }}
              className="w-3.5 h-3.5 rounded-full ml-2 border border-slate-200 dark:border-slate-700 block shrink-0"
            />
            <span className="text-xs text-slate-600 dark:text-slate-350 font-medium">
              {item.colorName}
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <p className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-1.5">
              <FaShieldAlt className="text-slate-450 shrink-0" />
              <span>{item.warranty}</span>
            </p>

            <p className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-1.5">
              <FaStoreAlt className="text-slate-450 shrink-0" />
              <span>{item.stock}</span>
            </p>
          </div>

          {/* دکمه حذف فلت مدرن با ترنزیشن ملایم */}
          <button
            onClick={() => onRemoveAction(item.id)}
            className="
              flex items-center text-rose-600 dark:text-rose-400 hover:text-rose-750 dark:hover:text-rose-350 
              text-xs font-bold gap-1.5 pt-1 transition active:scale-95
            "
            aria-label={`حذف ${item.title} از لیست علاقه‌ها`}
          >
            <FaTrashAlt className="text-xs" />
            حذف از لیست علاقه‌ها
          </button>
        </div>
      </div>

      {/* بخش قیمت و تخفیف در منتهی‌الیه سمت چپ (بدون هم‌پوشانی) */}
      <div className="flex flex-col items-end sm:items-left justify-center shrink-0 self-end sm:self-center text-left pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50 dark:border-slate-800/40 w-full sm:w-auto">
        {item.discount && (
          <span className="
            inline-block text-rose-600 dark:text-rose-400 text-xs font-extrabold 
            bg-rose-50 dark:bg-rose-950/30 px-2.5 py-1 rounded-lg mb-1.5
          ">
            تخفیف {item.discount.toLocaleString()}%
          </span>
        )}
        <span className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg whitespace-nowrap">
          {item.price.toLocaleString()} <span className="text-xs font-normal text-slate-400">تومان</span>
        </span>
      </div>
    </section>
  );
}