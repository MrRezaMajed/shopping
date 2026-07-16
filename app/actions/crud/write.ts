"use server";

import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug/generateSlug";
import { modelMap, ModelKey, CRUDItemInput } from "./types";
import { sanitizeData, cleanAndParseNumber, handleFileUpload, serializeDecimal } from "./helpers";
import { getRelationIncludes } from "./helpers";

interface VariantPriceUpdate {
  id: number;
  price: number;
}

/**
 * ایجاد آیتم جدید در دیتابیس (محصول و روابط آن یا مدل‌های ساده)
 */
export async function createItem(model: ModelKey, data: CRUDItemInput) {
  try {
    const db = modelMap[model];
    if (!db) throw new Error(`Model "${model}" not found`);

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
    console.error("updateItem error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * بروزرسانی تراکنشی قیمت‌های تنوع‌های مختلف یک کالا (Inline Edit)
 */
export async function quickUpdateVariantPrices(
  productId: number,
  updates: VariantPriceUpdate[]
) {
  try {
    if (!updates || updates.length === 0) {
      throw new Error("لیست تغییرات قیمت خالی است");
    }

    // تغییر تراکنشی قیمت تمام تنوع‌ها به صورت همزمان
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

    return { success: true };
  } catch (err: any) {
    console.error("quickUpdateVariantPrices error:", err);
    return { success: false, error: err.message };
  }
}