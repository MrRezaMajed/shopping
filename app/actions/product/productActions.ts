"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/slug/generateSlug";

// انواع داده‌ها
export type ProductFilters = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  brandId?: number;
  status?: "ACTIVE" | "INACTIVE";
};

// ایجاد محصول - فقط از generateSlug استفاده می‌کند
export async function createProduct(data: {
  title: string;
  slug?: string;
  description: string;
  brandId: number | null;
  categoryId: number;
  status: "ACTIVE" | "INACTIVE";
}) {
  try {
    // اعتبارسنجی
    if (!data.title?.trim()) {
      return {
        success: false,
        error: "عنوان محصول الزامی است",
      };
    }

    // همیشه اول از generateSlug استفاده کن
    let slug = generateSlug(data.title);
    
    // اگر کاربر اسلاگ وارد کرده باشد، از generateSlug روی آن استفاده کن
    if (data.slug?.trim()) {
      slug = generateSlug(data.slug);
    }

    // اطمینان از وجود اسلاگ
    if (!slug?.trim()) {
      slug = data.title
        .toLowerCase()
        .replace(/[^\w\u0600-\u06FF]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .trim();
    }

    // ایجاد محصول
    const product = await prisma.product.create({
      data: {
        title: data.title.trim(),
        slug: slug,
        description: data.description.trim(),
        brandId: data.brandId,
        categoryId: data.categoryId,
        status: data.status,
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/content/products");
    return {
      success: true,
      data: product,
      message: "محصول با موفقیت ایجاد شد",
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

// تابع کمکی برای مدیریت خطاها
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message;
    
    if (message.includes("foreign key constraint")) {
      return "برند یا دسته‌بندی معتبر نیست";
    }
    
    if (message.includes("Unique constraint failed")) {
      return "اسلاگ تکراری است. اسلاگ به صورت خودکار تغییر کرد";
    }
    
    if (message.includes("NOT NULL constraint failed")) {
      return "پر کردن تمام فیلدهای الزامی ضروری است";
    }
  }
  
  return "خطا در ایجاد محصول";
}

// به‌روزرسانی محصول - فقط از generateSlug استفاده می‌کند
export async function updateProduct(
  id: number,
  data: {
    title: string;
    slug?: string;
    description: string;
    brandId: number | null;
    categoryId: number;
    status: "ACTIVE" | "INACTIVE";
  }
) {
  try {
    // همیشه اول از generateSlug استفاده کن
    let slug = generateSlug(data.title);
    
    // اگر کاربر اسلاگ وارد کرده باشد، از generateSlug روی آن استفاده کن
    if (data.slug?.trim()) {
      slug = generateSlug(data.slug);
    }

    // اطمینان از وجود اسلاگ
    if (!slug?.trim()) {
      slug = data.title
        .toLowerCase()
        .replace(/[^\w\u0600-\u06FF]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .trim();
    }

    // بررسی و ایجاد اسلاگ منحصربه‌فرد (به جز محصول فعلی)
    const uniqueSlug = await getUniqueSlugForUpdate(slug, id);

    const updatedProduct = await prisma.product.update({
      where: {
        id,
        softDeletedAt: null,
      },
      data: {
        title: data.title.trim(),
        slug: uniqueSlug,
        description: data.description.trim(),
        brandId: data.brandId,
        categoryId: data.categoryId,
        status: data.status,
        updatedAt: new Date(),
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/content/products");
    return {
      success: true,
      data: updatedProduct,
      message: "محصول با موفقیت بروزرسانی شد",
    };
  } catch (error) {
    console.error("Error updating product:", error);
    
    let errorMessage = "خطا در بروزرسانی محصول";
    
    if (error instanceof Error) {
      if (error.message.includes("Record to update not found")) {
        errorMessage = "محصول مورد نظر یافت نشد";
      } else if (error.message.includes("foreign key constraint")) {
        errorMessage = "برند یا دسته‌بندی معتبر نیست";
      } else if (error.message.includes("Unique constraint failed")) {
        errorMessage = "اسلاگ تکراری است. اسلاگ به صورت خودکار تغییر کرد";
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// تابع کمکی برای ایجاد اسلاگ منحصربه‌فرد برای آپدیت
async function getUniqueSlugForUpdate(baseSlug: string, excludeId: number): Promise<string> {
  let slug = baseSlug.trim();
  let counter = 1;
  
  if (!slug) {
    slug = `product-${Date.now().toString(36)}`;
  }
  
  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        slug: slug,
        id: { not: excludeId },
        softDeletedAt: null,
      },
    });
    
    if (!existing) {
      return slug;
    }
    
    // ایجاد اسلاگ جدید با شماره
    slug = `${baseSlug}-${counter}`;
    counter++;
    
    // جلوگیری از حلقه بی‌نهایت
    if (counter > 100) {
      slug = `${baseSlug}-${Date.now().toString(36)}`;
      return slug;
    }
  }
}

// بقیه توابع بدون تغییر می‌مانند...

// دریافت محصولات با صفحه‌بندی و فیلتر
export async function getProducts(
  page: number = 1, 
  limit: number = 5,
  search?: string,
  categoryId?: number,
  brandId?: number,
  status?: "ACTIVE" | "INACTIVE"
) {
  try {
    const skip = (page - 1) * limit;
    
    const whereClause: any = {
      softDeletedAt: null,
    };

    // اعمال فیلتر جستجو
    if (search && search.trim() !== "") {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // اعمال فیلتر دسته‌بندی
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    // اعمال فیلتر برند
    if (brandId) {
      whereClause.brandId = brandId;
    }

    // اعمال فیلتر وضعیت
    if (status) {
      whereClause.status = status;
    }

    // دریافت محصولات با صفحه‌بندی
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        where: whereClause,
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          variants: {
            where: {
              softDeletedAt: null,
            },
            select: {
              id: true,
              price: true,
              stock: true,
              color: true,
              status: true,
            },
          },
          images: {
            where: {
              softDeletedAt: null,
            },
            select: {
              id: true,
              url: true,
              isMain: true,
              status: true,
            },
            orderBy: {
              id: "asc",
            },
          },
          _count: {
            select: {
              variants: true,
              images: true,
              comments: true,
              favorites: true,
              attributes: true,
              faqs: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: products,
      total,
      page,
      limit,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: "خطا در دریافت محصولات",
      data: [],
      total: 0,
      page: 1,
      limit: 5,
      totalPages: 0,
    };
  }
}

// تغییر وضعیت محصول
export async function toggleProductStatus(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
        softDeletedAt: null,
      },
    });

    if (!product) {
      return {
        success: false,
        error: "محصول مورد نظر یافت نشد",
      };
    }

    const newStatus = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const updatedProduct = await prisma.product.update({
      where: {
        id,
        softDeletedAt: null,
      },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/content/products");
    return {
      success: true,
      data: updatedProduct,
      message: "وضعیت محصول با موفقیت تغییر کرد",
    };
  } catch (error) {
    console.error("Error toggling product status:", error);
    return {
      success: false,
      error: "خطا در تغییر وضعیت محصول",
    };
  }
}

export async function deleteProduct(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    });

    if (!product) {
      return {
        success: false,
        error: "محصول مورد نظر یافت نشد",
      };
    }

    const now = new Date();

    // 1. حذف وابستگی‌های واریانت‌ها (Warranty)
    const variantIds = product.variants.map(v => v.id);
    if (variantIds.length > 0) {
      await prisma.productWarranty.updateMany({
        where: { variantId: { in: variantIds }, softDeletedAt: null },
        data: { softDeletedAt: now },
      });
    }

    // 2. حذف واریانت‌ها
    if (variantIds.length > 0) {
      await prisma.productVariant.updateMany({
        where: { id: { in: variantIds }, softDeletedAt: null },
        data: { softDeletedAt: now },
      });
    }

    // 3. حذف سایر وابستگی‌ها
    const relations = [
      prisma.productImage.updateMany({ where: { productId: id, softDeletedAt: null }, data: { softDeletedAt: now } }),
      prisma.comment.updateMany({ where: { productId: id, softDeletedAt: null }, data: { softDeletedAt: now } }),
      prisma.favorite.updateMany({ where: { productId: id, softDeletedAt: null }, data: { softDeletedAt: now } }),
      prisma.productAttribute.updateMany({ where: { productId: id, softDeletedAt: null }, data: { softDeletedAt: now } }),
      prisma.productFAQ.updateMany({ where: { productId: id, softDeletedAt: null }, data: { softDeletedAt: now } }),
      prisma.attachment.updateMany({ where: { productId: id, softDeletedAt: null }, data: { softDeletedAt: now } }),
      prisma.productBundleItem.updateMany({ where: { productId: id, softDeletedAt: null }, data: { softDeletedAt: now } }),
    ];
    await Promise.all(relations);

    // 4. حذف خود محصول
    await prisma.product.update({
      where: { id },
      data: { softDeletedAt: now, status: "INACTIVE", updatedAt: now },
    });

    revalidatePath("/dashboard/content/products");

    return {
      success: true,
      message: "محصول و تمام وابستگی‌های آن با موفقیت حذف شدند",
    };
  } catch (error) {
    console.error("Error deleting product and its relations:", error);
    return {
      success: false,
      error: "خطا در حذف محصول و وابستگی‌های آن",
    };
  }
}





// دریافت دسته‌بندی‌های فعال
export async function getActiveCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        status: "ACTIVE",
        softDeletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error("Error fetching active categories:", error);
    return {
      success: false,
      error: "خطا در دریافت دسته‌بندی‌ها",
      data: [],
    };
  }
}

// دریافت تمام دسته‌بندی‌ها (برای مدیریت)
export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        softDeletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error("Error fetching all categories:", error);
    return {
      success: false,
      error: "خطا در دریافت دسته‌بندی‌ها",
      data: [],
    };
  }
}

// دریافت برندهای فعال
export async function getActiveBrands() {
  try {
    const brands = await prisma.productBrand.findMany({
      where: {
        status: "ACTIVE",
        softDeletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: brands,
    };
  } catch (error) {
    console.error("Error fetching active brands:", error);
    return {
      success: false,
      error: "خطا در دریافت برندها",
      data: [],
    };
  }
}

// دریافت تمام برندها (برای مدیریت)
export async function getAllBrands() {
  try {
    const brands = await prisma.productBrand.findMany({
      where: {
        softDeletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: brands,
    };
  } catch (error) {
    console.error("Error fetching all brands:", error);
    return {
      success: false,
      error: "خطا در دریافت برندها",
      data: [],
    };
  }
}

// آمار محصولات
export async function getProductStats() {
  try {
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalVariants,
      totalImages,
      totalCategories,
      totalBrands
    ] = await Promise.all([
      prisma.product.count({
        where: { softDeletedAt: null },
      }),
      prisma.product.count({
        where: { 
          status: "ACTIVE",
          softDeletedAt: null 
        },
      }),
      prisma.product.count({
        where: { 
          status: "INACTIVE",
          softDeletedAt: null 
        },
      }),
      prisma.productVariant.count({
        where: { 
          product: {
            softDeletedAt: null
          }
        },
      }),
      prisma.productImage.count({
        where: { 
          product: {
            softDeletedAt: null
          }
        },
      }),
      prisma.category.count({
        where: { 
          status: "ACTIVE",
          softDeletedAt: null 
        },
      }),
      prisma.productBrand.count({
        where: { 
          status: "ACTIVE",
          softDeletedAt: null 
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalProducts,
        activeProducts,
        inactiveProducts,
        totalVariants,
        totalImages,
        totalCategories,
        totalBrands,
        // محاسبات اضافی
        averageVariantsPerProduct: totalProducts > 0 ? (totalVariants / totalProducts).toFixed(1) : "0",
        averageImagesPerProduct: totalProducts > 0 ? (totalImages / totalProducts).toFixed(1) : "0",
      },
    };
  } catch (error) {
    console.error("Error fetching product stats:", error);
    return {
      success: false,
      error: "خطا در دریافت آمار محصولات",
    };
  }
}

// جستجوی سریع محصولات
export async function searchProducts(query: string, limit: number = 5) {
  try {
    const products = await prisma.product.findMany({
      where: {
        softDeletedAt: null,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("Error searching products:", error);
    return {
      success: false,
      error: "خطا در جستجوی محصولات",
      data: [],
    };
  }
}

// دریافت محصولات پرطرفدار
export async function getPopularProducts(limit: number = 5) {
  try {
    const products = await prisma.product.findMany({
      where: {
        softDeletedAt: null,
        status: "ACTIVE",
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            favorites: true,
            comments: true,
          },
        },
      },
      take: limit,
      orderBy: [
        {
          favorites: {
            _count: "desc",
          },
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return {
      success: false,
      error: "خطا در دریافت محصولات پرطرفدار",
      data: [],
    };
  }
}

// بررسی در دسترس بودن اسلاگ
export async function checkSlugAvailability(slug: string, excludeId?: number) {
  try {
    const whereClause: any = {
      slug: slug.trim(),
      softDeletedAt: null,
    };

    if (excludeId) {
      whereClause.id = { not: excludeId };
    }

    const existingProduct = await prisma.product.findFirst({
      where: whereClause,
    });

    return {
      success: true,
      data: {
        available: !existingProduct,
        message: existingProduct ? "این اسلاگ قبلاً استفاده شده است" : "اسلاگ قابل استفاده است",
      },
    };
  } catch (error) {
    console.error("Error checking slug availability:", error);
    return {
      success: false,
      error: "خطا در بررسی اسلاگ",
    };
  }
}

// بک‌آپ محصولات
export async function exportProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        softDeletedAt: null,
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: {
          where: {
            softDeletedAt: null,
          },
          select: {
            id: true,
            sku: true,
            price: true,
            discountedPrice: true,
            stock: true,
            status: true,
          },
        },
        images: {
          where: {
            softDeletedAt: null,
          },
          select: {
            id: true,
            url: true,
            alt: true,
            order: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return {
      success: true,
      data: products,
      message: "داده‌های محصولات با موفقیت استخراج شدند",
    };
  } catch (error) {
    console.error("Error exporting products:", error);
    return {
      success: false,
      error: "خطا در استخراج داده‌های محصولات",
    };
  }
}

// دریافت تعداد محصولات بر اساس وضعیت
export async function getProductCountByStatus() {
  try {
    const [activeCount, inactiveCount, totalCount] = await Promise.all([
      prisma.product.count({
        where: { 
          status: "ACTIVE",
          softDeletedAt: null 
        },
      }),
      prisma.product.count({
        where: { 
          status: "INACTIVE",
          softDeletedAt: null 
        },
      }),
      prisma.product.count({
        where: { 
          softDeletedAt: null 
        },
      }),
    ]);

    return {
      success: true,
      data: {
        active: activeCount,
        inactive: inactiveCount,
        total: totalCount,
      },
    };
  } catch (error) {
    console.error("Error fetching product count by status:", error);
    return {
      success: false,
      error: "خطا در دریافت تعداد محصولات",
    };
  }
}