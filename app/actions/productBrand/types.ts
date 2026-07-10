export interface ProductBrand {
  id: number;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
  softDeletedAt: Date | null;
  _count?: {
    products: number;
  };
}

export interface ProductBrandFormData {
  name: string;
  slug: string;
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