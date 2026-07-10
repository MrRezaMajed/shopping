// /**
//  * تبدیل اعداد انگلیسی به فارسی
//  */
// export const toPersianNumber = (num: number | string): string => {
//   const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
//   return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
// };

// export const formatPrice = (price: number): string => {
//   return price.toLocaleString('fa-IR');
// };

// /**
//  * تبدیل اعداد فارسی به انگلیسی
//  */
// export const toEnglishNumber = (persianNum: string): string => {
//   const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
//   const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
//   const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
//   let result = persianNum;
  
//   // تبدیل اعداد فارسی
//   persianDigits.forEach((persianDigit, index) => {
//     result = result.replace(new RegExp(persianDigit, 'g'), englishDigits[index]);
//   });
  
//   // تبدیل اعداد عربی
//   arabicDigits.forEach((arabicDigit, index) => {
//     result = result.replace(new RegExp(arabicDigit, 'g'), englishDigits[index]);
//   });
  
//   return result;
// };

// /**
//  * فرمت کردن عدد با جداکننده هزارگان فارسی
//  */
// export const formatPersianNumber = (num: number | string): string => {
//   const persianNum = toPersianNumber(num);
//   return persianNum.replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
// };

// /**
//  * بررسی آیا رشته شامل اعداد فارسی است
//  */
// export const containsPersianNumbers = (str: string): boolean => {
//   const persianDigits = /[۰-۹]/;
//   return persianDigits.test(str);
// };


// lib/utils/persianNumbers.ts

/**
 * تبدیل اعداد انگلیسی به فارسی
 */
export const toPersianNumber = (num: number | string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

/**
 * تبدیل اعداد فارسی به انگلیسی
 */
export const toEnglishNumber = (persianNum: string): string => {
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  let result = persianNum;
  
  persianDigits.forEach((persianDigit, index) => {
    result = result.replace(new RegExp(persianDigit, 'g'), englishDigits[index]);
  });
  
  arabicDigits.forEach((arabicDigit, index) => {
    result = result.replace(new RegExp(arabicDigit, 'g'), englishDigits[index]);
  });
  
  return result;
};

/**
 * فرمت کردن عدد با جداکننده هزارگان (فارسی)
 * ورودی: عدد (عدد یا رشته انگلیسی)
 * خروجی: رشته با جداکننده فارسی (مثال: ۱۲,۳۴۵,۶۷۸)
 */
export const formatPersianNumber = (num: number | string): string => {
  if (num === null || num === undefined || num === '') return '';
  
  // ۱. تبدیل به عدد انگلیسی (اگر رشته فارسی باشد)
  const englishStr = typeof num === 'string' ? toEnglishNumber(num) : String(num);
  
  // ۲. حذف کاراکترهای غیرعددی (به جز جداکننده‌ها)
  const cleaned = englishStr.replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  
  // ۳. تبدیل به عدد
  const number = parseInt(cleaned, 10);
  if (isNaN(number)) return '';
  
  // ۴. فرمت با جداکننده هزارگان (به انگلیسی)
  const formattedEnglish = number.toLocaleString('en-US');
  
  // ۵. تبدیل به فارسی
  return toPersianNumber(formattedEnglish);
};

/**
 * تبدیل رشته فرمت‌شده فارسی به عدد خام انگلیسی (برای ذخیره در دیتابیس)
 */
export const parsePersianNumber = (persianFormatted: string): number => {
  const english = toEnglishNumber(persianFormatted);
  const cleaned = english.replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};