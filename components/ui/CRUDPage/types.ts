// @/components/ui/CRUDPage/types.ts

import * as Yup from "yup";
import React from "react";
import { FilterField } from "@/components/GenericFilterBar";

export interface CRUDField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "number" | "checkbox" | "file" | "date" | "tree";
  options?: { value: string; label: string; parentId?: number | string | null }[];
  cellRenderer?: (item: any, onRefresh?: any) => React.ReactNode;

  disabled?: boolean | ((values: any) => boolean);
  compute?: (values: any, initialValues: any) => any;
  deps?: string[];
  trigger?: "change" | "blur";
}

export interface CRUDPageProps {
  model: "banner" | "brand" | "category" | "product" | "post" | "user"; // 👈 اضافه شدن مدل‌های جدید
  modelName: string;
  fields: CRUDField[];
  formFields: CRUDField[];
  filterFields: FilterField[];
  validationSchema: Yup.ObjectSchema<any>;
  enableStatusToggle?: boolean;
  hiddenOnMobile?: string[];
  dynamicOptions?: Record<string, { value: string; label: string; parentId?: number | string | null }[]>;
  filterTranslations?: {
    keys?: Record<string, string>;
    values?: Record<string, string>;
  };
  disableCreate?: boolean; // 👈 اضافه شد جهت کنترل دکمه افزودن
  disableEdit?: boolean;   // 👈 اضافه شد جهت کنترل دکمه ویرایش
}