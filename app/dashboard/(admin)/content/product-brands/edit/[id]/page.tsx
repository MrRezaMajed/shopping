"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductBrandById, updateProductBrand } from "@/app/actions/productBrand/productBrandActions";
import { toast } from "sonner";
import Link from "next/link";
import { generateSlug } from "@/lib/slug/generateSlug";

export default function EditProductBrandPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  // Fetch brand data
  useEffect(() => {
    const fetchBrand = async () => {
      if (!id || isNaN(id)) {
        toast.error("شناسه برند نامعتبر است");
        router.push("/dashboard/content/product-brands");
        return;
      }

      setFetching(true);
      const result = await getProductBrandById(id);

      if (result.success && result.data) {
        setFormData({
          name: result.data.name,
          slug: result.data.slug,
          status: result.data.status,
        });
      } else {
        toast.error(result.error || "خطا در دریافت اطلاعات برند");
        router.push("/dashboard/content/product-brands");
      }
      setFetching(false);
    };

    fetchBrand();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("نام برند الزامی است");
      return;
    }

    setLoading(true);
    const result = await updateProductBrand(id, formData);

    if (result.success) {
      toast.success("برند با موفقیت بروزرسانی شد");
      router.push("/dashboard/content/product-brands");
      router.refresh();
    } else {
      toast.error(result.error || "خطا در بروزرسانی برند");
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (fetching) {
    return (
      <div className="p-6 bg-gray-200 dark:bg-gray-950 rounded-xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-900 dark:text-gray-100">در حال دریافت اطلاعات...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-200 dark:bg-gray-950 rounded-xl">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ویرایش برند</h1>
        <Link
          href="/dashboard/content/product-brands"
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
        >
          بازگشت
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ستون اول */}
            <div className="space-y-6">
              {/* نام برند */}
              <div className="">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  نام برند *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      name: name,
                      // ایجاد اسلاگ خودکار از نام
                      slug: generateSlug(name)
                    }));
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="نام برند را وارد کنید"
                  required
                />
              </div>
      
              
            </div>
            
            {/* وضعیت */}
            <div className="space-y-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                وضعیت
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ACTIVE">فعال</option>
                <option value="INACTIVE">غیرفعال</option>
              </select>
            </div>
            
            {/* ستون دوم */}
            <div className="space-y-6 hidden">
              {/* اسلاگ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اسلاگ (تولید خودکار)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={(e) => {
                    // اگر کاربر مستقیماً اسلاگ را تغییر دهد، دستی بودن آن را علامت بزنید
                    setFormData(prev => ({
                      ...prev,
                      slug: e.target.value
                    }));
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    bg-gray-50 dark:bg-gray-800"
                  placeholder="اسلاگ به صورت خودکار ایجاد می‌شود"
                  readOnly={true} // یا می‌توانید false بگذارید اگر می‌خواهید کاربر بتواند تغییر دهد
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  این فیلد به طور خودکار از نام برند ایجاد می‌شود
                </p>
              </div>
      
              {/* پیش نمایش */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  پیش نمایش آدرس
                </label>
                <div className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-md 
                  bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  /brand/{formData.slug || 'نام-برند'}
                </div>
              </div>
            </div>
          </div>
      
          {/* دکمه‌های عملیات */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3 justify-start">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "در حال بروزرسانی..." : "بروزرسانی برند"}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                  rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                انصراف
              </button>
              
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}