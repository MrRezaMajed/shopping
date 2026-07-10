"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import StatusToggle from "@/components/ui/DataTable/StatusToggle";
import CRUDList from "@/components/CRUDList";

import { useDataTable } from "@/hooks/useDataTable";
import { getBanners, updateBanner, deleteBanner } from "@/app/actions/banner/banner.actions";
import GenericFilterBar from "@/components/GenericFilterBar";

// وارد کردن سیستم نوتیفیکیشن اختصاصی
import { useNotification } from "@/context/NotificationContext";


interface Banner {
  id: number;
  title: string;
  url: string;
  image: string;
  position: "TOP" | "RIGHT" | "DOWN";
  status: "ACTIVE" | "INACTIVE";
}

export default function BannerListPage() {
  const router = useRouter();
  
  // فراخوانی توابع سیستم نوتیفیکیشن و تاییدیه دو مرحله‌ای
  const { confirm, addNotification } = useNotification();

  const {
    data,
    total,
    page,
    limit,
    loading,
    setPage,
    setLimit,
    filters,
    setFilters,
    refetch,
  } = useDataTable<Banner, { search?: string; status?: string; position?: string }>(
    getBanners,
    { search: "", status: undefined, position: undefined },
    5
  );

  // ✅ حذف دو مرحله‌ای با تاییدیه اختصاصی
  const handleDelete = async (item: Banner) => {
    // مرحله اول: نمایش پنجره تایید مطمئن هستید؟
    const isConfirmed = await confirm({
      title: "آیا از حذف این بنر مطمئن هستید؟",
      message: `بنر "${item.title}" به طور کامل از دیتابیس حذف خواهد شد و امکان بازیابی آن وجود ندارد.`,
      confirmText: "بله، حذف شود",
      cancelText: "خیر، انصراف",
      type: "error", // تم هشداری قرمز رنگ
    });

    // مرحله دوم: در صورت تایید کاربر، بنر حذف می‌شود
    if (isConfirmed) {
      const res = await deleteBanner(item.id);

      if (res.success) {
        addNotification({
          type: "success",
          title: "حذف موفقیت‌آمیز",
          message: `بنر "${item.title}" با موفقیت حذف گردید.`,
          duration: 4000,
        });
        await refetch(); // صفحه مجدد پر می‌شود
      } else {
        addNotification({
          type: "error",
          title: "خطا در حذف",
          message: res.error || "خطا در حذف بنر",
          duration: 4500,
        });
      }
    } else {
      // پیام انصراف از حذف (اختیاری)
      addNotification({
        type: "info",
        title: "لغو حذف",
        message: "درخواست حذف بنر لغو شد.",
        duration: 3000,
      });
    }
  };

  // ✅ تغییر وضعیت با استفاده از نوتیفیکیشن اختصاصی
  const handleToggleStatus = async (item: Banner) => {
    const newStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      const res = await updateBanner(item.id, {
        title: item.title,
        url: item.url,
        position: item.position,
        status: newStatus,
      });

      if (res.success) {
        addNotification({
          type: "success",
          title: "بروزرسانی موفق",
          message: `وضعیت بنر با موفقیت به ${newStatus === "ACTIVE" ? "فعال" : "غیرفعال"} تغییر یافت.`,
          duration: 4000,
        });
        await refetch(); // ⭐ مهم
      } else {
        addNotification({
          type: "error",
          title: "خطا در بروزرسانی",
          message: res.error || "خطا در بروزرسانی وضعیت",
          duration: 4000,
        });
      }
    } catch {
      addNotification({
        type: "error",
        title: "خطای سیستم",
        message: "خطایی هنگام بروزرسانی وضعیت در ارتباط با سرور رخ داد.",
        duration: 4000,
      });
    }
  };

  const columns = [
    {
      key: "image",
      label: "تصویر",
      render: (item: Banner) =>
        item.image && (
          <div className="w-24 h-14 relative rounded-lg overflow-hidden shadow-sm border dark:border-gray-700">
            <Image src={item.image} alt={item.title} fill className="object-cover" />
          </div>
        ),
    },
    { key: "title", label: "عنوان" },
    { key: "url", label: "URL" },
    { key: "position", label: "موقعیت" },
    {
      key: "status",
      label: "وضعیت",
      render: (item: Banner) => (
        <StatusToggle
          checked={item.status === "ACTIVE"}
          onChange={() => handleToggleStatus(item)}
          size="sm"
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-8 dark:text-gray-100">
        <h1 className="text-2xl font-bold">لیست بنرها</h1>
        <button
          onClick={() => router.push("/dashboard/banner/create")}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition-colors"
        >
          ایجاد بنر جدید
        </button>
      </div>

      <GenericFilterBar
        fields={[
          { type: "search", key: "search", placeholder: "جستجو..." },
          {
            type: "select",
            key: "position",
            placeholder: "همه موقعیت‌ها",
            options: [
              { label: "بالا", value: "TOP" },
              { label: "راست", value: "RIGHT" },
              { label: "پایین", value: "DOWN" },
            ],
          },
          {
            type: "select",
            key: "status",
            placeholder: "همه وضعیت‌ها",
            options: [
              { label: "فعال", value: "ACTIVE" },
              { label: "غیرفعال", value: "INACTIVE" },
            ],
          },
        ]}
        filters={filters}
        onChange={setFilters}
      />

      <CRUDList
        columns={columns}
        data={data}
        total={total}
        page={page}
        limit={limit}
        loading={loading}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        onEdit={(item) => router.push(`/dashboard/banner/edit/${item.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}