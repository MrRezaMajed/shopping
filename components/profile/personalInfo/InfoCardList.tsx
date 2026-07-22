// @/components/profile/InfoCardList.tsx
"use client";

import { useState, useRef, ChangeEvent } from "react";
import { updateProfile } from "@/app/actions/profile";
import { FiUser, FiCamera, FiEdit3, FiLock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import Modal from "./Modal";
import { toPersianNumber, toEnglishNumber } from "@/lib/utils/persianNumbers"; // 👈 وارد کردن توابع کمکی شما

interface User {
  id?: number;
  name: string;
  email?: string | null;
  mobile: string;
  image?: string | null;
}

interface InfoCardListProps {
  user: User;
}

export default function InfoCardList({ user }: InfoCardListProps) {
  // مدیریت وضعیت‌های محلی برای هماهنگی با دیتابیس
  const [currentName, setCurrentName] = useState<string>(user.name || "");
  const [currentMobile, setCurrentMobile] = useState<string>(user.mobile || "");
  const [currentImage, setCurrentImage] = useState<string | null>(user.image || null);

  // وضعیت‌های مربوط به مودال ویرایش فیلدها
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<"name" | "mobile" | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // وضعیت بارگذاری آواتار
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ۱. شبیه‌ساز مستقیم تناظر دکمه‌های کیبورد انگلیسی به فارسی (QWERTY layout to Persian characters)
  const emulatePersianKeyboard = (val: string): string => {
    const layoutMap: Record<string, string> = {
      'q': 'ض', 'w': 'ص', 'e': 'ث', 'r': 'ق', 't': 'ف', 'y': 'غ', 'u': 'ع', 'i': 'ه', 'o': 'خ', 'p': 'ح', '[': 'ج', ']': 'چ', '\\': 'پ',
      'Q': 'ض', 'W': 'ص', 'E': 'ث', 'R': 'ق', 'Y': 'غ', 'U': 'ع', 'I': 'ه', 'O': 'خ', 'P': 'ح', '{': 'ج', '}': 'چ', '|': 'پ',
      'T': '،', 
      'a': 'ش', 's': 'س', 'd': 'ی', 'f': 'ب', 'g': 'ل', 'h': 'ا', 'j': 'ت', 'k': 'ن', 'l': 'م', ';': 'ک', "'": 'گ',
      'A': 'ش', 'S': 'س', 'D': 'ی', 'F': 'ب', 'G': 'ل', 'H': 'آ', 'J': 'ت', 'K': 'ن', 'L': 'م', ':': 'ک', '"': 'گ',
      'z': 'ظ', 'x': 'ط', 'c': 'ز', 'v': 'ر', 'b': 'ذ', 'n': 'د', 'm': 'ئ', ',': 'و', '.': '.', '/': 'پ',
      'Z': 'ظ', 'X': 'ط', 'C': 'ژ', 'V': 'ر', 'B': 'ذ', 'N': 'د', 'M': 'پ', '?': '؟',
      '`': 'پ', '~': 'ژ', '<': '،', '&': '،' 
    };

    let result = "";
    for (const char of val) {
      if (layoutMap[char]) {
        result += layoutMap[char];
      } else {
        result += char;
      }
    }
    return result;
  };

  // ۲. فیلتر سخت‌گیرانه نام و نام خانوادگی (فقط حروف الفبای فارسی، فاصله و نیم‌فاصله مجاز هستند)
  const cleanNameInput = (val: string): string => {
    const mapped = emulatePersianKeyboard(val);
    // حذف هر کاراکتری به غیر از حروف الفبای فارسی، فاصله‌ها و نیم‌فاصله‌ (\u200c)
    return mapped.replace(/[^آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئء\s\u200c]/g, "");
  };

  // ۳. فیلتر سخت‌گیرانه موبایل (فقط اعداد فارسی مجاز هستند)
  const cleanMobileInput = (val: string): string => {
    const englishStr = toEnglishNumber(val);
    const digitsOnly = englishStr.replace(/[^0-9]/g, "");
    return toPersianNumber(digitsOnly);
  };

  // هندلر دکمه‌های ترکیبی برای درج نیم‌فاصله با Shift + Space و Ctrl + Shift + 2
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isShiftSpace = e.shiftKey && e.code === "Space";
    const isCtrlShiftTwo = e.ctrlKey && e.shiftKey && e.code === "Digit2";

    if (isShiftSpace || isCtrlShiftTwo) {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart ?? 0;
      const end = target.selectionEnd ?? 0;
      const value = target.value;

      const newValue = value.substring(0, start) + "\u200c" + value.substring(end);

      target.value = newValue;
      target.selectionStart = target.selectionEnd = start + 1;

      setInputValue(newValue);
    }
  };

  // باز کردن مودال ویرایش برای نام یا موبایل
  const handleEditClick = (field: "name" | "mobile", value: string) => {
    setActiveField(field);
    // لود اولیه مقدار متناظر بر اساس نوع فیلد و فیلتر مربوطه
    setInputValue(field === "mobile" ? toPersianNumber(value) : cleanNameInput(value));
    setError(null);
    setSuccess(null);
    setOpenModal(true);
  };

  // ذخیره اطلاعات نام و موبایل در دیتابیس
  const handleSave = async () => {
    if (!inputValue.trim()) {
      setError("این فیلد نمی‌تواند خالی باشد.");
      return;
    }

    const englishMobile = activeField === "mobile" ? toEnglishNumber(inputValue) : toEnglishNumber(currentMobile);

    if (activeField === "mobile") {
      if (englishMobile.length !== 11 || !englishMobile.startsWith("09")) {
        setError("شماره همراه وارد شده باید ۱۱ رقم بوده و با ۰۹ شروع شود.");
        return;
      }
    }

    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", activeField === "name" ? inputValue : currentName);
    formData.append("mobile", englishMobile);

    try {
      const response = await updateProfile(formData);
      if (response.success) {
        if (activeField === "name") setCurrentName(inputValue);
        if (activeField === "mobile") setCurrentMobile(englishMobile);
        
        setSuccess("تغییرات با موفقیت در دیتابیس ذخیره شد.");
        setTimeout(() => setOpenModal(false), 1500);
      } else {
        setError(response.error || "خطا در ذخیره اطلاعات.");
      }
    } catch (err) {
      setError("خطای ارتباط با سرور رخ داده است.");
    } finally {
      setSaving(false);
    }
  };

  // آپلود آنی تصویر کاربری جدید
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("name", currentName);
      formData.append("mobile", currentMobile);
      formData.append("avatar", file);

      try {
        const response = await updateProfile(formData);
        if (response.success) {
          setCurrentImage(URL.createObjectURL(file));
        } else {
          alert(response.error || "خطا در آپلود عکس");
        }
      } catch (err) {
        alert("خطای ارتباط با سرور رخ داد.");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* بخش اول: ویرایش تصویر کاربری */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group cursor-pointer" onClick={() => !uploadingImage && fileInputRef.current?.click()}>
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/20 group-hover:border-blue-500 transition-all duration-300 shadow-md flex items-center justify-center bg-slate-50 dark:bg-slate-850">
            {uploadingImage ? (
              <CgSpinner className="w-8 h-8 animate-spin text-blue-500" />
            ) : currentImage ? (
              <img src={currentImage} alt={currentName} className="w-full h-full object-cover" />
            ) : (
              <FiUser className="w-10 h-10 text-slate-400" />
            )}
          </div>
          
          {!uploadingImage && (
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FiCamera className="w-6 h-6 text-white" />
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            className="hidden" 
            accept="image/*"
            disabled={uploadingImage}
          />
        </div>

        <div className="text-center sm:text-right">
          <h3 className="font-bold text-slate-800 dark:text-slate-200">تصویر حساب کاربری</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">جهت تغییر عکس، روی آیکون کلیک کنید یا دکمه زیر را بفشارید.</p>
          <button 
            type="button"
            disabled={uploadingImage}
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
          >
            {uploadingImage ? "در حال آپلود..." : "تغییر تصویر پروفایل"}
          </button>
        </div>
      </div>

      {/* بخش دوم: لیست کارت‌های اطلاعات کاربری */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
          
          {/* کارت اول: نام و نام خانوادگی */}
          <div className="flex justify-between items-center py-4 border-b border-slate-100 dark:border-slate-800/40 text-right">
            <div className="space-y-1.5">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">نام و نام خانوادگی</p>
              <p className="text-slate-800 dark:text-slate-200 font-bold text-sm min-h-[1.25rem]">
                {currentName || <span className="text-slate-350 dark:text-slate-650 font-normal">ثبت نشده</span>}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleEditClick("name", currentName)}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-blue-500 transition active:scale-95"
            >
              <FiEdit3 className="text-sm" />
            </button>
          </div>

          {/* کارت دوم: شماره همراه */}
          <div className="flex justify-between items-center py-4 border-b border-slate-100 dark:border-slate-800/40 text-right">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">شماره موبایل</p>
                <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                  تاییدشده
                </span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-bold text-sm min-h-[1.25rem] ltr text-left sm:text-right">
                {currentMobile ? toPersianNumber(currentMobile) : <span className="text-slate-350 dark:text-slate-650 font-normal">ثبت نشده</span>}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleEditClick("mobile", currentMobile)}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-blue-500 transition active:scale-95"
            >
              <FiEdit3 className="text-sm" />
            </button>
          </div>

          {/* کارت سوم: ایمیل (غیر قابل ویرایش) */}
          <div className="flex justify-between items-center py-4 border-b md:border-none border-slate-100 dark:border-slate-800/40 text-right md:col-span-2">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">پست الکترونیک (ایمیل)</p>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                  غیر قابل ویرایش
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm min-h-[1.25rem] ltr text-left sm:text-right">
                {user.email || <span className="text-slate-350 dark:text-slate-650 font-normal">ثبت نشده</span>}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 cursor-not-allowed">
              <FiLock className="text-sm" />
            </div>
          </div>

        </div>
      </div>

      {/* مودال پویا برای ویرایش فیلد فعال */}
      <Modal
        open={openModal}
        onClose={() => !saving && setOpenModal(false)}
        title={activeField === "name" ? "ویرایش نام و نام خانوادگی" : "ویرایش شماره همراه"}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-right leading-relaxed">
            مقدار فعلی:{" "}
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              {activeField === "name" 
                ? currentName 
                : toPersianNumber(currentMobile) || "—"
              }
            </span>
          </p>

          <input
            type="text"
            value={inputValue}
            maxLength={activeField === "mobile" ? 11 : undefined}
            onKeyDown={handleKeyDown} // 👈 کنترل کلیدهای میانبر نیم‌فاصله
            onChange={(e) => {
              const val = e.target.value;
              if (activeField === "mobile") {
                setInputValue(cleanMobileInput(val));
              } else if (activeField === "name") {
                setInputValue(cleanNameInput(val)); // 👈 مپ کردن دکمه‌های انگلیسی به فارسی و فیلتر سخت‌گیرانه نام
              } else {
                setInputValue(val);
              }
            }}
            disabled={saving}
            className="
              w-full px-4 py-2.5 rounded-xl text-sm border text-right
              bg-slate-50/50 dark:bg-slate-950
              border-slate-200 dark:border-slate-800
              text-slate-800 dark:text-slate-100
              focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
              focus:ring-2 focus:ring-blue-500/10 transition duration-200
              disabled:opacity-50 text-right
            "
            placeholder={activeField === "name" ? "نام جدید خود را وارد کنید" : "شماره همراه جدید را وارد کنید"}
          />

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-800 text-xs flex items-center gap-2">
              <FiAlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="
              bg-blue-600 dark:bg-blue-500
              text-white px-5 py-3 rounded-xl w-full
              hover:bg-blue-700 dark:hover:bg-blue-600
              font-bold text-sm transition-all shadow-sm active:scale-[0.98]
              disabled:opacity-50 flex items-center justify-center gap-2
            "
          >
            {saving && <CgSpinner className="w-4 h-4 animate-spin" />}
            {saving ? "در حال ثبت..." : "ذخیره تغییرات"}
          </button>
        </div>
      </Modal>
    </div>
  );
}