"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema برای اعتبارسنجی
const ProductSchema = z.object({
  title: z.string().min(2, "عنوان باید حداقل ۲ کاراکتر باشد"),
  description: z.string().min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد"),
  categoryId: z.number().min(1, "دسته‌بندی الزامی است"),
  brandId: z.number().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

const VariantSchema = z.object({
  color: z.string().optional(),
  price: z.number().min(0, "قیمت باید مثبت باشد"),
  stock: z.number().min(0, "موجودی باید مثبت باشد"),
});

const WarrantySchema = z.object({
  title: z.string().min(1, "عنوان گارانتی الزامی است"),
  periodMonths: z.number().min(1, "مدت گارانتی باید حداقل ۱ ماه باشد"),
  description: z.string().optional(),
});

// دریافت تمام محصولات
export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        variants: {
          include: {
            warranties: true,
          },
        },
        images: true,
        attributes: true,
        faqs: true,
      },
      where: {
        softDeletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: products };
  } catch (error) {
    console.error("Error getting products:", error);
    return { success: false, error: "خطا در دریافت محصولات" };
  }
}

// دریافت محصول بر اساس ID
export async function getProductById(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id, softDeletedAt: null },
      include: {
        category: true,
        brand: true,
        variants: {
          include: {
            warranties: true,
          },
        },
        images: true,
        attributes: true,
        faqs: true,
      },
    });

    if (!product) {
      return { success: false, error: "محصول یافت نشد" };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("Error getting product:", error);
    return { success: false, error: "خطا در دریافت محصول" };
  }
}

// ایجاد محصول جدید
export async function createProduct(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const categoryId = Number(formData.get("categoryId"));
    const brandId = formData.get("brandId") ? Number(formData.get("brandId")) : null;
    const status = formData.get("status") as "ACTIVE" | "INACTIVE";

    const variants = JSON.parse(formData.get("variants") as string || "[]");
    const warranties = JSON.parse(formData.get("warranties") as string || "{}");
    const images = JSON.parse(formData.get("images") as string || "[]");
    const attributes = JSON.parse(formData.get("attributes") as string || "[]");
    const faqs = JSON.parse(formData.get("faqs") as string || "[]");

    // اعتبارسنجی محصول اصلی
    const validatedProduct = ProductSchema.parse({
      title,
      description,
      categoryId,
      brandId,
      status,
    });

    // ایجاد slug
    const slug = title
      .toLowerCase()
      .replace(/[^\w\u0600-\u06FF]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // شروع تراکنش
    const result = await prisma.$transaction(async (tx) => {
      // ایجاد محصول
      const product = await tx.product.create({
        data: {
          title: validatedProduct.title,
          slug,
          description: validatedProduct.description,
          categoryId: validatedProduct.categoryId,
          brandId: validatedProduct.brandId,
          status: validatedProduct.status,
        },
      });

      // ایجاد واریانت‌ها
      for (const variantData of variants) {
        const validatedVariant = VariantSchema.parse(variantData);
        
        const variant = await tx.productVariant.create({
          data: {
            productId: product.id,
            color: validatedVariant.color || "",
            price: validatedVariant.price,
            stock: validatedVariant.stock,
          },
        });

        // ایجاد گارانتی برای این واریانت
        const variantWarranty = warranties[variantData.id || `variant_${variants.indexOf(variantData)}`];
        if (variantWarranty?.title) {
          const validatedWarranty = WarrantySchema.parse(variantWarranty);
          await tx.productWarranty.create({
            data: {
              variantId: variant.id,
              title: validatedWarranty.title,
              description: validatedWarranty.description || "",
              periodMonths: validatedWarranty.periodMonths,
            },
          });
        }
      }

      // ایجاد تصاویر
      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img: any, index: number) => ({
            productId: product.id,
            url: img.url,
            isMain: img.isMain || index === 0,
          })),
        });
      }

      // ایجاد ویژگی‌ها
      if (attributes.length > 0) {
        await tx.productAttribute.createMany({
          data: attributes.map((attr: any) => ({
            productId: product.id,
            key: attr.key,
            value: attr.value,
          })),
        });
      }

      // ایجاد سوالات متداول
      if (faqs.length > 0) {
        await tx.productFAQ.createMany({
          data: faqs.map((faq: any) => ({
            productId: product.id,
            question: faq.question,
            answer: faq.answer,
          })),
        });
      }

      return product;
    });

    revalidatePath("/dashboard/content/products");
    return { success: true, data: result, message: "محصول با موفقیت ایجاد شد" };
  } catch (error) {
    console.error("Error creating product:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "خطا در ایجاد محصول" };
  }
}

// ویرایش محصول
export async function updateProduct(id: number, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const categoryId = Number(formData.get("categoryId"));
    const brandId = formData.get("brandId") ? Number(formData.get("brandId")) : null;
    const status = formData.get("status") as "ACTIVE" | "INACTIVE";

    const variants = JSON.parse(formData.get("variants") as string || "[]");
    const warranties = JSON.parse(formData.get("warranties") as string || "{}");
    const images = JSON.parse(formData.get("images") as string || "[]");
    const attributes = JSON.parse(formData.get("attributes") as string || "[]");
    const faqs = JSON.parse(formData.get("faqs") as string || "[]");

    // اعتبارسنجی
    const validatedProduct = ProductSchema.parse({
      title,
      description,
      categoryId,
      brandId,
      status,
    });

    // آپدیت محصول
    const product = await prisma.product.update({
      where: { id },
      data: {
        title: validatedProduct.title,
        description: validatedProduct.description,
        categoryId: validatedProduct.categoryId,
        brandId: validatedProduct.brandId,
        status: validatedProduct.status,
      },
    });

    // حذف واریانت‌های قدیمی
    await prisma.productVariant.deleteMany({
      where: { productId: id },
    });

    // ایجاد واریانت‌های جدید
    for (const variantData of variants) {
      const validatedVariant = VariantSchema.parse(variantData);
      
      const variant = await prisma.productVariant.create({
        data: {
          productId: id,
          color: validatedVariant.color || "",
          price: validatedVariant.price,
          stock: validatedVariant.stock,
        },
      });

      // ایجاد گارانتی
      const variantWarranty = warranties[variantData.id || `variant_${variants.indexOf(variantData)}`];
      if (variantWarranty?.title) {
        const validatedWarranty = WarrantySchema.parse(variantWarranty);
        await prisma.productWarranty.create({
          data: {
            variantId: variant.id,
            title: validatedWarranty.title,
            description: validatedWarranty.description || "",
            periodMonths: validatedWarranty.periodMonths,
          },
        });
      }
    }

    // آپدیت تصاویر
    await prisma.productImage.deleteMany({
      where: { productId: id },
    });

    if (images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((img: any, index: number) => ({
          productId: id,
          url: img.url,
          isMain: img.isMain || index === 0,
        })),
      });
    }

    // آپدیت ویژگی‌ها
    await prisma.productAttribute.deleteMany({
      where: { productId: id },
    });

    if (attributes.length > 0) {
      await prisma.productAttribute.createMany({
        data: attributes.map((attr: any) => ({
          productId: id,
          key: attr.key,
          value: attr.value,
        })),
      });
    }

    // آپدیت سوالات
    await prisma.productFAQ.deleteMany({
      where: { productId: id },
    });

    if (faqs.length > 0) {
      await prisma.productFAQ.createMany({
        data: faqs.map((faq: any) => ({
          productId: id,
          question: faq.question,
          answer: faq.answer,
        })),
      });
    }

    revalidatePath("/dashboard/content/products");
    return { success: true, data: product, message: "محصول با موفقیت ویرایش شد" };
  } catch (error) {
    console.error("Error updating product:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "خطا در ویرایش محصول" };
  }
}

// حذف نرم محصول
export async function deleteProduct(id: number) {
  try {
    await prisma.product.update({
      where: { id },
      data: { softDeletedAt: new Date() },
    });

    revalidatePath("/dashboard/content/products");
    return { success: true, message: "محصول با موفقیت حذف شد" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "خطا در حذف محصول" };
  }
}

// تغییر وضعیت محصول
export async function toggleProductStatus(id: number, status: "ACTIVE" | "INACTIVE") {
  try {
    await prisma.product.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/dashboard/content/products");
    return { success: true, message: "وضعیت محصول تغییر کرد" };
  } catch (error) {
    console.error("Error toggling product status:", error);
    return { success: false, error: "خطا در تغییر وضعیت محصول" };
  }
}

// دریافت دسته‌بندی‌های فعال
export async function getActiveCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { status: "ACTIVE", softDeletedAt: null },
      orderBy: { name: "asc" },
    });

    return { success: true, data: categories };
  } catch (error) {
    console.error("Error getting categories:", error);
    return { success: false, error: "خطا در دریافت دسته‌بندی‌ها" };
  }
}

// دریافت برندهای فعال
export async function getActiveBrands() {
  try {
    const brands = await prisma.productBrand.findMany({
      where: { status: "ACTIVE", softDeletedAt: null },
      orderBy: { name: "asc" },
    });

    return { success: true, data: brands };
  } catch (error) {
    console.error("Error getting brands:", error);
    return { success: false, error: "خطا در دریافت برندها" };
  }
}