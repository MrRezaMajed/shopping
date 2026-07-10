// کارت تکی انتخاب متد ارسال

import { FaShippingFast, FaCalendarAlt } from "react-icons/fa";
import { DeliveryMethod } from "./DeliveryMethods";

interface DeliveryCardProps {
  method: DeliveryMethod;
  isSelected: boolean;
  onSelect: () => void;
}

export default function DeliveryCard({ method, isSelected, onSelect }: DeliveryCardProps) {
  return (
    <label className="relative block cursor-pointer group h-full select-none">
      <input
        type="radio"
        name="delivery"
        checked={isSelected}
        className="sr-only peer"
        onChange={onSelect}
      />

      <div className="
        flex flex-col h-full p-5 rounded-2xl border-2 transition-all duration-300
        bg-white dark:bg-slate-900 text-right
        border-slate-100 dark:border-slate-800/80
        hover:border-slate-350 dark:hover:border-slate-700 hover:shadow-md
        peer-checked:border-blue-600 dark:peer-checked:border-blue-500
        peer-checked:bg-blue-50/10 dark:peer-checked:bg-blue-950/20
        peer-checked:shadow-lg peer-checked:shadow-blue-500/5
        peer-checked:[&_.circle-marker]:border-blue-600 dark:peer-checked:[&_.circle-marker]:border-blue-500
        peer-checked:[&_.circle-marker]:bg-blue-600 dark:peer-checked:[&_.circle-marker]:bg-blue-500
        peer-checked:[&_.dot-marker]:scale-100
      ">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <FaShippingFast className="text-blue-600 dark:text-blue-400 text-lg" />
            <span className="font-bold text-sm">{method.title}</span>
          </div>

          <div className="circle-marker w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 border-slate-300 dark:border-slate-750 bg-white dark:bg-slate-900">
            <span className="dot-marker w-2.5 h-2.5 rounded-full bg-white transition-transform duration-300 scale-0" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mt-auto pt-2 border-t border-slate-50 dark:border-slate-800/40">
          <FaCalendarAlt className="text-slate-400" />
          <span>زمان تحویل تقریبی: <strong>{method.time}</strong></span>
        </div>
      </div>
    </label>
  );
}