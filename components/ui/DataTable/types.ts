// export interface ColumnDef<T> {
//   id: string;
//   header: string;
//   accessor: keyof T | string;
//   cell?: (row: T) => React.ReactNode;
//   width?: string;
// }

export interface GenericTableProps {
  model: string;
  columns: ColumnDef<any>[];
  title: string;
  createPath?: string;
  editPath?: (id: number | string) => string;
  includeRelations?: string[];
  defaultSort?: { field: string; order: 'asc' | 'desc' };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T[];
  total?: number;
  error?: string;
  message?: string;
}

import React from "react";

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessor?: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "right" | "center";
}
