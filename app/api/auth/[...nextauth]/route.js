// app/api/auth/[...nextauth]/route.js

import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials"; // اضافه شده جهت ورود دو مرحله‌ای ایمیل
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  // اتصال به آداپتور دیتابیس پریزما
  adapter: PrismaAdapter(prisma), 

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 15000, 
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      httpOptions: {
        timeout: 15000, 
      }
    }),
    // ارائه‌دهنده سیستم تایید کد ۵ رقمی موقت (OTP)
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) {
          throw new Error("لطفاً ایمیل و کد تایید را وارد کنید.");
        }

        // ۱. بررسی وجود و صحت کد تایید در دیتابیس
        const verificationToken = await prisma.verificationToken.findFirst({
          where: {
            identifier: credentials.email,
            token: credentials.code,
          },
        });

        if (!verificationToken || verificationToken.expires < new Date()) {
          throw new Error("کد تایید نامعتبر یا منقضی شده است.");
        }

        // ۲. حذف کد استفاده شده از دیتابیس جهت بالا بردن امنیت
        await prisma.verificationToken.delete({
          where: {
            token: verificationToken.token,
          },
        });

        // ۳. بررسی وجود کاربر یا ایجاد حساب کاربری جدید
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          // تولید نام کاربری از بخش اول ایمیل برای جلوگیری از خطای خالی بودن فیلد name در پریزما
          const defaultName = credentials.email.split("@")[0];

          user = await prisma.user.create({
            data: {
              email: credentials.email,
              emailVerified: new Date(),
              name: defaultName,
            },
          });
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt", // استفاده هوشمندانه از JWT برای مدیریت سریع نشست‌ها
  },
  // این بخش اضافه شد تا در صورت نیاز به ورود، کاربر مستقیماً به صفحه اختصاصی شما هدایت شود
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;               // 👈 حذف کدهای تایپ‌اسکریپت
        token.permissions = user.permissions; // 👈 حذف کدهای تایپ‌اسکریپت
      } else if (token.id) {
        // استعلام زنده تغییرات نقش و دسترسی در هر بار لود جهت همگام‌سازی بلادرنگ تغییرات پنل مدیریت [1]
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
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;               // 👈 حذف کدهای تایپ‌اسکریپت
        session.user.permissions = token.permissions; // 👈 حذف کدهای تایپ‌اسکریپت
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };