"use client";

import { useState, useEffect, useCallback } from "react";
import { GenericDataTable } from "@/components/ui/DataTable/GenericDataTable";
import { ColumnDef } from "@/components/ui/DataTable/types";
// import { getProductBrands, toggleProductBrandStatus, deleteProductBrand } from "@/app/actions/productBrand/productBrandActions";
import { toast } from "sonner";
import { FiTag, FiArchive, FiPlusSquare } from "react-icons/fi";
import Link from "next/link";
import { toPersianNumber } from "@/lib/utils/persianNumbers";

interface ProductBrand {
  id: number;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  softDeletedAt: string | null;
  _count?: {
    products: number;
  };
}

// ==================== Columns ====================
const brandColumns: ColumnDef<ProductBrand>[] = [
  {
    id: "name",
    header: "نام برند",
    accessor: "name",
    width: "250px",
  },
  {
    id: "slug",
    header: "اسلاگ",
    accessor: "slug",
    width: "300px",
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
    width: "140px",
  },
  {
    id: "products",
    header: "تعداد محصولات",
    accessor: "_count",
    cell: (row) => row._count?.products || 0,
    width: "120px",
  },
];

// ==================== Page ====================
export default function ProductBrandsPage() {
  const [brands, setBrands] = useState<ProductBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [togglingIds, setTogglingIds] = useState<number[]>([]);
  const [stats, setStats] = useState({ active: 0, inactive: 0, totalProducts: 0 });

  // ==================== Fetch Brands ====================
  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProductBrands(page, limit);
      if (res.success && res.data) {
        setBrands(res.data);
        setTotal(res.total || 0);

        // محاسبه stats
        const activeCount = res.data.filter(b => b.status === "ACTIVE").length;
        const inactiveCount = res.data.filter(b => b.status === "INACTIVE").length;
        const totalProducts = res.data.reduce((sum, b) => sum + (b._count?.products || 0), 0);

        setStats({ active: activeCount, inactive: inactiveCount, totalProducts });
      } else {
        toast.error(res.error || "خطا در دریافت برندها");
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در دریافت برندها");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  // ==================== Actions ====================
  const handleStatusToggle = async (id: number) => {
    setTogglingIds(prev => [...prev, id]);
    try {
      const result = await toggleProductBrandStatus(id);
      if (result.success && result.data) {
        setBrands(prev => {
          const updated = prev.map(b => b.id === id ? { ...b, status: result.data!.status } : b);

          // بروزرسانی stats
          const activeCount = updated.filter(b => b.status === "ACTIVE").length;
          const inactiveCount = updated.filter(b => b.status === "INACTIVE").length;
          const totalProducts = updated.reduce((sum, b) => sum + (b._count?.products || 0), 0);

          setStats({ active: activeCount, inactive: inactiveCount, totalProducts });

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
      const result = await deleteProductBrand(id);
      if (result.success) {
        setBrands(prev => prev.filter(b => b.id !== id));
        setTotal(prev => prev - 1);

        // آپدیت stats
        const updated = brands.filter(b => b.id !== id);
        const activeCount = updated.filter(b => b.status === "ACTIVE").length;
        const inactiveCount = updated.filter(b => b.status === "INACTIVE").length;
        const totalProducts = updated.reduce((sum, b) => sum + (b._count?.products || 0), 0);
        setStats({ active: activeCount, inactive: inactiveCount, totalProducts });

        toast.success(result.message || "برند با موفقیت حذف شد");
      } else {
        toast.error(result.error || "خطا در حذف برند");
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در حذف برند");
    }
  };

  const handleRefresh = () => { fetchBrands(); toast.success("اطلاعات به‌روزرسانی شد"); };
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">مدیریت برندها</h1>
              <p className="text-gray-700 dark:text-gray-300 mb-4">مشاهده، ویرایش و حذف برندهای محصولات و آمار آن‌ها</p>
            </div>
          </div>
          

          <div className="flex flex-wrap gap-4 mt-6">
            <StatCard title="فعال" value={stats.active} color="green" icon={<FiTag />} />
            <StatCard title="غیرفعال" value={stats.inactive} color="red" icon={<FiTag />} />
            <StatCard title="کل محصولات" value={stats.totalProducts} color="orange" icon={<FiArchive />} />
          </div>
        </div>

        {/* DataTable */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <GenericDataTable
              data={brands}
              total={total}
              columns={brandColumns}
              loading={loading}
              page={page}
              limit={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              onStatusToggle={handleStatusToggle}
              onDelete={handleDelete}
              editPath={(id) => `/dashboard/content/product-brands/edit/${id}`}
              createPath="/dashboard/content/product-brands/create"
              backPath="/dashboard"
              title="لیست برندها"
              emptyMessage="هیچ برندی یافت نشد! برای شروع برند جدید ایجاد کنید."
              togglingIds={togglingIds}
              createButton="برند"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard title="ایجاد برند جدید" href="/dashboard/content/product-brands/create" icon={<FiPlusSquare />} color="blue" description="اضافه کردن برند جدید به فروشگاه" />
        </div>
      </div>
    </div>
  );
}

// ==================== StatCard Component ====================
interface StatCardProps {
  title: string;
  value: number;
  color: "green" | "red" | "orange";
  icon: JSX.Element;
}

function StatCard({ title, value, color, icon }: StatCardProps) {
  const colorMap: Record<typeof color, string> = {
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
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
  color: "blue" | "green" | "red" | "orange";
  icon: JSX.Element;
}

function QuickActionCard({ title, description, href, color, icon }: QuickActionCardProps) {
  const colorMap: Record<typeof color, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
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
