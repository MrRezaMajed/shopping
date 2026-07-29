// @/app/actions/crud/helpers.ts

// شامل پردازش‌های عمومی مانند کار با فایل سیستم، نرمال‌سازی قیمت‌ها/اعداد و پاکسازی آبجکت‌ها است

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";
import { ModelKey, enumFields, CRUDItemInput } from "./types";

export function castValue(model: ModelKey, field: string, value: any) {
  const enums = enumFields[model]?.[field];
  if (!enums) return value;
  if (Object.values(enums).includes(value)) {
    return value;
  }
  throw new Error(`Invalid enum value "${value}" for ${model}.${field}`);
}

export async function handleFileUpload(file: File | Blob): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

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

export async function sanitizeData(model: ModelKey, data: CRUDItemInput) {
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

    if (key === "publishedAt") {
      if (value === "" || value === "null" || value === null || value === undefined) {
        sanitized[key] = null;
      } else {
        sanitized[key] = new Date(value);
      }
      continue;
    }

    sanitized[key] = castValue(model, key, value);
  }

  return sanitized;
}

export function cleanAndParseNumber(value: any): number {
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

export function serializeDecimal(data: any): any {
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

export function getRelationIncludes(model: ModelKey, isDeleted: boolean) {
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

  if (model === "post") {
    return {
      author: {
         select: { id: true, name: true }
      },
      category: {
        select: { id: true, name: true },
      },
    };
  }

  // 👈 بارگذاری نظرات به صورت درختی به همراه ادمین پاسخ‌دهنده و رابطه تودرتو:
  if (model === "postComment") {
    return {
      user: {
        select: { id: true, name: true, email: true }
      },
      post: {
        select: { id: true, title: true }
      },
      replies: {
        where: { softDeletedAt: filter },
        orderBy: { createdAt: "asc" as const },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      }
    };
  }

  if (model === "productFAQ") {
      return {
        product: {
          select: { id: true, title: true }
        }
      };
    }

  return undefined;
}