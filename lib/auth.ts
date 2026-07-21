// @/lib/auth.ts

import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  // اتصال به پایگاه‌داده پریزما جهت ذخیره‌سازی نشست‌ها و اطلاعات کاربران
  adapter: PrismaAdapter(prisma),
  
  providers: [
    // نمونه ارائه‌دهنده گوگل (OAuth)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // نمونه ارائه‌دهنده گیت‌هاب (OAuth)
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    
    // نمونه ارائه‌دهنده ورود سنتی با ایمیل/موبایل و رمزعبور
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "ایمیل یا موبایل", type: "text" },
        password: { label: "رمز عبور", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("لطفاً اطلاعات ورود را وارد نمایید.");
        }

        // جستجوی کاربر در دیتابیس
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.username },
              { mobile: credentials.username }
            ]
          }
        });

        if (!user || !user.password) {
          throw new Error("کاربری با این مشخصات یافت نشد.");
        }

        // در صورت استفاده از bcrypt برای بررسی رمز عبور:
        // const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        const isPasswordValid = credentials.password === user.password; // جایگزین با متد مقایسه رمزنگاری شما

        if (!isPasswordValid) {
          throw new Error("رمز عبور وارد شده اشتباه است.");
        }

        if (user.status === "INACTIVE") {
          throw new Error("حساب کاربری شما غیرفعال یا مسدود شده است.");
        }

        return user as any;
      }
    })
  ],

  session: {
    strategy: "jwt", // استفاده از استراتژی توکن امن JWT برای نشست‌ها
    maxAge: 30 * 24 * 60 * 60, // انقضای نشست پس از ۳۰ روز
  },

  callbacks: {
    async jwt({ token, user }) {
      // اگر کاربر برای بار اول لاگین کرده باشد، مقادیر اولیه را ذخیره می‌کنیم
      if (user) {
        token.role = (user as any).role;
        token.permissions = (user as any).permissions;
        token.id = user.id;
      } else if (token.id) {
        // 👈 استعلام زنده تغییرات نقش و دسترسی در هر بار لود، جهت همگام‌سازی بلادرنگ تغییرات پنل مدیریت [1]
        const dbUser = await prisma.user.findUnique({
          where: { id: Number(token.id) },
          select: { role: true, permissions: true }
        });
        
        if (dbUser) {
          token.role = dbUser.role;
          token.permissions = dbUser.permissions;
        }
      }
      return token;
    },

    async session({ session, token }) {
      // پاس دادن مقادیر پویای نقش و دسترسی به فرانت‌اند (کلاینت)
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).permissions = token.permissions;
      }
      return session;
    }
  },

  pages: {
    signIn: "/auth/signin", // مسیر سفارشی صفحه لاگین شما (اختیاری)
    error: "/auth/error",   // مسیر سفارشی خطاهای احراز هویت (اختیاری)
  },

  secret: process.env.NEXTAUTH_SECRET, // کلید امنیتی اختصاصی سشن‌ها در فایل .env
};