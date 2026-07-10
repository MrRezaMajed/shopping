// متدهای کمکی و قالب‌بندی فایل و اعداد


import { toEnglishNumber, formatPersianNumber } from "@/lib/utils/persianNumbers";

export function formatNumericInput(raw: string) {
  const english = toEnglishNumber(raw);
  const digitsOnly = english.replace(/[^0-9]/g, "");
  return formatPersianNumber(digitsOnly);
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}