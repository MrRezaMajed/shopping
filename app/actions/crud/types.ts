import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type CRUDItemInput = Record<string, any>;

export const modelMap = {
  banner: prisma.banner,
  brand: prisma.productBrand,
  category: prisma.category,
  product: prisma.product,
};

export type ModelKey = keyof typeof modelMap;

export const enumFields: Record<ModelKey, Record<string, any>> = {
  banner: {
    status: Prisma.Status,
    position: Prisma.Position,
  },
  brand: {
    status: Prisma.Status,
  },
  category: {
    status: Prisma.Status,
  },
  product: {
    status: Prisma.Status,
  },
};

export const searchFields: Record<ModelKey, string> = {
  banner: "title",
  brand: "name",
  category: "name",
  product: "title",
};