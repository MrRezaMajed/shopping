// @/components/ui/CRUDPage/confing/models/user.config.tsx

import * as Yup from "yup";
import React, { useState } from "react";
import { CRUDField } from "@/components/ui/CRUDPage/types";
import { UserRolePermissionModal } from "@/components/users/UserRolePermissionModal";
import { updateItem } from "@/app/actions/crud/crudActions";
import { useNotification } from "@/context/NotificationContext";
import StatusToggle from "@/components/ui/DataTable/StatusToggle"; // 👈 استفاده از همان کامپوننت StatusToggle پروژه
import { MdSecurity } from "react-icons/md";

// ۱. کامپوننت دکمه مدیریت دسترسی و نقش کاربر
const ActionRoleCell = ({ item, onRefresh }: { item: any; onRefresh?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 dark:text-indigo-400 dark:hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
        title="تعیین نقش و سطوح دسترسی"
      >
        <MdSecurity className="w-4 h-4" />
        <span>نقش و دسترسی</span>
      </button>

      <UserRolePermissionModal
        user={item}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onRefresh={onRefresh}
      />
    </>
  );
};

// ۲. کامپوننت فعال‌سازی با استفاده مستقیم از همان StatusToggle سیستم (دقیقاً هم‌شکل و هم‌رنگ)
const ActivationToggleCell = ({ item, onRefresh }: { item: any; onRefresh?: () => void }) => {
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  // بررسی فعال بودن (ACTIVE یا 1 یا true)
  const isActivated = item.activation === "ACTIVE" || item.activation === true || item.activation === 1;

  const handleToggle = async () => {
    setLoading(true);
    const newStatus = isActivated ? "INACTIVE" : "ACTIVE";

    // به‌روزرسانی در دیتابیس
    const res = await updateItem("user", item.id, { activation: newStatus });
    setLoading(false);

    if (res.success) {
      addNotification({
        type: "success",
        title: "به‌روزرسانی موفق",
        message: "وضعیت فعال‌سازی کاربر با موفقیت تغییر یافت.",
        duration: 3000,
      });
      if (onRefresh) onRefresh();
    } else {
      addNotification({
        type: "error",
        title: "خطا در تغییر وضعیت",
        message: res.error || "مشکلی در تغییر وضعیت رخ داد.",
        duration: 3500,
      });
    }
  };

  return (
    <StatusToggle
      checked={isActivated}
      onChange={handleToggle}
      loading={loading}
      size="sm"
    />
  );
};

// ۳. کانفیگ اصلی CRUD برای کاربران ادمین
export const userConfig = {
  modelKey: "user" as const,
  modelName: "کاربران ادمین",
  enableStatusToggle: true,
  hiddenOnMobile: ["mobile", "createdAt"],

  validationSchema: Yup.object().shape({
    firstName: Yup.string().required("نام الزامی است"),
    lastName: Yup.string().required("نام خانوادگی الزامی است"),
    email: Yup.string().email("ایمیل معتبر نیست").nullable(),
    mobile: Yup.string().required("شماره موبایل الزامی است"),
    password: Yup.string().when("$mode", {
      is: "create",
      then: (schema) => schema.required("کلمه عبور الزامی است").min(6, "حداقل ۶ کاراکتر"),
      otherwise: (schema) => schema.nullable(),
    }),
    status: Yup.string().required("انتخاب وضعیت الزامی است"),
    activation: Yup.string().required("انتخاب وضعیت فعال‌سازی الزامی است"),
  }),

  getFields: (): CRUDField[] => [
    {
      name: "name",
      label: "نام و نام خانوادگی",
      cellRenderer: (item: any) => (
        <div className="flex items-center gap-2.5 text-right">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center shrink-0">
            {item.firstName?.[0] || item.name?.[0] || "U"}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {item.firstName && item.lastName ? `${item.firstName} ${item.lastName}` : item.name || "بدون نام"}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{item.email || "بدون ایمیل"}</span>
          </div>
        </div>
      ),
    },
    { name: "mobile", label: "شماره موبایل" },
    {
      name: "role",
      label: "نقش کاربر",
      cellRenderer: (item: any) => {
        const roleMap: Record<string, { label: string; color: string }> = {
          SUPER_ADMIN: { label: "مدیر ارشد", color: "bg-purple-50 text-purple-600 border-purple-200" },
          ADMIN: { label: "ادمین", color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
          SUPPORT: { label: "پشتیبان", color: "bg-blue-50 text-blue-600 border-blue-200" },
          WRITER: { label: "نویسنده", color: "bg-amber-50 text-amber-600 border-amber-200" },
          USER: { label: "کاربر عادی", color: "bg-slate-50 text-slate-600 border-slate-200" },
        };
        const current = roleMap[item.role] || { label: item.role, color: "bg-slate-50 text-slate-600" };
        return (
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${current.color}`}>
            {current.label}
          </span>
        );
      },
    },
    {
      name: "activation",
      label: "فعال‌سازی",
      cellRenderer: (item: any, onRefresh?: () => void) => (
        <ActivationToggleCell item={item} onRefresh={onRefresh} />
      ),
    },
    { name: "status", label: "وضعیت حساب" },
    {
      name: "action_permissions",
      label: "تنظیمات دسترسی",
      cellRenderer: (item: any, onRefresh?: () => void) => (
        <ActionRoleCell item={item} onRefresh={onRefresh} />
      ),
    },
  ],

  formFields: [
    { name: "firstName", label: "نام", type: "text" },
    { name: "lastName", label: "نام خانوادگی", type: "text" },
    { name: "email", label: "آدرس ایمیل", type: "text" },
    { name: "mobile", label: "شماره موبایل", type: "text" },
    { name: "password", label: "کلمه عبور", type: "text" },
    {
      name: "activation",
      label: "وضعیت فعال‌سازی",
      type: "select",
      options: [
        { value: "ACTIVE", label: "فعال" },
        { value: "INACTIVE", label: "غیرفعال" },
      ],
    },
    {
      name: "status",
      label: "وضعیت حساب کاربری",
      type: "select",
      options: [
        { value: "ACTIVE", label: "فعال" },
        { value: "INACTIVE", label: "غیرفعال" },
      ],
    },
  ],

  filterFields: [
    { key: "search", type: "search", placeholder: "جستجو در نام، ایمیل یا موبایل..." },
    {
      key: "role",
      type: "select",
      placeholder: "همه نقش‌ها",
      options: [
        { value: "SUPER_ADMIN", label: "مدیر ارشد" },
        { value: "ADMIN", label: "ادمین" },
        { value: "SUPPORT", label: "پشتیبان" },
        { value: "WRITER", label: "نویسنده" },
        { value: "USER", label: "کاربر عادی" },
      ],
    },
  ],
};