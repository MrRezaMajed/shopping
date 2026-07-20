// @/components/ui/CRUDPage/confing/models/post.config.tsx

import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import { CRUDField } from "@/components/ui/CRUDPage/types";
import { toPersianNumber } from "@/lib/utils/persianNumbers";

// کامپوننت مدیریت پاسخ‌ها به صورت کلاینتی، انیمیشن‌دار و بسیار روان
const PostReplyCell = ({ item }: { item: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  // شبیه‌سازی لیست پاسخ‌های ثبت شده قبلی
  const [replies, setReplies] = useState<Array<{ id: number; author: string; text: string; date: string }>>([
    { id: 1, author: "پشتیبان سیستم", text: "ممنون از دیدگاه ارزشمند شما. حتماً بررسی و اعمال خواهد شد.", date: "۱ ساعت پیش" }
  ]);

  // کنترل افکت‌های انیمیشن باز و بسته شدن
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSending(true);
    // شبیه‌سازی ارسال درخواست پاسخ به سرور با افکت لودینگ زیبا
    setTimeout(() => {
      setReplies((prev) => [
        ...prev,
        {
          id: Date.now(),
          author: "مدیر بخش",
          text: replyText,
          date: "هم‌اکنون",
        },
      ]);
      setReplyText("");
      setIsSending(false);
    }, 1000);
  };

  return (
    <>
      {/* دکمه باز کردن مودال پاسخ با افکت‌ها و سایه ملایم */}
      <button
        onClick={handleOpen}
        className="relative group overflow-hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 dark:bg-zinc-800 dark:hover:bg-indigo-600 text-indigo-600 hover:text-white dark:text-indigo-400 dark:hover:text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-indigo-100 dark:hover:shadow-none active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
        </svg>
        <span>پاسخ‌دهی</span>
        <span className="inline-flex items-center justify-center bg-indigo-100 group-hover:bg-indigo-500 text-indigo-700 group-hover:text-white dark:bg-zinc-700 w-5 h-5 rounded-full text-[10px] transition-colors">
          {toPersianNumber(replies.length)}
        </span>
      </button>

      {/* پرتال مودال با انیمیشن تاریک‌کننده پس‌زمینه (Backdrop Blur) */}
      {isAnimating && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 text-right ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          dir="rtl"
        >
          {/* پس‌زمینه تیره و تار با قابلیت کلیک جهت خروج */}
          <div
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[4px] transition-all"
          />

          {/* محفظه اصلی مودال (انیمیشن پاپ‌آپ) */}
          <div
            className={`relative bg-white dark:bg-zinc-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 dark:border-zinc-800 flex flex-col max-h-[85vh] transition-all duration-300 overflow-hidden transform ${
              isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
            }`}
          >
            {/* سربرگ مودال */}
            <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-sm">
                  ارسال پاسخ به پست کاربر
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* بدنه مودال (محتوا و لیست کامنت‌ها) */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
              {/* پست اصلی کاربر */}
              <div className="bg-slate-50 dark:bg-zinc-900/40 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                    {item.author || "کاربر ناشناس"}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                    {item.createdAtPersian || "۲ روز پیش"}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-zinc-200 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {item.content || "محتوایی برای نمایش وجود ندارد."}
                </p>
              </div>

              {/* خط جداکننده گفت‌وگو */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dashed border-slate-200 dark:border-zinc-800" />
                </div>
                <span className="relative px-3 bg-white dark:bg-zinc-900 text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                  روند گفت‌وگو و پاسخ‌ها
                </span>
              </div>

              {/* لیست پاسخ‌های قبلی و جدید */}
              <div className="space-y-3">
                {replies.map((rep) => (
                  <div
                    key={rep.id}
                    className="flex gap-2.5 max-w-[85%] mr-auto text-right bg-indigo-50/40 dark:bg-zinc-800/40 border border-indigo-50/50 dark:border-zinc-800 p-3.5 rounded-2xl rounded-tr-none transition-all duration-300 animate-[fadeIn_0.3s_ease-out_forwards]"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-black text-xs text-slate-700 dark:text-zinc-300">
                          {rep.author}
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-zinc-500">
                          {rep.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                        {rep.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* فرم چسبیده پایینی ارسال پاسخ با فیلد متنی */}
            <form onSubmit={handleSubmitReply} className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
              <div className="relative flex items-end gap-2 bg-white dark:bg-zinc-900 p-2 rounded-xl border border-slate-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="پاسخ خود را اینجا بنویسید..."
                  className="w-full text-xs text-slate-800 dark:text-zinc-200 bg-transparent border-0 outline-none resize-none focus:ring-0 placeholder-slate-400 dark:placeholder-zinc-500 leading-relaxed pr-2"
                />
                <button
                  type="submit"
                  disabled={isSending || !replyText.trim()}
                  className="flex items-center justify-center p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-slate-100 dark:disabled:bg-zinc-800 disabled:text-slate-400 transition-all flex-shrink-0 active:scale-95"
                >
                  {isSending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transform rotate-180">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// کانفیگ اصلی بخش پست‌ها منطبق با تایپ ModelRegistryConfig
export const postConfig = {
  modelKey: "post" as const,
  modelName: "پست‌ها و نظرات",
  enableStatusToggle: true,
  hiddenOnMobile: ["createdAt", "status"],
  validationSchema: Yup.object().shape({
    title: Yup.string().required("عنوان پست الزامی است"),
    content: Yup.string().required("محتوای پست الزامی است"),
    status: Yup.string().required("انتخاب وضعیت الزامی است"),
  }),
  filterTranslations: {
    keys: { search: "جستجو در عنوان پست", status: "وضعیت نمایش" },
    values: { ACTIVE: "فعال", INACTIVE: "غیرفعال" },
  },
  getFields: (): CRUDField[] => [
    {
      name: "author",
      label: "نویسنده پست",
      cellRenderer: (item: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
            {item.author ? item.author.substring(0, 2) : "کا"}
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
            {item.author || "کاربر ناشناس"}
          </span>
        </div>
      ),
    },
    {
      name: "title",
      label: "عنوان پست / سوال",
      cellRenderer: (item: any) => (
        <div className="max-w-[280px]">
          <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">{item.title}</p>
          <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate mt-0.5">{item.content}</p>
        </div>
      ),
    },
    { name: "status", label: "وضعیت" },
    {
      name: "replyAction",
      label: "پاسخ‌ها و مدیریت",
      cellRenderer: (item: any) => <PostReplyCell item={item} />,
    },
  ],
  // خالی گذاشتن فیلدهای فرم، از ایجاد پست جدید به وسیله این لایه در پنل جلوگیری می‌کند
  formFields: [],
  filterFields: [
    { key: "search", type: "search", placeholder: "جستجو در عنوان یا متن..." },
    {
      key: "status",
      type: "select",
      placeholder: "وضعیت تایید",
      options: [
        { value: "ACTIVE", label: "فعال (نمایش عمومی)" },
        { value: "INACTIVE", label: "غیرفعال" },
      ],
    },
  ],
};