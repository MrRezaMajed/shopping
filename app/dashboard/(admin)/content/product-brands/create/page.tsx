"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductBrand } from "@/app/actions/productBrand/productBrandActions";
import { toast } from "sonner";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function CreateProductBrandPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("نام برند الزامی است");
      return;
    }

    setLoading(true);

    try {
      const result = await createProductBrand(formData);

      if (result.success) {
        toast.success("برند با موفقیت ایجاد شد", { duration: 1500 });
        setTimeout(() => {
          router.push("/dashboard/content/product-brands");
          router.refresh();
        }, 1500);
      } else {
        toast.error(result.error || "خطا در ایجاد برند");
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در ایجاد برند");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-x-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full"></div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
              ایجاد برند
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mt-2 max-w-2xl">
            برای افزودن برند جدید، اطلاعات مورد نیاز را وارد کنید. فیلدهای ستاره‌دار الزامی هستند.
          </p>
        </div>

        <Link
          href="/dashboard/content/product-brands"
          className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md dark:hover:shadow-blue-900/20 transition-all duration-300"
        >
          <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-transform group-hover:rotate-180" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            بازگشت به لیست
          </span>
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-gray-800 dark:text-gray-100 dark:shadow-gray-900/50 overflow-hidden border border-gray-100 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* نام برند */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">نام برند *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="نام برند را وارد کنید"
              required
              className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* slug (اختیاری) */}
          <div className="flex flex-col hidden">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">Slug (اختیاری)</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="slug برند"
              className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* وضعیت */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">وضعیت</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="ACTIVE">فعال</option>
              <option value="INACTIVE">غیرفعال</option>
            </select>
          </div>

          {/* دکمه ارسال */}
          <div className="md:col-span-2 flex justify-start mt-4 gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md"
            >
              {loading ? "در حال ایجاد..." : "ایجاد برند"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="ml-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl px-6 py-3 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-md"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
