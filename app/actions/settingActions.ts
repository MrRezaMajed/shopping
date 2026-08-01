'use server'

import { prisma } from '@/lib/prisma'
import { unstable_cache, revalidateTag } from 'next/cache'

// ثابتی که نباید export شود تا با قوانین 'use server' تداخل نداشته باشد
const SETTING_KEY = 'general-settings'

// تابع کش‌کننده داخلی بر روی کش لبه Next.js
const fetchSettingsFromDb = unstable_cache(
  async () => {
    try {
      const setting = await prisma.siteSetting.findUnique({
        where: { key: SETTING_KEY }
      })

      if (setting) return setting

      // مقادیر پیش‌فرض در صورت عدم وجود رکورد در دیتابیس
      return {
        key: SETTING_KEY,
        siteTitle: 'نام وب‌سایت من',
        siteDescription: 'توضیحات کوتاه درباره وب‌سایت...',
        logoUrl: '',
        faviconUrl: '',
        phone: '',
        email: '',
        address: '',
        instagram: '',
        telegram: '',
        whatsapp: '',
        bale: '',
        eitaa: '',
        soroush: '',
        rubika: '',
        isMaintenance: false
      }
    } catch (error) {
      console.error("خطا در خواندن تنظیمات:", error)
      return null
    }
  },
  ['site-settings-cache-key'],
  { tags: ['site-settings'] }
)

// اکشن دریافت تنظیمات
export async function getSettings() {
  return await fetchSettingsFromDb()
}

// اکشن ذخیره و ویرایش تنظیمات (بدون هشدار متغیرهای بدون استفاده)
export async function saveSettings(formData: any) {
  try {
    // کپی از داده‌ها و پاکسازی فیلدهای غیرمجاز جهت ذخیره در دیتابیس
    const dataToSave = { ...formData }
    delete dataToSave.id
    delete dataToSave.createdAt
    delete dataToSave.updatedAt
    delete dataToSave.key

    await prisma.siteSetting.upsert({
      where: { key: SETTING_KEY },
      update: {
        ...dataToSave,
      },
      create: {
        key: SETTING_KEY,
        ...dataToSave,
      }
    })

    // باطل کردن فوری کش جهت اعمال تغییرات در کل سایت
    revalidateTag('site-settings')

    return { success: true }
  } catch (error: any) {
    console.error("خطا در ذخیره‌سازی تنظیمات:", error)
    return { success: false, error: 'ذخیره‌سازی تنظیمات با شکست مواجه شد.' }
  }
}