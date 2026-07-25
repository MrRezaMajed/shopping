// components/dashboard/providers.tsx
"use client";
import AppHeader from "@/components/dashboard/AppHeader";
import AppSidebar from "@/components/dashboard/AppSidebar";
import Backdrop from "@/components/dashboard/Backdrop";
import { useSidebar } from "@/context/SidebarContext";
import { FC, ReactNode } from "react";
import ScrollButton from "@/components/ui/ScrollButton";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // مارجین راست محتوا متناسب با وضعیت سایدبار
  const mainContentMargin = isMobileOpen
    ? "mr-0"
    : isExpanded || isHovered
    ? "lg:mr-52.5"
    : "lg:mr-[90px]";

  return (
    // کانتینر ریشه با جلوگیری از تداخل اسکرول افقی
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-950 relative flex flex-col overflow-x-hidden">
      {/* سایدبار قفل شده در کنار صفحه */}
      <AppSidebar />
      <Backdrop />

      {/* کانتینر محتوای اصلی */}
      <div className={`flex-grow transition-all duration-300 ease-in-out ${mainContentMargin} flex flex-col`}>

        {/* هدر بالایی داشبورد */}
        <AppHeader />

        {/* 
          تغییر جزیی: اضافه شدن ساختار فلکس تراز اول برای ممانعت از تداخل لایه‌های فرزند 
          جهت همگام‌سازی ابعاد دقیق لودینگ یا جداول
        */}
        <div className="p-4 md:p-6 w-full flex-grow flex flex-col">{children}</div>

      </div>

      {/* رندر کردن دکمه هوشمند پیمایش برای کل صفحات پنل مدیریت در سمت راست */}
      <ScrollButton />
    </div>
  );
};

export default AdminLayout;