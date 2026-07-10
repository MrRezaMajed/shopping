'use client';
import { FaInfoCircle, FaShippingFast, FaCalendarAlt } from "react-icons/fa";

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
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
      
      <h2 className="font-bold text-lg mb-4 text-right text-slate-800 dark:text-slate-100">
        انتخاب نحوه ارسال
      </h2>

      {/* هشدار */}
      <div className="flex items-start gap-2.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/80 dark:border-blue-900/40 p-3.5 rounded-2xl text-blue-700 dark:text-blue-400 text-xs leading-relaxed mb-5">
        <FaInfoCircle className="text-sm shrink-0 mt-0.5" />
        <span>لطفاً مدت زمان ارسال را هنگام انتخاب روش ارسال در نظر بگیرید.</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methods.map((m) => (
          <label
            key={m.id}
            className="relative block cursor-pointer group h-full select-none"
          >
            <input
              type="radio"
              name="delivery"
              checked={selected === m.id}
              className="sr-only peer"
              onChange={() => onSelect(m.id)}
            />

            {/* کارت متد ارسال سفارشی شده */}
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
                  <span className="font-bold text-sm">{m.title}</span>
                </div>

                {/* دایره رادیویی کارت ارسال */}
                <div className="circle-marker w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 border-slate-300 dark:border-slate-750 bg-white dark:bg-slate-900">
                  <span className="dot-marker w-2.5 h-2.5 rounded-full bg-white transition-transform duration-300 scale-0" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mt-auto pt-2 border-t border-slate-50 dark:border-slate-800/40">
                <FaCalendarAlt className="text-slate-400" />
                <span>زمان تحویل تقریبی: <strong>{m.time}</strong></span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}