"use client";

import { Product, Category, ProductBrand } from "@prisma/client";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { deleteProduct, toggleProductStatus } from "@/app/actions/product/products";
import { FiEdit, FiTrash2, FiEye, FiImage, FiSearch } from "react-icons/fi";
import { toPersianNumber, formatPrice } from "@/lib/utils/persianNumbers";
import Pagination from "@/components/ui/DataTable/Pagination";

interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductImage {
  id: number;
  productId: number;
  url: string;
  alt: string;
  order: number;
  isMain: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductWithRelations extends Product {
  category: Category;
  brand: ProductBrand | null;
  variants: ProductVariant[];
  images: ProductImage[];
}

interface ProductsListClientProps {
  initialProducts: ProductWithRelations[];
  categories: Category[];
  brands: ProductBrand[];
}

export default function ProductsListClient({ 
  initialProducts, 
  categories, 
  brands 
}: ProductsListClientProps) {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || 
                             product.categoryId?.toString() === selectedCategory;
      const matchesBrand = selectedBrand === "all" || 
                          (product.brandId && product.brandId.toString() === selectedBrand);
      const matchesStatus = statusFilter === "all" || product.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
    });
  }, [initialProducts, searchTerm, selectedCategory, selectedBrand, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedBrand, statusFilter]);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این محصول مطمئن هستید؟")) return;
    
    setDeletingId(id);
    try {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success(result.message);
        // برای حذف از لیست، باید از parent component re-fetch شود
        window.location.reload();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "خطا در حذف محصول";
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (id: number, currentStatus: "ACTIVE" | "INACTIVE") => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    
    try {
      const result = await toggleProductStatus(id);
      if (result.success) {
        toast.success(result.message);
        // برای آپدیت وضعیت، باید از parent component re-fetch شود
        window.location.reload();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "خطا در تغییر وضعیت";
      toast.error(errorMessage);
    }
  };

  // Get category name
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "بدون دسته‌بندی";
  };

  // Get brand name
  const getBrandName = (brandId: number | null) => {
    if (!brandId) return "بدون برند";
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : "بدون برند";
  };

  // Get total stock
  const getTotalStock = (variants: ProductVariant[]) => {
    return variants.reduce((sum, v) => sum + v.stock, 0);
  };

  // Get min price
  const getMinPrice = (variants: ProductVariant[]) => {
    if (variants.length === 0) return 0;
    return Math.min(...variants.map(v => v.price));
  };

  return (
    <div className="space-y-6">
      {/* Advanced Filters */}
      <div className="bg-gradient-to-r from-gray-50 bg-gray-100 dark:from-gray-800 dark:to-gray-900 
        rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <div className="relative">
              <FiSearch className="absolute right-3 top-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="جستجوی محصول بر اساس نام یا توضیحات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 
                  border border-gray-300 dark:border-gray-600 rounded-lg 
                  text-gray-900 dark:text-gray-200 placeholder-gray-600 
                  dark:placeholder-gray-400 focus:outline-none focus:ring-2 
                  focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 
              dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm 
              text-gray-900 dark:text-gray-200 focus:outline-none 
              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="all">همه دسته‌بندی‌ها</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          
          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 
              dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm 
              text-gray-900 dark:text-gray-200 focus:outline-none 
              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="all">همه برندها</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 
              dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm 
              text-gray-900 dark:text-gray-200 focus:outline-none 
              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="ACTIVE">فعال</option>
            <option value="INACTIVE">غیرفعال</option>
          </select>
        </div>
        
        {/* Results Info */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {toPersianNumber(filteredProducts.length)} محصول یافت شد
            </span>
            {searchTerm && (
              <span className="text-sm text-blue-600 dark:text-blue-400">
                (جستجو: "{searchTerm}")
              </span>
            )}
          </div>
          
          {/* Items per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              نمایش
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white dark:bg-gray-800 border border-gray-300 
                dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm 
                text-gray-900 dark:text-gray-200 focus:outline-none 
                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value={5}>{toPersianNumber(5)}</option>
              <option value={10}>{toPersianNumber(10)}</option>
              <option value={20}>{toPersianNumber(20)}</option>
              <option value={50}>{toPersianNumber(50)}</option>
            </select>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              در هر صفحه
            </span>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow 
        border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 
              dark:from-gray-800 dark:to-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-sm font-semibold 
                  text-gray-900 dark:text-gray-200 uppercase tracking-wider">
                  محصول
                </th>
                <th scope="col" className="px-6 py-3 text-right text-sm font-semibold 
                  text-gray-900 dark:text-gray-200 uppercase tracking-wider">
                  دسته‌بندی
                </th>
                <th scope="col" className="px-6 py-3 text-right text-sm font-semibold 
                  text-gray-900 dark:text-gray-200 uppercase tracking-wider">
                  برند
                </th>
                <th scope="col" className="px-6 py-3 text-right text-sm font-semibold 
                  text-gray-900 dark:text-gray-200 uppercase tracking-wider">
                  قیمت
                </th>
                <th scope="col" className="px-6 py-3 text-right text-sm font-semibold 
                  text-gray-900 dark:text-gray-200 uppercase tracking-wider">
                  موجودی
                </th>
                <th scope="col" className="px-6 py-3 text-right text-sm font-semibold 
                  text-gray-900 dark:text-gray-200 uppercase tracking-wider">
                  وضعیت
                </th>
                <th scope="col" className="px-6 py-3 text-right text-sm font-semibold 
                  text-gray-900 dark:text-gray-200 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 
              bg-white dark:bg-gray-800">
              {currentProducts.map((product) => (
                <tr 
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 
                    transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg 
                        bg-gradient-to-br from-blue-50 to-blue-100 
                        dark:from-blue-900/20 dark:to-blue-900/10 
                        flex items-center justify-center mr-3 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]?.url} 
                            alt={product.title}
                            className="h-12 w-12 object-cover"
                          />
                        ) : (
                          <FiImage className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 
                          dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 
                          transition-colors">
                          <Link href={`/dashboard/content/products/${product.id}`}>
                            {product.title}
                          </Link>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 
                          mt-1 line-clamp-1">
                          {product.description?.substring(0, 80)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-800 dark:text-gray-300">
                      {getCategoryName(product.categoryId)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-800 dark:text-gray-300">
                      {getBrandName(product.brandId)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {product.variants && product.variants.length > 0 ? (
                        <div>
                          از {formatPrice(getMinPrice(product.variants))} تومان
                          {product.variants.length > 1 && (
                            <span className="text-xs font-normal text-gray-600 
                              dark:text-gray-400 mr-1">
                              ({toPersianNumber(product.variants.length)} مدل)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          تعریف نشده
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {product.variants ? (
                        <span className={getTotalStock(product.variants) === 0 ? 
                          "text-red-600 dark:text-red-400" : ""}>
                          {toPersianNumber(getTotalStock(product.variants))} عدد
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">0 عدد</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusToggle(product.id, product.status)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold 
                        transition-all duration-200 ${
                          product.status === "ACTIVE"
                            ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                            : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                        }`}
                    >
                      {product.status === "ACTIVE" ? "فعال" : "غیرفعال"}
                    </button>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/dashboard/content/products/${product.id}`}
                        className="p-2 rounded-lg text-blue-600 dark:text-blue-400 
                          hover:bg-blue-50 dark:hover:bg-blue-900/20 
                          transition-colors"
                        title="مشاهده جزئیات"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/content/products/${product.id}/edit`}
                        className="p-2 rounded-lg text-green-600 dark:text-green-400 
                          hover:bg-green-50 dark:hover:bg-green-900/20 
                          transition-colors"
                        title="ویرایش"
                      >
                        <FiEdit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className={`p-2 rounded-lg ${
                          deletingId === product.id
                            ? 'text-red-400 cursor-not-allowed'
                            : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                        } transition-colors`}
                        title="حذف"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Products Message */}
        {currentProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 
              dark:bg-gray-700 flex items-center justify-center">
              <FiImage className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              محصولی یافت نشد
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              هیچ محصولی با فیلترهای انتخاب شده مطابقت ندارد. 
              فیلترها را تغییر دهید یا محصول جدیدی ایجاد کنید.
            </p>
          </div>
        )}

        {/* Pagination - فقط اگر بیش از یک صفحه وجود داشته باشد */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 
            bg-gray-50 dark:bg-gray-900/30">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                نمایش {toPersianNumber(startIndex + 1)} تا {toPersianNumber(Math.min(endIndex, filteredProducts.length))} 
                {" "}از {toPersianNumber(filteredProducts.length)} محصول
              </div>
              
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}