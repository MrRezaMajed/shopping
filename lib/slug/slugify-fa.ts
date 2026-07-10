/**
 * تبدیل متن فارسی به اسلاگ قابل استفاده در URL
 */
export function slugifyFa(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")                 // فاصله → خط تیره
    .replace(/[^\u0600-\u06FF0-9-]/g, "") // فقط فارسی، عدد و -
    .replace(/-+/g, "-");                 // حذف - اضافی
}
