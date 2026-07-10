// ناظر و هماهنگ‌کننده تغییر فیلدهای وابسته (Formik Observer)

import { useEffect, useRef } from "react";
import { useFormikContext } from "formik";
import { FieldConfig } from "./types";

interface FormikObserverProps {
  fields: FieldConfig<any>[];
}

export function FormikObserver({ fields }: FormikObserverProps) {
  const { values, initialValues, setFieldValue } = useFormikContext<any>();
  const prevValuesRef = useRef<any>(values);

  useEffect(() => {
    const prev = prevValuesRef.current;

    fields.forEach((field) => {
      if (!field.compute || field.trigger === "blur") return;

      const hasChanged =
        field.deps && field.deps.length > 0
          ? field.deps.some((dep) => values[dep] !== prev[dep])
          : Object.keys({ ...values, ...prev }).some((key) => values[key] !== prev[key]);

      if (hasChanged) {
        const computedValue = field.compute(values, initialValues);
        if (computedValue !== undefined && computedValue !== values[field.name]) {
          setFieldValue(String(field.name), computedValue);
        }
      }
    });

    prevValuesRef.current = values;
  }, [values, initialValues, fields, setFieldValue]);

  return null;
}