// @/lib/auth.ts

import { NextAuthOptions, DefaultSession, DefaultUser } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
      permissions?: string[];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    permissions?: string[];
    status?: string;
    password?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    permissions?: string[];
    picture?: string | null; 
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "ایمیل", type: "email" },
        code: { label: "کد تایید", type: "text" }
      },
      async authorize(credentials) {
        console.log("--- [Authorize Action Triggered] ---");
        if (!credentials?.email || !credentials?.code) {
          throw new Error("لطفاً ایمیل و کد تایید را وارد نمایید.");
        }

        const email = credentials.email.toLowerCase().trim();
        const code = credentials.code;

        const verification = await prisma.verificationToken.findFirst({
          where: {
            identifier: email,
            token: code,
            expires: { gt: new Date() } 
          }
        });

        if (!verification) {
          console.log("❌ کد تایید اشتباه یا منقضی است.");
          throw new Error("کد تایید وارد شده اشتباه یا منقضی شده است.");
        }

        await prisma.verificationToken.deleteMany({
          where: { identifier: email },
        });

        let user = await prisma.user.findUnique({
          where: { email }
        });

        // تولید لینک هوشمند عکس (فقط در صورتی کار می‌کند که ایمیل در Gravatar ثبت شده باشد)
        const googleImage = `https://unavatar.io/${email}`;
        console.log("📷 آدرس تصویر تولید شده برای فرم:", googleImage);

        if (!user) {
          console.log("📝 کاربر جدید پیدا نشد، در حال ثبت‌نام...");
          user = await prisma.user.create({
            data: {
              email,
              name: email.split("@")[0],
              image: googleImage,
              status: "ACTIVE"
            }
          });
          console.log("✅ کاربر جدید با تصویر پیش‌فرض ساخته شد:", user.email);
        } else if (!user.image || (typeof user.image === "string" && user.image.startsWith("https://unavatar.io"))) {
          console.log("🔄 کاربر قدیمی پیدا شد، در حال بررسی به‌روزرسانی تصویر...");
          user = await prisma.user.update({
            where: { id: user.id },
            data: { image: googleImage }
          });
        }

        return user;
      }
    })
  ],

  session: {
    strategy: "jwt", 
    maxAge: 30 * 24 * 60 * 60, 
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("--- [SignIn Callback Triggered] ---");
      console.log("Provier:", account?.provider);
      
      if (account?.provider === "google" && user.email) {
        // دریافت صحیح آدرس عکس از پروفایل گوگل
        const googleImage = (profile as any)?.picture || user.image;
        console.log("📷 آدرس واقعی تصویر جیمیل دریافت شده از گوگل:", googleImage);

        if (googleImage) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email },
              select: { id: true, image: true }
            });

            if (dbUser) {
              console.log("👤 کاربر در دیتابیس یافت شد. تصویر فعلی دیتابیس:", dbUser.image);
              if (dbUser.image !== googleImage) {
                await prisma.user.update({
                  where: { id: dbUser.id },
                  data: { image: googleImage }
                });
                console.log("💾 عکس جدید گوگل با موفقیت در دیتابیس ذخیره شد.");
              } else {
                console.log("ℹ️ عکس جدید با عکس دیتابیس یکی است، نیازی به آپدیت نیست.");
              }
            } else {
              console.log("⚠️ کاربر هنوز در دیتابیس ایجاد نشده است (این مورد در اولین لاگین طبیعی است و ادپتر آن را می‌سازد).");
            }
          } catch (error) {
            console.error("❌ خطا در ذخیره عکس جیمیل:", error);
          }
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
        token.picture = user.image; 
        console.log("🔑 توکن جدید ساخته شد با آدرس تصویر:", token.picture);
      } else if (token.id) {
        const isNumeric = !isNaN(Number(token.id));
        const userId = isNumeric ? Number(token.id) : token.id;
        
        const dbUser = await prisma.user.findUnique({
          where: { id: userId as any },
          select: { role: true, permissions: true, image: true } 
        });
        
        if (dbUser) {
          token.role = dbUser.role;
          token.permissions = dbUser.permissions;
          token.picture = dbUser.image; 
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.permissions = token.permissions;
        session.user.image = token.picture; 
      }
      return session;
    }
  },

  pages: {
    signIn: "/auth/signin", 
    error: "/auth/error",   
  },

  secret: process.env.NEXTAUTH_SECRET, 
};