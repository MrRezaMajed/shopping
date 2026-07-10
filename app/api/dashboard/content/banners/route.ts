import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma"; // Singleton Prisma Client
// import { prisma } from "@/lib/prisma"; // Singleton Prisma Client
import fs from "fs";
import path from "path";

// Fetch all posts (in /pages/api/posts.ts)
export default async function handle(req, res) {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
  })
  res.json(posts)
}
// پوشه uploads
const uploadsDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string | null;
    const imageFile = formData.get("image") as File | null;

    if (!title || !imageFile) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const fileName = `${Date.now()}-${imageFile.name}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const test = await prisma.test.create({
      data: {
        title,
        image: `/uploads/${fileName}`,
      },
    });

    return NextResponse.json(test);
  } catch (error) {
    console.error("POST /api/dashboard/content/banners error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
