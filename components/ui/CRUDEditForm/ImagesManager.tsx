"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useFormikContext } from "formik";
import { FiImage, FiUpload, FiStar, FiTrash2 } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import { SectionPanel } from "./SectionPanel";
import { EmptyState } from "./EmptyState";
import ImageCropperModal from "../ImageCropper/ImageCropperModal";

interface ImagesManagerProps {
  name: string;
}

interface CropQueueItem {
  file: File;
  previewUrl: string;
}

export const ImagesManager = React.memo(function ImagesManager({ name }: ImagesManagerProps) {
  const { values, setFieldValue } = useFormikContext<any>();
  const images: any[] = values[name] || [];

  // صف‌بندی هوشمند کلاینت برای تصاویری که در صفِ کراپ کردن قرار دارند
  const [cropQueue, setCropQueue] = useState<CropQueueItem[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(-1);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files;
      if (!fileList || fileList.length === 0) return;

      const files = Array.from(fileList);
      
      // ساخت لیست تصاویر خام انتخابی برای صف برش
      const queueItems = files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setCropQueue(queueItems);
      setCurrentQueueIndex(0); // شروع پروسه برش از اولین عکسِ صف
      e.target.value = "";
    },
    []
  );

  const handleCroppedItem = (croppedFile: File) => {
    // ایجاد ساختار نهایی گالری متناسب با عکس اصلاح شده
    const croppedUrl = URL.createObjectURL(croppedFile);
    const newGalleryItem = {
      url: croppedUrl,
      isMain: images.length === 0, // اگر اولین عکس گالری بود، عکس اصلی شود
      file: croppedFile,
    };

    // اضافه کردن آیتم به تصاویر فرم گالری
    setFieldValue(name, [...images, newGalleryItem]);

    // آزادسازی منابع موقتی عکس قبلی صف
    if (cropQueue[currentQueueIndex]) {
      URL.revokeObjectURL(cropQueue[currentQueueIndex].previewUrl);
    }

    // هدایت سیستم به عکس بعدی صف
    if (currentQueueIndex < cropQueue.length - 1) {
      setCurrentQueueIndex((prev) => prev + 1);
    } else {
      // اتمام صف‌بندی و بستن مودال‌ها
      setCropQueue([]);
      setCurrentQueueIndex(-1);
    }
  };

  const handleCancelCrop = () => {
    // لغو برش عکس فعلی و انتقال به عکس بعدی صف
    if (cropQueue[currentQueueIndex]) {
      URL.revokeObjectURL(cropQueue[currentQueueIndex].previewUrl);
    }

    if (currentQueueIndex < cropQueue.length - 1) {
      setCurrentQueueIndex((prev) => prev + 1);
    } else {
      setCropQueue([]);
      setCurrentQueueIndex(-1);
    }
  };

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

  const activeCropItem = currentQueueIndex !== -1 ? cropQueue[currentQueueIndex] : null;

  return (
    <SectionPanel icon={<FiImage className="w-4 h-4" />} title="گالری تصاویر محصول" accent="sky">
      <label className="flex flex-col items-center gap-2 p-5 border-2 border-dashed rounded-xl border-slate-200 dark:border-[#1f2235]/50 cursor-pointer hover:border-sky-400 hover:bg-sky-50/40 transition">
        <FiUpload className="w-5 h-5 text-slate-400" />
        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">انتخاب و بهینه‌سازی گروهی تصاویر گالری</span>
        <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
      </label>

      {images.length === 0 ? (
        <EmptyState label="هنوز تصویری اضافه نشده است" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-[#1f2235]/50 aspect-square">
              <Image src={img.url} alt="product" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSetMain(idx)}
                  aria-label="تنظیم به عنوان تصویر اصلی"
                  className={`p-1.5 rounded-lg text-white transition ${img.isMain ? "bg-emerald-500" : "bg-slate-700 hover:bg-slate-600"}`}
                >
                  <FiStar className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  aria-label="حذف تصویر"
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

      {/* سیستم هوشمند صف‌بندی برش گالری کالاها (به صورت مربع ۱:۱ استاندارد محصولات) */}
      <AnimatePresence>
        {activeCropItem && (
          <ImageCropperModal
            key={currentQueueIndex}
            imageSrc={activeCropItem.previewUrl}
            aspectRatio={1 / 1} // ابعاد مربع ۱:۱ برای گالری محصولات
            targetWidth={800} // سایز بهینه ۸۰۰ پیکسلی
            title={`برش و فشرده‌سازی تصویر گالری (${toPersianNumber(currentQueueIndex + 1)} از ${toPersianNumber(cropQueue.length)})`}
            onCrop={handleCroppedItem}
            onCancel={handleCancelCrop}
          />
        )}
      </AnimatePresence>
    </SectionPanel>
  );
});