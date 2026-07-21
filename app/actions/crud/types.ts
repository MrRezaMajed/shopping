// @/app/actions/crud/types.ts

import { prisma } from "@/lib/prisma";
// 👈 ایمپورت مستقیم انوم‌های پریزما به عنوان اشیاء زمان اجرا (Runtime Objects)
import { Status, Position, UserRole } from "@prisma/client"; 

export type CRUDItemInput = Record<string, any>;

export const modelMap = {
  banner: prisma.banner,
  brand: prisma.productBrand,
  category: prisma.category,
  product: prisma.product,
  post: (prisma as any).post,
  user: (prisma as any).user,
};

export type ModelKey = keyof typeof modelMap;

export const enumFields: Record<ModelKey, Record<string, any>> = {
  banner: {
    status: Status,     // 👈 اصلاح شد
    position: Position, // 👈 اصلاح شد
  },
  brand: {
    status: Status,     // 👈 اصلاح شد
  },
  category: {
    status: Status,     // 👈 اصلاح شد
  },
  product: {
    status: Status,     // 👈 اصلاح شد
  },
  post: {
    status: Status,     // 👈 اصلاح شد
  },
  user: {
    status: Status,     // 👈 اصلاح شد
    role: UserRole,     // 👈 استفاده مستقیم از انوم معتبر UserRole
  },
};

export const searchFields: Record<ModelKey, string> = {
  banner: "title",
  brand: "name",
  category: "name",
  product: "title",
  post: "title",
  user: "name",
};