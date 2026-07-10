import { getActiveCategories, getActiveBrands } from "@/app/actions/product/products";
import CreateProductForm from "./components/CreateProductForm";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default async function CreateProductPage() {
  const [categoriesResult, brandsResult] = await Promise.all([
    getActiveCategories(),
    getActiveBrands(),
  ]);

  const categories = categoriesResult.success ? categoriesResult.data ?? [] : [];
  const brands = brandsResult.success ? brandsResult.data ?? [] : [];

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 
      dark:from-gray-900 dark:to-gray-800 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-600 
                  dark:from-blue-400 dark:to-blue-500 rounded-full"></div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 
                  dark:text-gray-100">
                  ایجاد محصول جدید
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base 
                mt-2 max-w-2xl">
                برای افزودن محصول جدید به فروشگاه، اطلاعات مورد نیاز را با دقت وارد کنید.
                تمامی فیلدهای ستاره‌دار الزامی می‌باشند.
              </p>
            </div>
            
            <Link
              href="/dashboard/content/products"
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

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
          dark:shadow-gray-900/50 overflow-hidden border border-gray-100 
          dark:border-gray-700">
          {/* Progress Indicator */}
          <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full 
                bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 
                dark:to-blue-500 text-white font-semibold text-sm">
                1
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  مرحله اول: تکمیل اطلاعات
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  اطلاعات پایه، واریانت‌ها، تصاویر و ویژگی‌های محصول
                </p>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="p-4 md:p-6 lg:p-8">
            <CreateProductForm 
              categories={categories} 
              brands={brands} 
            />
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 dark:border-gray-700 px-6 py-4 
            bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  سیستم در حالت آماده‌به‌کار
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                آخرین بروزرسانی: امروز
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 
            dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-100 
            dark:border-blue-800/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 
                flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-lg">💡</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  نکته مهم
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  تصویر اصلی محصول اولین تصویر آپلود شده خواهد بود.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 
            dark:from-green-900/20 dark:to-green-900/10 border border-green-100 
            dark:border-green-800/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/40 
                flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-lg">⚡</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  راهنمای سریع
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  برای هر واریانت، گارانتی جداگانه قابل تعریف است.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 
            dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-100 
            dark:border-purple-800/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 
                flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-lg">📱</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  نمایش واکنش‌گرا
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  فرم در تمام دستگاه‌ها به بهترین شکل نمایش داده می‌شود.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}