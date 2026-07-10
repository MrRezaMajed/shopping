// کارت‌های ناوبری جانبی و پایینی

import React from "react";
import { useRouter } from "next/navigation";
import { FiFolder, FiTag, FiTrendingUp, FiBox } from "react-icons/fi";
import { toPersianNumber } from "@/lib/utils/persianNumbers";

interface NavigationCardsProps {
  categoriesCount: number;
  brandsCount: number;
  lowStockCount: number;
}

export const NavigationCards = React.memo(function NavigationCards({
  categoriesCount,
  brandsCount,
  lowStockCount,
}: NavigationCardsProps) {
  const router = useRouter();

  const actionCards = React.useMemo(() => [
    {
      title: "دسته‌بندی‌ها",
      subtitle: "مدیریت دسته‌بندی محصولات",
      link: "/dashboard/categories",
      icon: <FiFolder className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />,
      iconBg: "bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 dark:border-indigo-500/20",
      badge: categoriesCount > 0 ? `${toPersianNumber(categoriesCount)} دسته‌بندی فعال` : "بدون دسته‌بندی",
      badgeClass: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/20 dark:border-indigo-500/10"
    },
    {
      title: "برندها",
      subtitle: "مدیریت برندهای محصولات",
      link: "/dashboard/brands",
      icon: <FiTag className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />,
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/20",
      badge: brandsCount > 0 ? `${toPersianNumber(brandsCount)} برند ثبت شده` : "بدون برند",
      badgeClass: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100/20 dark:border-emerald-500/10"
    },
    {
      title: "آمار فروش",
      subtitle: "گزارش‌های فروش محصولات",
      link: "/dashboard",
      icon: <FiTrendingUp className="h-5 w-5 text-purple-500 dark:text-purple-400" />,
      iconBg: "bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/20 dark:border-purple-500/20",
      badge: "بروزرسانی ۲۴ ساعت گذشته",
      badgeClass: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100/20 dark:border-purple-500/10"
    },
    {
      title: "موجودی انبار",
      subtitle: "مدیریت موجودی محصولات",
      link: "/dashboard/products",
      icon: <FiBox className="h-5 w-5 text-amber-500 dark:text-amber-400" />,
      iconBg: "bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 dark:border-amber-500/20",
      badge: lowStockCount > 0 ? `${toPersianNumber(lowStockCount)} کالا نیاز به شارژ` : "موجودی انبار پایدار",
      badgeClass: lowStockCount > 0 
        ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100/20 dark:border-rose-500/10 animate-pulse" 
        : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100/20 dark:border-emerald-500/10"
    }
  ], [categoriesCount, brandsCount, lowStockCount]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200/50 dark:border-[#1f2235]/60">
      {actionCards.map((card, idx) => (
        <div
          key={idx}
          onClick={() => router.push(card.link)}
          className="
            relative group/card cursor-pointer rounded-2xl p-5 overflow-hidden 
            bg-white/60 dark:bg-[#121420]/40 
            backdrop-blur-xl
            border border-slate-200/50 dark:border-[#1f2235]/50 
            hover:border-indigo-500/30 dark:hover:border-indigo-500/40
            shadow-[0_4px_25px_rgba(0,0,0,0.01)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]
            hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_12px_45px_rgba(0,0,0,0.4)]
            transition-all duration-350 hover:-translate-y-1 flex items-center justify-between
          "
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

          <div className="space-y-1 text-right">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors">
              {card.title}
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-450 leading-relaxed font-semibold">
              {card.subtitle}
            </p>
            {card.badge && (
              <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-lg text-[9px] font-bold border ${card.badgeClass}`}>
                {card.badge}
              </span>
            )}
          </div>

          <div className={`p-3.5 rounded-2xl ${card.iconBg} group-hover/card:scale-105 transition-all duration-300 flex items-center justify-center shrink-0`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
});