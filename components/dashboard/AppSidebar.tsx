"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "@/icons/index";

interface SubItem {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
}

interface NavItem {
  icon: React.ReactNode;
  name: string;
  path?: string;
  subItems?: SubItem[];
}

interface OpenSubmenu {
  type: string;
  index: number;
}

interface SubMenuHeight {
  [key: string]: number;
}

const navItems: NavItem[] = [
  { 
    icon: <Image src={GridIcon} alt="" width={20} height={20} className="dark:invert" />, 
    name: "محتوا", 
    subItems: [
      { name: "بنرها", path: "/dashboard/content/banners" },
      { name: "دسته‌بندی‌ها", path: "/dashboard/content/categories" },
      { name: "برندها", path: "/dashboard/content/product-brands" },
      { name: "محصولات", path: "/dashboard/content/products" }
    ] 
  },
  { 
    icon: <Image src={CalenderIcon} alt="" width={20} height={20} className="dark:invert" />, 
    name: "تقویم کاری", 
    path: "/calendar" 
  },
  { 
    icon: <Image src={UserCircleIcon} alt="" width={20} height={20} className="dark:invert" />, 
    name: "پروفایل من", 
    path: "/profile" 
  },
  { 
    name: "فرم‌ها", 
    icon: <Image src={ListIcon} alt="" width={20} height={20} className="dark:invert" />, 
    subItems: [{ name: "فیلدهای ورودی", path: "/form-elements" }] 
  },
  { 
    name: "جدول‌ها", 
    icon: <Image src={TableIcon} alt="" width={20} height={20} className="dark:invert" />, 
    subItems: [{ name: "جدول ساده", path: "/basic-tables" }] 
  },
  { 
    name: "صفحات جانبی", 
    icon: <Image src={PageIcon} alt="" width={20} height={20} className="dark:invert" />, 
    subItems: [
      { name: "صفحه خالی", path: "/blank" }, 
      { name: "خطای 404", path: "/error-404" }
    ] 
  },
];

const othersItems: NavItem[] = [
  { 
    icon: <Image src={PieChartIcon} alt="" width={20} height={20} className="dark:invert" />, 
    name: "نمودارها", 
    subItems: [
      { name: "نمودار خطی", path: "/line-chart" }, 
      { name: "نمودار میله‌ای", path: "/bar-chart" }
    ] 
  },
  { 
    icon: <Image src={BoxCubeIcon} alt="" width={20} height={20} className="dark:invert" />, 
    name: "رابط کاربری", 
    subItems: [
      { name: "هشدارها", path: "/alerts" }, 
      { name: "آواتارها", path: "/avatars" }, 
      { name: "دکمه‌ها", path: "/buttons" }
    ] 
  },
  { 
    icon: <Image src={PlugInIcon} alt="" width={20} height={20} className="dark:invert" />, 
    name: "احراز هویت", 
    subItems: [
      { name: "ورود", path: "/signin" }, 
      { name: "ثبت‌نام", path: "/signup" }
    ] 
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<OpenSubmenu | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<SubMenuHeight>({});
  const subMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmenuToggle = (index: number, menuType: string) => {
    if (isMobile) {
      setOpenSubmenu((prev) => 
        prev?.type === menuType && prev?.index === index ? null : { type: menuType, index }
      );
    }
  };

  const handleMouseEnterSubmenu = (index: number, menuType: string) => {
    if (!isMobile) setOpenSubmenu({ type: menuType, index });
  };

  const handleMouseLeaveSubmenu = (index: number, menuType: string) => {
    if (!isMobile) {
      setOpenSubmenu((prev) => 
        prev?.type === menuType && prev?.index === index ? null : prev
      );
    }
  };

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({ 
          ...prev, 
          [key]: subMenuRefs.current[key]?.scrollHeight || 0 
        }));
      }
    }
  }, [openSubmenu]);

  const renderMenuItems = (navItems: NavItem[], menuType: string = "main") => (
    <ul className="flex flex-col gap-5">
      {navItems.map((nav, index) => {
        const hasSubmenu = !!nav.subItems;
        const isOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;

        return (
          <li
            key={nav.name}
            onMouseEnter={() => hasSubmenu && handleMouseEnterSubmenu(index, menuType)}
            onMouseLeave={() => hasSubmenu && handleMouseLeaveSubmenu(index, menuType)}
          >
            {hasSubmenu ? (
              <div
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group flex cursor-pointer transition-all rounded-xl p-3 ${isOpen ? "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#121420]/50"}
                  ${!isExpanded && !isMobile ? "lg:justify-center" : "lg:justify-start"}`}
              >
                <span className={isOpen ? "text-indigo-500" : ""}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text font-bold text-xs pr-3 leading-6">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <Image 
                    src={ChevronDownIcon} 
                    alt="" 
                    className={`mr-auto w-4 h-4 transition-transform duration-200 dark:invert
                      ${isOpen ? "rotate-180" : ""}`} 
                    width={16}
                    height={16}
                  />
                )}
              </div>
            ) : (
              nav.path && (
                <Link 
                  href={nav.path} 
                  className={`menu-item group flex transition-all rounded-xl p-3 ${isActive(nav.path) ? "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#121420]/50"}`}
                >
                  <span>
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text font-bold text-xs pr-3 leading-6">{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {hasSubmenu && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isOpen ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 mr-9">
                  {nav.subItems!.map((subItem) => (
                    <li key={subItem.name}>
                      <Link 
                        href={subItem.path} 
                        className={`menu-dropdown-item flex items-center justify-between rounded-lg p-2 text-xs font-semibold ${isActive(subItem.path) ? "text-indigo-600 dark:text-indigo-400"
                          : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 right-0 h-screen z-50 bg-white/95 dark:bg-[#0c0d14]/95 border-l backdrop-blur-3xl
        border-slate-200/60 dark:border-[#1f2235]/40 transition-all duration-300 ease-in-out flex flex-col px-5
        ${isMobile ? (isMobileOpen ? "translate-x-0 w-52.5" : "translate-x-full w-52.5")
        : isExpanded || isHovered ? "w-52.5" : "w-[90px]"}`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/dashboard">
          <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm whitespace-nowrap">
            {isExpanded || isHovered || isMobileOpen ? "داشبورد مدیریت" : "آمازون"}
          </span>
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-slate-400 dark:text-slate-600
                ${!isExpanded ? "lg:justify-center" : "justify-start"}`}>
                {isExpanded || isHovered || isMobileOpen ? "منو کاربری" : (
                  <Image 
                    src={HorizontaLDots} 
                    alt="" 
                    className="dark:invert" 
                    width={20}
                    height={20}
                  />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-slate-400 dark:text-slate-600
                ${!isExpanded ? "lg:justify-center" : "justify-start"}`}>
                {isExpanded || isHovered || isMobileOpen ? "سایر بخش‌ها" : (
                  <Image 
                    src={HorizontaLDots} 
                    alt="" 
                    className="dark:invert" 
                    width={20}
                    height={20}
                  />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;