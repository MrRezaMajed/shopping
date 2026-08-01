// @/components/ui/CRUDPage/confing/models/postComment.config.tsx

import * as Yup from "yup";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react"; // دریافت اطلاعات ادمین لاگین شده برای ردیابی
import { CRUDField } from "@/components/ui/CRUDPage/types";
import { toPersianNumber } from "@/lib/utils/persianNumbers";
import { updateItem, createItem } from "@/app/actions/crud/crudActions"; 
import { useNotification } from "@/context/NotificationContext";

// کامپوننت دکمه‌های سریع وضعیت دیدگاه
const CommentStatusBadge = ({ item, onRefresh }: { item: any; onRefresh?: () => void }) => {
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: "PENDING" | "APPROVED" | "REJECTED") => {
    setLoading(true);
    const res = await updateItem("postComment", item.id, { status: newStatus });
    setLoading(false);

    if (!res.success) {
      addNotification({
        type: "error",
        title: "خطا در تغییر وضعیت",
        message: res.error || "خطایی رخ داد.",
        duration: 4000,
      });
      return;
    }

    addNotification({
      type: "success",
      title: "به‌روزرسانی موفق",
      message: "وضعیت دیدگاه با موفقیت تغییر یافت.",
      duration: 3500,
    });

    if (onRefresh) onRefresh();
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: "در انتظار تایید", color: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40" },
    APPROVED: { label: "تایید شده", color: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40" },
    REJECTED: { label: "رد شده", color: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50" },
  };

  const current = statusMap[item.status] || { label: item.status, color: "bg-slate-50 text-slate-600 border-slate-100" };

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${current.color}`}>
        {current.label}
      </span>
      
      {!loading && item.status !== "APPROVED" && (
        <button
          onClick={() => handleStatusChange("APPROVED")}
          title="تایید دیدگاه"
          className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 text-emerald-600 hover:text-white transition-all duration-200 active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </button>
      )}

      {!loading && item.status !== "REJECTED" && (
        <button
          onClick={() => handleStatusChange("REJECTED")}
          title="رد دیدگاه"
          className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-600 hover:text-white transition-all duration-200 active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

// کامپوننت مودال مشاهده دیدگاه و تایم‌لاین کامل چت/پاسخ‌ها
const CommentReplyManagerCell = ({ item, onRefresh }: { item: any; onRefresh?: () => void }) => {
  const { data: session } = useSession(); // دریافت اطلاعات کاربری مدیر لاگین شده
  const { addNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false); 
  const [replyText, setReplyText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null); // رفرنس مودال برای فوکوس ترپ

  useEffect(() => {
    setMounted(true); 
    return () => setMounted(false);
  }, []);

  // بهینه‌سازی متد بستن مودال با useCallback جهت ممانعت از ایجاد Stale Closure در رندرها
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setReplyText("");
  }, []);

  // پیاده‌سازی مجهز به فوکوس ترپ و بستن مودال با کلید فرار (Escape)
  useEffect(() => {
    if (!isOpen) return;
    setIsAnimating(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      // بستن آنی مودال با فشردن کلید Escape در هر کجای صفحه
      if (e.key === "Escape") {
        handleClose();
        return;
      }

      if (e.key !== "Tab") return;

      // یافتن تمام عناصر قابل فوکوس در مودال
      const focusableElements = modalRef.current?.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) { // Shift + Tab (گردش معکوس دکمه تب)
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else { // Tab (گردش عادی دکمه تب)
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // اسکرول خودکار به انتهای چت
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      // فوکوس پیش‌فرض روی اینپوت متن پاسخ
      const input = modalRef.current?.querySelector("input");
      if (input) input.focus();
    }, 150);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]); // هوک به روزرسانی سراسری

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSaveReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setIsSaving(true);
    
    try {
      const res = await createItem("postComment", {
        postId: item.postId,
        text: replyText,
        parentId: item.id,
        userId: session?.user?.id ? Number(session.user.id) : null, // ذخیره شناسه ادمین پاسخ‌دهنده
        status: "APPROVED",
      });

      if (res.success) {
        addNotification({
          type: "success",
          title: "ثبت پاسخ موفقیت‌آمیز",
          message: "پاسخ جدید شما به گفتگو اضافه شد.",
          duration: 3500,
        });
        
        setReplyText("");
        if (onRefresh) onRefresh();
        
        // اسکرول به انتهای چت پس از ارسال پاسخ جدید
        setTimeout(() => {
          chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        throw new Error(res.error || "خطایی رخ داد");
      }
    } catch (error: any) {
      addNotification({
        type: "error",
        title: "خطا در ثبت پاسخ",
        message: error.message || "بروز خطا در برقراری ارتباط با پایگاه‌داده.",
        duration: 4500,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const repliesList = item.replies || [];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative group overflow-hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 dark:bg-zinc-800 dark:hover:bg-indigo-600 text-indigo-600 hover:text-white dark:text-indigo-400 dark:hover:text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-sm active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h9m-9 3h3m-6.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 17.25 4.5H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        <span>مشاهده و پاسخ</span>
      </button>

      {isAnimating && mounted && createPortal(
        <div
          className={`fixed inset-0 z-[999] flex items-center justify-center p-4 transition-opacity duration-300 text-right ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          dir="rtl"
        >
          {/* 👈 لایه پشتی کاملاً شیشه‌ای، با تاری ملایم و رنگ بسیار روشن (مطابق با دکوراسیون مودال بومی سیستم شما) */}
          <div className="fixed inset-0 z-[998] pointer-events-auto" />

          {/* بدنه مودال سه‌بعدی و درخشان */}
          <div
            ref={modalRef}
            tabIndex={-1}
            className={`relative bg-white dark:bg-[#0c0d14] w-full max-w-lg rounded-3xl shadow-[0_25px_60px_rgba(99,102,241,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-slate-200/80 dark:border-indigo-500/20 flex flex-col h-[80vh] transition-all duration-300 overflow-hidden transform ${
              isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
            } z-[999]`}
          >
            {/* هاله خط درخشان رنگی بالای مودال */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />

            {/* هدر مودال */}
            <div className="p-4 border-b border-slate-100 dark:border-zinc-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-950/20">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-sm">تاریخچه گفتگو و پاسخ‌ها</h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* تاریخچه گفتگوها به صورت حباب‌های چت (مدرن و حرفه‌ای) */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50/50 dark:bg-[#0c0d14]/30">
              
              {/* نظر اصلی کاربر (پیام سمت راست) */}
              <div className="flex flex-col items-start space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold mr-2">
                  {item.user?.name || "کاربر مهمان"} • پیام اصلی
                </span>
                <div className="max-w-[85%] p-3.5 bg-white dark:bg-zinc-850 border border-slate-150 dark:border-zinc-800 text-xs text-slate-800 dark:text-zinc-700 rounded-2xl rounded-tr-none shadow-sm font-medium leading-relaxed">
                  {item.text}
                </div>
              </div>

              {/* پاسخ‌های رد و بدل شده‌ی بعدی */}
              {repliesList.map((reply: any, rIdx: number) => {
                const isAdminReply = reply.userId && reply.user; // کاربر پاسخگو موجود است
                const senderName = reply.user?.name || "کاربر سیستم";
                
                return (
                  <div 
                    key={rIdx} 
                    className={`flex flex-col space-y-1 ${isAdminReply ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold px-1">
                      {senderName}
                    </span>
                    <div 
                      className={`
                        max-w-[85%] p-3.5 text-xs rounded-2xl shadow-sm font-medium leading-relaxed border
                        ${isAdminReply 
                          ? "bg-gradient-to-tr from-indigo-600 to-violet-500 border-indigo-500 text-white rounded-tl-none shadow-[0_4px_12px_rgba(99,102,241,0.2)]" 
                          : "bg-white dark:bg-zinc-850 border-slate-150 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 rounded-tr-none"
                        }
                      `}
                    >
                      {reply.text}
                    </div>
                  </div>
                );
              })}
              
              <div ref={chatEndRef} />
            </div>

            {/* کادر ارسال پاسخ جدید در انتهای مودال */}
            <div className="p-4 border-t border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90">
              <form onSubmit={handleSaveReply} className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="پاسخ خود را بنویسید..."
                  className="flex-1 p-3 text-xs font-semibold border rounded-xl border-slate-200 dark:border-indigo-500 bg-white dark:bg-zinc-950/20 text-slate-800 dark:text-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={isSaving || !replyText.trim()}
                  className="px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>ارسال</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>,
        document.body 
      )}
    </>
  );
};

export const postCommentConfig = {
  modelKey: "postComment" as const,
  modelName: "نظرات وبلاگ",
  enableStatusToggle: false,
  
  // غیرفعال‌سازی دکمه‌های پیش‌فرض ایجاد و ویرایش فرمیک
  disableCreate: true, 
  disableEdit: true, 

  hiddenOnMobile: ["postId", "createdAt"],
  
  validationSchema: Yup.object().shape({
    postId: Yup.number().required("انتخاب پست الزامی است"),
    userId: Yup.number().nullable(),
    text: Yup.string().required("متن دیدگاه الزامی است"),
    status: Yup.string().required("تعیین وضعیت دیدگاه الزامی است"),
  }),

  filterTranslations: {
    keys: { search: "جستجو در متن نظر", status: "وضعیت تایید", postId: "پست وبلاگ" },
    values: { PENDING: "در انتظار تایید", APPROVED: "تایید شده", REJECTED: "رد شده" },
  },

  getFields: (): CRUDField[] => [
    {
      name: "user",
      label: "نویسنده دیدگاه",
      cellRenderer: (item: any) => (
        <div className="flex flex-col text-right">
          <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">{item.user?.name || "کاربر مهمان"}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500">{item.user?.email || "ثبت عمومی بدون ایمیل"}</span>
        </div>
      ),
    },
    {
      name: "post",
      label: "مربوط به پست",
      cellRenderer: (item: any) => <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{item.post?.title || "-"}</span>,
    },
    {
      name: "text",
      label: "خلاصه متن دیدگاه",
      cellRenderer: (item: any) => {
        if (!item.text) return <span className="text-xs text-slate-400">-</span>;
        const plainText = item.text.replace(/<[^>]*>/g, "").trim();
        const words = plainText.split(/\s+/);
        const displayValue = words.length > 8 ? words.slice(0, 8).join(" ") + " ..." : plainText;
        return <span className="text-xs text-slate-500 dark:text-slate-400 font-medium" title={plainText}>{displayValue}</span>;
      },
    },
    {
      name: "status",
      label: "وضعیت دیدگاه",
      cellRenderer: (item: any, onRefresh?: () => void) => <CommentStatusBadge item={item} onRefresh={onRefresh} />,
    },
    {
      // ستون وضعیت پاسخ: خلاصه‌ای از آخرین پاسخ ثبت شده توسط ادمین را زنده نشان می‌دهد
      name: "replies",
      label: "وضعیت پاسخ",
      cellRenderer: (item: any) => {
        const replies = item.replies || [];
        const hasReply = replies.length > 0;
        
        // حالت اول: هنوز هیچ گفتگویی ثبت نشده و منتظر پاسخ اول ادمین است
        if (!hasReply) {
          return (
            <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-200 max-w-max dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40">
              در انتظار پاسخ اول
            </span>
          );
        }

        // دریافت آخرین پیام ارسال شده در این گفتگو
        const lastMessage = replies[replies.length - 1];
        
        // حالت دوم: اگر آخرین پیام ثبت شده در چت توسط خودِ کاربر اصلی ارسال شده باشد (یعنی سوال مجدد پرسیده)
        const isLastMessageFromUser = lastMessage.userId === item.userId;

        if (isLastMessageFromUser) {
          return (
            <div className="flex flex-col gap-1 text-right">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20 max-w-max animate-pulse dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/40">
                سوال جدید کاربر 💬
              </span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 truncate max-w-[150px]" title={lastMessage.text}>
                {lastMessage.text}
              </span>
            </div>
          );
        }

        // حالت سوم: آخرین پیام گفتگو توسط ادمین/نویسنده ارسال شده است (پاسخ داده شده)
        return (
          <div className="flex flex-col gap-1 text-right">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 max-w-max dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40">
              پاسخ داده شده
            </span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 truncate max-w-[150px]" title={lastMessage.text}>
              {lastMessage.text}
            </span>
          </div>
        );
      }
    },
    {
      // ستون ردیابی نام کاربر/ادمین پاسخ‌دهنده به کامنت
      name: "replied_by",
      label: "پاسخ‌دهنده",
      cellRenderer: (item: any) => {
        const replies = item.replies || [];
        const staffReplies = replies.filter((r: any) => r.userId !== null && r.user);
        
        if (staffReplies.length > 0) {
          const lastReplierName = staffReplies[staffReplies.length - 1].user.name;
          return (
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 px-2.5 py-1 rounded-lg border border-indigo-500/10">
              {lastReplierName}
            </span>
          );
        }
        return <span className="text-xs text-slate-400">-</span>;
      }
    },
    {
      name: "action_reply",
      label: "عملیات دیدگاه",
      cellRenderer: (item: any, onRefresh?: any) => <CommentReplyManagerCell item={item} onRefresh={onRefresh} />,
    },
  ],

  formFields: [],
  filterFields: [
    { key: "search", type: "search", placeholder: "جستجو در دیدگاه یا نویسنده..." },
    {
      key: "status",
      type: "select",
      placeholder: "وضعیت بررسی",
      options: [
        { value: "PENDING", label: "در انتظار بررسی" },
        { value: "APPROVED", label: "منتشر شده" },
        { value: "REJECTED", label: "رد شده" },
      ],
    },
  ],
};