"use client";

import { useState, useEffect, useCallback } from "react";
import { GenericDataTable } from "@/components/ui/DataTable/GenericDataTable";
import { toast } from "sonner";
import Link from "next/link";
import { FiImage } from "react-icons/fi";
import { toPersianNumber } from "@/lib/utils/persianNumbers";
import { getBanners, toggleBannerStatus, deleteBanner } from "@/app/actions/banner/bannerCreate.actions";

// ==================== Types ====================
interface Banner {
  id: number;
  title: string;
  url: string;
  image: string;
  status: "ACTIVE" | "INACTIVE";
  position: "TOP" | "RIGHT" | "DOWN";
  createdAt: string;
}

// ==================== Columns ====================

// نقشه موقعیت‌ها و رنگ‌ها
const positionMap: Record<Banner["position"], { label: string; color: string }> = {
  TOP: { label: "بالا", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  RIGHT: { label: "راست", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  DOWN: { label: "پایین", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
};

// نقشه وضعیت‌ها و رنگ‌ها
const statusMap: Record<Banner["status"], { label: string; color: string }> = {
  ACTIVE: { label: "فعال", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  INACTIVE: { label: "غیرفعال", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
};

const bannerColumns = [
  {
    id: "title",
    header: "عنوان",
    accessor: "title",
    width: "200px",
  },
  {
    id: "url",
    header: "لینک",
    accessor: "url",
    width: "250px",
  },
  {
    id: "image",
    header: "تصویر",
    accessor: "image",
    width: "100px",
    cell: (row: Banner) => (
      <div className="flex items-center justify-center">
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <img
            src={row.image}
            alt={row.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
            }}
          />
        </div>
      </div>
    ),
  },
  {
    id: "position",
    header: "موقعیت",
    accessor: "position",
    width: "120px",
    cell: (row: Banner) => {
      const pos = positionMap[row.position];
      return (
        <span className={`px-2 py-1 rounded text-sm font-semibold ${pos.color}`}>
          {pos.label}
        </span>
      );
    },
  },
  {
    id: "status",
    header: "وضعیت",
    accessor: "status",
    width: "120px",
    cell: (row: Banner) => {
      const stat = statusMap[row.status];
      return (
        <span className={`px-2 py-1 rounded text-sm font-semibold ${stat.color}`}>
          {stat.label}
        </span>
      );
    },
  },
  {
    id: "createdAt",
    header: "تاریخ ایجاد",
    accessor: "createdAt",
    cell: (row: Banner) => new Date(row.createdAt).toLocaleDateString("fa-IR"),
    width: "140px",
  },
];

// ==================== Page ====================
export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [togglingIds, setTogglingIds] = useState<number[]>([]);
  const [stats, setStats] = useState({ active: 0, inactive: 0 });

  // ==================== Fetch Banners ====================
  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getBanners(page, limit);
      if (res.data) {
        setBanners(res.data);
        setTotal(res.total || 0);

        // محاسبه stats
        const activeCount = res.data.filter(b => b.status === "ACTIVE").length;
        const inactiveCount = res.data.filter(b => b.status === "INACTIVE").length;
        setStats({ active: activeCount, inactive: inactiveCount });
      } else {
        toast.error(res.error || "خطا در دریافت بنرها");
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در دریافت بنرها");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  // ==================== Actions ====================
  const handleStatusToggle = async (id: number) => {
    try {
      setTogglingIds(prev => [...prev, id]);
      const result = await toggleBannerStatus(id);
      if (result.success && result.data) {
        setBanners(prev => {
          const updated = prev.map(b => b.id === id ? { ...b, status: result.data.status } : b);

          // آپدیت stats همزمان
          const activeCount = updated.filter(b => b.status === "ACTIVE").length;
          const inactiveCount = updated.filter(b => b.status === "INACTIVE").length;
          setStats({ active: activeCount, inactive: inactiveCount });

          return updated;
        });

        toast.success("وضعیت بنر تغییر کرد");
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
      const result = await deleteBanner(id);
      if (result.success) {
        setBanners(prev => prev.filter(b => b.id !== id));
        setTotal(prev => prev - 1);

        // آپدیت stats بعد از حذف
        setStats(prev => {
          const updated = banners.filter(b => b.id !== id);
          return {
            active: updated.filter(b => b.status === "ACTIVE").length,
            inactive: updated.filter(b => b.status === "INACTIVE").length,
          };
        });

        if (banners.length === 1 && page > 1) setPage(page - 1);
        toast.success(result.message || "بنر با موفقیت حذف شد");
      } else {
        toast.error(result.error || "خطا در حذف بنر");
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در حذف بنر");
    }
  };

  const handleRefresh = () => { fetchBanners(); toast.success("اطلاعات به‌روزرسانی شد"); };
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">مدیریت بنرها</h1>
              <p className="text-gray-700 dark:text-gray-300 mt-1">مشاهده، ویرایش و حذف بنرها</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            {/* Active Banners */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <FiImage className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-400">بنرهای فعال</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-200">{toPersianNumber(stats.active.toString())}</p>
                </div>
              </div>
            </div>

            {/* Inactive Banners */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                  <FiImage className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-400">بنرهای غیرفعال</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-200">{toPersianNumber(stats.inactive.toString())}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DataTable */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <GenericDataTable
              data={banners}
              total={total}
              columns={bannerColumns}
              loading={loading}
              page={page}
              limit={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              onStatusToggle={handleStatusToggle}
              onDelete={handleDelete}
              editPath={(id) => `/dashboard/content/banners/edit/${id}`}
              createPath="/dashboard/content/banners/create"
              title="لیست بنرها"
              emptyMessage="هیچ بنری یافت نشد! برای شروع یک بنر جدید ایجاد کنید."
              togglingIds={togglingIds}
              createButton="بنر"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/content/banners/create" className="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiImage className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-200">ایجاد بنر جدید</h3>
                <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">اضافه کردن بنر جدید به سایت</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
