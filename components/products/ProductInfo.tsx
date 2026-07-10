// components/products/ProductInfo.tsx
'use client';
import { FC, useState } from 'react';
import { FaShieldAlt, FaStore, FaHeart, FaInfoCircle, FaRegHeart, FaPlus, FaMinus } from 'react-icons/fa';

const ProductInfo: FC = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('#523e02');

  const colors = [
    { code: '#523e02', label: 'قهوه‌ای' },
    { code: '#0c4128', label: 'سبز تیره' },
    { code: '#f97316', label: 'نارنجی' }
  ];

  const formatToPersianNumber = (num: number): string => {
    return new Intl.NumberFormat('fa-IR').format(num);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-6 transition-colors">
      
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 leading-8">
          کتاب اثر مرکب نوشته دارن هاردی
        </h1>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">The Compound Effect by Darren Hardy</p>
      </div>

      <div className="border-b border-zinc-100 dark:border-zinc-800"></div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span>انتخاب رنگ:</span>
          <span className="font-bold text-zinc-800 dark:text-zinc-200">
            {colors.find(c => c.code === selectedColor)?.label}
          </span>
        </div>
        
        <div className="flex gap-3">
          {colors.map((color) => (
            <button
              key={color.code}
              onClick={() => setSelectedColor(color.code)}
              style={{ backgroundColor: color.code }}
              className={`w-8 h-8 rounded-full transition-all duration-300 relative focus:outline-none ${
                selectedColor === color.code 
                  ? 'ring-4 ring-brand-500/20 scale-110 shadow-md'  /* تغییر به brand */
                  : 'hover:scale-105 opacity-90 hover:opacity-100'
              }`}
            >
              {selectedColor === color.code && (
                <span className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/20 p-3 rounded-xl">
          <FaShieldAlt className="text-emerald-500 shrink-0" size={18} />
          <span>گارانتی اصالت و سلامت فیزیکی کالا</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/20 p-3 rounded-xl">
          <FaStore className="text-brand-500 shrink-0" size={18} /> {/* تغییر رنگ مایه آیکون */}
          <span>موجود در انبار (آماده ارسال از تهران)</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        
        {/* انتخاب تعداد */}
        <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 p-1.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
          <button 
            onClick={() => setQuantity(prev => prev + 1)}
            className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-lg text-zinc-500 hover:text-brand-600 dark:text-zinc-400 dark:hover:text-brand-400 hover:shadow-sm transition-all" 
            aria-label="افزایش تعداد"
          >
            <FaPlus size={10} />
          </button>
          
          <span className="w-10 text-center font-bold text-zinc-800 dark:text-zinc-200">
            {formatToPersianNumber(quantity)}
          </span>
          
          <button 
            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
            className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-lg text-zinc-500 hover:text-brand-600 dark:text-zinc-400 dark:hover:text-brand-400 hover:shadow-sm transition-all" 
          >
             <FaMinus size={10} />
          </button>
        </div>

        {/* دکمه علاقه مندی */}
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            isLiked 
              ? 'bg-brand-50 border-brand-100 dark:bg-brand-950/20 dark:border-brand-900/40 text-brand-600 dark:text-brand-400' 
              : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
          }`}
        >
          {isLiked ? <FaHeart className="text-brand-500" /> : <FaRegHeart />} {/* تغییر به brand */}
          {isLiked ? 'در علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی'}
        </button>
      </div>

      <div className="flex gap-3 text-xs leading-6 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/40 dark:border-amber-900/40 p-4 rounded-xl text-amber-800 dark:text-amber-300">
        <FaInfoCircle className="shrink-0 mt-0.5" size={16} />
        <p>
          کاربر گرامی خرید شما هنوز نهایی نشده است. برای ثبت سفارش و تکمیل خرید
          باید ابتدا آدرس خود را انتخاب کنید و سپس نحوه ارسال را مشخص فرمایید. نحوه
          ارسال انتخابی شما محاسبه و به این مبلغ اضافه خواهد شد.
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;