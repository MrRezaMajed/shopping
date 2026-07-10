"use client";

import { useState, useEffect, useCallback } from "react";
import { GenericDataTable } from "@/components/ui/DataTable/GenericDataTable";
import { ProductWithRelations } from "./types";
import { productColumns } from "./columns";
import { 
  getProducts, 
  getActiveCategories, 
  getActiveBrands, 
  toggleProductStatus, 
  deleteProduct 
} from "@/app/actions/product/productActions";
import { toast } from "sonner";
import { FiGrid } from "react-icons/fi";
import Link from "next/link";
import { toPersianNumber } from "@/lib/utils/persianNumbers";
import { ProductBrand, Category } from "@prisma/client";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<ProductBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [togglingIds, setTogglingIds] = useState<(number | string)[]>([]);
  const [stats, setStats] = useState({ activeCategories: 0, activeBrands: 0 });

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const productsResult = await getProducts(page, limit);
      if (productsResult.success && productsResult.data) {
        setProducts(productsResult.data);
        setTotal(productsResult.total || 0);
      } else {
        toast.error(productsResult.error || "خطا در دریافت محصولات");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("خطا در دریافت محصولات");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  // Fetch categories & brands
  const fetchCategoriesAndBrands = useCallback(async () => {
    try {
      const [categoriesResult, brandsResult] = await Promise.all([
        getActiveCategories(),
        getActiveBrands(),
      ]);

      if (categoriesResult.success && categoriesResult.data) {
        setCategories(categoriesResult.data);
        setStats(prev => ({ ...prev, activeCategories: categoriesResult.data.length }));
      } else {
        toast.error(categoriesResult.error || "خطا در دریافت دسته‌بندی‌ها");
      }

      if (brandsResult.success && brandsResult.data) {
        setBrands(brandsResult.data);
        setStats(prev => ({ ...prev, activeBrands: brandsResult.data.length }));
      } else {
        toast.error(brandsResult.error || "خطا در دریافت برندها");
      }
    } catch (error) {
      console.error("Error fetching categories and brands:", error);
      toast.error("خطا در دریافت اطلاعات");
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategoriesAndBrands()]);
      setLoading(false);
    };
    fetchAll();
  }, [fetchProducts, fetchCategoriesAndBrands]);

  // Refetch on page or limit change
  useEffect(() => { fetchProducts(); }, [page, limit, fetchProducts]);

  // Toggle status
  const handleStatusToggle = async (id: number | string) => {
    try {
      setTogglingIds(prev => [...prev, id]);
      const result = await toggleProductStatus(Number(id));
      if (result.success) {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : p));
        toast.success(result.message || "وضعیت محصول با موفقیت تغییر کرد");
      } else {
        toast.error(result.error || "خطا در تغییر وضعیت");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("خطا در تغییر وضعیت");
    } finally {
      setTogglingIds(prev => prev.filter(itemId => itemId !== id));
    }
  };

  // Delete product (direct, no confirmation)
  const handleDelete = async (id: number | string) => {
    try {
      const result = await deleteProduct(Number(id));
      if (result.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        setTotal(prev => prev - 1);
        if (products.length === 1 && page > 1) setPage(page - 1);
        toast.success(result.message || "محصول با موفقیت حذف شد");
      } else {
        toast.error(result.error || "خطا در حذف محصول");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("خطا در حذف محصول");
    }
  };

  // Refresh products
  const handleRefresh = () => {
    fetchProducts();
    toast.success("اطلاعات به‌روزرسانی شد");
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleLimitChange = (newLimit: number) => { setLimit(newLimit); setPage(1); };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Header & Stats */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-10 bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full"></div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">مدیریت محصولات</h1>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">مشاهده، ویرایش و حذف محصولات فروشگاه</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                {/* Total Products */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <FiGrid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-400">کل محصولات</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-200">{toPersianNumber(total.toString())}</p>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 text-lg">🏷️</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-400">دسته‌بندی‌ها</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-200">{toPersianNumber(stats.activeCategories.toString())}</p>
                    </div>
                  </div>
                </div>

                {/* Brands */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 text-lg">🏭</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-400">برندها</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-200">{toPersianNumber(stats.activeBrands.toString())}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DataTable */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <GenericDataTable
              data={products}
              total={total}
              columns={productColumns}
              loading={loading}
              page={page}
              limit={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              onStatusToggle={handleStatusToggle}
              onDelete={handleDelete}
              editPath={(id) => `/dashboard/content/products/edit/${id}`}
              createPath="/dashboard/content/products/create"
              title="لیست محصولات"
              emptyMessage="محصولی یافت نشد! برای شروع محصول جدیدی ایجاد کنید."
              togglingIds={togglingIds}
              createButton="محصول"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/content/categories" className="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-blue-600 dark:text-blue-400 text-xl">📂</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-200">دسته‌بندی‌ها</h3>
                <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">مدیریت دسته‌بندی محصولات</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/content/product-brands" className="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-green-600 dark:text-green-400 text-xl">🏭</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-200">برندها</h3>
                <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">مدیریت برندهای محصولات</p>
              </div>
            </div>
          </Link>

          <div className="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-purple-600 dark:text-purple-400 text-xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-200">آمار فروش</h3>
                <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">گزارش‌های فروش محصولات</p>
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-orange-600 dark:text-orange-400 text-xl">📦</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-200">موجودی انبار</h3>
                <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">مدیریت موجودی محصولات</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
