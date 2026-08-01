// @/components/ui/CRUDEditForm/CKEditorField.tsx
"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// بارگیری استایل‌های بومی سی‌کا‌ادیتور
import "ckeditor5/ckeditor5.css";

// لود داینامیک پکیج‌ها در کلاینت برای جلوگیری از خطای رندر سمت سرور (SSR) در Next.js
const CKEditorWrapper = dynamic(
  () =>
    Promise.all([
      import("@ckeditor/ckeditor5-react").then((m) => m.CKEditor),
      import("ckeditor5").then((m) => m.ClassicEditor),
    ]).then(([CKEditorModule, ClassicEditorModule]) => {
      const CKEditor = CKEditorModule;
      const ClassicEditor = ClassicEditorModule;

      return function Wrapper({
        value,
        onChange,
        placeholder,
      }: {
        value: string;
        onChange: (data: string) => void;
        placeholder?: string;
      }) {
        const isReadyRef = useRef(false);

        useEffect(() => {
          return () => {
            isReadyRef.current = false;
          };
        }, []);

        return (
          <div className="text-right w-full">
            {/* 
              تزریق استایل بومی جهت تضمین حداقل ارتفاع ۲۵۰ پیکسلی و 
              حفاظت از اجزای ادیتور در برابر استایل‌های تلویند
            */}
            <style>{`
              .ck-editor__editable_inline {
                min-height: 250px !important;
              }
              .ck.ck-editor {
                width: 100% !important;
              }
              /* تصحیح رنگ دکمه‌ها و سازگاری با حالت تاریک */
              .ck.ck-button, .ck.ck-dropdown {
                color: inherit !important;
              }
              .dark .ck-editor__editable_inline {
                background-color: #121420 !important;
                color: #f1f5f9 !important;
              }
            `}</style>
            <CKEditor
              editor={ClassicEditor}
              config={{
                licenseKey: "GPL", // تایید مجوز رایگان عمومی
                placeholder: placeholder || "متن خود را اینجا بنویسید...",
                language: "fa", // راست‌چین و فارسی بومی
                toolbar: [
                  "undo", "redo", "|",
                  "heading", "|",
                  "bold", "italic", "|",
                  "link", "insertTable", "blockQuote", "|",
                  "bulletedList", "numberedList", "outdent", "indent"
                ]
              }}
              data={value || ""}
              onReady={() => {
                setTimeout(() => {
                  isReadyRef.current = true;
                }, 50);
              }}
              onChange={(_, editor) => {
                if (!isReadyRef.current) return;
                const data = editor.getData();
                onChange(data);
              }}
            />
          </div>
        );
      };
    }),
  {
    ssr: false, // ممانعت از اجرای کدهای ادیتور در سمت سرور
    loading: () => (
      <div className="h-60 bg-slate-50 dark:bg-[#121420]/20 border border-slate-200 dark:border-[#1f2235]/60 rounded-2xl animate-pulse flex items-center justify-center text-xs text-slate-400">
        در حال آماده‌سازی ویرایشگر متن (NPM)...
      </div>
    ),
  }
);

interface CKEditorFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const CKEditorField = React.memo(function CKEditorField({
  value,
  onChange,
  placeholder,
}: CKEditorFieldProps) {
  return (
    // حذف کلاس‌های مخرب prose، overflow-hidden و مرزهای تلویندیِ دور کانتینر ادیتور
    <div className="w-full relative bg-transparent">
      <CKEditorWrapper value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
});