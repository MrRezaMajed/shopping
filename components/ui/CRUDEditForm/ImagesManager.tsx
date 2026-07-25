// components/ImagesManager.tsx
"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useFormikContext } from "formik";
import { FiImage, FiUpload, FiStar, FiTrash2, FiSquare, FiSliders, FiLoader } from "react-icons/fi";
import { SectionPanel } from "./SectionPanel";
import { EmptyState } from "./EmptyState";
import { autoSmartCrop } from "@/lib/utils/smartcrop"; // فراخوانی تابع کراپ هوشمند

interface ImagesManagerProps {
  name: string;
}

export const ImagesManager = React.memo(function ImagesManager({ name }: ImagesManagerProps) {
  const { values, setFieldValue } = useFormikContext<any>();
  const images: any[] = values[name] || [];

  // انتخاب دستی نسبت تصویر فعال قبل از آپلود (۱ برای مربعی، ۱۶:۹ برای بنر)
  const [activeUploadRatio, setActiveUploadRatio] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files;
      if (!fileList || fileList.length === 0) return;

      const files = Array.from(fileList);
      setIsProcessing(true);

      try {
        const processedItems = await Promise.all(
          files.map(async (file) => {
            // ۱. محاسبه خودکار طول و عرض هدف بر اساس انتخاب کاربر
            const targetWidth = activeUploadRatio === 1 ? 800 : 1200;
            const targetHeight = Math.round(targetWidth / activeUploadRatio);

            // ۲. اجرای فرآیند برش کاملاً هوشمند بدون نمایش مودال
            const croppedFile = await autoSmartCrop(file, targetWidth, targetHeight);
            
            return {
              url: URL.createObjectURL(croppedFile),
              isMain: images.length === 0,
              ratio: activeUploadRatio, // ذخیره نسبت ابعاد جهت نمایش بهینه در پیش‌نمایش
              file: croppedFile,
            };
          })
        );

        setFieldValue(name, [...images, ...processedItems]);
      } catch (error) {
        console.error("خطا در پردازش خودکار تصویر:", error);
      } finally {
        setIsProcessing(false);
        e.target.value = "";
      }
    },
    [images, name, setFieldValue, activeUploadRatio]
  );

  const handleRemove = useCallback(
    (idx: number) => {
      const updated = images.filter((_, i) => i !== idx);
      if (images[idx]?.isMain && updated.length > 0) updated[0].isMain = true;
      setFieldValue(name, updated);
    },
    [images, name, setFieldValue]
  );

  const handleSetMain = useCallback(
    (idx: number) => {
      setFieldValue(
        name,
        images.map((img, i) => ({ ...img, isMain: i === idx }))
      );
    },
    [images, name, setFieldValue]
  );

  return (
    <SectionPanel icon={<FiImage className="w-4 h-4" />} title="مدیریت تصاویر محصول" accent="sky">
      
      {/* هدر انتخاب دستی نسبت ابعاد پیش از آپلود */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 mb-3">
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">ابعاد کادر عکس برای بارگذاری:</h4>
          <p className="text-[10px] text-slate-400 mt-1">پیش از انتخاب عکس، نوع تصویر را انتخاب کنید تا به طور هوشمند برش بخورد.</p>
        </div>
        
        <div className="flex p-1 bg-slate-200/60 dark:bg-slate-800 rounded-xl max-w-xs gap-1">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => setActiveUploadRatio(1)}
            className={`
              flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-extrabold transition
              ${activeUploadRatio === 1 
                ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }
            `}
          >
            <FiSquare className="w-3.5 h-3.5" /> تصویر محصول (۱:۱)
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => setActiveUploadRatio(16 / 9)}
            className={`
              flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-extrabold transition
              ${activeUploadRatio === 16 / 9 
                ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }
            `}
          >
            <FiSliders className="w-3.5 h-3.5" /> بنر عریض (۱۶:۹)
          </button>
        </div>
      </div>

      {/* بخش انتخاب فایل با لودینگ */}
      <label className="flex flex-col items-center gap-2 p-5 border-2 border-dashed rounded-xl border-slate-200 dark:border-[#1f2235]/50 cursor-pointer hover:border-sky-400 hover:bg-sky-50/40 transition">
        {isProcessing ? (
          <FiLoader className="w-5 h-5 text-sky-500 animate-spin" />
        ) : (
          <FiUpload className="w-5 h-5 text-slate-400" />
        )}
        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          {isProcessing ? "در حال آنالیز و برش هوشمند تصویر در کلاینت..." : "انتخاب و بارگذاری مستقیم تصویر"}
        </span>
        <input type="file" multiple accept="image/*" disabled={isProcessing} className="hidden" onChange={handleUpload} />
      </label>

      {/* گالری نمایش تصاویر ذخیره‌شده */}
      {images.length === 0 ? (
        <EmptyState label="هنوز تصویری اضافه نشده است" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className={`
                relative group rounded-xl overflow-hidden border border-slate-200 dark:border-[#1f2235]/50
                ${img.ratio === 1 ? "aspect-square" : "aspect-video col-span-2"}
              `}
            >
              <Image src={img.url} alt="product" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSetMain(idx)}
                  className={`p-1.5 rounded-lg text-white transition ${img.isMain ? "bg-emerald-500" : "bg-slate-700 hover:bg-slate-600"}`}
                >
                  <FiStar className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {img.isMain && (
                <span className="absolute top-1.5 right-1.5 bg-emerald-500 text-[10px] text-white px-1.5 py-0.5 rounded font-bold">اصلی</span>
              )}
            </div>
          ))}
        </div>
      )}
    </SectionPanel>
  );
});