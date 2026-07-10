// کامپوننت نمایش پویای خطاهای فیلدها

import React from "react";
import { Field } from "formik";
import { motion, AnimatePresence } from "framer-motion";

interface ErrorMessageProps {
  name: string;
}

export const ErrorMessage = React.memo(function ErrorMessage({ name }: ErrorMessageProps) {
  return (
    <div className="min-h-5">
      <Field name={name}>
        {({ meta }: any) => (
          <AnimatePresence>
            {meta.touched && meta.error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <p className="text-rose-500 dark:text-rose-400 text-xs font-bold mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0" />{meta.error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Field>
    </div>
  );
});