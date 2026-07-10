// کارت تکی روش پرداخت

"use client";
import React from "react";

interface PaymentCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
}

export default function PaymentCard({
  icon,
  title,
  subtitle,
  value,
  checked,
  onChange,
}: PaymentCardProps) {
  return (
    <label className="relative block cursor-pointer group h-full select-none text-right" dir="rtl">
      {/* رادیوباکس جهت مدیریت وضعیت */}
      <input
        type="radio"
        name="payment_type"
        value={value}
        checked={checked}
        onChange={() => onChange?.(value)}
        className="sr-only peer"
      />

      {/* بدنه اصلی کارت */}
      <div className="
        flex flex-col h-full p-5 rounded-2xl border-2 transition-all duration-300
        bg-white dark:bg-gray-900 
        border-slate-100 dark:border-slate-800/80
        hover:border-slate-350 dark:hover:border-slate-700
        peer-checked:border-blue-600 dark:peer-checked:border-blue-500
        peer-checked:bg-blue-50/10 dark:peer-checked:bg-blue-950/20
        peer-checked:shadow-md peer-checked:shadow-blue-500/5
        peer-checked:[&_.icon-box]:bg-blue-600 dark:peer-checked:[&_.icon-box]:bg-blue-500
        peer-checked:[&_.icon-box]:text-white
        peer-checked:[&_.radio-circle]:border-blue-600 dark:peer-checked:[&_.radio-circle]:border-blue-500
        peer-checked:[&_.radio-dot]:scale-100
      ">
        {/* ردیف اول: آیکون و نشانگر رادیو */}
        <div className="flex justify-between items-start mb-5">
          <div className="icon-box w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <span className="text-lg flex items-center justify-center">{icon}</span>
          </div>

          {/* دایره رادیویی سفارشی */}
          <div className="radio-circle w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
            <span className="radio-dot w-2.5 h-2.5 rounded-full bg-white transition-transform duration-300 scale-0" />
          </div>
        </div>

        {/* متون کارت */}
        <div className="space-y-1 mt-auto">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
            {title}
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>
      </div>
    </label>
  );
}