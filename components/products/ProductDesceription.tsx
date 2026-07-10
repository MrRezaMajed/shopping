'use client';
import { FC, useState } from 'react';
import { FaRegCommentDots, FaStar, FaTimes, FaUser } from 'react-icons/fa';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
}

const ReviewModal: FC<ReviewModalProps> = ({ open, onClose }) => {
  const [name, setName] = useState<string>('');
  const [text, setText] = useState<string>('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100 dark:border-zinc-800 transform scale-100 transition-transform">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            <FaRegCommentDots className="text-rose-500" />
            ثبت دیدگاه جدید
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <input
          className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 rounded-xl p-3 mb-4 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm"
          placeholder="نام و نام خانوادگی شما"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 rounded-xl p-3 h-32 mb-5 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm resize-none"
          placeholder="دیدگاه خود را اینجا بنویسید..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-end gap-3 text-sm font-medium">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
          >
            انصراف
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/10 hover:shadow-rose-600/25 transition-all"
          >
            ثبت دیدگاه
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductDescription: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('introduction');

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors">
      {/* Tabs */}
      <div className="flex flex-wrap items-center border-b border-zinc-100 dark:border-zinc-800 gap-2 pb-1 text-sm font-semibold">
        {[
          { id: 'introduction', label: 'معرفی' },
          { id: 'features', label: 'ویژگی‌ها' },
          { id: 'comments', label: 'دیدگاه‌ها' }
        ].map((tab) => (
          <a
            key={tab.id}
            href={`#${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 border-b-2 transition-all duration-300 relative ${
              activeTab === tab.id
                ? 'border-rose-600 text-rose-600 dark:text-rose-400 font-bold'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <div className="py-6">
        {/* معرفی */}
        <div id="introduction" className="mb-10 scroll-mt-20">
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-rose-600 rounded-full"></span>
            معرفی محصول
          </h3>
          <p className="text-zinc-600 dark:text-zinc-300 leading-8 text-justify text-sm bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-xl">
            خلاصه کتاب اثر مرکب «انتخاب‌های شما تنها زمانی معنی دار است که آنها را
            به دلخواه به رؤیاهای خود متصل کنید... متن بالا شاید بهترین خلاصه ای
            باشد که می شود از کتاب نوشت!
          </p>
        </div>

        {/* ویژگی‌ها */}
        <div id="features" className="mb-10 scroll-mt-20">
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-rose-600 rounded-full"></span>
            مشخصات فنی
          </h3>

          <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {[
                  ["وزن", "220 گرم"],
                  ["قطع", "رقعی"],
                  ["تعداد صفحات", "173 صفحه"],
                  ["نوع جلد", "شومیز"],
                  ["نویسنده", "دارن هاردی"],
                  ["مترجم", "ناهید محمدی"],
                  ["ناشر", "انتشارات نگین ایران"],
                  ["رده‌بندی", "روان‌شناسی"],
                  ["شابک", "9786227195132"],
                  ["سایر توضیحات", "چهار صفحه اول رنگی"],
                ].map(([key, value], i) => (
                  <tr
                    key={i}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                  >
                    <td className="p-3.5 text-zinc-500 dark:text-zinc-400 font-medium w-40 bg-zinc-50/50 dark:bg-zinc-800/10">
                      {key}
                    </td>
                    <td className="p-3.5 text-zinc-800 dark:text-zinc-200">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* دیدگاه‌ها */}
        <div id="comments" className="scroll-mt-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-rose-600 rounded-full"></span>
              دیدگاه کاربران
            </h3>

            <button
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-rose-600/10 hover:shadow-rose-600/20 transition-all flex items-center gap-1.5"
              onClick={() => setIsModalOpen(true)}
            >
              <FaRegCommentDots />
              افزودن دیدگاه جدید
            </button>
          </div>

          <div className="space-y-4">
            {[
              ["۲۱ مرداد ۱۴۰۰", "مجتبی مجدی", "با این تخفیف قیمت خیلی خوبه", 5],
              ["۲۱ مرداد ۱۴۰۰", "هدیه سادات هاشمی نژاد", "پیشنهاد میشه، کتاب مفیدیه", 4],
              ["۲۱ مرداد ۱۴۰۰", "علی محمدی", "کیفیت چاپ عالیه و قیمتش فوق‌العاده است", 5],
            ].map(([date, name, text, stars], i) => (
              <div
                key={i}
                className="border border-zinc-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm bg-zinc-50/30 dark:bg-zinc-800/30 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                      <FaUser size={14} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{name}</h4>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">{String(date)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <FaStar
                        key={idx}
                        size={12}
                        className={idx < Number(stars) ? "text-amber-400" : "text-zinc-200 dark:text-zinc-700"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-7 pr-1">
                  {String(text)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReviewModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ProductDescription;