// مدیریت و گالری تصاویر چندگانه محصول

import React, { useCallback } from "react";
import Image from "next/image";
import { useFormikContext } from "formik";
import { FiImage, FiUpload, FiStar, FiTrash2 } from "react-icons/fi";
import { SectionPanel } from "./SectionPanel";
import { EmptyState } from "./EmptyState";
import { readFileAsDataURL } from "./utils";

interface ImagesManagerProps {
  name: string;
}

export const ImagesManager = React.memo(function ImagesManager({ name }: ImagesManagerProps) {
  const { values, setFieldValue } = useFormikContext<any>();
  const images: any[] = values[name] || [];

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files;
      if (!fileList || fileList.length === 0) return;

      const files = Array.from(fileList);
      const urls = await Promise.all(files.map(readFileAsDataURL));
      const newItems = files.map((file, i) => ({
        url: urls[i],
        isMain: images.length === 0 && i === 0,
        file,
      }));

      setFieldValue(name, [...images, ...newItems]);
      e.target.value = "";
    },
    [images, name, setFieldValue]
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
    <SectionPanel icon={<FiImage className="w-4 h-4" />} title="گالری تصاویر محصول" accent="sky">
      <label className="flex flex-col items-center gap-2 p-5 border-2 border-dashed rounded-xl border-slate-200 dark:border-[#1f2235]/50 cursor-pointer hover:border-sky-400 dark:hover:border-sky-500/40 hover:bg-sky-50/40 dark:hover:bg-sky-500/5 transition">
        <FiUpload className="w-5 h-5 text-slate-400" />
        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">انتخاب و آپلود چندین تصویر</span>
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
    </SectionPanel>
  );
});