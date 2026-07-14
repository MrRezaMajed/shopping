"use client";
import AppHeader from "@/components/dashboard/AppHeader";
import AppSidebar from "@/components/dashboard/AppSidebar";
import Backdrop from "@/components/dashboard/Backdrop";
import { useSidebar } from "@/context/SidebarContext";
import { FC, ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "mr-0"
    : isExpanded || isHovered
    ? "lg:mr-52.5"
    : "lg:mr-[90px]";

  return (
    <div  className="min-h-screen w-full flex flex-col xl:flex-row bg-gray-100 dark:bg-gray-950
      overflow-y-auto scrollbar-hidden">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin} flex flex-col`}>

        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <div className="p-4 md:p-6 w-full">{children}</div>

      </div>
    </div>
  );
};

export default AdminLayout;

