// @/components/ui/CRUDEditForm/FormField.tsx

import React, { useCallback, useRef, useEffect } from "react";
import { useField, useFormikContext } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import { FieldConfig } from "./types";
import { INPUT_BASE, INPUT_ERROR, INPUT_IDLE, LABEL_CLASS, getIconForField } from "./constants";
import { formatNumericInput } from "./utils";
import { ImagesManager } from "./ImagesManager";
import { AttributesManager } from "./AttributesManager";
import { VariantsManager } from "./VariantsManager";
import { JoditField } from "./JoditField"; // 👈 استفاده از ویرایشگر جدید Jodit
import { TagsField } from "./TagsField";

interface FormFieldProps {
  field: FieldConfig<any>;
  fields: FieldConfig<any>[];
  disabled?: boolean;
}

const renderError = (error: any): React.ReactNode => {
  if (!error) return null;
  if (typeof error === "string") return error;
  if (Array.isArray(error)) {
    for (const item of error) {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        const nestedErr = Object.values(item).find((v) => typeof v === "string");
        if (nestedErr) return nestedErr as string;
      }
    }
  }
  if (typeof error === "object") {
    const nestedErr = Object.values(error).find((v) => typeof v === "string");
    if (nestedErr) return nestedErr as string;
  }
  return String(error);
};

export const FormField = React.memo(function FormField({
  field,
  fields,
  disabled,
}: FormFieldProps) {
  const [formikField, meta] = useField(String(field.name));
  const { setFieldValue, values, initialValues } = useFormikContext<any>();

  const valuesRef = useRef(values);
  const initialValuesRef = useRef(initialValues);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    initialValuesRef.current = initialValues;
  }, [initialValues]);

  const fieldId = String(field.name);
  const hasError = meta.touched && !!meta.error;
  const stateClass = hasError ? INPUT_ERROR : INPUT_IDLE;

  const handleCustomChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (field.type === "number") {
        setFieldValue(e.target.name, formatNumericInput(e.target.value));
      } else {
        formikField.onChange(e);
      }
    },
    [field.type, formikField, setFieldValue]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<any>) => {
      formikField.onBlur(e);

      fields.forEach((f) => {
        if (f.compute && f.trigger === "blur" && f.deps?.some((dep) => String(dep) === String(field.name))) {
          const computedValue = f.compute(valuesRef.current, initialValuesRef.current);
          if (computedValue !== undefined && computedValue !== valuesRef.current[f.name]) {
            setFieldValue(String(f.name), computedValue);
          }
        }
      });
    },
    [field.name, fields, formikField, setFieldValue]
  );

  const icon = getIconForField(fieldId);
  const inputPaddingClass = icon ? "pr-11" : "pr-4";

  const errorNode = (
    <AnimatePresence>
      {hasError && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <p className="text-rose-500 dark:text-rose-400 text-xs font-bold mt-1.5 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0" /> {renderError(meta.error)}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );

  switch (field.type) {
    case "select":
      return (
        <div className="space-y-2">
          <label htmlFor={fieldId} className={LABEL_CLASS}>{field.label}</label>
          <div className="relative flex items-center">
            {icon && <div className="absolute right-4 pointer-events-none flex items-center justify-center">{icon}</div>}
            <select
              {...formikField}
              id={fieldId}
              disabled={disabled}
              onBlur={handleBlur}
              aria-invalid={hasError}
              className={`${INPUT_BASE} ${stateClass} ${inputPaddingClass} cursor-pointer`}
            >
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#121420] text-slate-800 dark:text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {errorNode}
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-2">
          <label className={LABEL_CLASS}>{field.label}</label>
          <label
            htmlFor={fieldId}
            className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200/60 dark:border-[#1f2235]/40 bg-white/30 dark:bg-[#121420]/20 hover:bg-white/50 dark:hover:bg-[#121420]/40 transition cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={!!formikField.value}
              onChange={formikField.onChange}
              onBlur={handleBlur}
              disabled={disabled}
              name={formikField.name}
              id={fieldId}
              className="w-5 h-5 rounded-lg border-indigo-500 text-indigo-500 focus:ring-indigo-500/20 accent-indigo-500 cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-350">فعال‌سازی وضعیت {field.label}</span>
          </label>
          {errorNode}
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-2">
          <label htmlFor={fieldId} className={LABEL_CLASS}>{field.label}</label>
          <div className="relative">
            {icon && <div className="absolute right-4 top-4 pointer-events-none">{icon}</div>}
            <textarea
              {...formikField}
              id={fieldId}
              rows={4}
              disabled={disabled}
              onChange={handleCustomChange}
              onBlur={handleBlur}
              aria-invalid={hasError}
              placeholder={`ورود ${field.label}...`}
              className={`${INPUT_BASE} ${stateClass} ${icon ? "pt-3.5 pr-11" : "p-3.5"} resize-none`}
            />
          </div>
          {errorNode}
        </div>
      );

    case "images":
      return (
        <div className="space-y-2">
          <ImagesManager name={String(field.name)} />
          {errorNode}
        </div>
      );

    case "attributes":
      return (
        <div className="space-y-2">
          <AttributesManager name={String(field.name)} />
          {errorNode}
        </div>
      );

    case "variants":
      return (
        <div className="space-y-2">
          <VariantsManager name={String(field.name)} />
          {errorNode}
        </div>
      );

    case "tags":
      return (
        <div className="space-y-2">
          <label htmlFor={fieldId} className={LABEL_CLASS}>{field.label}</label>
          <TagsField
            name={fieldId}
            value={formikField.value || []}
            onChange={(val) => setFieldValue(fieldId, val)}
            placeholder={`ورود ${field.label}...`}
          />
          {errorNode}
        </div>
      );

    case "editor":
    case "tiptap":
    case "jodit": // 👈 پشتیبانی یکجا از هر سه تایپ به نفع رندر Jodit
      return (
        <div className="space-y-2">
          <label htmlFor={fieldId} className={LABEL_CLASS}>{field.label}</label>
          <JoditField
            value={formikField.value || ""}
            onChange={(val) => setFieldValue(fieldId, val)}
            placeholder={`ورود ${field.label}...`}
          />
          {errorNode}
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <label htmlFor={fieldId} className={LABEL_CLASS}>{field.label}</label>
          <div className="relative flex items-center">
            {icon && <div className="absolute right-4 pointer-events-none flex items-center justify-center">{icon}</div>}
            <input
              {...formikField}
              id={fieldId}
              type={field.type === "number" ? "text" : field.type || "text"}
              inputMode={field.type === "number" ? "numeric" : undefined}
              disabled={disabled}
              onChange={handleCustomChange}
              onBlur={handleBlur}
              aria-invalid={hasError}
              placeholder={`ورود ${field.label}...`}
              className={`${INPUT_BASE} ${stateClass} ${inputPaddingClass}`}
            />
          </div>
          {errorNode}
        </div>
      );
  }
});