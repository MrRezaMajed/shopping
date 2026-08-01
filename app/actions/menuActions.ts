'use server'

import { prisma } from '@/lib/prisma' // 👈 آدرس ایمپورت نمونه پریزما کلاینت پروژه خود را جایگزین کنید
import { unstable_cache, revalidateTag } from 'next/cache'

// ۱. خواندن منو از دیتابیس SQLite با کمک Prisma و فعال‌سازی کش لبه Next.js
export const getMenu = unstable_cache(
  async () => {
    try {
      const menu = await prisma.navigationMenu.findUnique({
        where: { 
          key: 'header-menu',
          status: 'ACTIVE' // استفاده از انوم استاتوس پروژه شما
        }
      })

      if (menu && menu.content) {
        return JSON.parse(menu.content)
      }

      // ساختار پیش‌فرض منو در اولین اجرای برنامه در صورتی که دیتابیس خالی باشد
      const defaultMenu = [
        { id: "1", parent: "0", droppable: true, text: "کالای دیجیتال", data: { url: "/digital" } },
        { id: "2", parent: "1", droppable: true, text: "موبایل", data: { url: "/mobile" } },
        { id: "3", parent: "2", droppable: false, text: "گوشی سامسونگ", data: { url: "/samsung" } },
        { id: "4", parent: "0", droppable: false, text: "سوپرمارکت", data: { url: "/supermarket" } },
        { id: "5", parent: "0", droppable: false, text: "تخفیف‌ها و پیشنهادها", data: { url: "/offers" } }
      ]
      return defaultMenu
    } catch (error) {
      console.error("خطا در خواندن منو با پریزما:", error)
      return []
    }
  },
  ['main-navigation-cache-key'], // کلید کش لبه
  { 
    tags: ['main-navigation'] // برچسب اختصاصی جهت باطل کردن آنی کش
  }
)

// ۲. ذخیره یا ویرایش منو با استفاده از مکانیزم بهینه upsert در پریزما
export async function saveMenu(menuData: any[]) {
  try {
    const jsonString = JSON.stringify(menuData)

    await prisma.navigationMenu.upsert({
      where: { key: 'header-menu' },
      update: { 
        content: jsonString 
      },
      create: {
        key: 'header-menu',
        title: 'منوی هدر اصلی',
        content: jsonString,
        status: 'ACTIVE'
      }
    })

    // باطل کردن فوری کش لبه جهت اعمال تغییرات در کسری از ثانیه روی کل سایت
    revalidateTag('main-navigation')

    return { success: true }
  } catch (error) {
    console.error("خطا در ذخیره منو با پریزما:", error)
    return { success: false, error: 'ثبت منو در دیتابیس با شکست مواجه شد.' }
  }
}