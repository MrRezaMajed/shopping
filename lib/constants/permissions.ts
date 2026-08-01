export interface PermissionItem {
  key: string;
  label: string;
}

export interface PermissionGroup {
  groupName: string;
  permissions: PermissionItem[];
}

export const SYSTEM_PERMISSIONS: PermissionGroup[] = [
  {
    groupName: "مدیریت کاربران و ادمین‌ها",
    permissions: [
      { key: "users:read", label: "مشاهده کاربران" },
      { key: "users:create", label: "ایجاد کاربر جدید" },
      { key: "users:edit", label: "ویرایش کاربران" },
      { key: "users:delete", label: "حذف کاربران" },
      { key: "users:roles", label: "تغییر نقش و دسترسی‌ها" },
    ],
  },
  {
    groupName: "مدیریت محصولات و انبار",
    permissions: [
      { key: "products:read", label: "مشاهده محصولات" },
      { key: "products:create", label: "ایجاد محصول جدید" },
      { key: "products:edit", label: "ویرایش محصولات" },
      { key: "products:delete", label: "حذف محصولات" },
    ],
  },
  {
    groupName: "مدیریت سفارشات و مالی",
    permissions: [
      { key: "orders:read", label: "مشاهده سفارشات" },
      { key: "orders:edit", label: "ویرایش و تغییر وضعیت سفارش" },
      { key: "payments:manage", label: "تایید پرداخت‌های کارت‌به‌کارت" },
    ],
  },
  {
    groupName: "وبلاگ و محتوا",
    permissions: [
      { key: "posts:read", label: "مشاهده مقالات" },
      { key: "posts:create", label: "ارسال مقاله جدید" },
      { key: "posts:edit", label: "ویرایش مقالات" },
      { key: "comments:manage", label: "تایید و پاسخ به دیدگاه‌ها" },
    ],
  },
];