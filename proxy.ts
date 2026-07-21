// proxy.js (یا proxy.ts)

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // 👈 نام تابع داخلی به proxy تغییر یافت تا با ساختار Next.js 16 همگام شود
  function proxy(req) { 
    const token = req.nextauth.token;
    const role = token?.role;

    // لیست نقش‌های مجاز برای دسترسی به پنل مدیریت
    const allowedRoles = ["ADMIN", "SUPER_ADMIN", "SUPPORT", "WRITER"];

    // اگر کاربر نقش معتبری نداشت، به صفحه اصلی انتقال داده می‌شود
    if (!role || !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      // اگر کاربر کلاً لاگین نکرده باشد، NextAuth خودکار درخواست او را رد می‌کند
      authorized: ({ token }) => !!token,
    },
  }
);

// مسیرهایی که نیاز به فیلتر و محافظت سرور دارند
export const config = {
  matcher: [
    "/panel/:path*",      // مسدودسازی دستی روت /panel و تمام زیرمسیرهای آن
    "/dashboard/:path*",  // مسدودسازی دستی روت /dashboard و تمام زیرمسیرهای آن
    "/admin/:path*"
  ],
};