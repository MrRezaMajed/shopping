// فرآیندهای حذف و بازیابی داده‌ها
"use server";

import { prisma } from "@/lib/prisma";
import { modelMap, ModelKey, enumFields } from "./types";

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

    return { success: true };
  } catch (err: any) {
    console.error("deleteItem error:", err);
    return { success: false, error: err.message };
  }
}

export async function restoreItem(model: ModelKey, id: number) {
  try {
    const itemId = Number(id);

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
        product: "Product"
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

    return { success: true };
  } catch (err: any) {
    console.error("restoreItem error:", err);
    return { success: false, error: err.message };
  }
}