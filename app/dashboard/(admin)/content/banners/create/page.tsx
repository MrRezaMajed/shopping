"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { createBanner } from "../../../../../actions/banner/bannerCreate.actions";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

// ==================== Types ====================
interface FormValues {
  title: string;
  url: string;
  position: "TOP" | "RIGHT" | "DOWN";
  status: "ACTIVE" | "INACTIVE";
  image: File | null;
}

// ==================== Constants ====================
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
  position: Yup.string().oneOf(["TOP", "RIGHT", "DOWN"]).required("موقعیت الزامی است"),
  status: Yup.string().oneOf(["ACTIVE", "INACTIVE"]).required("وضعیت الزامی است"),
  image: Yup.mixed().required("تصویر الزامی است"),
});

// ==================== Banner Form Component ====================
export default function Page() {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    if (!values.image) {
      toast.error("تصویر الزامی است");
      setSubmitting(false);
      return;
    }

    setUploading(true);

    try {
      const res = await createBanner(values);

      if (res.success) {
        toast.success("بنر با موفقیت ایجاد شد", { duration: 1500 });
        resetForm();
        setPreview(null);
        setTimeout(() => router.push("/dashboard/content/banners"), 1500);
      } else {
        toast.error(res.error || "خطا در ایجاد بنر");
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در ایجاد بنر");
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 
      dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-x-auto">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-600 
                  dark:from-blue-400 dark:to-blue-500 rounded-full"></div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 
                  dark:text-gray-100">
                  ایجاد بنر
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mt-2 max-w-2xl">
                برای افزودن بنر جدید، اطلاعات مورد نیاز را با دقت وارد کنید.
                تمامی فیلدهای ستاره‌دار الزامی هستند.
              </p>
            </div>

            <Link
              href="/dashboard/content/banners"
              className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white 
                dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                rounded-xl hover:border-blue-500 dark:hover:border-blue-400 
                hover:shadow-md dark:hover:shadow-blue-900/20 transition-all 
                duration-300"
            >
              <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 
                dark:group-hover:text-blue-400 transition-transform group-hover:rotate-180" />
              <span className="text-sm font-medium text-gray-700 
                dark:text-gray-300 group-hover:text-blue-600 
                dark:group-hover:text-blue-400">
                بازگشت به لیست
              </span>
            </Link>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-gray-800  dark:text-gray-100
          dark:shadow-gray-900/50 overflow-hidden border border-gray-100 dark:border-gray-700 p-6">
          <Formik<FormValues>
            initialValues={{
              title: "",
              url: "",
              position: "TOP",
              status: "ACTIVE",
              image: null,
            }}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, isSubmitting }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* عنوان */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">عنوان بنر</label>
                  <Field
                    name="title"
                    className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage name="title" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                {/* URL */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">آدرس URL</label>
                  <Field
                    name="url"
                    className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage name="url" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                {/* وضعیت */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">وضعیت</label>
                  <Field as="select" name="status" className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400">
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="status" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                {/* موقعیت */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">موقعیت</label>
                  <Field as="select" name="position" className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    {positions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="position" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                {/* تصویر */}
                <div className="flex flex-col md:col-span-2">
                  <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">تصویر بنر</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0] || null;
                      setFieldValue("image", file);
                      if (file) setPreview(URL.createObjectURL(file));
                    }}
                    className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <ErrorMessage name="image" component="p" className="text-red-500 text-sm mt-1" />
                  {preview && (
                    <div className="mt-3 w-full h-40 md:h-32 relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                      <Image src={preview} alt="Preview" fill className="object-cover rounded-lg" />
                    </div>
                  )}
                </div>

                {/* دکمه ارسال */}
                <div className="md:col-span-2 flex justify-start mt-4 gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || uploading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md"
                  >
                    {uploading ? "در حال آپلود..." : isSubmitting ? "در حال ذخیره..." : "ایجاد بنر"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="ml-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl px-6 py-3 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-md"
                  >
                    انصراف
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}



