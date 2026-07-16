راه‌اندازی یک **سیستم پایش فعالیت‌ها و لاگ زنده (Dashboard Audit Log / Activity Feed)** یکی از حرفه‌ای‌ترین ویژگی‌ها برای کنترل پنل‌های چندکاربره است. 

برای پیاده‌سازی گام‌به‌گام و بدون نقص این قابلیت، مراحل زیر را طی می‌کنیم:
1. **گام اول:** تعریف مدل `AuditLog` در اسکیمای پریزما.
2. **گام دوم:** نوشتن اکشن‌های سمت سرور (Server Actions) جهت ثبت و خواندن لاگ‌ها.
3. **گام سوم:** تزریق خودکار لاگ‌نویسی به کدهای جاری سرور اکشن‌ها (`createItem` ،`deleteItem` و...).
4. **گام چهارم:** ساخت ابزارک (Widget) شیک، متحرک و نئونی در فرانت‌اند مجهز به سیستم به‌روزرسانی زنده (Live Polling).

---

### گام اول: ویرایش اسکیمای دیتابیس (Prisma Schema)

ابتدا مدل جدید `AuditLog` را به انتهای فایل `prisma/schema.prisma` اضافه کنید و دیتابیس خود را با دستور `npx prisma db push` بروزرسانی نمایید:

```prisma
// اضافه کردن مدل به انتهای فایل schema.prisma
model AuditLog {
  id          Int      @id @default(autoincrement())
  userId      Int?     // شناسه کاربری که اقدام را انجام داده (null یعنی سیستم)
  action      String   // نوع اقدام: CREATE | UPDATE | DELETE | RESTORE | SYSTEM_AUTO
  modelName   String   // نام مدل: Product | Category | Brand | Banner
  recordId    Int?     // شناسه رکورد ویرایش‌شده
  details     String   // جزئیات فارسی لاگ
  createdAt   DateTime @default(now())

  user        User?    @relation(fields: [userId], references: [id])
}

// همچنین فیلد ارتباطی زیر را درون مدل User اضافه کنید:
model User {
  id        Int       @id @default(autoincrement())
  // ... سایر فیلدها ...
  auditLogs AuditLog[]
}
```

---

### گام دوم: ساخت اکشن‌های سرور ثبت و خواندن لاگ‌ها

فایل جدیدی در مسیر `app/actions/audit/log.ts` ایجاد کنید که حاوی متدهای درج و دریافت لاگ‌ها با قابلیت فچ کردن اطلاعاتِ کاربرِ اقدام‌کننده باشد:

```typescript
"use server";

import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "../crud/helpers";

interface LogActivityInput {
  userId?: number | null;
  action: "CREATE" | "UPDATE" | "DELETE" | "RESTORE" | "SYSTEM_AUTO";
  modelName: string;
  recordId?: number | null;
  details: string;
}

/**
 * متد کمکی برای درج خودکار لاگ فعالیت در پایگاه داده
 */
export async function logActivity({
  userId = null,
  action,
  modelName,
  recordId = null,
  details,
}: LogActivityInput) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        modelName,
        recordId,
        details,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to write audit log:", error);
    return { success: false };
  }
}

/**
 * واکشی جدیدترین لاگ‌های ثبت‌شده برای نمایش در ابزارک
 */
export async function getRecentAuditLogs(limit: number = 7) {
  try {
    const logs = await prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });
    
    return { success: true, data: serializeDecimal(logs) };
  } catch (err: any) {
    console.error("getRecentAuditLogs error:", err);
    return { success: false, data: [], error: err.message };
  }
}
```

---

### گام سوم: تزریق لاگ‌نویسی به کدهای جاری سرور اکشن‌ها

حالا این قابلیت را به طور مستقیم به توابع ثبت کالا و حذف کالا متصل می‌کنیم تا به محض انجام هر کار، لاگ آن به صورت خودکار ذخیره شود:

#### ۳.۱. به‌روزرسانی کدهای ایجاد آیتم (`createItem`) و ویرایش آیتم (`updateItem`):
فایل `app/actions/crud/write.ts` را باز کرده و در بخش‌هایی که مشخص شده، تابع `logActivity` را اضافه کنید:

```typescript
// اضافه کردن ایمپورت به بالای فایل app/actions/crud/write.ts
import { logActivity } from "../audit/log";

// ۱. انتهای عملیات موفق ایجاد محصول (createItem):
// قبل از خط return await tx.product...
await logActivity({
  action: "CREATE",
  modelName: "Product",
  recordId: product.id,
  details: `محصول جدید "${sanitizedData.title}" ثبت شد.`,
});

// ۲. انتهای عملیات موفق ایجاد برند/دسته‌بندی/بنر ساده (createItem):
// قبل از خط return { success: true, data: ... }
await logActivity({
  action: "CREATE",
  modelName: model,
  recordId: item.id,
  details: `${model === "category" ? "دسته‌بندی" : model === "brand" ? "برند" : "بنر"} جدید با عنوان "${sanitizedData.title || sanitizedData.name || sanitizedData.title}" ایجاد شد.`,
});

// ۳. انتهای عملیات موفق تراکنش آپدیت محصول (updateItem):
// قبل از خط return { success: true }
await logActivity({
  action: "UPDATE",
  modelName: "Product",
  recordId: id,
  details: `اطلاعات و تنوع‌های محصول "${sanitizedData.title || 'ثبت شده'}" ویرایش شد.`,
});
```

#### ۳.۲. به‌روزرسانی کدهای حذف و بازیابی آیتم‌ها:
فایل `app/actions/crud/delete.ts` را باز کرده و کدهای زیر را برای ثبت فعالیت درج کنید:

```typescript
// اضافه کردن ایمپورت به بالای فایل app/actions/crud/delete.ts
import { logActivity } from "../audit/log";

// ۱. انتهای تابع deleteItem قبل از خط return { success: true }
await logActivity({
  action: "DELETE",
  modelName: model,
  recordId: itemId,
  details: permanent 
    ? `آیتم با شناسه ${itemId} از بانک اطلاعاتی ${model} به طور کامل پاک شد.`
    : `آیتم با شناسه ${itemId} از بانک اطلاعاتی ${model} به سطل زباله منتقل شد.`,
});

// ۲. انتهای تابع restoreItem قبل از خط return { success: true }
await logActivity({
  action: "RESTORE",
  modelName: model,
  recordId: itemId,
  details: `رکورد با شناسه ${itemId} از زباله‌دان بخش ${model} بازیابی شد.`,
});
```

---

### گام چهارم: ساخت ابزارک شیک و متحرک فرانت‌اند (`ActivityFeed.tsx`)

یک ابزارک با لود متحرک، انیمیشن فید، تفکیک رنگی آیکون‌ها بر اساس نوع فعالیت، و مجهز به سیستم بروزرسانی خودکار (هر ۱۵ ثانیه یک‌بار) طراحی می‌کنیم.

**مسیر ایجاد فایل:** `components/ui/Dashboard/ActivityFeed.tsx`

```typescript
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlusCircle, FiEdit3, FiTrash2, FiRotateCcw, FiCpu, FiRefreshCw } from "react-icons/fi";
import { toPersianNumber } from "@/lib/utils/persianNumbers";
import { getRecentAuditLogs } from "@/app/actions/audit/log";

interface AuditLogItem {
  id: number;
  userId: number | null;
  action: "CREATE" | "UPDATE" | "DELETE" | "RESTORE" | "SYSTEM_AUTO";
  modelName: string;
  details: string;
  createdAt: string | Date;
  user?: {
    name: string;
    avatar?: string | null;
  } | null;
}

// تابع کمکی برای فرمت فارسی و متنی زمان ثبت لاگ
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

// مپ کردن نوع عملیات به آیکون و استایل رنگی متناسب با تم نئونی پنل
const getActionMeta = (action: string) => {
  switch (action) {
    case "CREATE":
      return {
        icon: <FiPlusCircle className="w-4 h-4" />,
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      };
    case "UPDATE":
      return {
        icon: <FiEdit3 className="w-4 h-4" />,
        color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      };
    case "DELETE":
      return {
        icon: <FiTrash2 className="w-4 h-4" />,
        color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      };
    case "RESTORE":
      return {
        icon: <FiRotateCcw className="w-4 h-4" />,
        color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
      };
    case "SYSTEM_AUTO":
    default:
      return {
        icon: <FiCpu className="w-4 h-4" />,
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      };
  }
};

export default function ActivityFeed() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await getRecentAuditLogs(6);
      if (res.success && res.data) {
        setLogs(res.data as AuditLogItem[]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();

    // ایجاد یک تایمر برای بروزرسانی خودکار لاگ‌ها هر ۱۵ ثانیه یک‌بار
    const interval = setInterval(() => {
      fetchLogs();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchLogs]);

  return (
    <div className="
      relative overflow-hidden w-full p-5 rounded-3xl text-right
      bg-white/60 dark:bg-[#0c0d14]/40 backdrop-blur-xl
      border border-slate-200/50 dark:border-[#1f2235]/50
      shadow-[0_4px_30px_rgba(0,0,0,0.01)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]
    ">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1f2235]/40 pb-3.5 mb-4 relative z-10">
        <div className="space-y-0.5">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
            فعالیت‌ها و پایش زنده پنل
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">ردیابی آنی تغییرات مدیران و سرور</p>
        </div>
        
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="
            p-2 rounded-xl border border-slate-200/60 dark:border-[#1f2235]/50
            bg-white/50 dark:bg-[#121420]/40 text-slate-400 hover:text-slate-700
            transition flex items-center justify-center disabled:opacity-50
          "
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-500" : ""}`} />
        </button>
      </div>

      <div className="relative z-10 space-y-3 min-h-[150px]">
        {loading && logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-slate-350 dark:text-slate-600">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-bold">در حال دریافت فعالیت‌ها...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-350 dark:text-slate-600">
            <span className="text-[10px] font-bold">هنوز فعالیتی ثبت نشده است</span>
          </div>
        ) : (
          <div className="relative border-r-2 border-dashed border-slate-100 dark:border-[#1f2235]/40 mr-3 pr-4 space-y-4">
            <AnimatePresence initial={false}>
              {logs.map((log) => {
                const meta = getActionMeta(log.action);
                const executorName = log.user?.name || "سیستم هوشمند";
                
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="relative flex items-start gap-3 w-full"
                  >
                    {/* آیکون عملیات به صورت پین‌شده روی خط چین‌خورده کنار ردیف */}
                    <div className={`
                      absolute -right-[27px] top-1 p-1 rounded-lg border flex items-center justify-center shadow-sm shrink-0
                      ${meta.color}
                    `}>
                      {meta.icon}
                    </div>

                    <div className="space-y-1 w-full text-right">
                      <div className="flex items-center justify-between gap-4 w-full flex-wrap">
                        <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                          {executorName}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-550 shrink-0">
                          {getRelativeTimePersian(log.createdAt)}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
                        {log.details}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
```

با این چیدمان، اکنون هر زمان که تغییری در پنل ایجاد یا حذف شود، به صورت خودکار لاگ آن در سیستم ثبت شده و در این ابزارک شیک و زنده به بقیه مدیران نمایش داده می‌شود.