import * as Yup from "yup";
import { FormikHelpers } from "formik";

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "number"
  | "checkbox"
  | "file"
  | "date"
  | "tree"
  | "images"
  | "attributes"
  | "variants"
  | "jodit"
  | "jalali-date"
  | "tags";

export interface FieldConfig<T> {
  name: keyof T;
  label: string;
  type?: FieldType;
  options?: { value: any; label: string }[];
  disabled?: boolean | ((values: T) => boolean);
  compute?: (values: T, initialValues: T) => any;
  deps?: (keyof T)[];
  trigger?: "change" | "blur";
}

export interface CRUDEditFormProps<T> {
  title: string;
  initialValues?: Partial<T>;
  validationSchema: Yup.ObjectSchema<any>;
  onSubmit: (values: T, helpers: FormikHelpers<T>) => Promise<void> | void;
  onCancel?: () => void;
  mode?: "create" | "edit";
  fields: FieldConfig<T>[];
}