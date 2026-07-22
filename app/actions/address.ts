// app/actions/address.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

// تابع کمکی برای یافتن شناسه کاربر لاگین شده
async function getUserId(): Promise<number | null> {
  try {
    const session = await getServerSession();
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      return user?.id || null;
    }
  } catch (error) {
    console.warn("خطا در دریافت سشن کاربر:", error);
  }
  
  // برای تست محلی در صورتی که سیستم احراز هویت تنظیم نشده باشد، اولین کاربر دیتابیس بازگردانده می‌شود.
  // در محیط پروداکشن این بخش را با مدیریت خطای مناسب جایگزین کنید.
  const fallbackUser = await prisma.user.findFirst();
  return fallbackUser?.id || null;
}

// دریافت لیست آدرس‌ها با اطلاعات کاربر
export async function getAddresses() {
  const userId = await getUserId();
  if (!userId) return [];

  return prisma.address.findMany({
    where: {
      userId,
      softDeletedAt: null,
      status: "ACTIVE",
    },
    include: {
      user: {
        select: {
          name: true,
          mobile: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// ایجاد آدرس جدید
export async function createAddress(data: {
  province: string;
  city: string;
  address: string;
  postal: string;
}) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error("کاربر یافت نشد. لطفا ابتدا وارد حساب کاربری خود شوید.");
  }

  const newAddress = await prisma.address.create({
    data: {
      userId,
      province: data.province,
      city: data.city,
      address: data.address,
      postal: data.postal,
      status: "ACTIVE",
    },
  });

  revalidatePath("/profile/addresses");
  return { success: true, address: newAddress };
}

// ویرایش آدرس موجود
export async function updateAddress(
  id: number,
  data: {
    province: string;
    city: string;
    address: string;
    postal: string;
  }
) {
  const userId = await getUserId();
  if (!userId) throw new Error("کاربر یافت نشد.");

  // بررسی مالکیت آدرس پیش از ویرایش
  const existing = await prisma.address.findFirst({
    where: { id, userId, softDeletedAt: null },
  });

  if (!existing) {
    throw new Error("آدرس مورد نظر یافت نشد یا دسترسی به آن مجاز نیست.");
  }

  const updated = await prisma.address.update({
    where: { id },
    data: {
      province: data.province,
      city: data.city,
      address: data.address,
      postal: data.postal,
    },
  });

  revalidatePath("/profile/addresses");
  return { success: true, address: updated };
}

// حذف نرم آدرس (Soft Delete) مطابق با ساختار دیتابیس شما
export async function deleteAddress(id: number) {
  const userId = await getUserId();
  if (!userId) throw new Error("کاربر یافت نشد.");

  const existing = await prisma.address.findFirst({
    where: { id, userId, softDeletedAt: null },
  });

  if (!existing) {
    throw new Error("آدرس مورد نظر یافت نشد یا دسترسی به آن مجاز نیست.");
  }

  await prisma.address.update({
    where: { id },
    data: {
      softDeletedAt: new Date(),
      status: "INACTIVE",
    },
  });

  revalidatePath("/profile/addresses");
  return { success: true };
}