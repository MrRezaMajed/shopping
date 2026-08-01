// @/components/ui/CRUDEditForm/TiptapField.tsx
"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TiptapField = React.memo(function TiptapField({
  value,
  onChange,
  placeholder,
}: TiptapFieldProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // مخابره کدهای تمیز HTML به فرمیک
    },
    editorProps: {
      attributes: {
        // اعمال استایل بومی و پروژه‌محور شما به ویرایشگر متنی
        class:
          "focus:outline-none min-h-[250px] max-w-none prose dark:prose-invert text-xs sm:text-sm p-4 font-semibold text-slate-800 dark:text-slate-100",
      },
    },
  });

  // همگام‌سازی داده در صورت تغییر مقدار از بیرون (مثلا لود اطلاعات در مد ویرایش)
  useEffect(() => {
    if (editor && value !== editor.getHTML() && value !== undefined) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="h-60 bg-slate-50 dark:bg-[#121420]/20 border border-slate-200 dark:border-[#1f2235]/60 rounded-2xl animate-pulse flex items-center justify-center text-xs text-slate-400">
        در حال آماده‌سازی ویرایشگر متنی Tiptap...
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1f2235]/60 bg-white/40 dark:bg-[#121420]/20 text-right">
      {/* تولبار شخصی‌سازی شده با تلویند و مطابق دیزاین مدرن بقیه کدهای شما */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50/50 dark:bg-[#0c0d14]/40 border-b border-slate-200 dark:border-[#1f2235]/60 select-none">
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            editor.isActive("bold")
              ? "bg-indigo-500 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b1e30]"
          }`}
        >
          ضخیم (Bold)
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            editor.isActive("italic")
              ? "bg-indigo-500 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b1e30]"
          }`}
        >
          مورب (Italic)
        </button>

        <div className="w-px h-6 bg-slate-200 dark:bg-[#1f2235]/60 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            editor.isActive("heading", { level: 1 })
              ? "bg-indigo-500 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b1e30]"
          }`}
        >
          تیتر ۱
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            editor.isActive("heading", { level: 2 })
              ? "bg-indigo-500 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b1e30]"
          }`}
        >
          تیتر ۲
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            editor.isActive("heading", { level: 3 })
              ? "bg-indigo-500 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b1e30]"
          }`}
        >
          تیتر ۳
        </button>

        <div className="w-px h-6 bg-slate-200 dark:bg-[#1f2235]/60 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            editor.isActive("bulletList")
              ? "bg-indigo-500 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b1e30]"
          }`}
        >
          لیست نشانه‌دار
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            editor.isActive("orderedList")
              ? "bg-indigo-500 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b1e30]"
          }`}
        >
          لیست عددی
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            editor.isActive("blockquote")
              ? "bg-indigo-500 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b1e30]"
          }`}
        >
          نقل قول
        </button>
      </div>

      {/* بدنه ویرایشگر */}
      <div className="bg-white/45 dark:bg-[#121420]/15">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
});