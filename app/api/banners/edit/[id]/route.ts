import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bannerId = Number(id);

    if (!Number.isInteger(bannerId)) {
      return NextResponse.json(
        { error: "شناسه بنر نامعتبر است" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const position = formData.get("position") as "TOP" | "RIGHT" | "DOWN";
    const status = formData.get("status") as "ACTIVE" | "INACTIVE";
    const image = formData.get("image") as File | null;

    if (!title || !url || !position || !status) {
      return NextResponse.json(
        { error: "اطلاعات اجباری ناقص است" },
        { status: 400 }
      );
    }

    const existing = await prisma.banner.findUnique({
      where: { id: bannerId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "بنر پیدا نشد" },
        { status: 404 }
      );
    }

    let imagePath = existing.image;

    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await fs.promises.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}_${image.name}`;
      await fs.promises.writeFile(
        path.join(uploadDir, fileName),
        buffer
      );

      imagePath = `/uploads/${fileName}`;
    }

    const updated = await prisma.banner.update({
      where: { id: bannerId },
      data: { title, url, position, status, image: imagePath },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "خطا در ذخیره بنر" },
      { status: 500 }
    );
  }
}
