"use client";
import Link from "next/link";
import {
  FaListUl,
  FaMapMarkerAlt,
  FaHeart,
  FaUserEdit,
  FaSignOutAlt,
} from "react-icons/fa";

type SidebarItem = {
  href: string;
  label: string;
  icon: React.ReactNode; 
  danger?: boolean;
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    href: "/profile/orders",
    label: "سفارش‌های من",
    icon: <FaListUl />,
  },
  {
    href: "/profile/addresses",
    label: "آدرس‌های من",
    icon: <FaMapMarkerAlt />,
  },
  {
    href: "/profile/favorites",
    label: "لیست علاقه‌مندی",
    icon: <FaHeart />,
  },
  {
    href: "/profile/personal-info",
    label: "ویرایش حساب",
    icon: <FaUserEdit />,
  },
  {
    href: "/",
    label: "خروج از حساب",
    icon: <FaSignOutAlt />,
    danger: true,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-full lg:w-1/4">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow space-y-4">
        <nav className="space-y-3">
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarLink key={item.href} {...item} />
          ))}
        </nav>
      </div>
    </aside>
  );
}

type SidebarLinkProps = SidebarItem;

function SidebarLink({ href, label, icon, danger }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 p-3 rounded-lg transition-colors
        ${
          danger
            ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-200"
            : "hover:bg-gray-100 dark:hover:bg-gray-600"
        }`}
    >
      <span
        className={`text-lg ${
          danger
            ? "text-red-600"
            : "text-gray-600 dark:text-gray-100"
        }`}
      >
        {icon}
      </span>

      <span
        className={`text-sm ${
          danger ? "" : "hover:text-blue-700"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
