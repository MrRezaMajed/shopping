export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  brandId: number | null;
  categoryId: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
  softDeletedAt: Date | null;
  
  brand?: {
    id: number;
    name: string;
  };
  
  category?: {
    id: number;
    name: string;
  };
  
  _count?: {
    variants: number;
    images: number;
    comments: number;
    favorites: number;
  };
}

export interface ProductFormData {
  title: string;
  slug?: string;
  description: string;
  brandId: number | null;
  categoryId: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}

