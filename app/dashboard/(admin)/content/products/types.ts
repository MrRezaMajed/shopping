import { Product, Category, ProductBrand } from "@prisma/client";

export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  alt: string;
  order: number;
  isMain: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// تعریف interface اصلی با علامت سوال برای فیلدهای optional
export interface ProductWithRelations extends Product {
  category?: Category;
  brand?: ProductBrand | null;
  variants?: ProductVariant[];
  images?: ProductImage[];
  _count?: {
    variants: number;
    images: number;
    comments?: number;
    favorites?: number;
    attributes?: number;
    faqs?: number;
  };
}