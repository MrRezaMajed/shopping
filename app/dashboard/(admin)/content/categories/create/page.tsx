import CategoryFormTree from "@/components/dashboard/content/category/CategoryFormTree";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default async function CreateCategoryPage() {
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div
      className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100
      dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-x-auto  text-gray-800  dark:text-gray-100"
    >
      {/* ===== Header ===== */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                ایجاد دسته‌بندی جدید
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm max-w-2xl">
              برای افزودن دسته‌بندی جدید، اطلاعات را وارد کرده و والد مناسب را انتخاب کنید.
            </p>
          </div>

          <Link
            href="/dashboard/content/categories"
            className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white 
            dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
            rounded-xl hover:border-blue-500 hover:shadow-md transition-all"
          >
            <FiArrowRight className="w-4 h-4 group-hover:rotate-180 transition-transform" />
            <span className="text-sm font-medium">بازگشت به لیست</span>
          </Link>
        </div>
      </div>

      {/* ===== Form Card ===== */}
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg
        dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700"
      >
        <CategoryFormTree categories={categories} />
      </div>
    </div>
  );
}
