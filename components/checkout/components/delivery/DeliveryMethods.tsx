// لیست روش‌های ارسال

'use client';
import DeliveryCard from "./DeliveryCard";
import InfoBanner from "../InfoBanner";

export interface DeliveryMethod {
  id: number;
  title: string;
  time: string;
}

interface DeliveryMethodsProps {
  methods: DeliveryMethod[];
  selected: number | null;
  onSelect: (id: number) => void;
}

export default function DeliveryMethods({ methods, selected, onSelect }: DeliveryMethodsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm text-right">
      <h2 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100">
        انتخاب نحوه ارسال
      </h2>

      <InfoBanner message="لطفاً مدت زمان ارسال را هنگام انتخاب روش ارسال در نظر بگیرید." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methods.map((m) => (
          <DeliveryCard
            key={m.id}
            method={m}
            isSelected={selected === m.id}
            onSelect={() => onSelect(m.id)}
          />
        ))}
      </div>
    </div>
  );
}