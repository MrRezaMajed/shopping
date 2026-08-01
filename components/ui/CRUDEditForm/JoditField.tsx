// @/components/ui/CRUDEditForm/JoditField.tsx
"use client";

import React, { useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

// بارگیری داینامیک پکیج جهت ممانعت از خطای ساختار مدرن SSR در کلاینت Next.js
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => (
    <div className="h-60 bg-slate-50 dark:bg-[#121420]/20 border border-slate-200 dark:border-[#1f2235]/60 rounded-2xl animate-pulse flex items-center justify-center text-xs text-slate-400">
      در حال آماده‌سازی ویرایشگر متنی Jodit...
    </div>
  ),
});

interface JoditFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const JoditField = React.memo(function JoditField({
  value,
  onChange,
  placeholder,
}: JoditFieldProps) {
  const editor = useRef(null);

  useEffect(() => {
    // ۱. پاکسازی همیشگی تگ‌های خارجی و اشتباه CDN قدیمی از هدر صفحه مرورگر برای رفع کرش دکمه ثبت
    const oldCdnStyles = document.querySelectorAll(
      'link[href*="cdnjs.cloudflare.com/ajax/libs/jodit"], link[href*="unpkg.com/jodit"], link[id*="cdn-style"]'
    );
    oldCdnStyles.forEach((element) => {
      element.remove();
    });

    // ۲. بارگذاری استایل محلی و امن بدون تداخل CORS
    const linkId = "jodit-editor-local-style";
    let link = document.getElementById(linkId) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = "/css/jodit.min.css"; 
      document.head.appendChild(link);
    }
  }, []);

  // پیکربندی و ساختاردهی ادیتور با لایسنس آزاد و زبان فارسی بومی
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "متن خود را اینجا بنویسید...",
      direction: "rtl", // فعال‌سازی ساختار راست‌چین فارسی
      language: "fa", // محلی‌سازی کادرها و دکمه‌ها به فارسی
      toolbarAdaptive: false, // جلوگیری از مخفی شدن خودکار تولبار در سایزهای مختلف
      theme: "default",
      minHeight: 280,
      maxHeight: 600,
      // آپلود محلی تصاویر و تبدیل خودکار به Base64
      uploader: {
        insertImageAsBase64URI: true,
      },
      buttons: [
        "source", "|",
        "bold", "italic", "underline", "strikethrough", "|",
        "ul", "ol", "|",
        "outdent", "indent", "|",
        "font", "fontsize", "brush", "paragraph", "|",
        "image", "table", "link", "|",
        "align", "undo", "redo", "|",
        "hr", "eraser", "fullsize"
      ],
      // غیرفعال کردن موارد اضافی در نوار وضعیت پایین
      showXPathInStatusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
    }),
    [placeholder]
  );

  return (
    <div className="w-full text-right relative">
      {/* استایل‌های سفارشی جهت هماهنگی با پالت رنگی و دارک‌مود اختصاصی وب‌سایت شما */}
      <style>{`
        .jodit-container {
          border-radius: 1rem !important;
          border: 1px solid rgb(226, 232, 240) !important;
          background-color: rgba(255, 255, 255, 0.4) !important;
          overflow: hidden;
          font-family: inherit !important;
        }
        .dark .jodit-container {
          border-color: rgba(31, 34, 53, 0.6) !important;
          background-color: rgba(18, 20, 32, 0.2) !important;
        }
        .jodit-toolbar__box {
          background-color: rgba(248, 250, 252, 0.5) !important;
          border-bottom: 1px solid rgb(226, 232, 240) !important;
        }
        .dark .jodit-toolbar__box {
          background-color: rgba(12, 13, 20, 0.4) !important;
          border-bottom-color: rgba(31, 34, 53, 0.6) !important;
        }
        .jodit-toolbar-button__button {
          color: rgb(71, 85, 105) !important;
        }
        .dark .jodit-toolbar-button__button {
          color: rgb(148, 163, 184) !important;
        }
        .jodit-toolbar-button__button:hover {
          background-color: rgb(241, 245, 249) !important;
        }
        .dark .jodit-toolbar-button__button:hover {
          background-color: rgb(27, 30, 48) !important;
        }
        .jodit-wysiwyg {
          background-color: rgba(255, 255, 255, 0.45) !important;
          color: rgb(30, 41, 59) !important;
          font-size: 0.875rem !important;
          line-height: 1.75 !important;
        }
        .dark .jodit-wysiwyg {
          background-color: rgba(18, 20, 32, 0.15) !important;
          color: rgb(241, 245, 249) !important;
        }
        .jodit-status-bar {
          background-color: transparent !important;
          border-top: 1px solid rgb(226, 232, 240) !important;
        }
        .dark .jodit-status-bar {
          border-top-color: rgba(31, 34, 53, 0.6) !important;
        }
      `}</style>

      {/* متد onBlur کارایی و پرفورمنس بهتری در اتصال به فرمیک ایفا می‌کند */}
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
        onChange={() => {}} 
      />
    </div>
  );
});