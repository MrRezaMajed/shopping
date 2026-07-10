"use client";

import Image from "next/image";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Formik, Form, Field, useField, FormikHelpers, useFormikContext } from "formik";
import * as Yup from "yup";
import {
  FiArrowRight, FiRefreshCw, FiX, FiCheck, FiUpload,
  FiPlus, FiTrash2, FiStar, FiCpu, FiShield, FiImage,
  FiEdit3, FiLink, FiEye, FiGrid, FiFileText, FiLayers, FiTag, FiBox,
  FiInbox,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import CategoryTreeSelector from "./CategoryTreeSelector";
import { toPersianNumber, formatPersianNumber, toEnglishNumber, parsePersianNumber } from "@/lib/utils/persianNumbers";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "number"
  | "checkbox"
  | "file"
  | "date"
  | "tree"
  | "images"
  | "attributes"
  | "variants";

type FieldConfig<T> = {
  name: keyof T;
  label: string;
  type?: FieldType;
  options?: { value: any; label: string }[];
  disabled?: boolean | ((values: T) => boolean);
  compute?: (values: T, initialValues: T) => any;
  deps?: (keyof T)[];
  trigger?: "change" | "blur";
};

type CRUDEditFormProps<T> = {
  title: string;
  initialValues?: Partial<T>;
  validationSchema: Yup.ObjectSchema<any>;
  onSubmit: (values: T, helpers: FormikHelpers<T>) => Promise<void> | void;
  onCancel?: () => void;
  mode?: "create" | "edit";
  fields: FieldConfig<T>[];
};

/* ------------------------------------------------------------------ */
/*  Shared style tokens (single source of truth = easier to re-theme) */
/* ------------------------------------------------------------------ */

const INPUT_BASE =
  "w-full p-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 outline-none focus:ring-4 placeholder-slate-400 dark:placeholder-slate-600 disabled:opacity-60 disabled:cursor-not-allowed";

const INPUT_IDLE =
  "border-slate-200 dark:border-[#1f2235]/60 bg-white/40 dark:bg-[#121420]/20 text-slate-800 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-[#121420] disabled:bg-slate-100 dark:disabled:bg-zinc-900/40";

const INPUT_ERROR =
  "border-rose-400 dark:border-rose-500/50 bg-rose-500/5 focus:ring-rose-500/10 text-rose-900 dark:text-rose-200";

const LABEL_CLASS = "text-xs font-bold text-slate-500 dark:text-slate-400 block";

const PANEL_ACCENTS = {
  sky: { glow: "bg-sky-500/10", icon: "text-sky-500", ring: "focus:ring-sky-500/10" },
  indigo: { glow: "bg-indigo-500/10", icon: "text-indigo-500", ring: "focus:ring-indigo-500/10" },
  violet: { glow: "bg-violet-500/10", icon: "text-violet-500", ring: "focus:ring-violet-500/10" },
} as const;

const FIELD_ICONS: Record<string, React.ReactNode> = {
  title: <FiEdit3 className="w-4 h-4 text-slate-400 dark:text-slate-500" />,
  slug: <FiLink className="w-4 h-4 text-slate-400 dark:text-slate-500" />,
  status: <FiEye className="w-4 h-4 text-slate-400 dark:text-slate-500" />,
  brandId: <FiTag className="w-4 h-4 text-slate-400 dark:text-slate-500" />,
  categoryId: <FiGrid className="w-4 h-4 text-slate-400 dark:text-slate-500" />,
  description: <FiFileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />,
};

function getIconForField(name: string) {
  return FIELD_ICONS[name] ?? null;
}

/** Persian-number-safe numeric input formatting, shared by every numeric field. */
function formatNumericInput(raw: string) {
  const english = toEnglishNumber(raw);
  const digitsOnly = english.replace(/[^0-9]/g, "");
  return formatPersianNumber(digitsOnly);
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ------------------------------------------------------------------ */
/*  Reusable panel shell for the array-based sections                 */
/* ------------------------------------------------------------------ */

function SectionPanel({
  icon,
  title,
  accent = "indigo",
  action,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accent?: keyof typeof PANEL_ACCENTS;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const tone = PANEL_ACCENTS[accent];
  return (
    <div className="space-y-4 p-5 rounded-2xl border border-slate-100 dark:border-[#1f2235]/40 bg-slate-50/20 dark:bg-[#121420]/10 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 ${tone.glow} rounded-full blur-3xl pointer-events-none`} />
      <div className="flex items-center justify-between gap-3 relative z-10">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span className={tone.icon}>{icon}</span> {title}
        </span>
        {action}
      </div>
      <div className="relative z-10 space-y-3">{children}</div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-350 dark:text-slate-600">
      <FiInbox className="w-6 h-6" />
      <p className="text-xs font-bold">{label}</p>
    </div>
  );
}

/** Generic helper for "list of objects" fields (images / attributes / variants). */
function useFieldArray<Item = any>(name: string) {
  const { values, setFieldValue } = useFormikContext<any>();
  const list: Item[] = values[name] || [];
  const set = useCallback((updated: Item[]) => setFieldValue(name, updated), [name, setFieldValue]);
  return { list, set };
}

/* ------------------------------------------------------------------ */
/*  File input (single image)                                         */
/* ------------------------------------------------------------------ */

type FileInputProps = {
  name: string;
  setFieldValue: (name: string, value: File | string | null) => void;
  existingUrl?: string | null;
};

export function FileInput({ name, setFieldValue, existingUrl }: FileInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(existingUrl || "");
  const [error, setError] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const processFile = useCallback(
    (file: File | null) => {
      setFieldValue(name, file);
      setPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return file ? URL.createObjectURL(file) : "";
      });
      setError(false);
    },
    [name, setFieldValue]
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
    processFile(null);
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
            ? "border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-[0_0_24px_rgba(99,102,241,0.15)] scale-[1.01]"
            : "border-slate-200 dark:border-[#1f2235]/60 bg-slate-50/30 dark:bg-[#121420]/20 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:bg-slate-50/50 dark:hover:bg-[#121420]/40"
        }`}
      >
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <div
          className={`p-4 rounded-xl transition-all duration-300 ${
            isDragActive ? "bg-indigo-500 text-white scale-110" : "bg-slate-100 dark:bg-[#1b1e30] text-slate-400 group-hover:scale-105 group-hover:text-indigo-500"
          }`}
        >
          <FiUpload className="w-5 h-5" />
        </div>
        <div className="text-center space-y-1 z-10 select-none">
          <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            {isDragActive ? "فایل را اینجا رها کنید" : "کلیک کنید یا تصویر خود را به اینجا بکشید"}
          </p>
          <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium">PNG, JPG, WEBP تا حداکثر ۱۰ مگابایت</p>
        </div>
      </label>

      {previewUrl && (
        <div className="relative w-40 h-40 group/preview rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1f2235] shadow-md">
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
                  className="mt-2 text-[10px] font-semibold bg-indigo-500 hover:bg-indigo-600 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
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
            className="absolute top-2 right-2 p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 shadow-lg z-10"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Formik "compute on change" side-effect observer                   */
/* ------------------------------------------------------------------ */

function FormikObserver({ fields }: { fields: FieldConfig<any>[] }) {
  const { values, initialValues, setFieldValue } = useFormikContext<any>();
  const prevValuesRef = useRef<any>(values);

  useEffect(() => {
    const prev = prevValuesRef.current;

    fields.forEach((field) => {
      if (!field.compute || field.trigger === "blur") return;

      const hasChanged =
        field.deps && field.deps.length > 0
          ? field.deps.some((dep) => values[dep] !== prev[dep])
          // Cheap shallow diff instead of JSON.stringify on every keystroke.
          : Object.keys({ ...values, ...prev }).some((key) => values[key] !== prev[key]);

      if (hasChanged) {
        const computedValue = field.compute(values, initialValues);
        if (computedValue !== undefined && computedValue !== values[field.name]) {
          setFieldValue(String(field.name), computedValue);
        }
      }
    });

    prevValuesRef.current = values;
  }, [values, initialValues, fields, setFieldValue]);

  return null;
}

/* ------------------------------------------------------------------ */
/*  Images gallery manager                                            */
/* ------------------------------------------------------------------ */

function ImagesManager({ name }: { name: string }) {
  const { list: images, set } = useFieldArray<any>(name);

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

      set([...images, ...newItems]);
      e.target.value = ""; // allow re-selecting the same file later
    },
    [images, set]
  );

  const handleRemove = useCallback(
    (idx: number) => {
      const updated = images.filter((_: any, i: number) => i !== idx);
      if (images[idx]?.isMain && updated.length > 0) updated[0].isMain = true;
      set(updated);
    },
    [images, set]
  );

  const handleSetMain = useCallback(
    (idx: number) => {
      set(images.map((img: any, i: number) => ({ ...img, isMain: i === idx })));
    },
    [images, set]
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
          {images.map((img: any, idx: number) => (
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
}

/* ------------------------------------------------------------------ */
/*  Attributes (key/value spec) manager                               */
/* ------------------------------------------------------------------ */

function AttributesManager({ name }: { name: string }) {
  const { list, set } = useFieldArray<any>(name);

  const handleAdd = useCallback(() => set([...list, { key: "", value: "" }]), [list, set]);
  const handleRemove = useCallback((idx: number) => set(list.filter((_: any, i: number) => i !== idx)), [list, set]);
  const handleChange = useCallback(
    (idx: number, key: string, val: string) => {
      const updated = [...list];
      updated[idx] = { ...updated[idx], [key]: val };
      set(updated);
    },
    [list, set]
  );

  return (
    <SectionPanel icon={<FiCpu className="w-4 h-4" />} title="ویژگی‌های فنی محصول" accent="indigo">
      {list.length === 0 && <EmptyState label="هنوز ویژگی‌ای ثبت نشده است" />}

      <AnimatePresence initial={false}>
        {list.map((item: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="flex gap-3 items-center"
          >
            <input
              type="text"
              placeholder="نام ویژگی (مثال: ظرفیت باتری)"
              value={item.key}
              onChange={(e) => handleChange(idx, "key", e.target.value)}
              className={`flex-1 p-3 text-xs sm:text-sm font-semibold border rounded-xl ${INPUT_IDLE}`}
            />
            <input
              type="text"
              placeholder="مقدار ویژگی (مثال: 5000 میلی‌آمپر)"
              value={item.value}
              onChange={(e) => handleChange(idx, "value", e.target.value)}
              className={`flex-1 p-3 text-xs sm:text-sm font-semibold border rounded-xl ${INPUT_IDLE}`}
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              aria-label="حذف ویژگی"
              className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full py-3.5 border-2 border-dashed border-slate-200 dark:border-[#1f2235]/50 hover:border-indigo-500 dark:hover:border-indigo-500/50 rounded-xl bg-slate-50/30 hover:bg-indigo-500/5 dark:bg-[#121420]/10 dark:hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold"
      >
        <FiPlus className="w-4.5 h-4.5" /> افزودن ویژگی فنی جدید
      </button>
    </SectionPanel>
  );
}

/* ------------------------------------------------------------------ */
/*  Variants (color / price / stock / warranty) manager                */
/* ------------------------------------------------------------------ */

const EMPTY_VARIANT = { color: "", price: "", stock: "", warranty: { title: "", periodMonths: 12, description: "" } };

function VariantsManager({ name }: { name: string }) {
  const { list, set } = useFieldArray<any>(name);

  const handleAdd = useCallback(() => set([...list, { ...EMPTY_VARIANT, warranty: { ...EMPTY_VARIANT.warranty } }]), [list, set]);
  const handleRemove = useCallback((idx: number) => set(list.filter((_: any, i: number) => i !== idx)), [list, set]);

  const handleChange = useCallback(
    (idx: number, field: string, value: any) => {
      const updated = [...list];
      if (field.startsWith("warranty.")) {
        const subField = field.split(".")[1];
        updated[idx] = { ...updated[idx], warranty: { ...(updated[idx].warranty || {}), [subField]: value } };
      } else {
        updated[idx] = { ...updated[idx], [field]: value };
      }
      set(updated);
    },
    [list, set]
  );

  return (
    <SectionPanel icon={<FiLayers className="w-4 h-4" />} title="لیست تنوع‌ها و گارانتی‌های محصول" accent="violet">
      {list.length === 0 && <EmptyState label="هنوز تنوعی تعریف نشده است" />}

      <AnimatePresence initial={false}>
        {list.map((item: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="rounded-2xl border border-slate-200/60 dark:border-[#1f2235]/50 bg-white/50 dark:bg-[#121420]/30 overflow-hidden"
          >
            <div className="flex justify-between items-center px-4 py-3 bg-slate-50/60 dark:bg-[#0c0d14]/40 border-b border-slate-100 dark:border-[#1f2235]/40">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-500 flex items-center justify-center text-[10px] font-extrabold">
                  {toPersianNumber(idx + 1)}
                </span>
                واریانت
              </span>
              {list.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold"
                >
                  <FiTrash2 className="w-3.5 h-3.5" /> حذف تنوع
                </button>
              )}
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-bold">رنگ / ویژگی</label>
                  <div className="relative flex items-center">
                    <FiEdit3 className="absolute right-3 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      placeholder="مثال: نقره‌ای"
                      value={item.color || ""}
                      onChange={(e) => handleChange(idx, "color", e.target.value)}
                      className={`w-full p-2.5 pr-9 text-xs font-semibold border rounded-lg ${INPUT_IDLE}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-bold">قیمت (تومان)</label>
                  <div className="relative flex items-center">
                    <FiTag className="absolute right-3 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="قیمت..."
                      value={item.price}
                      onChange={(e) => handleChange(idx, "price", formatNumericInput(e.target.value))}
                      className={`w-full p-2.5 pr-9 text-xs font-bold border rounded-lg ${INPUT_IDLE}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-bold">موجودی انبار</label>
                  <div className="relative flex items-center">
                    <FiBox className="absolute right-3 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="تعداد..."
                      value={item.stock}
                      onChange={(e) => handleChange(idx, "stock", formatNumericInput(e.target.value))}
                      className={`w-full p-2.5 pr-9 text-xs font-bold border rounded-lg ${INPUT_IDLE}`}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-slate-100 dark:border-[#1f2235]/50 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <FiShield className="w-3.5 h-3.5" /> گارانتی این تنوع
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-1">عنوان گارانتی</label>
                    <input
                      type="text"
                      placeholder="مثال: گارانتی مایکروتل"
                      value={item.warranty?.title || ""}
                      onChange={(e) => handleChange(idx, "warranty.title", e.target.value)}
                      className={`w-full p-2.5 text-xs font-semibold border rounded-lg ${INPUT_IDLE}`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">مدت زمان (ماه)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="۱۲"
                      value={item.warranty?.periodMonths ?? 12}
                      onChange={(e) => handleChange(idx, "warranty.periodMonths", parseInt(e.target.value, 10) || 0)}
                      className={`w-full p-2.5 text-xs font-semibold border rounded-lg ${INPUT_IDLE}`}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">توضیحات و شرایط گارانتی</label>
                    <textarea
                      rows={2}
                      placeholder="مواردی نظیر قطعات تحت پوشش، شرایط ابطال گارانتی و شرایط تعویض دستگاه را در این کادر توضیح دهید..."
                      value={item.warranty?.description || ""}
                      onChange={(e) => handleChange(idx, "warranty.description", e.target.value)}
                      className={`w-full p-2.5 text-xs font-semibold border rounded-lg resize-none ${INPUT_IDLE}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-[#1f2235]/50 hover:border-violet-500 dark:hover:border-violet-500/50 rounded-2xl bg-slate-50/30 hover:bg-violet-500/5 dark:bg-[#121420]/10 dark:hover:bg-violet-500/10 text-slate-400 hover:text-violet-600 dark:text-slate-500 dark:hover:text-violet-400 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold"
      >
        <FiPlus className="w-5 h-5" /> افزودن تنوع و گارانتی جدید
      </button>
    </SectionPanel>
  );
}

/* ------------------------------------------------------------------ */
/*  Generic field renderer                                            */
/* ------------------------------------------------------------------ */

export function FormField({
  field,
  fields,
  disabled,
}: {
  field: FieldConfig<any>;
  fields: FieldConfig<any>[];
  disabled?: boolean;
}) {
  const [formikField, meta] = useField(String(field.name));
  const { setFieldValue, values, initialValues } = useFormikContext<any>();

  const valuesRef = useRef(values);
  const initialValuesRef = useRef(initialValues);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    initialValuesRef.current = initialValues;
  }, [initialValues]);

  const fieldId = String(field.name);
  const hasError = meta.touched && !!meta.error;
  const stateClass = hasError ? INPUT_ERROR : INPUT_IDLE;

  const handleCustomChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (field.type === "number") {
        setFieldValue(e.target.name, formatNumericInput(e.target.value));
      } else {
        formikField.onChange(e);
      }
    },
    [field.type, formikField, setFieldValue]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<any>) => {
      formikField.onBlur(e);

      fields.forEach((f) => {
        if (f.compute && f.trigger === "blur" && f.deps?.some((dep) => String(dep) === String(field.name))) {
          const computedValue = f.compute(valuesRef.current, initialValuesRef.current);
          if (computedValue !== undefined && computedValue !== valuesRef.current[f.name]) {
            setFieldValue(String(f.name), computedValue);
          }
        }
      });
    },
    [field.name, fields, formikField, setFieldValue]
  );

  const icon = getIconForField(fieldId);
  const inputPaddingClass = icon ? "pr-11" : "pr-4";

  const errorNode = (
    <AnimatePresence>
      {hasError && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <p className="text-rose-500 dark:text-rose-400 text-xs font-bold mt-1.5 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0" /> {meta.error}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );

  switch (field.type) {
    case "select":
      return (
        <div className="space-y-2">
          <label htmlFor={fieldId} className={LABEL_CLASS}>{field.label}</label>
          <div className="relative flex items-center">
            {icon && <div className="absolute right-4 pointer-events-none flex items-center justify-center">{icon}</div>}
            <select
              {...formikField}
              id={fieldId}
              disabled={disabled}
              onBlur={handleBlur}
              aria-invalid={hasError}
              className={`${INPUT_BASE} ${stateClass} ${inputPaddingClass} cursor-pointer`}
            >
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#121420] text-slate-800 dark:text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {errorNode}
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-2">
          <label className={LABEL_CLASS}>{field.label}</label>
          <label
            htmlFor={fieldId}
            className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200/60 dark:border-[#1f2235]/40 bg-white/30 dark:bg-[#121420]/20 hover:bg-white/50 dark:hover:bg-[#121420]/40 transition cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={!!formikField.value}
              onChange={formikField.onChange}
              onBlur={handleBlur}
              disabled={disabled}
              name={formikField.name}
              id={fieldId}
              className="w-5 h-5 rounded-lg border-indigo-500 text-indigo-500 focus:ring-indigo-500/20 accent-indigo-500 cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-350">فعال‌سازی وضعیت {field.label}</span>
          </label>
          {errorNode}
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-2">
          <label htmlFor={fieldId} className={LABEL_CLASS}>{field.label}</label>
          <div className="relative">
            {icon && <div className="absolute right-4 top-4 pointer-events-none">{icon}</div>}
            <textarea
              {...formikField}
              id={fieldId}
              rows={4}
              disabled={disabled}
              onChange={handleCustomChange}
              onBlur={handleBlur}
              aria-invalid={hasError}
              placeholder={`ورود ${field.label}...`}
              className={`${INPUT_BASE} ${stateClass} ${icon ? "pt-3.5 pr-11" : "p-3.5"} resize-none`}
            />
          </div>
          {errorNode}
        </div>
      );

    case "images":
      return <ImagesManager name={String(field.name)} />;

    case "attributes":
      return <AttributesManager name={String(field.name)} />;

    case "variants":
      return <VariantsManager name={String(field.name)} />;

    default:
      return (
        <div className="space-y-2">
          <label htmlFor={fieldId} className={LABEL_CLASS}>{field.label}</label>
          <div className="relative flex items-center">
            {icon && <div className="absolute right-4 pointer-events-none flex items-center justify-center">{icon}</div>}
            <input
              {...formikField}
              id={fieldId}
              type={field.type === "number" ? "text" : field.type || "text"}
              inputMode={field.type === "number" ? "numeric" : undefined}
              disabled={disabled}
              onChange={handleCustomChange}
              onBlur={handleBlur}
              aria-invalid={hasError}
              placeholder={`ورود ${field.label}...`}
              className={`${INPUT_BASE} ${stateClass} ${inputPaddingClass}`}
            />
          </div>
          {errorNode}
        </div>
      );
  }
}

export function ErrorMessage({ name }: { name: string }) {
  return (
    <div className="min-h-5">
      <Field name={name}>
        {({ meta }: any) => (
          <AnimatePresence>
            {meta.touched && meta.error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <p className="text-rose-500 dark:text-rose-400 text-xs font-bold mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0" />{meta.error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Field>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root form                                                          */
/* ------------------------------------------------------------------ */

export default function CRUDEditForm<T extends Record<string, any>>({
  title,
  initialValues,
  validationSchema,
  onSubmit,
  onCancel,
  mode = "create",
  fields,
}: CRUDEditFormProps<T>) {
  const router = useRouter();

  const normalizedInitialValues = useMemo(() => {
    const defaults: Record<string, any> = {};
    for (const field of fields) {
      const existing = (initialValues as any)?.[field.name];
      if (existing !== undefined && existing !== null) {
        if (field.type === "number") {
          defaults[field.name as string] = formatPersianNumber(existing);
        } else if (field.type === "variants" && Array.isArray(existing)) {
          defaults[field.name as string] = existing.map((v: any) => ({
            color: v.color || "",
            price: formatPersianNumber(v.price),
            stock: formatPersianNumber(v.stock),
            warranty: v.warranties?.[0]
              ? {
                  title: v.warranties[0].title || "",
                  periodMonths: v.warranties[0].periodMonths ?? 12,
                  description: v.warranties[0].description || "",
                }
              : { title: "", periodMonths: 12, description: "" },
          }));
        } else if (field.type === "attributes" && Array.isArray(existing)) {
          defaults[field.name as string] = existing.map((a: any) => ({ key: a.key || "", value: a.value || "" }));
        } else if (field.type === "images" && Array.isArray(existing)) {
          defaults[field.name as string] = existing.map((img: any) => ({ url: img.url || "", isMain: !!img.isMain }));
        } else {
          defaults[field.name as string] = existing;
        }
        continue;
      }

      switch (field.type) {
        case "checkbox":
          defaults[field.name as string] = false;
          break;
        case "number":
          defaults[field.name as string] = "";
          break;
        case "file":
          defaults[field.name as string] = null;
          break;
        case "select":
          defaults[field.name as string] = field.options?.[0]?.value ?? "";
          break;
        case "images":
          defaults[field.name as string] = [];
          break;
        case "attributes":
          defaults[field.name as string] = [{ key: "", value: "" }];
          break;
        case "variants":
          defaults[field.name as string] = [{ ...EMPTY_VARIANT, warranty: { ...EMPTY_VARIANT.warranty } }];
          break;
        default:
          defaults[field.name as string] = "";
      }
    }
    return defaults as T;
  }, [initialValues, fields]);

  const handleCancel = useCallback(() => {
    if (onCancel) onCancel();
    else router.back();
  }, [onCancel, router]);

  const handleSubmit = useCallback(
    async (values: T, helpers: FormikHelpers<T>) => {
      const cleanedValues: any = { ...values };
      if (values.price !== undefined) cleanedValues.price = parsePersianNumber(values.price as any);
      if (values.stock !== undefined) cleanedValues.stock = parsePersianNumber(values.stock as any);
      if (Array.isArray((values as any).variants)) {
        cleanedValues.variants = (values as any).variants.map((v: any) => ({
          ...v,
          price: parsePersianNumber(v.price),
          stock: parsePersianNumber(v.stock),
        }));
      }
      await onSubmit(cleanedValues as T, helpers);
    },
    [onSubmit]
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="space-y-1.5 text-right">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-350 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 leading-relaxed font-semibold">
            {mode === "edit" ? "ویرایش و به‌روزرسانی اطلاعات موجود پایگاه داده" : "ثبت و مقداردهی رکوردهای اطلاعاتی جدید"}
          </p>
        </div>

        <div className="flex-shrink-0 p-1.5 flex items-center justify-start md:justify-end">
          <Button variant="ghost" size="md" iconLeft={<FiArrowRight />} iconTranslate="right" onClick={handleCancel} className="border-transparent hover:bg-slate-100 dark:hover:bg-[#121420] text-slate-500 dark:text-slate-400">
            بازگشت به لیست
          </Button>
        </div>
      </div>

      <div className="relative bg-white/60 dark:bg-[#0c0d14]/20 backdrop-blur-xl border border-slate-200/50 dark:border-[#1f2235]/40 rounded-3xl p-6 md:p-8 isolation-auto overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        <Formik<T> initialValues={normalizedInitialValues} enableReinitialize validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 pt-6">
              <FormikObserver fields={fields as any} />

              {fields.map((field) => {
                const isFullWidth =
                  field.type === "textarea" ||
                  field.type === "file" ||
                  field.type === "tree" ||
                  field.type === "images" ||
                  field.type === "attributes" ||
                  field.type === "variants";
                const isDisabled = typeof field.disabled === "function" ? field.disabled(values) : !!field.disabled;

                return (
                  <div key={String(field.name)} className={isFullWidth ? "md:col-span-2" : "col-span-1"}>
                    {field.type === "file" ? (
                      <div className="space-y-2">
                        <label className={LABEL_CLASS}>{field.label}</label>
                        <FileInput
                          name={String(field.name)}
                          setFieldValue={setFieldValue}
                          existingUrl={typeof normalizedInitialValues[field.name] === "string" ? (normalizedInitialValues[field.name] as string) : null}
                        />
                        <ErrorMessage name={String(field.name)} />
                      </div>
                    ) : field.type === "tree" ? (
                      <div className="space-y-2">
                        <label className={LABEL_CLASS}>{field.label}</label>
                        <CategoryTreeSelector name={String(field.name)} options={field.options || []} currentId={initialValues ? (initialValues as any).id : null} />
                        <ErrorMessage name={String(field.name)} />
                      </div>
                    ) : (
                      <FormField field={field} fields={fields as any} disabled={isDisabled} />
                    )}
                  </div>
                );
              })}

              <div className="md:col-span-2 flex flex-col-reverse sm:flex-row sm:justify-start gap-3 mt-8 border-t border-slate-100 dark:border-[#1f2235]/60 pt-6">
                <Button
                  variant="success"
                  size="lg"
                  type="submit"
                  loading={isSubmitting}
                  withShine
                  withRipple
                  withGlow
                  iconLeft={<FiCheck />}
                  iconTranslate="left"
                  className="w-full sm:w-auto justify-center rounded-xl"
                >
                  {mode === "edit" ? "بروزرسانی تغییرات" : "ثبت نهایی اطلاعات"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  iconLeft={<FiX />}
                  iconRotate={90}
                  iconScale
                  disabled={isSubmitting}
                  onClick={handleCancel}
                  className="w-full sm:w-auto hover:border-rose-500 hover:text-rose-500 transition-all rounded-xl"
                >
                  انصراف و خروج
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
