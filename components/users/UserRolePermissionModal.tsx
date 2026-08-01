'use client'

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { UserRole } from "@prisma/client";
import { SYSTEM_PERMISSIONS } from "@/lib/constants/permissions";
import { updateUserRoleAndPermissions } from "@/app/actions/userActions";
import { useNotification } from "@/context/NotificationContext";
import { MdClose, MdCheck, MdShield } from "react-icons/md";

interface Props {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export const UserRolePermissionModal: React.FC<Props> = ({
  user,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const { addNotification } = useNotification();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || "USER");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    user?.permissions ? user.permissions.split(",").filter(Boolean) : []
  );
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role || "USER");
      setSelectedPermissions(
        user.permissions ? user.permissions.split(",").filter(Boolean) : []
      );
    }
  }, [user]);

  // قفل اسکرول بدنه + مدیریت Esc و Focus Trap کلید Tab
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    setTimeout(() => {
      modalRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user || !mounted) return null;

  const handlePermissionToggle = (key: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleSelectAllGroup = (groupPermissions: { key: string }[]) => {
    const groupKeys = groupPermissions.map((p) => p.key);
    const allSelected = groupKeys.every((k) => selectedPermissions.includes(k));

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((k) => !groupKeys.includes(k)));
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...groupKeys])));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await updateUserRoleAndPermissions(
      user.id,
      selectedRole,
      selectedPermissions
    );
    setLoading(false);

    if (res.success) {
      addNotification({
        type: "success",
        title: "ارتقای سطح دسترسی",
        message: `نقش و دسترسی‌های کاربر ${user.firstName || user.name || user.email} با موفقیت به‌روزرسانی شد.`,
        duration: 3500,
      });
      if (onRefresh) onRefresh();
      onClose();
    } else {
      addNotification({
        type: "error",
        title: "خطا در ثبت",
        message: res.error || "مشکلی در ذخیره‌سازی رخ داد.",
        duration: 4000,
      });
    }
  };

  // رندر مستقیم در ریشه اصلی سند با پورتال
  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 dir-rtl select-none pointer-events-auto"
      style={{ zIndex: 99999999 }}
      tabIndex={-1}
    >
      {/* لایه پس‌زمینه تیره و شیشه‌ای (قفل کامل کلیک‌ها و ایزوله‌سازی پس‌زمینه) */}
      <div 
        className="fixed inset-0 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        style={{ zIndex: 99999998 }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* بدنه اصلی مودال با افکت‌های ۳بعدی و برجسته‌سازی سنگین */}
      <div
        ref={modalRef}
        tabIndex={-1}
        style={{ zIndex: 99999999 }}
        className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl 
          shadow-[0_25px_70px_rgba(0,0,0,0.5),0_0_40px_rgba(245,158,11,0.15)] 
          border border-slate-200/80 dark:border-slate-700/60 
          ring-1 ring-slate-900/5 dark:ring-white/10 
          overflow-hidden flex flex-col max-h-[88vh] 
          animate-in zoom-in-95 duration-200 focus:outline-none"
      >
        {/* نوار رنگی درخشان بالای مودال */}

        {/* هدر چسبان مودال (Sticky & Glassmorphic) */}
        <div className="sticky top-0 z-20 p-1 sm:p-2 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500/10 to-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0 border border-amber-500/20 shadow-inner">
              <MdShield className="w-6 h-6" />
            </div>
            <div className="flex flex-col text-right">
              <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                مدیریت نقش و دسترسی‌های سیستم
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                کاربر: <span className="font-bold text-amber-600 dark:text-amber-400">{user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.name || user.email}</span>
                {user.email && <span className="text-[11px] text-slate-400 mr-1.5 dir-ltr inline-block">({user.email})</span>}
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:rotate-90"
            title="بستن (Esc)"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        {/* بدنه اسکرول‌پذیر محتوا */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-right">
          
          {/* بخش انتخاب نقش کاربری */}
          <div className="bg-slate-100/70 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-inner">
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-3">
              نقش کاربری (Role)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { key: "USER", label: "کاربر عادی" },
                { key: "WRITER", label: "نویسنده" },
                { key: "SUPPORT", label: "پشتیبان" },
                { key: "ADMIN", label: "ادمین" },
                { key: "SUPER_ADMIN", label: "مدیر ارشد" },
              ].map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setSelectedRole(r.key as UserRole)}
                  className={`p-2.5 sm:p-3 text-xs font-extrabold rounded-xl border transition-all duration-200 text-center ${
                    selectedRole === r.key
                      ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/30 scale-[1.03] -translate-y-0.5"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800 hover:border-amber-500/40 hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* لیست سطوح دسترسی گرانولار */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-3">
              سطوح دسترسی مستقیم (Granular Permissions)
            </label>

            <div className="space-y-4">
              {SYSTEM_PERMISSIONS.map((group, idx) => {
                const groupKeys = group.permissions.map((p) => p.key);
                const allSelected = groupKeys.every((k) => selectedPermissions.includes(k));

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                        {group.groupName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelectAllGroup(group.permissions)}
                        className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {allSelected ? "حذف همه" : "انتخاب همه این بخش"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {group.permissions.map((p) => {
                        const isChecked = selectedPermissions.includes(p.key);
                        return (
                          <button
                            type="button"
                            key={p.key}
                            onClick={() => handlePermissionToggle(p.key)}
                            className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all duration-200 ${
                              isChecked
                                ? "bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 text-indigo-950 dark:text-indigo-200 shadow-md shadow-indigo-500/10 -translate-y-0.5"
                                : "bg-slate-50/60 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm"
                            }`}
                          >
                            <span className="text-right font-bold">{p.label}</span>
                            <div
                              className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-200 ${
                                isChecked
                                  ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                                  : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                              }`}
                            >
                              {isChecked && <MdCheck className="w-3.5 h-3.5 stroke-[1]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* فوتر چسبان دکمه‌های عملیات (Sticky) */}
        <div className="sticky bottom-0 z-20 p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-start gap-3 shadow-lg">
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white rounded-xl text-xs font-black transition-all duration-200 shadow-lg shadow-amber-500/25 active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>ذخیره تغییرات دسترسی</span>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            انصراف
          </button>
          
        </div>

      </div>
    </div>,
    document.body
  );
};