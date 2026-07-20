"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { useTheme } from "@/context/ThemeContext"; // ایمپورت هوک تم
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiGrid, 
  FiCalendar, 
  FiUser, 
  FiList, 
  FiCheckSquare, 
  FiFileText, 
  FiPieChart, 
  FiBox, 
  FiLock, 
  FiChevronDown,
  FiMoreHorizontal
} from "react-icons/fi";

type Accent = "indigo" | "emerald" | "rose" | "amber";

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

const navItems: NavItem[] = [
  { 
    icon: <FiGrid className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />, 
    name: "محتوا", 
    subItems: [
      { name: "بنرها", path: "/dashboard/content/banners" },
      { name: "دسته‌بندی‌ها", path: "/dashboard/content/categories" },
      { name: "برندها", path: "/dashboard/content/product-brands" },
      { name: "محصولات", path: "/dashboard/content/products" }
    ] 
  },
  { 
    icon: <FiCalendar className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />, 
    name: "تقویم کاری", 
    path: "/calendar" 
  },
  { 
    icon: <FiUser className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />, 
    name: "پروفایل من", 
    path: "/profile" 
  },
  { 
    name: "فرم‌ها", 
    icon: <FiList className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />, 
    subItems: [{ name: "فیلدهای ورودی", path: "/form-elements" }] 
  },
  { 
    name: "جدول‌ها", 
    icon: <FiCheckSquare className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />, 
    subItems: [{ name: "جدول ساده", path: "/basic-tables" }] 
  },
  { 
    name: "صفحات جانبی", 
    icon: <FiFileText className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />, 
    subItems: [
      { name: "صفحه خالی", path: "/blank" }, 
      { name: "خطای 404", path: "/error-404" }
    ] 
  },
];

const othersItems: NavItem[] = [
  { 
    icon: <FiPieChart className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />, 
    name: "نمودارها", 
    subItems: [
      { name: "نمودار خطی", path: "/line-chart" }, 
      { name: "نمودار میله‌ای", path: "/bar-chart" }
    ] 
  },
  { 
    icon: <FiBox className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />, 
    name: "رابط کاربری", 
    subItems: [
      { name: "هشدارها", path: "/alerts" }, 
      { name: "آواتارها", path: "/avatars" }, 
      { name: "دکمه‌ها", path: "/buttons" }
    ] 
  },
  { 
    icon: <FiLock className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />, 
    name: "احراز هویت", 
    subItems: [
      { name: "ورود", path: "/signin" }, 
      { name: "ثبت‌نام", path: "/signup" }
    ] 
  },
];

// ساختار نگاشت رنگ سایدبار برای پوشش چهار رنگ فعال انتخابگر
const sidebarAccentStyles: Record<Accent, {
  activeMenu: string;
  hoverMenu: string;
  iconActive: string;
  chevronActive: string;
  activeSubmenu: string;
  hoverSubmenu: string;
  dotActive: string;
  dotHover: string;
  logoGradient: string;
}> = {
  indigo: {
    activeMenu: "bg-indigo-500/10 dark:bg-indigo-500/[0.04] text-indigo-600 dark:!text-indigo-400 border-r-2 border-indigo-500 dark:border-indigo-400 font-extrabold shadow-sm dark:shadow-none",
    hoverMenu: "text-slate-600 dark:!text-slate-300 hover:text-indigo-600 dark:hover:!text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20",
    iconActive: "text-indigo-500",
    chevronActive: "text-indigo-500",
    activeSubmenu: "text-indigo-600 dark:!text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/30 border-r border-indigo-500 dark:border-indigo-400",
    hoverSubmenu: "text-slate-500 dark:!text-slate-300 hover:text-indigo-600 dark:hover:!text-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20",
    dotActive: "bg-indigo-500 dark:bg-indigo-400 scale-125 shadow-[0_0_8px_rgba(99,102,241,0.4)] dark:shadow-[0_0_12px_rgba(129,140,248,0.5)]",
    dotHover: "bg-slate-300 dark:bg-slate-700 group-hover/sub:bg-indigo-500 dark:group-hover/sub:bg-indigo-400 group-hover/sub:scale-125",
    logoGradient: "from-indigo-500 to-violet-400 dark:from-indigo-400 dark:to-violet-300"
  },
  emerald: {
    activeMenu: "bg-emerald-500/10 dark:bg-emerald-500/[0.04] text-emerald-600 dark:!text-emerald-450 border-r-2 border-emerald-500 dark:border-emerald-400 font-extrabold shadow-sm dark:shadow-none",
    hoverMenu: "text-slate-600 dark:!text-slate-300 hover:text-emerald-600 dark:hover:!text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20",
    iconActive: "text-emerald-500",
    chevronActive: "text-emerald-500",
    activeSubmenu: "text-emerald-600 dark:!text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/30 border-r border-emerald-500 dark:border-emerald-400",
    hoverSubmenu: "text-slate-500 dark:!text-slate-300 hover:text-emerald-600 dark:hover:!text-emerald-400 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20",
    dotActive: "bg-emerald-500 dark:bg-emerald-400 scale-125 shadow-[0_0_8px_rgba(16,185,129,0.4)] dark:shadow-[0_0_12px_rgba(52,211,153,0.5)]",
    dotHover: "bg-slate-300 dark:bg-slate-700 group-hover/sub:bg-emerald-500 dark:group-hover/sub:bg-emerald-400 group-hover/sub:scale-125",
    logoGradient: "from-emerald-500 to-teal-400 dark:from-emerald-400 dark:to-teal-300"
  },
  rose: {
    activeMenu: "bg-rose-500/10 dark:bg-rose-500/[0.04] text-rose-600 dark:!text-rose-400 border-r-2 border-rose-500 dark:border-rose-400 font-extrabold shadow-sm dark:shadow-none",
    hoverMenu: "text-slate-600 dark:!text-slate-300 hover:text-rose-600 dark:hover:!text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20",
    iconActive: "text-rose-500",
    chevronActive: "text-rose-500",
    activeSubmenu: "text-rose-600 dark:!text-rose-400 bg-rose-50/80 dark:bg-rose-950/30 border-r border-rose-500 dark:border-rose-400",
    hoverSubmenu: "text-slate-500 dark:!text-slate-300 hover:text-rose-600 dark:hover:!text-rose-400 hover:bg-rose-50/30 dark:hover:bg-rose-950/20",
    dotActive: "bg-rose-500 dark:bg-rose-400 scale-125 shadow-[0_0_8px_rgba(244,63,94,0.4)] dark:shadow-[0_0_12px_rgba(251,113,133,0.5)]",
    dotHover: "bg-slate-300 dark:bg-slate-700 group-hover/sub:bg-rose-500 dark:group-hover/sub:bg-rose-400 group-hover/sub:scale-125",
    logoGradient: "from-rose-500 to-pink-400 dark:from-rose-400 dark:to-pink-300"
  },
  amber: {
    activeMenu: "bg-amber-500/10 dark:bg-amber-500/[0.04] text-amber-600 dark:!text-amber-400 border-r-2 border-amber-500 dark:border-amber-400 font-extrabold shadow-sm dark:shadow-none",
    hoverMenu: "text-slate-600 dark:!text-slate-300 hover:text-amber-600 dark:hover:!text-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/20",
    iconActive: "text-amber-500",
    chevronActive: "text-amber-500",
    activeSubmenu: "text-amber-600 dark:!text-amber-400 bg-amber-50/80 dark:bg-amber-950/30 border-r border-amber-500 dark:border-amber-400",
    hoverSubmenu: "text-slate-500 dark:!text-slate-300 hover:text-amber-600 dark:hover:!text-amber-400 hover:bg-amber-50/30 dark:hover:bg-amber-950/20",
    dotActive: "bg-amber-500 dark:bg-amber-400 scale-125 shadow-[0_0_8px_rgba(245,158,11,0.4)] dark:shadow-[0_0_12px_rgba(251,191,36,0.5)]",
    dotHover: "bg-slate-300 dark:bg-slate-700 group-hover/sub:bg-amber-500 dark:group-hover/sub:bg-amber-400 group-hover/sub:scale-125",
    logoGradient: "from-amber-500 to-orange-400 dark:from-amber-400 dark:to-orange-300"
  }
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { accent } = useTheme(); // دریافت تم فعال
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<OpenSubmenu | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const isAnySubItemActive = useCallback((subItems?: SubItem[]) => {
    if (!subItems) return false;
    return subItems.some(item => item.path === pathname);
  }, [pathname]);

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

  // دریافت استایل‌های هماهنگ با تم فعال
  const styles = sidebarAccentStyles[accent as Accent] || sidebarAccentStyles.indigo;

  const renderMenuItems = (itemsList: NavItem[], menuType: string = "main") => (
    <ul className="flex flex-col gap-2">
      {itemsList.map((nav, index) => {
        const hasSubmenu = !!nav.subItems;
        const isOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
        const activeMenu = hasSubmenu ? isAnySubItemActive(nav.subItems) : (nav.path ? isActive(nav.path) : false);

        return (
          <li
            key={nav.name}
            onMouseEnter={() => hasSubmenu && handleMouseEnterSubmenu(index, menuType)}
            onMouseLeave={() => hasSubmenu && handleMouseLeaveSubmenu(index, menuType)}
            className="relative"
          >
            {hasSubmenu ? (
              <div
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`
                  group flex items-center cursor-pointer transition-all duration-300 rounded-xl p-3 pr-3.5
                  ${isOpen || activeMenu ? styles.activeMenu : styles.hoverMenu}
                  ${!isExpanded && !isMobile ? "lg:justify-center" : "lg:justify-start"}
                `}
              >
                <span className={`transition-all duration-300 ${isOpen || activeMenu ? styles.iconActive : ""}`}>
                  {nav.icon}
                </span>

                <AnimatePresence>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <motion.span
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2 }}
                      className="font-extrabold text-xs pr-3 leading-6 whitespace-nowrap"
                    >
                      {nav.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <FiChevronDown 
                    className={`mr-auto w-3.5 h-3.5 transition-all duration-350 opacity-70 group-hover:opacity-100
                      ${isOpen ? `rotate-180 ${styles.chevronActive} opacity-100` : ""}`} 
                  />
                )}
              </div>
            ) : (
              nav.path && (
                <Link 
                  href={nav.path} 
                  className={`
                    group flex items-center transition-all duration-300 rounded-xl p-3 pr-3.5
                    ${activeMenu ? styles.activeMenu : styles.hoverMenu}
                  `}
                >
                  <span className="transition-all duration-300">
                    {nav.icon}
                  </span>
                  
                  <AnimatePresence>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <motion.span
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.2 }}
                        className="font-extrabold text-xs pr-3 leading-6 whitespace-nowrap"
                      >
                        {nav.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )
            )}

            {/* بخش زیرمنوها */}
            <AnimatePresence initial={false}>
              {hasSubmenu && isOpen && (isExpanded || isHovered || isMobileOpen) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <ul className="mt-1 space-y-1 mr-9 relative py-1">
                    {/* خط مینی‌مال اتصال عمودی زیرمنو */}
                    <div className="absolute right-[-10px] top-0 bottom-2 w-[1px] bg-slate-200/60 dark:bg-white/[0.06]" />
                    
                    {nav.subItems!.map((subItem) => {
                      const isSubActive = isActive(subItem.path);
                      
                      return (
                        <li key={subItem.name}>
                          <Link 
                            href={subItem.path} 
                            className={`
                              group/sub flex items-center justify-between rounded-lg p-2 pr-3.5 text-xs font-bold 
                              transition-all duration-300 relative overflow-hidden
                              ${isSubActive ? styles.activeSubmenu : styles.hoverSubmenu}
                            `}
                          >
                            <div className="flex items-center gap-2 transition-transform duration-300 group-hover/sub:-translate-x-1">
                              <span className={`
                                w-1.5 h-1.5 rounded-full transition-all duration-300 shrink-0
                                ${isSubActive ? styles.dotActive : styles.dotHover}
                              `} />
                              <span className="whitespace-nowrap">{subItem.name}</span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`
        fixed top-0 right-0 h-screen z-50 bg-white/80 dark:bg-[#0c0d14]/85 border-l backdrop-blur-3xl
        border-slate-200/50 dark:border-white/[0.04] transition-all duration-300 ease-in-out flex flex-col px-4
        ${isMobile 
          ? (isMobileOpen ? "translate-x-0 w-[210px]" : "translate-x-full w-[210px]")
          : isExpanded || isHovered ? "w-[210px]" : "w-[90px]"
        }
      `}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* هدر سایدبار با گرادیان داینامیک */}
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start pr-2"}`}>
        <Link href="/dashboard">
          <span className={`
            font-black text-sm whitespace-nowrap bg-clip-text text-transparent
            bg-gradient-to-r ${styles.logoGradient}
          `}>
            {isExpanded || isHovered || isMobileOpen ? "داشبورد مدیریت" : "آمازون"}
          </span>
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar pb-6">
        <nav className="mb-6">
          <div className="flex flex-col gap-6">
            
            {/* منو اول */}
            <div>
              <h2 className={`mb-4 text-[10px] uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500 flex
                ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start pr-3"}`}>
                <AnimatePresence mode="wait">
                  {isExpanded || isHovered || isMobileOpen ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      منو کاربری
                    </motion.span>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-slate-400 dark:text-slate-500 opacity-60"
                    >
                      <FiMoreHorizontal className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            {/* منو دوم */}
            <div>
              <h2 className={`mb-4 text-[10px] uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500 flex
                ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start pr-3"}`}>
                <AnimatePresence mode="wait">
                  {isExpanded || isHovered || isMobileOpen ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      سایر بخش‌ها
                    </motion.span>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-slate-400 dark:text-slate-500 opacity-60"
                    >
                      <FiMoreHorizontal className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
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