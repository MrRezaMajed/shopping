// @/components/ui/TiptapEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function TiptapEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // ارسال کد HTML تمیز به فرمیک
    },
    editorProps: {
      attributes: {
        // استایل‌دهی کامل کادر نوشتن با کلاس‌های تلویند بدون نیاز به استایل خارجی!
        class: "focus:outline-none min-h-[150px] max-w-none prose dark:prose-invert text-sm p-4",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="w-full border border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden text-right">
      {/* نوار ابزار ساخته شده با تلویند */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${editor.isActive("bold") ? "bg-indigo-500 text-white" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"}`}
        >
          ضخیم (B)
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${editor.isActive("italic") ? "bg-indigo-500 text-white" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"}`}
        >
          مورب (I)
        </button>
        {/* می‌توانید دکمه‌هایHeading، لیست‌ها و غیره را نیز به همین سادگی اضافه کنید */}
      </div>

      {/* بخش تایپ متن */}
      <EditorContent editor={editor} />
    </div>
  );
}