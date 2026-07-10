"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/slug/generateSlug";

export async function createCategoryAction(data: {
  name: string;
  slug: string;
  parentId?: number | null;
  status: "ACTIVE" | "INACTIVE";
}) {
  const exists = await prisma.category.findUnique({
    where: { slug: data.slug },
  });

  if (exists) {
    throw new Error("Slug تکراری است");
  }

  return prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      parentId: data.parentId ?? null,
      status: data.status,
    },
  });
}

export async function fetchAllCategories(excludeId?: number) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        softDeletedAt: null,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        parentId: true,
      },
      orderBy: [
        {
          parentId: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    });
    return categories;
  } catch (error) {
    console.error("Error fetching all categories:", error);
    return [];
  }
}

export async function getCategories(page: number = 1, limit: number = 5) {
  try {
    const skip = (page - 1) * limit;
    
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        skip,
        take: limit,
        where: {
          softDeletedAt: null,
        },
        include: {
          parent: {
            select: {
              name: true,
              id: true,
            },
          },
          _count: {
            select: {
              children: true,
              products: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.category.count({
        where: {
          softDeletedAt: null,
        },
      }),
    ]);

    return {
      success: true,
      data: categories,
      total,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: "خطا در دریافت دسته‌بندی‌ها",
      data: [],
      total: 0,
    };
  }
}

export async function toggleCategoryStatus(id: number) {
  try {
    // 1. بررسی وجود دسته‌بندی
    const category = await prisma.category.findUnique({
      where: { 
        id,
        softDeletedAt: null,
      },
    });

    if (!category) {
      return {
        success: false,
        error: "دسته‌بندی یافت نشد",
      };
    }

    // 2. محاسبه وضعیت جدید
    const newStatus = category.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    // 3. بروزرسانی در دیتابیس
    const updatedCategory = await prisma.category.update({
      where: { 
        id,
        softDeletedAt: null,
      },
      data: {
        status: newStatus,
      },
    });

    // 4. Revalidate برای بروزرسانی کش
    revalidatePath("/dashboard/content/categories");
    
    // 5. بازگشت نتیجه موفق
    return {
      success: true,
      data: updatedCategory,
      message: "وضعیت با موفقیت تغییر کرد",
    };
  } catch (error) {
    console.error("Error toggling category status:", error);
    
    // 6. بازگشت خطا به صورت ساختاریافته
    let errorMessage = "خطا در تغییر وضعیت دسته‌بندی";
    
    if (error instanceof Error) {
      if (error.message.includes("Record to update not found")) {
        errorMessage = "دسته‌بندی مورد نظر پیدا نشد";
      }
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function deleteCategory(id: number) {
  try {
    const children = await prisma.category.count({
      where: { 
        parentId: id,
        softDeletedAt: null,
      },
    });

    if (children > 0) {
      return {
        success: false,
        error: "امکان حذف دسته‌بندی دارای زیرمجموعه وجود ندارد",
      };
    }

    await prisma.category.update({
      where: { id },
      data: {
        softDeletedAt: new Date(),
        status: "INACTIVE",
      },
    });

    revalidatePath("/dashboard/content/categories");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    return {
      success: false,
      error: "خطا در حذف دسته‌بندی",
    };
  }
}

export async function getParentCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parentId: null,
        softDeletedAt: null,
      },
      select: {
        id: true,
        name: true,
      },
    });
    
    return categories;
  } catch (error) {
    console.error("Error fetching parent categories:", error);
    return [];
  }
}

export async function fetchCategoryById(id: number) {
  try {
    if (!id || isNaN(id)) {
      throw new Error("شناسه دسته‌بندی نامعتبر است");
    }

    const category = await prisma.category.findUnique({
      where: { 
        id,
        softDeletedAt: null
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            status: true,
          },
          where: {
            softDeletedAt: null,
          },
        },
      },
    });

    return category;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw error;
  }
}

export async function fetchAvailableParentCategories(excludeId?: number) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        status: "ACTIVE",
        softDeletedAt: null,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
      orderBy: [
        {
          parentId: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    });

    const filteredCategories = categories.filter(category => {
      if (!excludeId) return true;
      
      const isParent = checkIfIsParent(categories, category.id, excludeId);
      return !isParent;
    });

    return filteredCategories;
  } catch (error) {
    console.error("Error fetching parent categories:", error);
    return [];
  }
}

function checkIfIsParent(
  categories: { id: number; parentId: number | null }[], 
  parentId: number | null, 
  childId: number | null
): boolean {
  if (!parentId || !childId) {
    return false;
  }
  
  let currentParentId = parentId;
  
  while (currentParentId) {
    if (currentParentId === childId) {
      return true;
    }
    
    // استفاده از non-null assertion
    const currentCategory = categories.find(c => c.id === currentParentId!);
    currentParentId = currentCategory?.parentId || null;
  }
  
  return false;
}

export async function updateCategory(data: {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  status: "ACTIVE" | "INACTIVE";
}) {
  try {
    const { id, name, parentId, status } = data;
    
    const slug = data.slug?.trim() || generateSlug(name);
    
    if (!id || isNaN(id)) {
      return { success: false, error: "شناسه دسته‌بندی نامعتبر است" };
    }

    if (!name?.trim()) {
      return { success: false, error: "نام دسته‌بندی الزامی است" };
    }

    const existingSlug = await prisma.category.findFirst({
      where: {
        slug: slug,
        id: { not: id },
        softDeletedAt: null,
      },
    });

    if (existingSlug) {
      let uniqueSlug = slug;
      let counter = 1;
      
      while (true) {
        const checkSlug = await prisma.category.findFirst({
          where: {
            slug: uniqueSlug,
            id: { not: id },
            softDeletedAt: null,
          },
        });
        
        if (!checkSlug) break;
        
        uniqueSlug = `${slug}-${counter}`;
        counter++;
        
        if (counter > 100) {
          uniqueSlug = `${slug}-${Date.now().toString(36)}`;
          break;
        }
      }
      
      const updatedCategory = await prisma.category.update({
        where: { 
          id,
          softDeletedAt: null 
        },
        data: {
          name: name.trim(),
          slug: uniqueSlug.trim(),
          parentId,
          status,
          updatedAt: new Date(),
        },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      revalidatePath("/dashboard/content/categories");
      revalidatePath(`/dashboard/content/categories/${id}`);
      revalidatePath(`/dashboard/content/categories/${id}/edit`);

      return { 
        success: true, 
        data: updatedCategory,
        message: "دسته‌بندی با موفقیت بروزرسانی شد"
      };
    }

    const updatedCategory = await prisma.category.update({
      where: { 
        id,
        softDeletedAt: null 
      },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        parentId,
        status,
        updatedAt: new Date(),
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/content/categories");
    revalidatePath(`/dashboard/content/categories/${id}`);
    revalidatePath(`/dashboard/content/categories/${id}/edit`);

    return { 
      success: true, 
      data: updatedCategory,
      message: "دسته‌بندی با موفقیت بروزرسانی شد"
    };
  } catch (error) {
    console.error("Error updating category:", error);
    
    let errorMessage = "خطا در بروزرسانی دسته‌بندی. لطفاً دوباره تلاش کنید";
    
    if (error instanceof Error) {
      if (error.message.includes("foreign key constraint")) {
        errorMessage = "دسته‌بندی والد معتبر نیست";
      } else if (error.message.includes("Record to update not found")) {
        errorMessage = "دسته‌بندی مورد نظر پیدا نشد";
      } else if (error.message.includes("Unique constraint failed")) {
        errorMessage = "اسلاگ تکراری است. اسلاگ به صورت خودکار تغییر کرد";
      }
    }

    return { 
      success: false, 
      error: errorMessage
    };
  }
}
