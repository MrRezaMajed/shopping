"use server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function fetchBannerById(id: number) {
  if (!id || isNaN(id)) {
    throw new Error("ID بنر معتبر نیست");
  }
  return prisma.banner.findUnique({ where: { id } });
}

export async function updateBanner(formData: FormData) {
  try {
    const id = Number(formData.get("id"));
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const position = formData.get("position") as "TOP" | "RIGHT" | "DOWN";
    const status = formData.get("status") as "ACTIVE" | "INACTIVE";
    const image = formData.get("image") as File | null;

    if (!id || !title || !url || !position || !status) {
      return { success: false, error: "اطلاعات ناقص است" };
    }

    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "بنر پیدا نشد" };

    let imagePath = existing.image;

    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await fs.promises.mkdir(uploadDir, { recursive: true });
      const fileName = `${Date.now()}_${image.name}`;
      await fs.promises.writeFile(path.join(uploadDir, fileName), buffer);
      imagePath = `/uploads/${fileName}`;
    }

    await prisma.banner.update({
      where: { id },
      data: { title, url, position, status, image: imagePath },
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "خطا در بروزرسانی بنر" };
  }
}
