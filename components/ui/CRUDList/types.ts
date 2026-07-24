import React from "react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

export interface CRUDListProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;
  page: number;
  limit: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  
  // قابلیت انتخاب چندتایی و عملیات گروهی
  selectedIds?: number[];
  onSelectedIdsChange?: (ids: number[]) => void;
  bulkActionNode?: React.ReactNode; // دکمه‌ها یا دستورات گروهی برای نمایش زمان انتخاب

  // اسلات سفارشی عملیات ردیف
  renderActions?: (item: T) => React.ReactNode;

  // عملیات‌های پیش‌فرض
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onPermanentDelete?: (item: T) => void;
  onRestore?: (item: T) => void;
  
  hiddenOnMobile?: string[];
}