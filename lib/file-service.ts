import fs from "fs";
import path from "path";

// ذخیره یک فایل و برگشت مسیر
export async function saveFile(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${file.name}`;
  const fullPath = path.join(uploadDir, fileName);
  await fs.promises.writeFile(fullPath, buffer);

  return `/uploads/${fileName}`;
}

// ذخیره چند فایل
export async function saveMultipleFiles(files: File[]) {
  const results: string[] = [];
  for (const file of files) {
    if (file.size > 0) results.push(await saveFile(file));
  }
  return results;
}

// حذف فایل از دیسک
export async function deleteFile(filePath: string) {
  try {
    const fullPath = path.join(process.cwd(), "public", filePath.replace(/^\/+/, ""));
    if (fs.existsSync(fullPath)) await fs.promises.unlink(fullPath);
  } catch (err) {
    console.warn("Failed to delete file:", filePath, err);
  }
}
