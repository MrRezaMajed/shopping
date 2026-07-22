// components/profile/addresses/AddressModal.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaSpinner, FaRegAddressCard, FaLocationArrow } from "react-icons/fa";
import { createAddress, updateAddress } from "@/app/actions/address";
import { toEnglishNumber } from "@/lib/utils/persianNumbers";

type AddressType = {
  id: number;
  province: string;
  city: string;
  address: string;
  postal: string;
};

type AddressModalProps = {
  open: boolean;
  onClose: () => void;
  addressToEdit: AddressType | null;
};

export default function AddressModal({ open, onClose, addressToEdit }: AddressModalProps) {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postal, setPostal] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  // شبیه‌ساز مستقیم تناظر دکمه‌های کیبورد انگلیسی به فارسی (حروف، اعداد، ویرگول، دو نقطه و نقطه)
  const emulatePersianKeyboard = (val: string): string => {
    const layoutMap: Record<string, string> = {
      // ردیف اول حروف کیبورد QWERTY
      'q': 'ض', 'w': 'ص', 'e': 'ث', 'r': 'ق', 't': 'ف', 'y': 'غ', 'u': 'ع', 'i': 'ه', 'o': 'خ', 'p': 'ح', '[': 'ج', ']': 'چ', '\\': 'پ',
      'Q': 'ض', 'W': 'ص', 'E': 'ث', 'R': 'ق', 'Y': 'غ', 'U': 'ع', 'I': 'ه', 'O': 'خ', 'P': 'ح', '{': 'ج', '}': 'چ', '|': 'پ',
      'T': '،', 
      
      // ردیف دوم حروف کیبورد QWERTY
      'a': 'ش', 's': 'س', 'd': 'ی', 'f': 'ب', 'g': 'ل', 'h': 'ا', 'j': 'ت', 'k': 'ن', 'l': 'م', ';': 'ک', "'": 'گ',
      'A': 'ش', 'S': 'س', 'D': 'ی', 'F': 'ب', 'G': 'ل', 'H': 'آ', 'J': 'ت', 'K': 'ن', 'L': 'م', 
      ':': ':',  // دو نقطه بیانی
      '"': '؛',  // نقطه ویرگول با Shift + '

      // ردیف سوم حروف کیبورد QWERTY
      'z': 'ظ', 'x': 'ط', 'c': 'ز', 'v': 'ر', 'b': 'ذ', 'n': 'د', 'm': 'ئ', ',': 'و', 
      '.': '.',  // نقطه
      '/': '.',  // در کیبورد استاندارد فارسی کلید اسلش معادل نقطه است
      'Z': 'ظ', 'X': 'ط', 'C': 'ژ', 'V': 'ر', 'B': 'ذ', 'N': 'د', 'M': 'پ', '?': '؟',
      '`': 'پ', '~': 'ژ',
      '<': '،',
      '&': '،' 
    };

    const englishDigits = /[0-9]/g;
    const arabicDigits = /[٠-٩]/g;
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

    let result = "";
    for (const char of val) {
      if (layoutMap[char]) {
        result += layoutMap[char];
      } else if (char.match(englishDigits)) {
        result += char.replace(englishDigits, (w) => persianDigits[parseInt(w, 10)]);
      } else if (char.match(arabicDigits)) {
        result += char.replace(arabicDigits, (w) => persianDigits[char.charCodeAt(0) - 1632]);
      } else {
        result += char;
      }
    }
    return result;
  };

  // 👈 هندلر کلیدهای خاص برای ثبت «نیم‌فاصله» با کلیدهای ترکیبی Shift + Space و Ctrl + Shift + 2
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const isShiftSpace = e.shiftKey && e.code === "Space";
    const isCtrlShiftTwo = e.ctrlKey && e.shiftKey && e.code === "Digit2"; // 👈 پشتیبانی از Ctrl + Shift + 2

    if (isShiftSpace || isCtrlShiftTwo) {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart ?? 0;
      const end = target.selectionEnd ?? 0;
      const value = target.value;

      // درج کاراکتر نیم‌فاصله (\u200c) در موقعیت مکان‌نما
      const newValue = value.substring(0, start) + "\u200c" + value.substring(end);

      target.value = newValue;
      target.selectionStart = target.selectionEnd = start + 1;

      // به‌روزرسانی استیت متناظر با اینپوت مربوطه
      const id = target.id;
      if (id === "province") setProvince(newValue);
      else if (id === "city") setCity(newValue);
      else if (id === "address") setAddress(newValue);
    }
  };

  const handlePostalInput = (val: string): string => {
    const englishDigits = /[0-9]/g;
    const arabicDigits = /[٠-٩]/g;
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

    let cleaned = val
      .replace(englishDigits, (char) => persianDigits[parseInt(char, 10)])
      .replace(arabicDigits, (char) => persianDigits[char.charCodeAt(0) - 1632]);

    return cleaned.replace(/[^۰-۹]/g, "");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (addressToEdit) {
      setProvince(emulatePersianKeyboard(addressToEdit.province));
      setCity(emulatePersianKeyboard(addressToEdit.city));
      setAddress(emulatePersianKeyboard(addressToEdit.address));
      setPostal(handlePostalInput(addressToEdit.postal));
    } else {
      setProvince("");
      setCity("");
      setAddress("");
      setPostal("");
    }
    setError("");
  }, [addressToEdit, open]);

  if (!open || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const englishPostal = toEnglishNumber(postal.trim());

    if (!province.trim() || !city.trim() || !address.trim() || !englishPostal) {
      setError("لطفاً تمام فیلدها را تکمیل نمایید.");
      return;
    }

    if (englishPostal.length !== 10 || isNaN(Number(englishPostal))) {
      setError("کد پستی وارد شده باید دقیقاً ۱۰ رقم عددی باشد.");
      return;
    }

    startTransition(async () => {
      try {
        if (addressToEdit) {
          await updateAddress(addressToEdit.id, { province, city, address, postal: englishPostal });
        } else {
          await createAddress({ province, city, address, postal: englishPostal });
        }
        onClose();
      } catch (err: any) {
        setError(err.message || "خطایی در ذخیره اطلاعات به وجود آمد.");
      }
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-transparent z-[99999] flex items-center justify-center p-4 pointer-events-auto select-none"
    >
      <section
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 30px 100px rgba(0, 0, 0, 0.25), 0 10px 40px rgba(0, 0, 0, 0.1)"
        }}
        className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl p-6 border border-slate-200 dark:border-slate-700 select-text"
      >
        {/* Header */}
        <section className="flex justify-between items-center mb-6">
          <h3 className="text-base md:text-lg font-bold flex items-center gap-2 text-gray-950 dark:text-white">
            <FaRegAddressCard className="text-blue-500 text-xl" />
            {addressToEdit ? "ویرایش آدرس فعلی" : "ثبت آدرس جدید"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center transition"
          >
            <FaTimes />
          </button>
        </section>

        {/* Errors */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl border border-red-100 dark:border-red-950/50">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">استان</label>
              <input
                id="province"
                type="text"
                value={province}
                disabled={isPending}
                onKeyDown={handleKeyDown} // 👈 کنترل کلیدهای میانبر نیم‌فاصله
                onChange={(e) => setProvince(emulatePersianKeyboard(e.target.value))}
                placeholder="مثال: تهران"
                className="w-full text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">شهر</label>
              <input
                id="city"
                type="text"
                value={city}
                disabled={isPending}
                onKeyDown={handleKeyDown} // 👈 کنترل کلیدهای میانبر نیم‌فاصله
                onChange={(e) => setCity(emulatePersianKeyboard(e.target.value))}
                placeholder="مثال: تهران"
                className="w-full text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">کد پستی (۱۰ رقمی)</label>
            <input
              type="text"
              maxLength={10}
              value={postal}
              disabled={isPending}
              onChange={(e) => setPostal(handlePostalInput(e.target.value))}
              placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰"
              className="w-full text-sm text-left font-semibold tracking-widest bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">آدرس دقیق پستی</label>
            <textarea
              id="address"
              rows={3}
              value={address}
              disabled={isPending}
              onKeyDown={handleKeyDown} // 👈 کنترل کلیدهای میانبر نیم‌فاصله
              onChange={(e) => setAddress(emulatePersianKeyboard(e.target.value))}
              placeholder="خیابان، کوچه، پلاک، واحد..."
              className="w-full text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 resize-none leading-relaxed"
            />
          </div>

          {/* Footer Actions */}
          <section className="flex justify-end pt-3 gap-2 border-t border-slate-100 dark:border-slate-700 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-60"
            >
              بستن
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2 disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  <span>در حال ثبت...</span>
                </>
              ) : (
                <>
                  <FaLocationArrow className="text-xs rotate-[225deg]" />
                  <span>ثبت و ذخیره آدرس</span>
                </>
              )}
            </button>
          </section>
        </form>
      </section>
    </div>,
    document.body
  );
}