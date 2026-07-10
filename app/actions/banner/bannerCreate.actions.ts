"use server";

import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";


export interface BannerFormValues {
  title: string;
  url: string;
  position: "TOP" | "RIGHT" | "DOWN";
  status: "ACTIVE" | "INACTIVE";
  image: File;
}

interface DeleteBannerResult {
  success: boolean;
  error?: string;
}

export async function getBannerById(id: number) {
  return await prisma.banner.findUnique({
    where: { id },
  });
}

/* ---------- ایجاد بنر ---------- */
export async function createBanner(data: BannerFormValues) {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fileName = `${Date.now()}_${data.image.name}`;
    const filePath = path.join(uploadDir, fileName);

    const buffer = Buffer.from(await data.image.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        url: data.url,
        position: data.position,
        status: data.status,
        image: `/uploads/${fileName}`,
      },
    });

    return { success: true, banner };
  } catch (error) {
    console.error(error);
    return { success: false, error: "خطا در ایجاد بنر" };
  }
}

/* ---------- دریافت بنرها با Pagination ---------- */
export async function getBanners(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.banner.findMany({
      skip,
      take: limit,
      orderBy: { id: "desc" },
    }),
    prisma.banner.count(),
  ]);

  return { data, total };
}

export async function toggleBannerStatus(id: number) {
  try {
    // 1. بررسی وجود بنر
    const banner = await prisma.banner.findUnique({
      where: { 
        id,
        softDeletedAt: null,
      },
    });

    if (!banner) {
      return {
        success: false,
        error: "بنر یافت نشد",
      };
    }

    // 2. محاسبه وضعیت جدید
    const newStatus = banner.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    // 3. بروزرسانی در دیتابیس
    const updatedBanner = await prisma.banner.update({
      where: { 
        id,
        softDeletedAt: null,
      },
      data: {
        status: newStatus,
      },
    });

    // 4. Revalidate برای بروزرسانی کش
    revalidatePath("/dashboard/content/banners");
    
    // 5. بازگشت نتیجه موفق
    return {
      success: true,
      data: updatedBanner,
      message: "وضعیت با موفقیت تغییر کرد",
    };
  } catch (error) {
    console.error("Error toggling banner status:", error);
    
    // 6. بازگشت خطا به صورت ساختاریافته
    let errorMessage = "خطا در تغییر وضعیت بنر";
    
    if (error instanceof Error) {
      if (error.message.includes("Record to update not found")) {
        errorMessage = "بنر مورد نظر پیدا نشد";
      }
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function deleteBanner(id: number): Promise<DeleteBannerResult> {
  await prisma.banner.delete({ where: { id } });
  revalidatePath("/dashboard/content/banners");
  return { success: true };
}

