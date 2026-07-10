import { Product } from "@prisma/client";

export interface EnrichedProduct extends Product {
  imageUrl?: string;
  minPrice?: number;
  maxPrice?: number;
  price?: number;
  stock?: number;
  images?: any[];
  attributes?: any[];
  variants?: any[];
}