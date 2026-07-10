import { secureShortId } from "./short-id";

/**
 * تابع بهینه برای تبدیل رشته فارسی یا انگلیسی به اسلاگ
 * - تمام حروف به کوچک تبدیل می‌شوند
 * - فاصله‌ها و کاراکترهای غیرمجاز با "-" جایگزین می‌شوند
 * - چند "-" پشت سر هم به یک "-" تبدیل می‌شود
 * - شروع و پایان اسلاگ "-" ندارد
 */
function slugify(name: string): string {
  if (!name) return "";

  return name
    .toLowerCase() // تبدیل به حروف کوچک
    .normalize("NFD") // جدا کردن حروف ترکیبی
    .replace(/[\u0300-\u036f]/g, "") // حذف علامت‌های ترکیبی
    .replace(/[\s\_]+/g, "-") // فاصله و underscore -> "-"
    .replace(/[^a-z0-9\u0600-\u06FF-]+/g, "") // حذف کاراکترهای غیرمجاز (a-z, 0-9, فارسی)
    .replace(/-+/g, "-") // چند "-" پشت سر هم -> "-"
    .replace(/^-+|-+$/g, ""); // حذف "-" اول و آخر
}

/**
 * ساخت اسلاگ نهایی محصول با shortId
 * @param name نام محصول (فارسی یا انگلیسی)
 * @returns اسلاگ یکتا برای URL
 */
export function generateSlug(name: string): string {
  const baseSlug = slugify(name);
  const shortId = secureShortId();

  return baseSlug ? `${baseSlug}-${shortId}` : shortId;
}

