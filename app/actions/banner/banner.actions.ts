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
  image?: File;
}

export async function getBanners(
  page = 1,
  limit = 5,
  filters?: {
    search?: string;
    position?: "TOP" | "RIGHT" | "DOWN";
    status?: "ACTIVE" | "INACTIVE";
  }
) {
  const skip = (page - 1) * limit;

  const where: any = {
    softDeletedAt: null,
  };

  if (filters?.search) {
    where.title = {
      contains: filters.search, // بدون mode
    };
  }

  if (filters?.position) {
    where.position = filters.position;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  const [data, total] = await Promise.all([
    prisma.banner.findMany({
      skip,
      take: limit,
      orderBy: { id: "desc" },
      where,
    }),
    prisma.banner.count({ where }),
  ]);

  return { data, total };
}



export async function getBannerById(id: number) {
  return await prisma.banner.findUnique({ where: { id } });
}

export async function createBanner(data: BannerFormValues) {
  try {
    let imagePath = "";
    if (data.image) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const fileName = `${Date.now()}_${data.image.name}`;
      const buffer = Buffer.from(await data.image.arrayBuffer());
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      imagePath = `/uploads/${fileName}`;
    }

    const banner = await prisma.banner.create({
      data: { ...data, image: imagePath },
    });

    revalidatePath("/dashboard/banner");
    return { success: true, banner };
  } catch (err) {
    console.error(err);
    return { success: false, error: "خطا در ایجاد بنر" };
  }
}

export async function updateBanner(id: number, data: BannerFormValues) {
  try {
    let updatedData: any = { ...data };
    if (data.image) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const fileName = `${Date.now()}_${data.image.name}`;
      const buffer = Buffer.from(await data.image.arrayBuffer());
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      updatedData.image = `/uploads/${fileName}`;
    }

    const banner = await prisma.banner.update({
      where: { id },
      data: updatedData,
    });

    revalidatePath("/dashboard/banner");
    return { success: true, banner };
  } catch (err) {
    console.error(err);
    return { success: false, error: "خطا در بروزرسانی بنر" };
  }
}

export async function deleteBanner(id: number) {
  try {
    await prisma.banner.update({ where: { id }, data: { softDeletedAt: new Date() } });
    revalidatePath("/dashboard/banner");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "خطا در حذف بنر" };
  }
}
