// @/components/ui/CRUDEditForm/TagsField.tsx
"use client";

import React, { useState, KeyboardEvent, ClipboardEvent, useCallback } from "react";
import { FiX } from "react-icons/fi";

interface TagsFieldProps {
  name: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export const TagsField = React.memo(function TagsField({
  value = [],
  onChange,
  placeholder,
}: TagsFieldProps) {
  const [input, setInput] = useState("");

  const addTags = useCallback((tagsToAdd: string[]) => {
    // پاکسازی فاصله‌های اضافه و فیلتر کردن موارد تکراری یا خالی
    const cleaned = tagsToAdd
      .map((t) => t.trim())
      .filter((t) => t !== "" && !value.includes(t));

    if (cleaned.length > 0) {
      onChange([...value, ...cleaned]);
    }
    setInput("");
  }, [value, onChange]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "،") {
      e.preventDefault();
      // تفکیک تگ‌ها بر اساس علائم ویرگول انگلیسی، فارسی یا خط جدید
      addTags(input.split(/[,،\n]+/));
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    addTags(pastedText.split(/[,،\n]+/));
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(value.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="w-full text-right space-y-2">
      {/* کانتینر کلی تگ‌ها */}
      <div className="flex flex-wrap gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-[#1f2235]/60 bg-white/40 dark:bg-[#121420]/20 min-h-[52px] items-center focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all duration-200">
        
        {/* رندر تگ‌های ثبت‌شده به همراه دکمه حذف */}
        {value.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs px-2.5 py-1 rounded-lg font-semibold border border-indigo-500/20"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="hover:text-rose-500 transition-colors p-0.5 rounded-md"
              aria-label={`حذف برچسب ${tag}`}
            >
              <FiX className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        {/* اینپوت تایپ با عرض تعریف‌شده حداکثر ۵۰ درصد جهت جلوگیری از کشیدگی مفرط */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={value.length === 0 ? (placeholder || "برچسب‌ها را وارد کنید...") : "برچسب جدید..."}
          className="w-1/2 max-w-[50%] min-w-[120px] bg-transparent text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 outline-none"
        />
      </div>
      
      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
        راهنما: برچسب را بنویسید و کلید Enter، ویرگول انگلیسی (,) یا فارسی (،) را فشار دهید. چسباندن (Paste) گروهی نیز پشتیبانی می‌شود.
      </p>
    </div>
  );
});