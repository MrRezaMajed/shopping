"use client";

import { useState, useEffect, useCallback } from "react";
import { GenericDataTable } from "@/components/ui/DataTable/GenericDataTable";
import { ColumnDef } from "@/components/ui/DataTable/types";
import { getCategories, toggleCategoryStatus, deleteCategory } from "@/app/actions/category/categoryActions";
import { toast } from "sonner";
import { FiFolder, FiLayers, FiArchive, FiPlusSquare } from "react-icons/fi";
import Link from "next/link";
import { toPersianNumber } from "@/lib/utils/persianNumbers";

// ==================== Type ====================
interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  softDeletedAt: string | null;
  parent: { id: number; name: string } | null;
  _count: { children: number; products: number };
}

// ==================== Columns ====================
const categoryColumns: ColumnDef<Category>[] = [
  {
    id: "name",
    header: "نام",
    accessor: "name",
    width: "200px",
  },
  {
    id: "slug",
    header: "Slug",
    accessor: "slug",
    width: "250px",
  },
  {
    id: "parent",
    header: "والد",
    accessor: "parent",
    cell: (row) =>
      row.parent ? (
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
          {row.parent.name}
        </span>
      ) : (
        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm font-semibold">
          اصلی
        </span>
      ),
    width: "120px",
  },
  {
    id: "status",
    header: "وضعیت",
    accessor: "status",
    width: "120px",
  },
  {
    id: "createdAt",
    header: "تاریخ ایجاد",
    accessor: "createdAt",
    cell: (row) => new Date(row.createdAt).toLocaleDateString("fa-IR"),
    width: "120px",
  },
  {
    id: "products",
    header: "تعداد محصولات",
    accessor: "_count",
    cell: (row) => row._count.products,
    width: "120px",
  },
];

// ==================== Page ====================
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [togglingIds, setTogglingIds] = useState<number[]>([]);
  const [stats, setStats] = useState({
    active: 0,
    inactive: 0,
    parent: 0,
    child: 0,
    totalProducts: 0,
  });

  // ==================== Fetch Categories ====================
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCategories(page, limit);
      if (res.success && res.data) {
        setCategories(res.data);
        setTotal(res.total || 0);

        // محاسبه stats
        const activeCount = res.data.filter(c => c.status === "ACTIVE").length;
        const inactiveCount = res.data.filter(c => c.status === "INACTIVE").length;
        const parentCount = res.data.filter(c => c.parentId === null).length;
        const childCount = res.data.filter(c => c.parentId !== null).length;
        const totalProducts = res.data.reduce((sum, c) => sum + c._count.products, 0);

        setStats({ active: activeCount, inactive: inactiveCount, parent: parentCount, child: childCount, totalProducts });
      } else {
        toast.error(res.error || "خطا در دریافت دسته‌بندی‌ها");
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در دریافت دسته‌بندی‌ها");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // ==================== Actions ====================
  const handleStatusToggle = async (id: number) => {
    try {
      setTogglingIds(prev => [...prev, id]);
      const result = await toggleCategoryStatus(id);
      if (result.success && result.data) {
        setCategories(prev => {
          const updated = prev.map(c => c.id === id ? { ...c, status: result.data.status } : c);

          // آپدیت stats
          const activeCount = updated.filter(c => c.status === "ACTIVE").length;
          const inactiveCount = updated.filter(c => c.status === "INACTIVE").length;
          const parentCount = updated.filter(c => c.parentId === null).length;
          const childCount = updated.filter(c => c.parentId !== null).length;
          const totalProducts = updated.reduce((sum, c) => sum + c._count.products, 0);

          setStats({ active: activeCount, inactive: inactiveCount, parent: parentCount, child: childCount, totalProducts });

          return updated;
        });
        toast.success(result.message || "وضعیت با موفقیت تغییر کرد");
      } else {
        toast.error(result.error || "خطا در تغییر وضعیت");
      }
    } catch (error) {
      console.error(error);
      toast.error("خطای غیرمنتظره");
    } finally {
      setTogglingIds(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteCategory(id);
      if (result.success) {
        setCategories(prev => prev.filter(c => c.id !== id));
        setTotal(prev => prev - 1);

        // آپدیت stats
        const updated = categories.filter(c => c.id !== id);
        const activeCount = updated.filter(c => c.status === "ACTIVE").length;
        const inactiveCount = updated.filter(c => c.status === "INACTIVE").length;
        const parentCount = updated.filter(c => c.parentId === null).length;
        const childCount = updated.filter(c => c.parentId !== null).length;
        const totalProducts = updated.reduce((sum, c) => sum + c._count.products, 0);
        setStats({ active: activeCount, inactive: inactiveCount, parent: parentCount, child: childCount, totalProducts });

        if (categories.length === 1 && page > 1) setPage(page - 1);

        toast.success(result.message || "دسته‌بندی با موفقیت حذف شد");
      } else {
        toast.error(result.error || "خطا در حذف دسته‌بندی");
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در حذف دسته‌بندی");
    }
  };

  const handleRefresh = () => { fetchCategories(); toast.success("اطلاعات به‌روزرسانی شد"); };
  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleLimitChange = (newLimit: number) => { setLimit(newLimit); setPage(1); };

  // ==================== Render ====================
  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Header & Stats */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-10 bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full"></div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">مدیریت دسته‌بندی‌ها</h1>
              <p className="text-gray-700 dark:text-gray-300 mb-4">مشاهده، ویرایش و حذف دسته‌بندی‌های سایت و آمار آن‌ها</p>
            </div>
          </div>
          

          <div className="flex flex-wrap gap-4 mt-6">
            <StatCard title="فعال" value={stats.active} color="green" icon={<FiFolder />} />
            <StatCard title="غیرفعال" value={stats.inactive} color="red" icon={<FiFolder />} />
            <StatCard title="والد" value={stats.parent} color="blue" icon={<FiLayers />} />
            <StatCard title="فرزند" value={stats.child} color="purple" icon={<FiLayers />} />
            <StatCard title="محصولات" value={stats.totalProducts} color="orange" icon={<FiArchive />} />
          </div>
        </div>

        {/* DataTable */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <GenericDataTable
              data={categories}
              total={total}
              columns={categoryColumns}
              loading={loading}
              page={page}
              limit={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              onStatusToggle={handleStatusToggle}
              onDelete={handleDelete}
              editPath={(id) => `/dashboard/content/categories/edit/${id}`}
              createPath="/dashboard/content/categories/create"
              backPath="/dashboard"
              title="لیست دسته‌بندی‌ها"
              emptyMessage="هیچ دسته‌بندی‌ای یافت نشد! برای شروع دسته‌بندی جدید ایجاد کنید."
              togglingIds={togglingIds}
              createButton="دسته‌بندی"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard title="ایجاد دسته‌بندی جدید" href="/dashboard/content/categories/create" icon={<FiPlusSquare />} color="blue" description="اضافه کردن دسته‌بندی جدید به سایت" />
          <QuickActionCard title="مدیریت دسته‌بندی‌های والد" href="/dashboard/content/categories?type=parent" icon={<FiLayers />} color="green" description="نمایش تمام دسته‌بندی‌های والد" />
          <QuickActionCard title="مدیریت دسته‌بندی‌های فرزند" href="/dashboard/content/categories?type=child" icon={<FiLayers />} color="purple" description="نمایش تمام دسته‌بندی‌های فرزند" />
          <QuickActionCard title="مدیریت محصولات دسته‌ها" href="/dashboard/content/categories/products" icon={<FiArchive />} color="orange" description="مشاهده محصولات هر دسته" />
        </div>
      </div>
    </div>
  );
}

// ==================== StatCard Component ====================
interface StatCardProps {
  title: string;
  value: number;
  color: "green" | "red" | "blue" | "purple" | "orange";
  icon: JSX.Element;
}

function StatCard({ title, value, color, icon }: StatCardProps) {
  const colorMap: Record<typeof color, string> = {
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-400">{title}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-200">{toPersianNumber(value.toString())}</p>
        </div>
      </div>
    </div>
  );
}

// ==================== QuickActionCard Component ====================
interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  color: "blue" | "green" | "purple" | "orange";
  icon: JSX.Element;
}

function QuickActionCard({ title, description, href, color, icon }: QuickActionCardProps) {
  const colorMap: Record<typeof color, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  };

  return (
    <Link href={href} className="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${colorMap[color]}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-200">{title}</h3>
          <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
}
