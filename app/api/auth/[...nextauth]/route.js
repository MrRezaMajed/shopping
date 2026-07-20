import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter"; // 👈 آداپتور رسمی پریزما
import { prisma } from "@/lib/prisma"; // 👈 نمونه اتصال پریزما پروژه شما

export const authOptions = { // 👈 تعیین نوع `: any` برای هماهنگی با جاوااسکریپت حذف شد
  // 👈 این خط را برای ذخیره خودکار کاربران در دیتابیس فعال کنید
  adapter: PrismaAdapter(prisma), 

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt", // استفاده هوشمندانه از JWT برای مدیریت سریع نشست‌ها
  },
  callbacks: {
    async jwt({ token, user }) { // 👈 تایپ‌های اضافی حذف شدند
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) { // 👈 تایپ‌های اضافی حذف شدند
      if (session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };