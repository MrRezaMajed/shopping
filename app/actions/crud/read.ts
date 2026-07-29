// @/app/actions/crud/read.ts

"use server";
import { prisma } from "@/lib/prisma";
import { modelMap, ModelKey, searchFields } from "./types";
import { serializeDecimal, castValue, getRelationIncludes } from "./helpers"; // ایمپورت مستقیم از helpers

export async function getItems(
  model: ModelKey,
  page: number = 1,
  limit: number = 10,
  filters?: Record<string, any>,
  customSkip?: number,
) {
  try {
    const db = modelMap[model];
    if (!db) throw new Error(`Model "${model}" not found`);

    const where: any = {};
    const isDeletedQuery = !!filters?.deleted;

    if (isDeletedQuery) {
      where.softDeletedAt = { not: null };
    } else {
      where.softDeletedAt = null;
    }

    // 👈 فیلتر ردیف‌های فرعی نظرات وبلاگ؛ فقط پیام‌های اصلی بدون parentId لود می‌شوند
    if (model === "postComment") {
      where.parentId = null; 
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === null || key === "deleted") return;
        
        if (key === "search") {
          // پیاده‌سازی جستجوی متنی ترکیبی بر اساس نوع مدل
          if (model === "post") {
            where.OR = [
              { title: { contains: value } },
              { category: { name: { contains: value } } }
            ];
          } 
          // 👈 جستجوی ترکیبی هوشمند برای نظرات وبلاگ
          else if (model === "postComment") {
            where.OR = [
              { text: { contains: value } },
              { post: { title: { contains: value } } },
              { user: { name: { contains: value } } }
            ];
          } 
          // 👈 جستجوی ترکیبی پیشرفته برای سوالات متداول کالا (ProductFAQ)
          else if (model === "productFAQ") {
            where.OR = [
              { question: { contains: value } },
              { answer: { contains: value } },
              { product: { title: { contains: value } } }
            ];
          }
          else {
            const searchField = searchFields[model] || "title" || "slug" || "name";
            where[searchField] = { contains: value };
          }
        } 
        else if (key === "id" || key.endsWith("Id")) {
          where[key] = value === "null" ? null : Number(value);
        } 
        else {
          where[key] = castValue(model, key, value);
        }
      });
    }

    const total = await db.count({ where });

    const queryOptions: any = {
      where,
      skip: customSkip ?? (page - 1) * limit,
      take: limit,
      orderBy: { id: model === "category" ? "asc" : "desc" },
    };

    const includes = getRelationIncludes(model, isDeletedQuery);
    if (includes) {
      queryOptions.include = includes;
    }

    let data = await db.findMany(queryOptions);

    if (model === "product") {
      data = data.map((item: any) => {
        const variants = item.variants || [];
        const prices = variants.map((v: any) => Number(v.price) || 0).filter((p: number) => p > 0);
        
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
        const totalStock = variants.reduce((sum: number, variant: any) => sum + (Number(variant.stock) || 0), 0);
        const mainImage = item.images?.find((img: any) => img.isMain)?.url || item.images?.[0]?.url || "";

        return {
          ...item,
          minPrice,
          maxPrice,
          price: minPrice, 
          stock: totalStock,
          imageUrl: mainImage,
        };
      });
    }

    return { success: true, data: serializeDecimal(data), total };
  } catch (err: any) {
    console.error("getItems error:", err);
    return { success: false, error: err.message };
  }
}

export async function getBrands() {
  try {
    const brands = await prisma.productBrand.findMany({
      where: { softDeletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return brands;
  } catch (err: any) {
    console.error("getBrands error:", err);
    return [];
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { softDeletedAt: null },
      select: { id: true, name: true, parentId: true },
      orderBy: { name: "asc" },
    });
    return categories;
  } catch (err: any) {
    console.error("getCategories error:", err);
    return [];
  }
}

export async function getProductStats() {
  try {
    const totalProducts = await prisma.product.count({
      where: { softDeletedAt: null },
    });

    const products = await prisma.product.findMany({
      where: { softDeletedAt: null },
      select: {
        variants: {
          where: { softDeletedAt: null },
          select: { stock: true },
        },
      },
    });

    let outOfStockCount = 0;
    let lowStockCount = 0;

    products.forEach((p) => {
      const totalStock = p.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
      if (totalStock === 0) {
        outOfStockCount++;
      } else if (totalStock > 0 && totalStock < 4) {
        lowStockCount++;
      }
    });

    return {
      success: true,
      total: totalProducts,
      outOfStock: outOfStockCount,
      lowStock: lowStockCount,
    };
  } catch (err: any) {
    console.error("getProductStats error:", err);
    return { success: false, total: 0, outOfStock: 0, lowStock: 0 };
  }
}

export async function getPostCategories() {
  try {
    const categories = await prisma.postCategory.findMany({
      where: { softDeletedAt: null },
      select: { id: true, name: true, parentId: true },
      orderBy: { name: "asc" },
    });
    return categories;
  } catch (err: any) {
    console.error("getPostCategories error:", err);
    return [];
  }
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { softDeletedAt: null },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    });
    return products;
  } catch (err: any) {
    console.error("getProducts error:", err);
    return [];
  }
}