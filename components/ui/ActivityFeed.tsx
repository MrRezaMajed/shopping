"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiArrowUpRight, FiUser } from "react-icons/fi";
import { getRecentAuditLogs } from "@/app/actions/audit/log";

interface AuditLogItem {
  id: number;
  userId: number | null;
  action: "CREATE" | "UPDATE" | "DELETE" | "RESTORE" | "SYSTEM_AUTO";
  modelName: string;       
  targetName?: string | null; 
  details: string;
  createdAt: string | Date;
  user?: {
    name?: string | null;      
    firstName?: string | null; 
    lastName?: string | null;  
    avatar?: string | null;    
    image?: string | null;     
    role?: string | null; 
  } | null;
}

function toPersianNumber(num: number | string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(num).replace(/\d/g, (x) => persianDigits[parseInt(x)]);
}

function getRelativeTimePersian(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 15) return "هم‌اکنون";
  if (diffSecs < 60) return `${toPersianNumber(diffSecs)} ثانیه پیش`;
  if (diffMins < 60) return `${toPersianNumber(diffMins)} دقیقه پیش`;
  if (diffHours < 24) return `${toPersianNumber(diffHours)} ساعت پیش`;
  return `${toPersianNumber(diffDays)} روز پیش`;
}

const translateModel = (model: string): string => {
  const models: Record<string, string> = {
    Product: "محصول",
    Category: "دسته‌بندی",
    User: "کاربر",
    Order: "سفارش",
    Setting: "تنظیمات وب‌سایت",
    Article: "مقاله",
    Banner: "بنر",
  };
  return models[model] || model;
};

// تولید گرادیان‌های پویا و با کنتراست بالا متناسب با تم لایت و دارک
const getMeshGradient = (userId: number | null) => {
  const id = userId || 0;
  const gradients = [
    "from-violet-600 to-indigo-600 shadow-indigo-500/20 dark:shadow-indigo-500/5",
    "from-emerald-500 to-teal-600 shadow-emerald-500/20 dark:shadow-emerald-500/5",
    "from-pink-500 to-rose-600 shadow-rose-500/20 dark:shadow-rose-500/5",
    "from-amber-500 to-orange-600 shadow-orange-500/20 dark:shadow-orange-500/5",
    "from-fuchsia-500 to-purple-600 shadow-purple-500/20 dark:shadow-purple-500/5",
    "from-cyan-500 to-blue-600 shadow-blue-500/20 dark:shadow-blue-500/5"
  ];
  return gradients[id % gradients.length];
};

const getActionMeta = (action: string) => {
  switch (action) {
    case "CREATE":
      return {
        label: "ثبت جدید",
        icon: <FiPlus className="w-3.5 h-3.5" />,
        color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/10 dark:bg-emerald-500/5",
        textColor: "text-emerald-600 dark:text-emerald-400",
        shadow: "shadow-emerald-500/10"
      };
    case "UPDATE":
      return {
        label: "ویرایش",
        icon: <FiEdit2 className="w-3.5 h-3.5" />,
        color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20 dark:border-amber-500/10 dark:bg-amber-500/5",
        textColor: "text-amber-600 dark:text-amber-400",
        shadow: "shadow-amber-500/10"
      };
    case "DELETE":
      return {
        label: "حذف",
        icon: <FiTrash2 className="w-3.5 h-3.5" />,
        color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20 dark:border-rose-500/10 dark:bg-rose-500/5",
        textColor: "text-rose-600 dark:text-rose-400",
        shadow: "shadow-rose-500/10"
      };
    default:
      return {
        label: "سیستم",
        icon: <FiArrowUpRight className="w-3.5 h-3.5" />,
        color: "text-slate-500 dark:text-slate-400 bg-slate-500/10 border-slate-200 dark:border-white/[0.06] dark:bg-white/[0.02]",
        textColor: "text-slate-600 dark:text-slate-400",
        shadow: "shadow-slate-500/5"
      };
  }
};

export default function ActivityFeed() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await getRecentAuditLogs(12); 
      if (res.success && res.data) {
        setLogs(res.data as AuditLogItem[]);
      }
    } catch (e) {
      console.error("خطا در دریافت لاگ‌ها:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(() => {
      fetchLogs();
    }, 15000); 
    return () => clearInterval(interval);
  }, [fetchLogs]);

  return (
    <div className="
      relative overflow-hidden w-full p-6 rounded-3xl text-right
      bg-white/85 dark:bg-[#0c0d14]/75 backdrop-blur-2xl
      border border-slate-200/60 dark:border-white/[0.06]
      shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)]
    ">
      {/* هدر مجهز به افکت پالس‌دار */}
      <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-white/[0.06] pb-4.5 mb-5 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <h3 className="text-xs sm:text-[13px] font-black tracking-tight text-slate-800 dark:text-slate-100">
              فعالیت‌ها و رویدادهای زنده
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
            پایش مانیتورینگ تغییرات مدیران در دیتابیس
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="
            p-2 rounded-xl border border-slate-200/60 dark:border-white/[0.06]
            bg-white/60 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200
            transition-all duration-300 disabled:opacity-50 hover:shadow-md active:scale-95
          "
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-500" : ""}`} />
        </button>
      </div>

      <div className="relative min-h-[220px] z-10">
        {loading && logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-500 dark:text-slate-400">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-bold tracking-wider opacity-85">در حال همگام‌سازی...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold opacity-75">هیچ رویداد جدیدی یافت نشد</span>
          </div>
        ) : (
          /* محفظه مجهز به اسکرول‌بار مینی‌مالیستی */
          <div className="
            max-h-[380px] overflow-y-auto pl-1.5 pr-0.5
            [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-800/80
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-700
          ">
            {/* خط زمانی فوق مینی‌مال (لیزری) */}
            <div className="relative mr-3 pr-6 py-1 space-y-4">
              <div className="absolute right-0 top-2 bottom-2 w-[1px] bg-gradient-to-b from-slate-200 via-slate-200 to-transparent dark:from-slate-800 dark:via-slate-800 dark:to-transparent" />
              
              <AnimatePresence initial={false}>
                {logs.map((log) => {
                  const meta = getActionMeta(log.action);
                  
                  const fullName = log.user?.name 
                    ? log.user.name 
                    : (log.user?.firstName && log.user?.lastName 
                      ? `${log.user.firstName} ${log.user.lastName}`
                      : "سیستم هوشمند");

                  const firstChar = fullName.trim().charAt(0) || "س";
                  const avatarUrl = log.user?.image || log.user?.avatar || null;
                  const meshGradient = getMeshGradient(log.userId);

                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 420, damping: 30 }}
                      className="
                        relative flex items-start gap-4 p-2.5 rounded-2xl
                        transition-all duration-300 hover:bg-slate-500/5 dark:hover:bg-white/[0.02]
                        group/item
                      "
                    >
                      {/* گره نورانی آیکون رویداد روی خط زمانی */}
                      <div className={`
                        absolute -right-[23.5px] top-4.5 w-5 h-5 rounded-full border flex items-center justify-center shadow-sm shrink-0
                        ring-4 ring-white dark:ring-[#0c0d14] transition-all duration-300 group-hover/item:scale-110
                        ${meta.color} ${meta.shadow}
                      `}>
                        {meta.icon}
                      </div>

                      {/* آواتار کاربر با گرادیان‌های داینامیک */}
                      <div className="relative shrink-0 mt-0.5">
                        {avatarUrl ? (
                          <img 
                            src={avatarUrl} 
                            alt={fullName} 
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200/50 dark:ring-white/[0.06]"
                          />
                        ) : (
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm
                            bg-gradient-to-tr ${meshGradient}
                            ring-2 ring-slate-200/50 dark:ring-white/[0.06]
                          `}>
                            {log.userId ? firstChar : <FiUser className="w-3.5 h-3.5" />}
                          </div>
                        )}
                      </div>

                      {/* محتوا و متون لاگ با ساختار جملات مجهول فارسی روان */}
                      <div className="space-y-1 w-full text-right">
                        <div className="flex items-center justify-between gap-4 w-full flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] sm:text-xs font-extrabold text-slate-800 dark:text-slate-200">
                              {fullName}
                            </span>
                            {log.user?.role && (
                              <span className="
                                px-1.5 py-0.5 rounded-md text-[8px] font-bold tracking-wider
                                bg-slate-100 dark:bg-white/[0.03] text-slate-500 dark:text-slate-400
                                border border-slate-200/40 dark:border-white/[0.04]
                              ">
                                {log.user.role}
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 shrink-0">
                            {getRelativeTimePersian(log.createdAt)}
                          </span>
                        </div>

                        {/* ساختار مجهول: [نوع مدل] «عنوان» با موفقیت توسط [کاربر] [اکشن] شد */}
                        <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                          <span className="opacity-85">{translateModel(log.modelName)}</span>{" "}
                          <strong className="
                            text-slate-900 dark:text-slate-100 font-extrabold px-1.5 py-0.5 rounded-lg
                            bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/50 dark:border-white/[0.02]
                          ">
                            «{log.targetName || "نامشخص"}»
                          </strong>{" "}
                          با موفقیت توسط{" "}
                          <span className="text-slate-800 dark:text-slate-200 font-bold decoration-indigo-500/20 underline-offset-4 hover:underline">
                            {fullName}
                          </span>{" "}
                          <span className={`font-black ${meta.textColor}`}>
                            {meta.label === "ثبت جدید" ? "ایجاد" : meta.label === "ویرایش" ? "ویرایش" : meta.label === "حذف" ? "حذف" : "بروزرسانی"}
                          </span>{" "}
                          شد.
                        </p>

                        {/* دیسکریپشن جزییات کمکی در صورت لزوم */}
                        {log.details && log.details !== log.targetName && (
                          <p className="text-[10px] text-slate-500/80 dark:text-slate-400/80 font-medium opacity-90 leading-normal">
                            {log.details}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}