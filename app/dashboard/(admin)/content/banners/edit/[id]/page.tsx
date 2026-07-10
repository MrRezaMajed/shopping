// import BannerEditForm from '@/components/dashboard/content/banner/BannerEditForm';
// import { prisma } from '@/lib/prisma';

// type Props = {
//   params: Promise<{ id: string }>;
// };

// export default async function EditBannerPage({ params }: Props) {
//   const { id } = await params;
//   const bannerId = Number(id);

//   if (!Number.isInteger(bannerId)) {
//     return <p>شناسه بنر نامعتبر است</p>;
//   }

//   const bannerData = await prisma.banner.findUnique({
//     where: { id: bannerId },
//   });

//   if (!bannerData) {
//     return <p>بنر پیدا نشد</p>;
//   }

//   return <BannerEditForm bannerData={bannerData} />;
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { fetchBannerById, updateBanner } from "../../../../../../actions/banner/bannerEdit.actions";

interface BannerData {
  id: number;
  title: string;
  url: string;
  position: "TOP" | "RIGHT" | "DOWN";
  status: "ACTIVE" | "INACTIVE";
  image?: string | null;
}

interface FormValues {
  title: string;
  url: string;
  position: "TOP" | "RIGHT" | "DOWN";
  status: "ACTIVE" | "INACTIVE";
  image: File | null;
}

const positions = [
  { value: "TOP", label: "بالا" },
  { value: "RIGHT", label: "راست" },
  { value: "DOWN", label: "پایین" },
];

const statusOptions = [
  { value: "ACTIVE", label: "فعال" },
  { value: "INACTIVE", label: "غیرفعال" },
];

const schema = Yup.object().shape({
  title: Yup.string().required("عنوان بنر الزامی است"),
  url: Yup.string().required("URL الزامی است"),
  position: Yup.string()
    .oneOf(["TOP", "RIGHT", "DOWN"])
    .required("موقعیت الزامی است"),
  status: Yup.string()
    .oneOf(["ACTIVE", "INACTIVE"])
    .required("وضعیت الزامی است"),
  image: Yup.mixed().nullable().test(
    "fileType",
    "فایل باید تصویر باشد",
    (value) => !value || (value instanceof File && value.type.startsWith("image/"))
  ),
});

// Skeleton ساده برای فرم
function FormSkeleton() {
  const inputSkeleton = "h-10 bg-gray-300 dark:bg-zinc-700 rounded w-full";
  const labelSkeleton = "h-4 bg-gray-300 dark:bg-zinc-700 rounded w-1/3 mb-1";
  const buttonSkeleton = "h-10 bg-gray-300 dark:bg-zinc-700 rounded w-32";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {/* عنوان */}
          <div className="flex flex-col">
            <div className={labelSkeleton}></div>
            <div className={inputSkeleton}></div>
          </div>
    
          {/* URL */}
          <div className="flex flex-col">
            <div className={labelSkeleton}></div>
            <div className={inputSkeleton}></div>
          </div>
    
          {/* وضعیت */}
          <div className="flex flex-col">
            <div className={labelSkeleton}></div>
            <div className={inputSkeleton}></div>
          </div>
    
          {/* موقعیت */}
          <div className="flex flex-col">
            <div className={labelSkeleton}></div>
            <div className={inputSkeleton}></div>
          </div>
    
          {/* تصویر */}
          <div className="flex flex-col md:col-span-2">
            <div className={labelSkeleton}></div>
            <div className="h-40 bg-gray-300 dark:bg-zinc-700 rounded w-full mt-1"></div>
          </div>
    
          {/* دکمه ارسال */}
          <div className="md:col-span-2 flex justify-start mt-2">
            <div className={buttonSkeleton}></div>
          </div>
        </div>
  );
}

export default function EditBannerPage() {
  const router = useRouter();
  const params = useParams(); // برای Next.js 16
  const bannerId = Number(params.id);

  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadBanner() {
      try {
        setLoading(true);
        const data = await fetchBannerById(bannerId);
        if (!data) throw new Error("بنر پیدا نشد");
        setBannerData(data);
        setPreview(data.image || null);
      } catch (err: unknown) {
        if (err instanceof Error) toast.error(err.message);
        else toast.error("خطای ناشناخته");
      } finally {
        setLoading(false);
      }
    }
    loadBanner();
  }, [bannerId]);

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("id", String(bannerData?.id));
      formData.append("title", values.title);
      formData.append("url", values.url);
      formData.append("position", values.position);
      formData.append("status", values.status);
      if (values.image) formData.append("image", values.image);

      const res = await updateBanner(formData);

      if (res.success) {
        toast.success("بنر با موفقیت بروزرسانی شد.");
        if (values.image) setPreview(URL.createObjectURL(values.image));
        router.push("/dashboard/content/banners");
      } else {
        toast.error(res.error || "خطا در بروزرسانی بنر");
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در بروزرسانی بنر");
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  const inputClass = "w-full p-2 border rounded-md bg-gray-300 dark:bg-gray-800 dark:border-gray-700";

  if (loading) return <FormSkeleton />;

  if (!bannerData) return <p>بنر پیدا نشد</p>;

  return (
    <div className="p-6 overflow-x-auto bg-gray-200 dark:bg-gray-950 text-gray-900 dark:text-white rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ویرایش بنر</h1>
        <Link href="/dashboard/content/banners" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
          بازگشت
        </Link>
      </div>

      <Formik<FormValues>
        enableReinitialize
        initialValues={{
          title: bannerData.title,
          url: bannerData.url,
          position: bannerData.position,
          status: bannerData.status,
          image: null,
        }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* عنوان */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">عنوان بنر</label>
              <Field name="title" className={inputClass} />
              <ErrorMessage name="title" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            {/* URL */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">آدرس URL</label>
              <Field name="url" className={inputClass} />
              <ErrorMessage name="url" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            {/* وضعیت */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">وضعیت</label>
              <Field as="select" name="status" className={inputClass}>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="status" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            {/* موقعیت */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">موقعیت</label>
              <Field as="select" name="position" className={inputClass}>
                {positions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="position" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            {/* تصویر */}
            <div className="flex flex-col md:col-span-2">
              <label className="mb-1 font-medium">تصویر بنر</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0] || null;
                  setFieldValue("image", file);
                  if (file) setPreview(URL.createObjectURL(file));
                }}
                className={inputClass}
              />
              <ErrorMessage name="image" component="p" className="text-red-500 text-sm mt-1" />
              {preview && (
                <div className="mt-4 w-full relative">
                  <Image src={preview} alt="Preview" width={480}
                  height={420} className="object-cover rounded-md" />
                </div>
              )}
            </div>

            {/* دکمه ارسال */}
            <div className="md:col-span-2 flex justify-start">
              <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                {uploading ? "در حال آپلود..." : isSubmitting ? "در حال ذخیره..." : "بروزرسانی بنر"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

