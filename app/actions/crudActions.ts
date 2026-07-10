// app/actions/crudActions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { toPersianNumber  } from "@/lib/utils/persianNumbers";
import { generateSlug } from "@/lib/slug/generateSlug"; 
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export type CRUDItemInput = Record<string, any>;

// ==========================================
// نقشه مدل‌ها (Model Map)
// ==========================================
const modelMap = {
  banner: prisma.banner,
  brand: prisma.productBrand,
  category: prisma.category,
  product: prisma.product,
};

type ModelKey = keyof typeof modelMap;

// ==========================================
// ریخته‌گری انوم‌ها (Enum Fields)
// ==========================================
const enumFields: Record<ModelKey, Record<string, any>> = {
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

// ==========================================
// نقشه فیلدهای جستجو
// ==========================================
const searchFields: Record<ModelKey, string> = {
  banner: "title",
  brand: "name",
  category: "name",
  product: "title",
};

// ==========================================
// تابع کمکی برای دریافت داینامیک ارتباطات متناسب با وضعیت حذف‌شدگی رکورد پایه
// ==========================================
function getRelationIncludes(model: ModelKey, isDeleted: boolean) {
  const filter = isDeleted ? { not: null } : null;

  if (model === "product") {
    return {
      images: {
        where: { softDeletedAt: filter },
      },
      attributes: {
        where: { softDeletedAt: filter },
      },
      variants: {
        where: { softDeletedAt: filter },
        orderBy: { price: "asc" },
        include: {
          warranties: {
            where: { softDeletedAt: filter },
          },
        },
      },
    };
  }

  if (model === "brand" || model === "category") {
    return {
      _count: {
        select: {
          products: {
            where: { softDeletedAt: filter },
          },
        },
      },
    };
  }

  return undefined;
}

// ====================
// Helper: cast value
// ====================
function castValue(model: ModelKey, field: string, value: any) {
  const enums = enumFields[model]?.[field];
  if (!enums) return value;
  if (Object.values(enums).includes(value)) {
    return value;
  }
  throw new Error(`Invalid enum value "${value}" for ${model}.${field}`);
}

// ====================
// Helper: save file to server
// ====================
async function handleFileUpload(file: File | Blob): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const ext = file instanceof File ? path.extname(file.name) : ".bin";
  const fileName = `${uuidv4()}${ext}`;
  const filePath = path.join(uploadsDir, fileName);

  let buffer: Buffer;
  if (file instanceof File || file instanceof Blob) {
    buffer = Buffer.from(await file.arrayBuffer());
  } else {
    throw new Error("Invalid file type");
  }

  await fs.promises.writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

// ============================================================
// Helper: sanitize data
// ============================================================
async function sanitizeData(model: ModelKey, data: CRUDItemInput) {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;

    if ((typeof File !== "undefined" && value instanceof File) || value instanceof Blob) {
      sanitized[key] = await handleFileUpload(value);
      continue;
    }

    if (Buffer && Buffer.isBuffer(value)) {
      sanitized[key] = value;
      continue;
    }

    // مقادیر آرایه‌ای تودرتو را برای کنترل دستی روابط در متد ایجاد و ویرایش نادیده می‌گیریم
    if (Array.isArray(value) || (typeof value === "object" && value !== null && !(value instanceof Date))) {
      sanitized[key] = value;
      continue;
    }

    if (key === "id" || key.endsWith("Id")) {
      if (value === "" || value === "null" || value === null || value === undefined) {
        sanitized[key] = null;
      } else {
        sanitized[key] = Number(value);
      }
      continue;
    }

    sanitized[key] = castValue(model, key, value);
  }

  return sanitized;
}

// ====================
// Helper: تبدیل و پاکسازی مطمئن ارقام فارسی و علامت‌های کاما به عدد استاندارد در سرور
// ====================
function cleanAndParseNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  
  let str = String(value);
  const farsiDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /٨/g, /٩/g];
  const arabicDigits = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  
  for (let i = 0; i < 10; i++) {
    str = str.replace(farsiDigits[i], String(i)).replace(arabicDigits[i], String(i));
  }
  
  str = str.replace(/[^\d.]/g, "");
  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
}

// ====================
// Helper: تبدیل خودکار مقادیر Decimal به عدد معمولی
// ====================
function serializeDecimal(data: any): any {
  if (data === null || data === undefined) return data;

  if (Array.isArray(data)) {
    return data.map(serializeDecimal);
  }

  if (typeof data === "object") {
    const isDecimalInstance = 
      Prisma.Decimal.isDecimal(data) || 
      (typeof data.toNumber === "function" && typeof data.toFixed === "function");

    if (isDecimalInstance) {
      return Number(data.toNumber());
    }

    if (Array.isArray(data.d) && typeof data.e === "number" && typeof data.s === "number") {
      try {
        return Number(new Prisma.Decimal(data).toNumber());
      } catch {
        return 0;
      }
    }

    if (data instanceof Date) {
      return data;
    }

    const serialized: Record<string, any> = {};
    for (const key of Object.keys(data)) {
      serialized[key] = serializeDecimal(data[key]);
    }
    return serialized;
  }

  return data;
}

// ============================================================
// GET ITEMS
// ============================================================
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
    const isDeletedQuery = !!filters?.deleted; // بررسی کوئری سطل زباله

    if (isDeletedQuery) {
      where.softDeletedAt = { not: null };
    } else {
      where.softDeletedAt = null;
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === null || key === "deleted") return;
        
        if (key === "search") {
          const searchField = searchFields[model] || "title" || "slug" || "name";
          where[searchField] = { contains: value };
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

    // اعمال فیلتر داینامیک ارتباطات متناسب با وضعیت حذف‌شدگی داده‌ی اصلی
    const includes = getRelationIncludes(model, isDeletedQuery);
    if (includes) {
      queryOptions.include = includes;
    }

    let data = await db.findMany(queryOptions);

    if (model === "product") {
      data = data.map((item: any) => {
        const variants = item.variants || [];
        const prices = variants.map((v: any) => Number(v.price) || 0).filter((p: number) => p > 0);
        
        // محاسبه حد بالا و حد پایین قیمت‌ها جهت ارائه محدوده به بخش کلاینت
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
        
        // محاسبه مجموع موجودی تمام واریانت‌های این محصول
        const totalStock = variants.reduce((sum: number, variant: any) => sum + (Number(variant.stock) || 0), 0);
        
        // استخراج آدرس اولین تصویر (ترجیحاً اصلی) جهت رندر در گالری سطر جدول کلاینت
        const mainImage = item.images?.find((img: any) => img.isMain)?.url || item.images?.[0]?.url || "";

        return {
          ...item,
          minPrice,
          maxPrice,
          price: minPrice, // نگهداری فیلد پایه جهت عدم آسیب به سایر بخش‌ها
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

// ==========================================
// GET BRANDS
// ==========================================
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

// ==========================================
// GET CATEGORIES
// ==========================================
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

// ==========================================
// GET PRODUCT STATS (آمارهای پیشرفته کالاها)
// ==========================================
export async function getProductStats() {
  try {
    // ۱. کل محصولات حذف‌نشده
    const totalProducts = await prisma.product.count({
      where: { softDeletedAt: null },
    });

    // ۲. دریافت اطلاعات واریانت‌ها جهت تخمین موجودی
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
    let lowStockCount = 0; // موجودی مجموع بین ۱ و ۳ عدد

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

// ==========================================
// CREATE ITEM
// ==========================================
export async function createItem(model: ModelKey, data: CRUDItemInput) {
  try {
    const db = modelMap[model];
    if (!db) throw new Error(`Model "${model}" not found`);

    const sanitizedData = await sanitizeData(model, data);

    if (model === "product") {
      // تفکیک اطلاعات ساختاریافته فرعی
      const rawVariants = sanitizedData.variants || [];
      const rawAttributes = sanitizedData.attributes || [];
      const rawImages = sanitizedData.images || [];

      // حذف فیلدهای غیراصلی محصول از دیتای پایه ورودی پریزما
      delete sanitizedData.variants;
      delete sanitizedData.attributes;
      delete sanitizedData.images;
      delete sanitizedData.price;
      delete sanitizedData.stock;

      // بررسی نال بودن فیلد و تولید خودکار بر اساس کد اختصاصی شما در سرور
      if (!sanitizedData.slug) {
        sanitizedData.slug = generateSlug(sanitizedData.title);
      }

      // ۱. ثبت محصول پایه
      const product = await prisma.product.create({
        data: {
          ...sanitizedData,
          softDeletedAt: null,
        },
      });

      // ۲. ثبت تنوع‌ها و گارانتی‌های متناظر با فیلد توضیحات
      for (const v of rawVariants) {
        const price = cleanAndParseNumber(v.price);
        const stock = cleanAndParseNumber(v.stock);

        const variant = await prisma.productVariant.create({
          data: {
            productId: product.id,
            color: v.color || null,
            price,
            stock,
            status: "ACTIVE",
          },
        });

        if (v.warranty && v.warranty.title) {
          await prisma.productWarranty.create({
            data: {
              variantId: variant.id,
              title: v.warranty.title,
              periodMonths: cleanAndParseNumber(v.warranty.periodMonths) || 12,
              description: v.warranty.description || null,
              status: "ACTIVE",
            },
          });
        }
      }

      // ۳. ثبت ویژگی‌های فنی کالا
      for (const attr of rawAttributes) {
        if (attr.key && attr.value) {
          await prisma.productAttribute.create({
            data: {
              productId: product.id,
              key: attr.key,
              value: attr.value,
              status: "ACTIVE",
            },
          });
        }
      }

      // ۴. آپلود فایل‌ها و ثبت گالری تصاویر
      for (const img of rawImages) {
        let finalUrl = img.url || "";
        if (img.file) {
          finalUrl = await handleFileUpload(img.file);
        }
        if (finalUrl) {
          await prisma.productImage.create({
            data: {
              productId: product.id,
              url: finalUrl,
              isMain: !!img.isMain,
              status: "ACTIVE",
            },
          });
        }
      }

      const fullProduct = await prisma.product.findUnique({
        where: { id: product.id },
        include: relationIncludes.product,
      });

      return { success: true, data: serializeDecimal(fullProduct) };
    }

    const item = await db.create({
      data: {
        ...sanitizedData,
        softDeletedAt: null,
      },
    });

    return { success: true, data: serializeDecimal(item) };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message };
  }
}

// ============================================================
// UPDATE ITEM (اصلاح شده جهت جلوگیری از تخریب فیزیکی داده‌ها در بروزرسانی جزئی)
// ============================================================
export async function updateItem(model: ModelKey, id: number, data: CRUDItemInput) {
  try {
    const db = modelMap[model];
    if (!db) throw new Error(`Model "${model}" not found`);

    const sanitizedData = await sanitizeData(model, data);

    if (model === "product") {
      // بررسی صریح اینکه آیا فیلدهای وابسته ارسال شده‌اند یا خیر
      const hasVariants = data.variants !== undefined;
      const hasAttributes = data.attributes !== undefined;
      const hasImages = data.images !== undefined;

      const rawVariants = sanitizedData.variants || [];
      const rawAttributes = sanitizedData.attributes || [];
      const rawImages = sanitizedData.images || [];

      delete sanitizedData.variants;
      delete sanitizedData.attributes;
      delete sanitizedData.images;
      delete sanitizedData.price;
      delete sanitizedData.stock;

      // به‌روزرسانی اطلاعات هسته محصول
      const updated = await db.updateMany({
        where: { id, softDeletedAt: null },
        data: sanitizedData,
      });

      if (updated.count === 0) {
        return { success: false, error: "Record not found or deleted" };
      }

      // ۱. به‌روزرسانی تراکنشی تنوع‌ها و گارانتی‌ها (فقط در صورت ارسال صریح در پلود)
      if (hasVariants) {
        const oldVariants = await prisma.productVariant.findMany({
          where: { productId: id },
          select: { id: true },
        });
        const oldVariantIds = oldVariants.map(v => v.id);

        await prisma.productWarranty.deleteMany({ where: { variantId: { in: oldVariantIds } } });
        await prisma.productVariant.deleteMany({ where: { productId: id } });

        for (const v of rawVariants) {
          const price = cleanAndParseNumber(v.price);
          const stock = cleanAndParseNumber(v.stock);

          const variant = await prisma.productVariant.create({
            data: {
              productId: id,
              color: v.color || null,
              price,
              stock,
              status: "ACTIVE",
            },
          });

          if (v.warranty && v.warranty.title) {
            await prisma.productWarranty.create({
              data: {
                variantId: variant.id,
                title: v.warranty.title,
                periodMonths: cleanAndParseNumber(v.warranty.periodMonths) || 12,
                description: v.warranty.description || null,
                status: "ACTIVE",
              },
            });
          }
        }
      }

      // ۲. به‌روزرسانی ویژگی‌های فنی کالا (فقط در صورت ارسال صریح در پلود)
      if (hasAttributes) {
        await prisma.productAttribute.deleteMany({ where: { productId: id } });
        for (const attr of rawAttributes) {
          if (attr.key && attr.value) {
            await prisma.productAttribute.create({
              data: {
                productId: id,
                key: attr.key,
                value: attr.value,
                status: "ACTIVE",
              },
            });
          }
        }
      }

      // ۳. به‌روزرسانی تصاویر گالری محصول (فقط در صورت ارسال صریح در پلود)
      if (hasImages) {
        await prisma.productImage.deleteMany({ where: { productId: id } });
        for (const img of rawImages) {
          let finalUrl = img.url || "";
          if (img.file) {
            finalUrl = await handleFileUpload(img.file);
          }
          if (finalUrl) {
            await prisma.productImage.create({
              data: {
                productId: id,
                url: finalUrl,
                isMain: !!img.isMain,
                status: "ACTIVE",
              },
            });
          }
        }
      }

      return { success: true };
    }

    const updated = await db.updateMany({
      where: { id, softDeletedAt: null },
      data: sanitizedData,
    });

    if (updated.count === 0) {
      return { success: false, error: "Record not found or deleted" };
    }

    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// DELETE (Soft / Hard)
// ==========================================
export async function deleteItem(model: ModelKey, id: number, permanent: boolean = false) {
  try {
    const db = modelMap[model];
    if (!db) throw new Error(`Model "${model}" not found`);

    const itemId = Number(id);

    if (permanent) {
      await db.delete({
        where: { id: itemId },
      });
      return { success: true };
    }

    const deletedAt = new Date();

    if (model === "product") {
      // استفاده از تراکنش برای تضمین یکپارچگی حذف نرم
      await prisma.$transaction(async (tx) => {
        // ۱. حذف نرم محصول پایه
        await tx.product.update({
          where: { id: itemId },
          data: {
            softDeletedAt: deletedAt,
            status: "INACTIVE",
          },
        });

        // ۲. حذف نرم ویژگی‌های فنی
        await tx.productAttribute.updateMany({
          where: { productId: itemId },
          data: {
            softDeletedAt: deletedAt,
            status: "INACTIVE",
          },
        });

        // ۳. حذف نرم تصاویر گالری
        await tx.productImage.updateMany({
          where: { productId: itemId },
          data: {
            softDeletedAt: deletedAt,
            status: "INACTIVE",
          },
        });

        // ۴. استخراج شناسه‌های تنوع‌ها برای تغییر گارانتی‌ها
        const variants = await tx.productVariant.findMany({
          where: { productId: itemId },
          select: { id: true },
        });
        const variantIds = variants.map((v) => v.id);

        // ۵. حذف نرم گارانتی‌های مرتبط
        if (variantIds.length > 0) {
          await tx.productWarranty.updateMany({
            where: { variantId: { in: variantIds } },
            data: {
              softDeletedAt: deletedAt,
              status: "INACTIVE",
            },
          });
        }

        // ۶. حذف نرم تنوع‌ها
        await tx.productVariant.updateMany({
          where: { productId: itemId },
          data: {
            softDeletedAt: deletedAt,
            status: "INACTIVE",
          },
        });
      });
    } else {
      // حذف نرم استاندارد برای سایر مدل‌ها
      await db.update({
        where: { id: itemId },
        data: {
          softDeletedAt: deletedAt,
          status: "INACTIVE",
        },
      });
    }

    return { success: true };
  } catch (err: any) {
    console.error("deleteItem error:", err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// RESTORE (بازیابی ایمن به لایه دیتابیس بومی SQLite با دور زدن ۱۰۰٪ میدل‌ور حذف موقت)
// ==========================================
export async function restoreItem(model: ModelKey, id: number) {
  try {
    const itemId = Number(id);

    if (model === "product") {
      // اجرای مستقیم دستورات SQL خام بر روی کلاینت اصلی پروژه جهت عبور بی قید و شرط از میدل‌ور حذف موقت
      await prisma.$transaction(async (tx) => {
        // ۱. بازیابی محصول پایه
        await tx.$executeRaw`
          UPDATE Product 
          SET softDeletedAt = NULL, status = 'INACTIVE' 
          WHERE id = ${itemId}
        `;

        // ۲. بازیابی ویژگی‌های فنی کالا
        await tx.$executeRaw`
          UPDATE ProductAttribute 
          SET softDeletedAt = NULL, status = 'INACTIVE' 
          WHERE productId = ${itemId}
        `;

        // ۳. بازیابی تصاویر گالری محصول
        await tx.$executeRaw`
          UPDATE ProductImage 
          SET softDeletedAt = NULL, status = 'INACTIVE' 
          WHERE productId = ${itemId}
        `;

        // ۴. بازیابی مستقیم گارانتی‌ها با استفاده از ساب‌کوئری SQLite بومی
        await tx.$executeRaw`
          UPDATE ProductWarranty 
          SET softDeletedAt = NULL, status = 'INACTIVE' 
          WHERE variantId IN (
            SELECT id FROM ProductVariant WHERE productId = ${itemId}
          )
        `;

        // ۵. بازیابی لیست تنوع‌های کالا
        await tx.$executeRaw`
          UPDATE ProductVariant 
          SET softDeletedAt = NULL, status = 'INACTIVE' 
          WHERE productId = ${itemId}
        `;
      });
    } else {
      // بازیابی استاندارد برای سایر مدل‌ها با استفاده از کوئری خام
      const tableNameMap: Record<ModelKey, string> = {
        banner: "Banner",
        brand: "ProductBrand",
        category: "Category",
        product: "Product"
      };

      const tableName = tableNameMap[model];
      if (tableName) {
        await prisma.$executeRawUnsafe(
          `UPDATE ${tableName} SET softDeletedAt = NULL, status = 'INACTIVE' WHERE id = ${itemId}`
        );
      } else {
        // متد استاندارد پشتیبان
        const db = modelMap[model];
        if (!db) throw new Error(`Model "${model}" not found`);

        await db.updateMany({
          where: { id: itemId, softDeletedAt: { not: null } },
          data: {
            softDeletedAt: null,
            ...(enumFields[model]?.status && {
              status: "INACTIVE",
            }),
          },
        });
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("restoreItem error:", err);
    return { success: false, error: err.message };
  }
}