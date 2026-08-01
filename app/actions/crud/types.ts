// @/app/actions/crud/types.ts

import { prisma } from "@/lib/prisma";
// ایمپورت مستقیم وضعیت کامنت از انوم‌های پریزما
import { Status, Position, UserRole, CommentStatus } from "@prisma/client"; 

export type CRUDItemInput = Record<string, any>;

export const modelMap = {
  banner: prisma.banner,
  brand: prisma.productBrand,
  category: prisma.category,
  product: prisma.product,
  post: (prisma as any).post,
  user: (prisma as any).user,
  postCategory: (prisma as any).postCategory,
  postComment: (prisma as any).postComment, 
  productFAQ: (prisma as any).productFAQ,
  page: (prisma as any).page,
};

export type ModelKey = keyof typeof modelMap;

export const enumFields: Record<ModelKey, Record<string, any>> = {
  banner: {
    status: Status,
    position: Position,
  },
  brand: {
    status: Status,
  },
  category: {
    status: Status,
  },
  product: {
    status: Status,
  },
  post: {
    status: Status,
  },
  user: {
    status: Status,
    role: UserRole,
  },
  postCategory: {
    status: Status,
  },
  postComment: { 
    status: CommentStatus, 
  },
  productFAQ: { 
    status: Status,
  },
  page: {
    status: Status
  },
};

export const searchFields: Record<ModelKey, string> = {
  banner: "title",
  brand: "name",
  category: "name",
  product: "title",
  post: "title",
  user: "name",
  postCategory: "name",
  postComment: "text",
  productFAQ: "question",
  page: "title",
};