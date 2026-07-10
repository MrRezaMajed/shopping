import * as Yup from "yup";
import React from "react";
import { FilterField } from "@/components/GenericFilterBar";

export interface CRUDField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "number" | "checkbox" | "file" | "date" | "tree";
  options?: { value: string; label: string; parentId?: number | string | null }[];
  cellRenderer?: (item: any) => React.ReactNode;

  disabled?: boolean | ((values: any) => boolean);
  compute?: (values: any, initialValues: any) => any;
  deps?: string[];
  trigger?: "change" | "blur";
}

export interface CRUDPageProps {
  model: "banner" | "brand" | "category" | "product";
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
}