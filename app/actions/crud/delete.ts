// @/app/actions/crud/delete.ts

"use server";

import { prisma } from "@/lib/prisma";
import { modelMap, ModelKey, enumFields } from "./types";
import { logActivity } from "../audit/log";

/**
 * حذف فیزیکی یا منطقی (Soft Delete) آیتم‌ها
 */
export async function deleteItem(model: ModelKey, id: number, permanent: boolean = false) {
  console.log("🔵 [deleteItem] تابع حذف فراخوانی شد | مدل:", model, "| شناسه:", id, "| حذف دائمی:", permanent);

  try {
    const db = modelMap[model];
    if (!db) throw new Error(`Model "${model}" not found`);

    const itemId = Number(id);

    const targetName = await getItemDisplayName(model, itemId);

    if (permanent) {
      await db.delete({
        where: { id: itemId },
      });

      console.log("🟢 [deleteItem] حذف فیزیکی/دائمی از دیتابیس با موفقیت انجام شد.");
      console.log("🟡 [deleteItem] در حال تلاش برای ثبت لاگ حذف دائمی...");

      await logActivity({
        action: "DELETE",
        modelName: model,
        recordId: itemId,
        targetName: targetName,
        details: `آیتم «${targetName}» از بخش مربوطه به طور کامل و برای همیشه از دیتابیس حذف شد.`,
      });

      console.log("✅ [deleteItem] لاگ حذف دائمی با موفقیت ثبت شد.");
      return { success: true };
    }

    const deletedAt = new Date();

    if (model === "product") {
      await prisma.$transaction(async (tx) => {
        await tx.product.update({
          where: { id: itemId },
          data: {
            softDeletedAt: deletedAt,
            status: "INACTIVE",
          },
        });

        await tx.productAttribute.updateMany({
          where: { productId: itemId },
          data: {
            softDeletedAt: deletedAt,
            status: "INACTIVE",
          },
        });

        await tx.productImage.updateMany({
          where: { productId: itemId },
          data: {
            softDeletedAt: deletedAt,
            status: "INACTIVE",
          },
        });

        const variants = await tx.productVariant.findMany({
          where: { productId: itemId },
          select: { id: true },
        });
        const variantIds = variants.map((v) => v.id);

        if (variantIds.length > 0) {
          await tx.productWarranty.updateMany({
            where: { variantId: { in: variantIds } },
            data: {
              softDeletedAt: deletedAt,
              status: "INACTIVE",
            },
          });
        }

        await tx.productVariant.updateMany({
          where: { productId: itemId },
          data: {
            softDeletedAt: deletedAt,
            status: "INACTIVE",
          },
        });
      });
    } else {
      await db.update({
        where: { id: itemId },
        data: {
          softDeletedAt: deletedAt,
          status: "INACTIVE",
        },
      });
    }

    console.log("🟢 [deleteItem] حذف نرم (Soft Delete) از دیتابیس با موفقیت انجام شد.");
    console.log("🟡 [deleteItem] در حال تلاش برای ثبت لاگ حذف نرم...");

    await logActivity({
      action: "DELETE",
      modelName: model,
      recordId: itemId,
      targetName: targetName,
      details: `آیتم «${targetName}» به سطل زباله بخش مدیریت منتقل شد.`,
    });

    console.log("✅ [deleteItem] لاگ حذف نرم با موفقیت ثبت شد.");
    return { success: true };
  } catch (err: any) {
    console.log("🔴 [deleteItem] خطا در اجرای فرآیند حذف رخ داد:", err.message);
    console.error("deleteItem error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * بازیابی آیتم‌ها از سطل زباله (Restore)
 */
export async function restoreItem(model: ModelKey, id: number) {
  console.log("🔵 [restoreItem] تابع بازیابی فراخوانی شد | مدل:", model, "| شناسه:", id);

  try {
    const itemId = Number(id);
    
    const targetName = await getItemDisplayName(model, itemId);

    if (model === "product") {
      await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
          UPDATE Product 
          SET softDeletedAt = NULL, status = 'INACTIVE' 
          WHERE id = ${itemId}
        `;

        await tx.$executeRaw`
          UPDATE ProductAttribute 
          SET softDeletedAt = NULL, status = 'INACTIVE' 
          WHERE productId = ${itemId}
        `;

        await tx.$executeRaw`
          UPDATE ProductImage 
          SET softDeletedAt = NULL, status = 'INACTIVE' 
          WHERE productId = ${itemId}
        `;

        await tx.$executeRaw`
          UPDATE ProductWarranty 
          SET softDeletedAt = NULL, status = 'INACTIVE' 
          WHERE variantId IN (
            SELECT id FROM ProductVariant WHERE productId = ${itemId}
          )
        `;

        await tx.$executeRaw`
          UPDATE ProductVariant 
          SET softDeletedAt = NULL, status = 'INACTIVE' 
          WHERE productId = ${itemId}
        `;
      });
    } else {
      const tableNameMap: Record<ModelKey, string> = {
        banner: "Banner",
        brand: "ProductBrand",
        category: "Category",
        product: "Product",
        post: "Post",
        user: "User" // 👈 نگاشت فیزیکی جدول کاربران برای عملیات مستقیم اس‌کیوال
      };

      const tableName = tableNameMap[model];
      if (tableName) {
        await prisma.$executeRawUnsafe(
          `UPDATE ${tableName} SET softDeletedAt = NULL, status = 'INACTIVE' WHERE id = ${itemId}`
        );
      } else {
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

    console.log("🟢 [restoreItem] عملیات بازیابی در دیتابیس با موفقیت انجام شد.");
    console.log("🟡 [restoreItem] در حال تلاش برای ثبت لاگ بازیابی...");

    await logActivity({
      action: "RESTORE",
      modelName: model,
      recordId: itemId,
      targetName: targetName,
      details: `آیتم «${targetName}» با موفقیت از زباله‌دان بازیابی و به سیستم بازگردانده شد.`,
    });

    console.log("✅ [restoreItem] لاگ بازیابی با موفقیت ثبت شد.");
    return { success: true };
  } catch (err: any) {
    console.log("🔴 [restoreItem] خطا در اجرای فرآیند بازیابی رخ داد:", err.message);
    console.error("restoreItem error:", err);
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
    const selectField = isTitleModel ? "title" : "name"; // نام کاربر به دلیل name بودن اینجا به درستی استخراج می‌شود

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