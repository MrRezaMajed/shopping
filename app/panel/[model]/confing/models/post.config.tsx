// @/components/ui/CRUDPage/confing/models/post.config.tsx

import * as Yup from 'yup'
import React from 'react'
import { CRUDField } from '@/components/ui/CRUDPage/types'
import { generateSlug } from '@/lib/slug/generateSlug'
import { toPersianNumber } from '@/lib/utils/persianNumbers'
import { updateItem } from '@/app/actions/crud/crudActions'
import { useNotification } from '@/context/NotificationContext'
import StatusToggle from '@/components/ui/DataTable/StatusToggle'

// کامپوننت سوئیچ برای ستون نظرات (همانند وضعیت بنر)
const CommentableToggle = ({ item, onRefresh }: { item: any; onRefresh?: () => void }) => {
  const { addNotification } = useNotification()

  const handleToggle = async () => {
    const oldValue = item.commentable
    const newValue = oldValue === '1' ? '0' : '1'

    // ارسال درخواست به‌روزرسانی به سرور اکشن
    const res = await updateItem('post', item.id, { commentable: newValue })

    if (!res.success) {
      addNotification({
        type: 'error',
        title: 'خطا در تغییر وضعیت نظرات',
        message: res.error || 'تغییر وضعیت امکان درج کامنت با خطا مواجه شد.',
        duration: 4000,
      })
      return
    }

    addNotification({
      type: 'success',
      title: 'بروزرسانی موفق',
      message: 'وضعیت نظرات با موفقیت تغییر کرد.',
      duration: 4000,
    })

    if (onRefresh) {
      onRefresh()
    }
  }

  return <StatusToggle checked={item.commentable === '1'} onChange={handleToggle} size="sm" />
}

export const postConfig = {
  modelKey: 'post' as const,
  modelName: 'پست وبلاگ',
  enableStatusToggle: true,
  // فیلدهایی که در نسخه موبایل جدول خلاصه می‌شوند
  hiddenOnMobile: ['slug', 'createdAt', 'publishedAt', 'commentable', 'categoryId'],

  // ۱. طرح‌واره اعتبارسنجی
  validationSchema: Yup.object().shape({
    title: Yup.string().required('عنوان پست الزامی است').min(3, 'عنوان باید حداقل ۳ کاراکتر باشد'),
    slug: Yup.string().required('نامک (Slug) الزامی است'),
    categoryId: Yup.number()
          .required('انتخاب دسته‌بندی الزامی است')
          .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === 'null' || originalValue === undefined || originalValue === null) {
              return null;
            }
            return Number(value);
          }),

    image: Yup.mixed().nullable(),
    status: Yup.string().required('انتخاب وضعیت انتشار الزامی است'),
    commentable: Yup.string().required('تعیین وضعیت نظرات الزامی است'),
    publishedAt: Yup.mixed().required('تعیین زمان انتشار الزامی است'),
    tags: Yup.array().of(Yup.string()).default([]),
    summary: Yup.string().required('خلاصه پست الزامی است'),
    content: Yup.string().required('محتوای اصلی پست الزامی است'),
    authorId: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        if (originalValue === '' || originalValue === 'null' || originalValue === undefined) {
          return null
        }
        return Number(value)
      }),
  }),

  filterTranslations: {
    keys: {
      search: 'جستجو در عنوان یا دسته‌بندی',
      status: 'وضعیت انتشار',
      authorId: 'نویسنده',
      categoryId: 'دسته‌بندی',
      commentable: 'امکان درج کامنت', 
    },
    values: {
      ACTIVE: 'فعال (منتشر شده)',
      INACTIVE: 'غیرفعال (پیش‌نویس)',
      '1': 'فعال', 
      '0': 'غیرفعال', 
    },
  },

  // ۲. نمایش اطلاعات فیلدها در جدول مدیریت
  getFields: (): CRUDField[] => [
    { name: 'title', label: 'عنوان پست' },
    {
      name: 'summary',
      label: 'خلاصه پست',
      cellRenderer: (item: any) => {
        if (!item.summary) return <span className="text-xs text-slate-400">-</span>

        // پاک‌سازی تگ‌های HTML (به دلیل استفاده از ادیتور Jodit)
        const plainText = item.summary.replace(/<[^>]*>/g, '').trim()
        const words = plainText.split(/\s+/)

        // بررسی تعداد کلمات و اعمال محدودیت ۵ کلمه
        const displayValue = words.length > 5 ? words.slice(0, 5).join(' ') + ' ...' : plainText

        return (
          <span
            className="text-xs text-slate-500 dark:text-slate-400 font-medium"
            title={plainText} // نمایش کل متن هنگام نگه داشتن ماوس روی ستون
          >
            {displayValue}
          </span>
        )
      },
    },

    {
      name: 'category',
      label: 'دسته‌بندی',
      cellRenderer: (item: any) => (
        <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
          {item.category?.name || 'بدون دسته‌بندی'}
        </span>
      ),
    },

    {
      name: 'author',
      label: 'نویسنده',
      cellRenderer: (item: any) => (
        <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
          {item.author?.name || 'سیستم'}
        </span>
      ),
    },
    { name: 'status', label: 'وضعیت' },
    {
      name: 'commentable',
      label: 'نظرات',
      cellRenderer: (item: any, onRefresh?: () => void) => (
        <CommentableToggle item={item} onRefresh={onRefresh} />
      ),
    },
    {
      name: 'publishedAt',
      label: 'تاریخ انتشار',
      cellRenderer: (item: any) => {
        if (!item.publishedAt) return <span className="text-xs text-slate-400">تنظیم نشده</span>

        try {
          const date = new Date(item.publishedAt)
          const formattedDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).format(date)

          return (
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 dir-rtl">
              {toPersianNumber(formattedDate)}
            </span>
          )
        } catch (e) {
          return <span className="text-xs text-red-500">خطا در تاریخ</span>
        }
      },
    },
  ],

  // ۳. فیلدهای داینامیک فرم
  formFields: [
    { name: 'title', label: 'عنوان پست', type: 'text' },
    {
      name: 'slug',
      label: 'نامک (Slug)',
      type: 'text',
      disabled: true,
      deps: ['title'],
      trigger: 'blur',
      compute: (values: any, initialValues: any) =>
        values.title === initialValues.title ? initialValues.slug : generateSlug(values.title),
    },
    { name: 'categoryId', label: 'دسته‌بندی', type: 'tree', options: [] },
    {
      name: 'tags',
      label: 'تگ‌ها (برچسب‌ها)',
      type: 'tags',
    },
    {
      name: 'publishedAt',
      label: 'تاریخ انتشار',
      type: 'jalali-date',
    },
    {
      name: 'image',
      label: 'تصویر شاخص پست',
      type: 'file',
    },
    {
      name: 'status',
      label: 'وضعیت انتشار',
      type: 'select',
      options: [
        { value: 'ACTIVE', label: 'فعال (منتشر شده)' },
        { value: 'INACTIVE', label: 'غیرفعال (پیش‌نویس)' },
      ],
    },
    {
      name: 'commentable',
      label: 'امکان درج کامنت',
      type: 'select',
      options: [
        { value: '1', label: 'فعال' },
        { value: '0', label: 'غیرفعال' },
      ],
    },
    {
      name: 'summary',
      label: 'خلاصه پست',
      type: 'jodit',
    },
    {
      name: 'content',
      label: 'متن اصلی پست',
      type: 'jodit',
    },
  ],

  filterFields: [
    { key: 'search', type: 'search', placeholder: 'جستجو در عنوان یا دسته‌بندی پست...' },
    {
      key: 'status',
      type: 'select',
      placeholder: 'وضعیت انتشار',
      options: [
        { value: 'ACTIVE', label: 'فعال' },
        { value: 'INACTIVE', label: 'غیرفعال' },
      ],
    },
    { // 👈 روش دوم: فیلتر کشویی دسته‌بندی به نوار ابزار اضافه شد
      key: 'categoryId',
      type: 'select',
      placeholder: 'دسته‌بندی پست',
    },
    { 
      key: 'commentable',
      type: 'select',
      placeholder: 'وضعیت نظرات',
      options: [
        { value: '1', label: 'امکان درج کامنت (فعال)' },
        { value: '0', label: 'امکان درج کامنت (غیرفعال)' },
      ],
    },
  ],
}