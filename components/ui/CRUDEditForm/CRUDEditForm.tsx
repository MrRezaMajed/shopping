// کامپوننت تجمیع‌کننده ریشه فرم (Root Form Manager)

"use client";
import { useMemo, useCallback } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { FiArrowRight, FiCheck, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import CategoryTreeSelector from "@/components/ui/CategoryTreeSelector/CategoryTreeSelector";
import { formatPersianNumber, parsePersianNumber } from "@/lib/utils/persianNumbers";
import { CRUDEditFormProps } from "./types";
import { FormikObserver } from "./FormikObserver";
import { FileInput } from "./FileInput";
import { FormField } from "./FormField";
import { ErrorMessage } from "./ErrorMessage";
import { LABEL_CLASS } from "./constants";

// ایمپورت ابزارهای تقویم شمسی
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const EMPTY_VARIANT = { color: "", price: "", stock: "", warranty: { title: "", periodMonths: 12, description: "" } };

export default function CRUDEditForm<T extends Record<string, any>>({
  title,
  initialValues,
  validationSchema,
  onSubmit,
  onCancel,
  mode = "create",
  fields,
}: CRUDEditFormProps<T>) {
  const router = useRouter();

  const normalizedInitialValues = useMemo(() => {
    const defaults: Record<string, any> = {};
    for (const field of fields) {
      const existing = (initialValues as any)?.[field.name];
      if (existing !== undefined && existing !== null) {
        if (field.type === "number") {
          defaults[field.name as string] = formatPersianNumber(existing);
        } else if (field.type === "jalali-date") {
          // تبدیل تاریخ ذخیره شده به شیء تاریخ جاوااسکریپت برای دیت‌پیکر کلاینت
          defaults[field.name as string] = new Date(existing);
        } else if (field.type === "variants" && Array.isArray(existing)) {
          defaults[field.name as string] = existing.map((v: any) => ({
            color: v.color || "",
            price: formatPersianNumber(v.price),
            stock: formatPersianNumber(v.stock),
            warranty: v.warranties?.[0]
              ? {
                  title: v.warranties[0].title || "",
                  periodMonths: v.warranties[0].periodMonths ?? 12,
                  description: v.warranties[0].description || "",
                }
              : { title: "", periodMonths: 12, description: "" },
          }));
        } else if (field.type === "attributes" && Array.isArray(existing)) {
          defaults[field.name as string] = existing.map((a: any) => ({ key: a.key || "", value: a.value || "" }));
        } else if (field.type === "images" && Array.isArray(existing)) {
          defaults[field.name as string] = existing.map((img: any) => ({ url: img.url || "", isMain: !!img.isMain }));
        } else {
          defaults[field.name as string] = existing;
        }
        continue;
      }

      switch (field.type) {
        case "checkbox":
          defaults[field.name as string] = false;
          break;
        case "number":
          defaults[field.name as string] = "";
          break;
        case "file":
          defaults[field.name as string] = null;
          break;
        case "select":
          defaults[field.name as string] = field.options?.[0]?.value ?? "";
          break;
        case "images":
          defaults[field.name as string] = [];
          break;
        case "tags":
          defaults[field.name as string] = [];
          break;
        case "jalali-date": // مقدار اولیه تهی برای فیلد تاریخ خورشیدی
          defaults[field.name as string] = null;
          break;
        case "attributes":
          defaults[field.name as string] = [];
          break;
        case "variants":
          defaults[field.name as string] = [{ ...EMPTY_VARIANT, warranty: { ...EMPTY_VARIANT.warranty } }];
          break;
        default:
          defaults[field.name as string] = "";
      }
    }
    return defaults as T;
  }, [initialValues, fields]);

  const handleCancel = useCallback(() => {
    if (onCancel) onCancel();
    else router.back();
  }, [onCancel, router]);

  const handleSubmit = useCallback(
    async (values: T, helpers: FormikHelpers<T>) => {
      const cleanedValues: any = { ...values };
      if (values.price !== undefined) cleanedValues.price = parsePersianNumber(values.price as any);
      if (values.stock !== undefined) cleanedValues.stock = parsePersianNumber(values.stock as any);
      if (Array.isArray((values as any).variants)) {
        cleanedValues.variants = (values as any).variants.map((v: any) => ({
          ...v,
          price: parsePersianNumber(v.price),
          stock: parsePersianNumber(v.stock),
        }));
      }
      await onSubmit(cleanedValues as T, helpers);
    },
    [onSubmit]
  );

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="space-y-1.5 text-right">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-350 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 leading-relaxed font-semibold">
            {mode === "edit" ? "ویرایش و به‌روزرسانی اطلاعات موجود پایگاه داده" : "ثبت و مقداردهی رکوردهای اطلاعاتی جدید"}
          </p>
        </div>

        <div className="flex-shrink-0 p-1.5 flex items-center justify-start md:justify-end">
          <Button variant="ghost" size="md" iconLeft={<FiArrowRight />} iconTranslate="right" onClick={handleCancel} className="border-transparent hover:bg-slate-100 dark:hover:bg-[#121420] text-slate-500 dark:text-slate-400">
            بازگشت به لیست
          </Button>
        </div>
      </div>

      <div className="relative bg-white/60 dark:bg-[#0c0d14]/20 backdrop-blur-xl border border-slate-200/50 dark:border-[#1f2235]/40 rounded-3xl p-6 md:p-8 isolation-auto overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        <Formik<T> initialValues={normalizedInitialValues} enableReinitialize validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 pt-6">
              <FormikObserver fields={fields as any} />

              {fields.map((field) => {
                const isFullWidth =
                  field.type === "textarea" ||
                  field.type === "file" ||
                  field.type === "tree" ||
                  field.type === "images" ||
                  field.type === "attributes" ||
                  field.type === "variants" ||
                  field.type === "jodit";
                const isDisabled = typeof field.disabled === "function" ? field.disabled(values) : !!field.disabled;

                return (
                  <div key={String(field.name)} className={isFullWidth ? "md:col-span-2" : "col-span-1"}>
                    {field.type === "file" ? (
                      <div className="space-y-2">
                        <label className={LABEL_CLASS}>{field.label}</label>
                        <FileInput
                          name={String(field.name)}
                          setFieldValue={setFieldValue}
                          existingUrl={typeof normalizedInitialValues[field.name] === "string" ? (normalizedInitialValues[field.name] as string) : null}
                          aspectRatio={(field as any).aspectRatio}
                          targetWidth={(field as any).targetWidth}
                        />
                        <ErrorMessage name={String(field.name)} />
                      </div>
                    ) : field.type === "tree" ? (
                      <div className="space-y-2">
                        <label className={LABEL_CLASS}>{field.label}</label>
                        <CategoryTreeSelector name={String(field.name)} options={(field as any).options || []} currentId={initialValues ? (initialValues as any).id : null} />
                        <ErrorMessage name={String(field.name)} />
                      </div>
                    ) : field.type === "jalali-date" ? (
                      <div className="space-y-2">
                        <label className={LABEL_CLASS}>{field.label}</label>
                            <DatePicker
                          containerClassName="w-full"
                          calendar={persian}
                          locale={persian_fa}
                          value={values[field.name] || null}
                          onChange={(date: any) => {
                            // ذخیره تاریخ خروجی به شکل ابجکت استاندارد تاریخ جهت سهولت ذخیره در پایگاه‌داده
                            setFieldValue(String(field.name), date ? date.toDate() : null);
                          }}
                          disabled={isDisabled}
                          // رندر کردن فیلد ورودی سفارشی سازگار با استایل‌های اصلی فرم
                          render={(value, openShow) => (
                            <input
                              type="text"
                              value={value}
                              onClick={openShow}
                              readOnly
                              disabled={isDisabled}
                              placeholder={(field as any).placeholder || "انتخاب تاریخ..."}
                              className="w-full flex h-13 rounded-xl border border-slate-200/80 dark:border-[#1f2235]/60 bg-white/50 dark:bg-[#0c0d14]/40 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-sans cursor-pointer"
                            />
                          )}
                        />
                        <ErrorMessage name={String(field.name)} />
                      </div>
                    ) : (
                      <FormField field={field} fields={fields as any} disabled={isDisabled} />
                    )}
                  </div>
                );
              })}

              {/* کد موقت جهت عیب‌یابی خطاهای پنهان فرمیک */}
              {Object.keys(values).length > 0 && (
                <FormikObserver fields={fields as any} /> 
              )}

              <div className="md:col-span-2 flex flex-col-reverse sm:flex-row sm:justify-start gap-3 mt-8 border-t border-slate-100 dark:border-[#1f2235]/60 pt-6">
                <Button
                  variant="success"
                  size="lg"
                  type="submit"
                  loading={isSubmitting}
                  withShine
                  withRipple
                  withGlow
                  iconLeft={<FiCheck />}
                  iconTranslate="left"
                  className="w-full sm:w-auto justify-center rounded-xl"
                >
                  {mode === "edit" ? "بروزرسانی تغییرات" : "ثبت نهایی اطلاعات"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  iconLeft={<FiX />}
                  iconRotate={90}
                  iconScale
                  disabled={isSubmitting}
                  onClick={handleCancel}
                  className="w-full sm:w-auto hover:border-rose-500 hover:text-rose-500 transition-all rounded-xl"
                >
                  انصراف و خروج
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}