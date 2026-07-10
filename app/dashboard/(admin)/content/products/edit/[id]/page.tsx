"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById, updateProduct, getActiveCategories, getActiveBrands } from "@/app/actions/product/products";
import { generateSlug } from "@/lib/slug/generateSlug";
import { toast } from "sonner";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface ProductFormData {
  title: string;
  slug: string;
  description: string;
  brandId: number | null;
  categoryId: number;
  status: "ACTIVE" | "INACTIVE";
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    slug: "",
    description: "",
    brandId: null,
    categoryId: 0,
    status: "ACTIVE",
  });

  const [originalFormData, setOriginalFormData] = useState<ProductFormData | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Fetch product data and related data
  useEffect(() => {
    const fetchData = async () => {
      if (!id || isNaN(id)) {
        toast.error("شناسه محصول نامعتبر است");
        router.push("/dashboard/content/products");
        return;
      }

      setFetching(true);
      
      try {
        // Fetch product data
        const productResult = await getProductById(id);
        
        if (productResult.success && productResult.data) {
          const product = productResult.data;
          const formData = {
            title: product.title,
            slug: product.slug,
            description: product.description,
            brandId: product.brandId,
            categoryId: product.categoryId,
            status: product.status,
          };
          
          setFormData(formData);
          setOriginalFormData(formData);
        } else {
          toast.error(productResult.error || "خطا در دریافت اطلاعات محصول");
          router.push("/dashboard/content/products");
          return;
        }

        // Fetch categories and brands
        const [categoriesResult, brandsResult] = await Promise.all([
          getAllActiveCategories(),
          getAllActiveBrands(),
        ]);

        if (categoriesResult.success) {
          setCategories(categoriesResult.data);
        }

        if (brandsResult.success) {
          setBrands(brandsResult.data);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("خطا در دریافت اطلاعات");
        router.push("/dashboard/content/products");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("عنوان محصول الزامی است");
      return;
    }

    if (!formData.categoryId) {
      toast.error("انتخاب دسته‌بندی الزامی است");
      return;
    }

    // Check if any changes were made
    if (originalFormData && 
        JSON.stringify(formData) === JSON.stringify(originalFormData)) {
      toast.info("هیچ تغییری اعمال نشده است");
      return;
    }

    setLoading(true);
    const result = await updateProduct(id, formData);

    if (result.success) {
      toast.success("محصول با موفقیت بروزرسانی شد");
      router.push("/dashboard/content/products");
      router.refresh();
    } else {
      toast.error(result.error || "خطا در بروزرسانی محصول");
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'slug') {
      setSlugManuallyEdited(true);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'brandId' || name === 'categoryId' 
        ? (value ? Number(value) : null) 
        : value,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      title: title,
      // فقط اگر اسلاگ دستی ویرایش نشده باشد، آن را آپدیت کن
      slug: !slugManuallyEdited ? generateSlug(title) : prev.slug
    }));
  };

  const resetSlugToAuto = () => {
    setSlugManuallyEdited(false);
    setFormData(prev => ({
      ...prev,
      slug: generateSlug(prev.title)
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ویرایش محصول</h1>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/content/products/${id}`}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            مشاهده محصول
          </Link>
          <Link
            href="/dashboard/content/products"
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            بازگشت
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ستون اول */}
            <div className="space-y-6">
              {/* عنوان محصول */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عنوان محصول *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="عنوان محصول را وارد کنید"
                  required
                />
              </div>

              {/* اسلاگ */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    اسلاگ
                  </label>
                  {slugManuallyEdited && (
                    <button
                      type="button"
                      onClick={resetSlugToAuto}
                      className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      بازنشانی به حالت خودکار
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="اسلاگ محصول"
                />
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {slugManuallyEdited 
                      ? "شما اسلاگ را دستی ویرایش کرده‌اید" 
                      : "اسلاگ به صورت خودکار از عنوان ایجاد می‌شود"
                    }
                  </p>
                  {!slugManuallyEdited && (
                    <span className="text-xs text-green-600 dark:text-green-400">(خودکار)</span>
                  )}
                </div>
              </div>

              {/* دسته‌بندی */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  دسته‌بندی *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ستون دوم */}
            <div className="space-y-6">
              {/* برند */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  برند (اختیاری)
                </label>
                <select
                  name="brandId"
                  value={formData.brandId || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">بدون برند</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* وضعیت */}
              <div>
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

              {/* آمار محصول */}
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  آمار محصول
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                    <div className="text-sm text-blue-600 dark:text-blue-400">واریانت‌ها</div>
                    <div className="text-lg font-bold text-blue-700 dark:text-blue-300">0</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/30 rounded">
                    <div className="text-sm text-green-600 dark:text-green-400">تصاویر</div>
                    <div className="text-lg font-bold text-green-700 dark:text-green-300">0</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/30 rounded">
                    <div className="text-sm text-purple-600 dark:text-purple-400">نظرات</div>
                    <div className="text-lg font-bold text-purple-700 dark:text-purple-300">0</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded">
                    <div className="text-sm text-yellow-600 dark:text-yellow-400">علاقه‌مندی‌ها</div>
                    <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">0</div>
                  </div>
                </div>
              </div>
            </div>

            {/* توضیحات - کل عرض */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                توضیحات محصول *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={8}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="توضیحات کامل محصول را وارد کنید"
                required
              />
            </div>
          </div>

          {/* دکمه‌های عملیات */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3 justify-between">
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/content/products/${id}/variants`}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                >
                  مدیریت واریانت‌ها
                </Link>
                <Link
                  href={`/dashboard/content/products/${id}/images`}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                >
                  مدیریت تصاویر
                </Link>
                <Link
                  href={`/dashboard/content/products/${id}/attributes`}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  مدیریت ویژگی‌ها
                </Link>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                    rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  انصراف
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "در حال بروزرسانی..." : "بروزرسانی محصول"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}