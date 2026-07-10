"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/slug/generateSlug";

/* =====================================================
   GET LIST
===================================================== */

export async function getProductBrands(
  page = 1,
  limit = 5,
  filters?: {
    search?: string;
    status?: "ACTIVE" | "INACTIVE";
  }
) {
  try {
    const skip = (page - 1) * limit;

    const where: any = {
      softDeletedAt: null,
    };

    if (filters?.search) {
      where.name = {
        contains: filters.search,
      };
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    const [brands, total] = await Promise.all([
      prisma.productBrand.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.productBrand.count({ where }),
    ]);

    return {
      success: true,
      data: brands,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching product brands:", error);
    return {
      success: false,
      error: "خطا در دریافت برندها",
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  }
}

/* =====================================================
   CREATE
===================================================== */

export async function createProductBrand(data: {
  name: string;
  slug?: string;
  status: "ACTIVE" | "INACTIVE";
}) {
  try {
    const slug = data.slug?.trim() || generateSlug(data.name);

    const existing = await prisma.productBrand.findFirst({
      where: {
        OR: [{ name: data.name.trim() }, { slug: slug.trim() }],
        softDeletedAt: null,
      },
    });

    if (existing) {
      return { success: false, error: "نام یا اسلاگ تکراری است" };
    }

    const brand = await prisma.productBrand.create({
      data: {
        name: data.name.trim(),
        slug: slug.trim(),
        status: data.status,
      },
    });

    revalidatePath("/dashboard/content/product-brands");

    return { success: true, data: brand };
  } catch (error) {
    console.error("Error creating brand:", error);
    return { success: false, error: "خطا در ایجاد برند" };
  }
}

/* =====================================================
   UPDATE
===================================================== */

export async function updateProductBrand(
  id: number,
  data: { name: string; slug?: string; status: "ACTIVE" | "INACTIVE" }
) {
  try {
    const slug = data.slug?.trim() || generateSlug(data.name);

    const existing = await prisma.productBrand.findFirst({
      where: {
        OR: [{ name: data.name.trim() }, { slug: slug.trim() }],
        id: { not: id },
        softDeletedAt: null,
      },
    });

    if (existing) {
      return { success: false, error: "نام یا اسلاگ تکراری است" };
    }

    const updated = await prisma.productBrand.update({
      where: { id },
      data: {
        name: data.name.trim(),
        slug: slug.trim(),
        status: data.status,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/content/product-brands");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating brand:", error);
    return { success: false, error: "خطا در بروزرسانی برند" };
  }
}

/* =====================================================
   DELETE (Soft Delete)
===================================================== */

export async function deleteProductBrand(id: number) {
  try {
    const brand = await prisma.productBrand.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!brand) return { success: false, error: "برند یافت نشد" };
    if (brand._count.products > 0)
      return { success: false, error: "امکان حذف برند دارای محصول وجود ندارد" };

    await prisma.productBrand.update({
      where: { id },
      data: { softDeletedAt: new Date(), status: "INACTIVE" },
    });

    revalidatePath("/dashboard/content/product-brands");

    return { success: true };
  } catch (error) {
    console.error("Error deleting brand:", error);
    return { success: false, error: "خطا در حذف برند" };
  }
}
