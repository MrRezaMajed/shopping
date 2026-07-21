// app/actions/auth.ts
"use server";

import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer"; 

// پیکربندی فرستنده ایمیل با استفاده از متغیرهای محیطی
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // true برای پورت 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const isValidEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export async function sendOTPAction(email: string) {
  if (!email || !isValidEmail(email)) {
    return { success: false, error: "لطفاً یک ایمیل معتبر وارد کنید." };
  }

  try {
    // تولید کد ۵ رقمی
    const otpCode = Math.floor(10000 + Math.random() * 90000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // معتبر برای ۵ دقیقه

    // حذف کدهای قدیمی این ایمیل جهت خلوت ماندن دیتابیس
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // ذخیره کد جدید در دیتابیس
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otpCode,
        expires,
      },
    });

    // 👈 ارسال ایمیل واقعی به کاربر با قالب راست‌چین و شیک
    await transporter.sendMail({
      from: `"تایید هویت سایت هنرکده ریحانه" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "کد تایید ورود به سایت هنرکده ریحانه",
      text: `کد تایید شما: ${otpCode}`, // نسخه متنی ساده
      html: `
        <div style="direction: rtl; text-align: center; font-family: Tahoma, sans-serif; padding: 30px; background-color: #f8fafc; border-radius: 16px; max-width: 480px; margin: auto; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <h2 style="color: #1e293b; margin-bottom: 10px; font-size: 20px;">کد تایید ورود</h2>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">کد ۵ رقمی یک‌بار مصرف شما جهت ورود به سیستم:</p>
          
          <div style="background-color: #f1f5f9; padding: 16px; border-radius: 12px; font-size: 28px; font-weight: bold; letter-spacing: 8px; color: #2563eb; display: inline-block; min-width: 150px;">
            ${otpCode}
          </div>
          
          <p style="color: #94a3b8; font-size: 11px; margin-top: 24px;">این کد به دلایل امنیتی پس از ۵ دقیقه منقضی خواهد شد.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error in sendOTPAction:", error);
    return { 
      success: false, 
      error: "خطایی در ارسال ایمیل رخ داد. لطفاً چند لحظه بعد مجدداً تلاش کنید." 
    };
  }
}