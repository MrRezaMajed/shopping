"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { modelConfig, ModelKey } from "./model-config";
import { saveFile, saveMultipleFiles, deleteFile } from "./file-service";

export type CRUDItemInput = Record<string, any>;

const modelMap = {
  banner: prisma.banner,
  product: prisma.product,
  brand: prisma.productBrand,
  category: prisma.category,
};

// Enum auto-cast
const enumFields: Record<ModelKey, Record<string, any>> = {
  banner: { status: Prisma.Status, position: Prisma.Position },
  product: { status: Prisma.Status },
  brand: { status: Prisma.Status },
  category: { status: Prisma.Status },
};

// Helper cast
function castValue(model: ModelKey, field: string, value: any) {
  const enums = enumFields[model]?.[field];
  if (!enums) return value;
  if (Object.values(enums).includes(value)) return value;
  throw new Error(`Invalid enum value "${value}" for ${model}.${field}`);
}

// Sanitize data
function sanitizeData(model: ModelKey, data: CRUDItemInput) {
  const sanitized: any = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) return;
    if (typeof File !== "undefined" && value instanceof File) return;
    sanitized[key] = castValue(model, key, value);
  });
  return sanitized;
}

// ==================== CREATE ====================
export async function createGeneric(model: ModelKey, data: CRUDItemInput) {
  try {
    const config = modelConfig[model];
    const processedData: any = { ...data };

    // فایل‌ها
    if (config?.fileFields) {
      for (const [key, field] of Object.entries(config.fileFields)) {
        if (field.multiple) {
          const files = (data[key] || []) as File[];
          processedData[key] = await saveMultipleFiles(files);
        } else {
          const file = data[key] as File;
          if (file) processedData[key] = await saveFile(file);
        }
      }
    }

    const sanitized = sanitizeData(model, processedData);

    const item = await modelMap[model].create({ data: { ...sanitized, softDeletedAt: null } });
    return { success: true, data: item };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message };
  }
}

// ==================== UPDATE ====================
export async function updateGeneric(model: ModelKey, id: number, data: CRUDItemInput) {
  try {
    const config = modelConfig[model];
    const db = modelMap[model];

    // فایل‌ها → جایگزینی فایل قدیمی
    const existing: any = await db.findUnique({ where: { id } });
    const processedData: any = { ...data };

    if (config?.fileFields) {
      for (const [key, field] of Object.entries(config.fileFields)) {
        if (field.multiple) {
          const files = (data[key] || []) as File[];
          if (files.length > 0) {
            // حذف فایل‌های قبلی
            (existing[key] || []).forEach((p: string) => deleteFile(p));
            processedData[key] = await saveMultipleFiles(files);
          }
        } else {
          const file = data[key] as File;
          if (file) {
            if (existing[key]) await deleteFile(existing[key]);
            processedData[key] = await saveFile(file);
          }
        }
      }
    }

    const sanitized = sanitizeData(model, processedData);

    const updated = await db.updateMany({ where: { id, softDeletedAt: null }, data: sanitized });
    if (updated.count === 0) return { success: false, error: "Record not found or deleted" };
    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message };
  }
}

// ==================== SOFT / HARD DELETE ====================
export async function deleteGeneric(model: ModelKey, id: number, permanent = false) {
  try {
    const db = modelMap[model];
    const config = modelConfig[model];

    if (permanent) {
      // حذف فایل‌ها
      if (config?.fileFields) {
        const existing: any = await db.findUnique({ where: { id } });
        for (const key of Object.keys(config.fileFields)) {
          if (existing[key]) {
            if (Array.isArray(existing[key])) {
              existing[key].forEach((p: string) => deleteFile(p));
            } else {
              deleteFile(existing[key]);
            }
          }
        }
      }
      const deleted = await db.deleteMany({ where: { id } });
      if (!deleted.count) return { success: false, error: "Record not found" };
      return { success: true };
    }

    // Soft delete
    const deleted = await db.updateMany({
      where: { id, softDeletedAt: null },
      data: {
        softDeletedAt: new Date(),
        ...(enumFields[model]?.status && { status: Prisma.Status.INACTIVE }),
      },
    });

    if (!deleted.count) return { success: false, error: "Record not found or already deleted" };
    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message };
  }
}

// ==================== RESTORE ====================
export async function restoreGeneric(model: ModelKey, id: number) {
  try {
    const db = modelMap[model];
    const restored = await db.updateMany({
      where: { id, softDeletedAt: { not: null } },
      data: {
        softDeletedAt: null,
        ...(enumFields[model]?.status && { status: Prisma.Status.ACTIVE }),
      },
    });
    if (!restored.count) return { success: false, error: "Record not found or not deleted" };
    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message };
  }
}
