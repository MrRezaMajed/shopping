// components/ui/CRUDEditForm/FileInput.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FiUpload, FiRefreshCw, FiX, FiLoader } from "react-icons/fi";
import { autoSmartCrop } from "@/lib/utils/smartcrop";

interface FileInputProps {
  name: string;
  setFieldValue: (name: string, value: File | string | null) => void;
  existingUrl?: string | null;
  aspectRatio?: number; // نسبت ابعاد پویا (مثلا ۱۶:۹ برای بنر یا ۱:۱ برای لوگو)
  targetWidth?: number; // عرض بهینه داینامیک
}

export const FileInput = React.memo(function FileInput({
  name,
  setFieldValue,
  existingUrl,
  aspectRatio = 16 / 9, // پیش‌فرض بنرها عریض است
  targetWidth = 1280,   // پیش‌فرض کیفیت اچ‌دی
}: FileInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(existingUrl || "");
  const [error, setError] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const processFile = useCallback(
    async (file: File | null) => {
      if (!file) {
        setFieldValue(name, null);
        setPreviewUrl("");
        return;
      }

      setIsProcessing(true);
      try {
        const tWidth = targetWidth;
        const tHeight = Math.round(targetWidth / aspectRatio);

        // ۱. برش و فشرده‌سازی کاملا هوشمند در پس‌زمینه کلاینت
        const croppedFile = await autoSmartCrop(file, tWidth, tHeight);

        setFieldValue(name, croppedFile);
        setPreviewUrl((prev) => {
          if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
          return URL.createObjectURL(croppedFile);
        });
        setError(false);
      } catch (err) {
        console.error("خطا در برش هوشمند فایل کلاینت:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    [name, setFieldValue, aspectRatio, targetWidth]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.currentTarget.files?.[0] || null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragActive(true);
    else if (e.type === "dragleave") setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFieldValue(name, null);
    setPreviewUrl("");
  };

  const retryImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(false);
    setPreviewUrl((prev) => (prev ? `${prev}?retry=${Date.now()}` : prev));
  };

  return (
    <div className="space-y-4">
      <label
        onDragOver={handleDrag}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden group ${
          isDragActive
            ? "border-indigo-500 bg-indigo-500/5 shadow-[0_0_24px_rgba(99,102,241,0.15)] scale-[1.01]"
            : "border-slate-200 dark:border-[#1f2235]/60 bg-slate-50/30 dark:bg-[#121420]/20 hover:border-indigo-300 dark:hover:border-indigo-500/40"
        }`}
      >
        <input type="file" accept="image/*" disabled={isProcessing} onChange={handleFileChange} className="hidden" />
        <div
          className={`p-4 rounded-xl transition-all duration-300 ${
            isDragActive 
              ? "bg-indigo-500 text-white scale-110" 
              : isProcessing 
                ? "bg-sky-500/10 text-sky-500"
                : "bg-slate-100 dark:bg-[#1b1e30] text-slate-400 group-hover:scale-105 group-hover:text-indigo-500"
          }`}
        >
          {isProcessing ? (
            <FiLoader className="w-5 h-5 animate-spin" />
          ) : (
            <FiUpload className="w-5 h-5" />
          )}
        </div>
        <div className="text-center space-y-1 z-10 select-none">
          <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            {isProcessing 
              ? "در حال پردازش هوشمند تصویر..." 
              : isDragActive 
                ? "فایل را اینجا رها کنید" 
                : "کلیک کنید یا تصویر خود را به اینجا بکشید"}
          </p>
          <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium">
            PNG, JPG, WEBP مجهز به فشرده‌سازی و برش خودکار هوشمند
          </p>
        </div>
      </label>

      {previewUrl && (
        <div className="relative w-56 h-32 group/preview rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1f2235] shadow-md">
          <div className="relative w-full h-full bg-slate-100 dark:bg-[#121420]">
            {!error ? (
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover transition-transform duration-500 group-hover/preview:scale-105"
                onError={() => setError(true)}
                unoptimized={previewUrl.startsWith("blob:")}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <span className="text-[11px] font-bold text-slate-500">خطا در نمایش تصویر</span>
                <button
                  type="button"
                  onClick={retryImage}
                  className="mt-2 text-[10px] font-semibold bg-indigo-500 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                >
                  <FiRefreshCw className="w-3 h-3" /> تلاش مجدد
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={removeImage}
            aria-label="حذف تصویر"
            className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-full opacity-0 group-hover/preview:opacity-100 transition shadow-lg z-10"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
});