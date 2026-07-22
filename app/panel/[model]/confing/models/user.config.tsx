// @/components/ui/CRUDPage/confing/models/user.config.tsx

import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom"; 
import { CRUDField } from "@/components/ui/CRUDPage/types";
import { updateItem } from "@/app/actions/crud/crudActions"; 
import { useNotification } from "@/context/NotificationContext"; 

const SYSTEM_ROLES = [
  { value: "ADMIN", label: "مدیر کل", color: "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50" },
  { value: "SUPPORT", label: "پشتیبان سیستم", color: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50" },
  { value: "WRITER", label: "نویسنده", color: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50" },
  { value: "USER", label: "کاربر عادی", color: "bg-slate-50 text-slate-600 border-slate-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-750" },
];

const SYSTEM_PERMISSIONS = [
  { key: "manage_products", label: "مدیریت و ثبت محصولات" },
  { key: "manage_orders", label: "پردازش و مدیریت سفارشات" },
  { key: "manage_posts", label: "مدیریت پست‌ها و نظرات کاربران" },
  { key: "view_financial", label: "مشاهده گزارش‌های مالی و تراکنش‌ها" },
];

// 👈 کامپوننت هوشمند رندر عکس پروفایل با قابلیت مدیریت خطای بارگذاری
const UserTableAvatar = ({ item }: { item: any }) => {
  const [hasError, setHasError] = useState(false);
  const initials = item.name ? item.name.substring(0, 2) : "کا";

  // اگر کاربر عکس داشت و با خطا مواجه نشده بود، عکس او رندر می‌شود
  if (item.image && !hasError) {
    return (
      <img
        src={item.image}
        alt={item.name || "User Avatar"}
        className="w-8 h-8 rounded-full object-cover border border-slate-200/60 dark:border-zinc-700/80"
        onError={() => setHasError(true)} // سوئیچ به حالت متنی در صورت فیلتر بودن یا خرابی لینک
      />
    );
  }

  // نمایش حالت متنی پیش‌فرض
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
      {initials}
    </div>
  );
};

const UserRoleManagerCell = ({ item, onRefresh }: { item: any; onRefresh?: () => void }) => {
  const { addNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false); 
  
  const [selectedRole, setSelectedRole] = useState(item.role || "USER");
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true); 
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (item?.permissions) {
      setPermissions(item.permissions.split(",").filter(Boolean));
    } else {
      setPermissions([]);
    }
    if (item?.role) {
      setSelectedRole(item.role);
    }
  }, [item]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleTogglePermission = (permKey: string) => {
    setPermissions((prev) =>
      prev.includes(permKey) ? prev.filter((p) => p !== permKey) : [...prev, permKey]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const formattedPermissions = permissions.filter(Boolean).join(",");

      const res = await updateItem("user", item.id, {
        role: selectedRole,
        permissions: formattedPermissions,
      });

      if (res.success) {
        addNotification({
          type: "success",
          title: "بروزرسانی موفقیت‌آمیز",
          message: `نقش و سطح دسترسی کاربر با موفقیت تغییر یافت.`,
          duration: 3500,
        });
        
        if (onRefresh) {
          onRefresh();
        }
        setIsOpen(false);
      } else {
        throw new Error(res.error || "خطایی رخ داد");
      }
    } catch (error: any) {
      addNotification({
        type: "error",
        title: "خطا در بروزرسانی",
        message: error.message || "بروز خطا در برقراری ارتباط با پایگاه‌داده.",
        duration: 4500,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  return (
    <>
      <button
        onClick={handleOpen}
        className="relative group overflow-hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 dark:bg-zinc-800 dark:hover:bg-indigo-600 text-indigo-600 hover:text-white dark:text-indigo-400 dark:hover:text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-sm active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
        <span>نقش و دسترسی</span>
      </button>

      {isAnimating && mounted && createPortal(
        <div
          className={`fixed inset-0 z-[999] flex items-center justify-center p-4 transition-opacity duration-300 text-right ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          dir="rtl"
        >
          <div 
            onClick={handleClose} 
            className="fixed inset-0 bg-transparent pointer-events-auto" 
          />

          <div
            className={`relative bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 dark:border-zinc-800 flex flex-col max-h-[85vh] transition-all duration-300 overflow-hidden transform ${
              isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
            }`}
          >
            {/* هدر مودال */}
            <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-sm">
                  تنظیم سطح دسترسی کاربر
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* محتوای تنظیمات */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* اطلاعات کاربر مورد نظر */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-900/40 rounded-xl border border-slate-100 dark:border-zinc-800/80">
                <UserTableAvatar item={item} /> {/* 👈 نمایش عکس یا آوتار در داخل مودال */}
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-zinc-200 text-sm">{item.name || "کاربر سیستم"}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500">{item.email || "بدون ایمیل"}</p>
                </div>
              </div>

              {/* بخش انتخاب نقش کلیدی */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-3">
                  انتخاب نقش اصلی کاربر:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SYSTEM_ROLES.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                        selectedRole === role.value
                          ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 ring-2 ring-indigo-500/10"
                          : "border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      <span>{role.label}</span>
                      <span className={`w-2 h-2 rounded-full ${selectedRole === role.value ? "bg-indigo-600" : "bg-transparent border border-slate-300 dark:border-zinc-600"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full border-t border-dashed border-slate-200 dark:border-zinc-800" />

              {/* بخش مدیریت دسترسی‌های جزیی */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-3">
                  دسترسی‌های جزئی و انتخابی (Permissions):
                </label>
                <div className="space-y-2.5">
                  {SYSTEM_PERMISSIONS.map((perm) => {
                    const isChecked = permissions.includes(perm.key);
                    return (
                      <div
                        key={perm.key}
                        onClick={() => handleTogglePermission(perm.key)}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-zinc-800/60 bg-slate-50/30 dark:bg-zinc-900/20 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors"
                      >
                        <span className="text-xs text-slate-700 dark:text-zinc-300 font-medium">
                          {perm.label}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            isChecked
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "border-slate-300 dark:border-zinc-700"
                          }`}
                        >
                          {isChecked && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* دکمه‌های تایید فرم */}
            <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex items-center gap-2 justify-start">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>ذخیره تغییرات دسترسی</span>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-300 text-gray-800 hover:text-gray-100 transition-colors hover:bg-gray-500"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>,
        document.body 
      )}
    </>
  );
};

export const userConfig = {
  modelKey: "user" as const,
  modelName: "کاربران",
  enableStatusToggle: true,
  disableCreate: true,
  disableEdit: true,
  hiddenOnMobile: ["email", "status", "createdAt"],
  validationSchema: Yup.object().shape({
    status: Yup.string().required("انتخاب وضعیت الزامی است"),
  }),
  filterTranslations: {
    keys: { search: "جستجو کاربر", status: "وضعیت حساب", role: "نقش کاربری" },
    values: { ACTIVE: "فعال", INACTIVE: "غیرفعال", ADMIN: "مدیر کل", SUPPORT: "پشتیبان", WRITER: "نویسنده", USER: "کاربر عادی" },
  },
  getFields: (): CRUDField[] => [
    {
      name: "name",
      label: "کاربر",
      cellRenderer: (item: any) => (
        <div className="flex items-center gap-2.5">
          {/* 👈 استفاده از کامپوننت آواتار هوشمند که عکس کاربر را به صورت زنده نمایش می‌دهد */}
          <UserTableAvatar item={item} />
          <div>
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
              {item.name || "کاربر ناشناس"}
            </span>
            <span className="text-[9px] text-slate-400 dark:text-zinc-500 block">
              {item.email || "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "role",
      label: "نقش فعلی",
      cellRenderer: (item: any) => {
        const role = item.role || "USER";
        const matched = SYSTEM_ROLES.find((r) => r.value === role) || SYSTEM_ROLES[3];
        return (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${matched.color}`}>
            {matched.label}
          </span>
        );
      },
    },
    { name: "status", label: "وضعیت" },
    {
      name: "roleAction",
      label: "مدیریت نقش و دسترسی",
      cellRenderer: (item: any, onRefresh?: any) => <UserRoleManagerCell item={item} onRefresh={onRefresh} />,
    },
  ],
  formFields: [],
  filterFields: [
    { key: "search", type: "search", placeholder: "جستجوی نام یا ایمیل کاربر..." },
    {
      key: "role",
      type: "select",
      placeholder: "فیلتر بر اساس نقش",
      options: [
        { value: "ADMIN", label: "مدیر کل" },
        { value: "SUPPORT", label: "پشتیبان سیستم" },
        { value: "WRITER", label: "نویسنده" },
        { value: "USER", label: "کاربر عادی" },
      ],
    },
    {
      key: "status",
      type: "select",
      placeholder: "وضعیت حساب",
      options: [
        { value: "ACTIVE", label: "فعال" },
        { value: "INACTIVE", label: "غیرفعال (مسدود)" },
      ],
    },
  ],
};