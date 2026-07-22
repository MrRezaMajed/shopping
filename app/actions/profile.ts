// @/app/actions/profile.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { handleFileUpload } from "@/app/actions/crud/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * دریافت اطلاعات کاربر لاگین شده با الگوریتم جستجوی چندگانه
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      console.log("⚠️ [getCurrentUser] سشن فعال یافت نشد.");
      return { success: false, error: "کاربر احراز هویت نشده است" };
    }

    const email = session.user.email;
    const name = session.user.name;
    const userId = (session.user as any).id;
    const userMobile = (session.user as any).mobile || (session.user as any).phone;

    let user = null;

    if (userId) {
      const parsedId = Number(userId);
      if (!isNaN(parsedId)) {
        user = await prisma.user.findUnique({ where: { id: parsedId } });
      }
    }
    if (!user && email) {
      user = await prisma.user.findUnique({ where: { email: email } });
    }
    if (!user && email && email.match(/^09\d{9}$/)) {
      user = await prisma.user.findUnique({ where: { mobile: email } });
    }
    if (!user && name && name.match(/^09\d{9}$/)) {
      user = await prisma.user.findUnique({ where: { mobile: name } });
    }
    if (!user && userMobile) {
      user = await prisma.user.findUnique({ where: { mobile: userMobile } });
    }

    if (!user) {
      return { success: false, error: "رکورد کاربری در دیتابیس یافت نشد" };
    }

    return { 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        image: user.image || user.avatar, // 👈 همگام‌سازی فیلد تصویر و آواتار در زمان خواندن
        avatar: user.avatar || user.image,
      } 
    };
  } catch (error: any) {
    console.error("🔴 [getCurrentUser] خطا:", error);
    return { success: false, error: error.message };
  }
}

/**
 * بروزرسانی مشخصات کاربر لاگین شده
 */
export async function updateProfile(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: "دسترسی غیرمجاز" };
    }

    const email = session.user.email;
    const name = session.user.name;
    const userId = (session.user as any).id;
    const userMobile = (session.user as any).mobile || (session.user as any).phone;

    let user = null;

    if (userId) {
      const parsedId = Number(userId);
      if (!isNaN(parsedId)) {
        user = await prisma.user.findUnique({ where: { id: parsedId } });
      }
    }
    if (!user && email) {
      user = await prisma.user.findUnique({ where: { email: email } });
    }
    if (!user && email && email.match(/^09\d{9}$/)) {
      user = await prisma.user.findUnique({ where: { mobile: email } });
    }
    if (!user && name && name.match(/^09\d{9}$/)) {
      user = await prisma.user.findUnique({ where: { mobile: name } });
    }
    if (!user && userMobile) {
      user = await prisma.user.findUnique({ where: { mobile: userMobile } });
    }

    if (!user) {
      return { success: false, error: "کاربر معتبری برای ویرایش یافت نشد" };
    }

    const updatedName = formData.get("name") as string;
    const mobile = formData.get("mobile") as string;
    const avatarFile = formData.get("avatar") as File | null;

    if (!updatedName || !updatedName.trim()) {
      return { success: false, error: "نام و نام خانوادگی الزامی است" };
    }

    const updateData: any = {
      name: updatedName,
      mobile: mobile || null,
    };

    if (avatarFile && avatarFile.size > 0) {
      const uploadUrl = await handleFileUpload(avatarFile);
      updateData.image = uploadUrl;  // 👈 آپدیت ستون تصویر مخصوص NextAuth
      updateData.avatar = uploadUrl; // 👈 آپدیت ستون آواتار مخصوص پایگاه داده شما
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    console.error("🔴 [updateProfile] خطا:", error);
    return { success: false, error: "خطا در ثبت اطلاعات رخ داده است" };
  }
}