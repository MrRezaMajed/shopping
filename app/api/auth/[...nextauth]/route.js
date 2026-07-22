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
    strategy: "jwt", // استفاده از JWT برای مدیریت سریع نشست‌ها
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;               
        token.permissions = user.permissions; 
        token.name = user.name;                     
        token.picture = user.image || user.avatar;  
      } 
      // 👈 تریگرهای آپدیت یا ثبت نام جدید برای حذف کامل کوئری دیتابیس در لودهای عادی
      else if (trigger === "update" || trigger === "signUp") {
        const dbUser = await prisma.user.findUnique({
          where: { id: Number(token.id) },
          select: { 
            role: true, 
            permissions: true,
            name: true,           
            image: true,          
            avatar: true          
          }
        });
        
        if (dbUser) {
          token.role = dbUser.role;
          token.permissions = dbUser.permissions;
          token.name = dbUser.name;                           
          token.picture = dbUser.image || dbUser.avatar;      
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;               
        session.user.permissions = token.permissions; 
        session.user.name = token.name;       
        session.user.image = token.picture;   
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };