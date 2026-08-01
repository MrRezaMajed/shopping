// @/app/actions/crud/write.ts

"use server";

import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug/generateSlug";
import { modelMap, ModelKey, CRUDItemInput } from "./types";
import { sanitizeData, cleanAndParseNumber, handleFileUpload, serializeDecimal } from "./helpers";
import { getRelationIncludes } from "./helpers";
import { logActivity } from "../audit/log";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// هماهنگ‌کننده نام‌های جمع مدل‌ها برای ساخت آدرس‌ها و بازنویسی کش
const pluralModelMap: Record<string, string> = {
  category: "categories",
  product: "products",
  brand: "brands",
  banner: "banners",
  post: "posts",
  user: "users",
  postCategory: "post-categories",
  postComment: "post-comments",
  productFAQ: "product-faqs",
  page: "pages",
};

/**
 * ایجاد آیتم جدید در دیتابیس
 */
export async function createItem(model: ModelKey, data: CRUDItemInput) {
  try {
    const db = modelMap[model];
    if (!db) throw new Error(`Model "${model}" not found`);

    

    if (model === "post") {
      const session = await getServerSession(authOptions);
      const userId = session?.user?.id;
   
      if (!userId) {
        throw new Error("برای ثبت پست، ابتدا باید وارد حساب کاربری خود شوید.");
      }
   
      data.authorId = Number(userId);
    }
   const sanitizedData = await sanitizeData(model, data);
    

    if (model === "product") {
      const rawVariants = sanitizedData.variants || [];
      const rawAttributes = sanitizedData.attributes || [];
      const rawImages = sanitizedData.images || [];

      delete sanitizedData.variants;
      delete sanitizedData.attributes;
      delete sanitizedData.images;
      delete sanitizedData.price;
      delete sanitizedData.stock;

      if (!sanitizedData.slug) {
        sanitizedData.slug = generateSlug(sanitizedData.title);
      }

      const fullProduct = await prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
          data: {
            ...sanitizedData,
            softDeletedAt: null,
          },
        });

        for (const v of rawVariants) {
          const price = cleanAndParseNumber(v.price);
          const stock = cleanAndParseNumber(v.stock);

          const variant = await tx.productVariant.create({
            data: {
              productId: product.id,
              color: v.color || null,
              price,
              stock,
              status: "ACTIVE",
            },
          });

          if (v.warranty && v.warranty.title) {
            await tx.productWarranty.create({
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

        for (const attr of rawAttributes) {
          if (attr.key && attr.value) {
            await tx.productAttribute.create({
              data: {
                productId: product.id,
                key: attr.key,
                value: attr.value,
                status: "ACTIVE",
              },
            });
          }
        }

        for (const img of rawImages) {
          let finalUrl = img.url || "";
          if (img.file) {
            finalUrl = await handleFileUpload(img.file);
          }
          if (finalUrl) {
            await tx.productImage.create({
              data: {
                productId: product.id,
                url: finalUrl,
                isMain: !!img.isMain,
                status: "ACTIVE",
              },
            });
          }
        }

        return await tx.product.findUnique({
          where: { id: product.id },
          include: getRelationIncludes("product", false),
        });
      });

      const targetTitle = sanitizedData.title;

      await logActivity({
        action: "CREATE",
        modelName: "Product",
        recordId: fullProduct?.id || null,
        targetName: targetTitle,
        details: `محصول جدید با عنوان «${targetTitle}» توسط مدیریت در سیستم ثبت گردید.`,
      });

      const plural = pluralModelMap[model] || model;
      revalidatePath(`/panel/${plural}`);
      revalidatePath(`/dashboard/${plural}`);

      return { success: true, data: serializeDecimal(fullProduct) };
    }

    const item = await db.create({
      data: {
        ...sanitizedData,
        softDeletedAt: null,
      },
    });

    const targetName = sanitizedData.title || sanitizedData.name || "نامشخص";

    await logActivity({
      action: "CREATE",
      modelName: model,
      recordId: item.id,
      targetName: targetName,
      details: `یک رکورد جدید در بخش ${model} با نام «${targetName}» با موفقیت اضافه شد.`,
    });

    const plural = pluralModelMap[model] || model;
    revalidatePath(`/panel/${plural}`);
    revalidatePath(`/dashboard/${plural}`);

    return { success: true, data: serializeDecimal(item) };
  } catch (err: any) {
    console.error("createItem error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * ویرایش اطلاعات آیتم موجود در دیتابیس
 */
export async function updateItem(model: ModelKey, id: number, data: CRUDItemInput) {
  try {
    const db = modelMap[model];
    if (!db) throw new Error(`Model "${model}" not found`);

    const targetName = await getItemDisplayName(model, id);
    const sanitizedData = await sanitizeData(model, data);

    if (model === "product") {
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

      await prisma.$transaction(async (tx) => {
        const updated = await tx.product.updateMany({
          where: { id, softDeletedAt: null },
          data: sanitizedData,
        });

        if (updated.count === 0) {
          throw new Error("Record not found or deleted");
        }

        if (hasVariants) {
          const oldVariants = await tx.productVariant.findMany({
            where: { productId: id },
            select: { id: true },
          });
          const oldVariantIds = oldVariants.map(v => v.id);

          await tx.productWarranty.deleteMany({ where: { variantId: { in: oldVariantIds } } });
          await tx.productVariant.deleteMany({ where: { productId: id } });

          for (const v of rawVariants) {
            const price = cleanAndParseNumber(v.price);
            const stock = cleanAndParseNumber(v.stock);

            const variant = await tx.productVariant.create({
              data: {
                productId: id,
                color: v.color || null,
                price,
                stock,
                status: "ACTIVE",
              },
            });

            if (v.warranty && v.warranty.title) {
              await tx.productWarranty.create({
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

        if (hasAttributes) {
          await tx.productAttribute.deleteMany({ where: { productId: id } });
          for (const attr of rawAttributes) {
            if (attr.key && attr.value) {
              await tx.productAttribute.create({
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

        if (hasImages) {
          await tx.productImage.deleteMany({ where: { productId: id } });
          for (const img of rawImages) {
            let finalUrl = img.url || "";
            if (img.file) {
              finalUrl = await handleFileUpload(img.file);
            }
            if (finalUrl) {
              await tx.productImage.create({
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
      });

      await logActivity({
        action: "UPDATE",
        modelName: "Product",
        recordId: id,
        targetName: targetName,
        details: `اطلاعات و تنوع‌های مربوط به محصول «${targetName}» ویرایش و به‌روزرسانی شد.`,
      });

      const plural = pluralModelMap[model] || model;
      revalidatePath(`/panel/${plural}`);
      revalidatePath(`/dashboard/${plural}`);

      return { success: true };
    }

    const updated = await db.updateMany({
      where: { id, softDeletedAt: null },
      data: sanitizedData,
    });

    if (updated.count === 0) {
      return { success: false, error: "Record not found or deleted" };
    }

    await logActivity({
      action: "UPDATE",
      modelName: model,
      recordId: id,
      targetName: targetName,
      details: `آیتم «${targetName}» در بخش ${model} ویرایش و به‌روزرسانی شد.`,
    });

    const plural = pluralModelMap[model] || model;
    revalidatePath(`/panel/${plural}`);
    revalidatePath(`/dashboard/${plural}`); // 👈 بازنویسی کش مسیر داینامیک پنل کاربران

    return { success: true };
  } catch (err: any) {
    console.error("updateItem error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * بروزرسانی تراکنشی قیمت‌های تنوع‌های مختلف یک کالا (Inline Edit)
 */
export async function quickUpdateVariantPrices(
  productId: number,
  updates: any[]
) {
  try {
    if (!updates || updates.length === 0) {
      throw new Error("لیست تغییرات قیمت خالی است");
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { title: true },
    });
    const targetName = product?.title || `شناسه ${productId}`;

    await prisma.$transaction(
      updates.map((update) =>
        prisma.productVariant.update({
          where: { id: update.id },
          data: {
            price: update.price,
          },
        })
      )
    );

    await logActivity({
      action: "UPDATE",
      modelName: "Product",
      recordId: productId,
      targetName: targetName,
      details: `قیمت‌های مربوط به تنوع‌های محصول «${targetName}» به صورت ویرایش سریع به‌روزرسانی شد.`,
    });

    revalidatePath("/panel/products");
    revalidatePath("/dashboard/products");

    return { success: true };
  } catch (err: any) {
    console.error("quickUpdateVariantPrices error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * تابع کمکی برای استخراج نام یا عنوان فارسی آیتم قبل از ثبت لاگ تغییرات
 */
async function getItemDisplayName(model: ModelKey, id: number): Promise<string> {
  try {
    const db = modelMap[model];
    if (!db) return `شناسه ${id}`;

    const isTitleModel = model === "product" || model === "banner" || model === "post";
    const selectField = isTitleModel ? "title" : "name";

    const item = await (db as any).findUnique({
      where: { id },
      select: {
        [selectField]: true,
      },
    });

    if (item) {
      return item[selectField] || `شناسه ${id}`;
    }
    return `شناسه ${id}`;
  } catch (err) {
    console.error("Error in getItemDisplayName:", err);
    return `شناسه ${id}`;
  }
}