"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // 👈 فایل مسیر کانفیگ NextAuth شما

interface LogActivityInput {
  userId?: number | null;
  action: "CREATE" | "UPDATE" | "DELETE" | "RESTORE" | "SYSTEM_AUTO";
  modelName: string;
  recordId?: number | null;
  targetName?: string | null; 
  details: string;
}

/**
 * تابع سریالایز کردن ایمن داده‌ها برای حل مشکل انتقال Date یا Decimal از سمت سرور به کلاینت نکس‌جی‌اس
 */
function serializeData<T>(data: T): any {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      // تبدیل مقادیر BigInt به رشته جهت جلوگیری از خطای سریالایز دیتابیس
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    })
  );
}

/**
 * متد درج خودکار لاگ فعالیت در پایگاه داده (به همراه تشخیص خودکار کاربر لاگین شده و پاکسازی ۱۰ روزه)
 */
export async function logActivity({
  userId = null,
  action,
  modelName,
  recordId = null,
  targetName = null,
  details,
}: LogActivityInput) {
  try {
    let finalUserId: number | null = userId;

    // ۱. تشخیص خودکار کاربر لاگین شده بر اساس سشن فعال
    if (!finalUserId) {
      const session = await getServerSession(authOptions);
      
      if (session?.user) {
        // ابتدا تلاش می‌کنیم آیدی ذخیره شده در سشن را بخوانیم
        if (session.user.id) {
          finalUserId = Number(session.user.id);
        } else if (session.user.email) {
          // اگر آیدی در سشن نبود، بر اساس ایمیل کاربر را در دیتابیس جستجو می‌کنیم
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
          });
          if (dbUser) {
            finalUserId = dbUser.id;
          }
        }
      }
    }

    // ۲. ثبت نهایی لاگ در پایگاه داده با آیدی واقعی کاربر
    await prisma.auditLog.create({
      data: {
        userId: finalUserId, // در صورت عدم وجود سشن فعال، مقدار null (سیستم هوشمند) ذخیره می‌شود
        action,
        modelName,
        recordId,
        targetName,
        details,
      },
    });

    // ۳. پاکسازی خودکار لاگ‌های قدیمی‌تر از ۱۰ روز
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    // 👈 اجرای کوئری به صورت پس‌زمینه بدون await؛ برای معطل نشدن کاربر در ثبت اطلاعات اصلی
    prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: tenDaysAgo // حذف هر رکوردی که تاریخ ایجاد آن قبل از ۱۰ روز پیش است
        }
      }
    }).catch(err => console.error("خطا در پاکسازی خودکار لاگ‌های قدیمی:", err));

    return { success: true };
  } catch (error) {
    console.error("Failed to write audit log:", error);
    return { success: false, error: "خطا در ثبت لاگ" };
  }
}

/**
 * واکشی جدیدترین لاگ‌های ثبت‌شده برای نمایش در فرانت‌اند
 */
export async function getRecentAuditLogs(limit: number = 7) {
  try {
    const logs = await prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true, // دریافت نام و فامیل کاربر به صورت یکجا از گیت‌هاب یا گوگل
            image: true, // دریافت تصویر آواتار
          },
        },
      },
    });
    
    return { success: true, data: serializeData(logs) };
  } catch (err: any) {
    console.error("getRecentAuditLogs error:", err);
    return { success: false, data: [], error: err.message };
  }
}