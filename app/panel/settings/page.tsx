'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSettings, saveSettings } from '@/app/actions/settingActions'
import { useNotification } from '@/context/NotificationContext'
import { 
  MdSave, 
  MdSettings, 
  MdPhone, 
  MdShare, 
  MdStorefront, 
  MdOutlineImage, 
  MdClose,
  MdBuild,
  MdEmail,
  MdPlace
} from 'react-icons/md'

export default function SiteSettingsPage() {
  const router = useRouter()
  const { addNotification } = useNotification()

  const [formData, setFormData] = useState({
    siteTitle: '',
    siteDescription: '',
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
  })

  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'system'>('general')

  useEffect(() => {
    getSettings().then((data) => {
      if (data) {
        setFormData({
          siteTitle: data.siteTitle || '',
          siteDescription: data.siteDescription || '',
          logoUrl: data.logoUrl || '',
          faviconUrl: data.faviconUrl || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          instagram: data.instagram || '',
          telegram: data.telegram || '',
          whatsapp: data.whatsapp || '',
          bale: data.bale || '',
          eitaa: data.eitaa || '',
          soroush: data.soroush || '',
          rubika: data.rubika || '',
          isMaintenance: Boolean(data.isMaintenance)
        })
      }
      setLoading(false)
    })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement
      setFormData(prev => ({ ...prev, [name]: target.checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const res = await saveSettings(formData)
    setIsSaving(false)

    if (res.success) {
      addNotification({
        type: 'success',
        title: 'ذخیره‌سازی موفق',
        message: 'تنظیمات سایت با موفقیت به‌روزرسانی شد.',
        duration: 3000
      })
    } else {
      addNotification({
        type: 'error',
        title: 'خطا در ثبت',
        message: res.error || 'خطایی در ثبت تنظیمات رخ داد.',
        duration: 4000
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full mx-auto dir-rtl font-sans selection:bg-indigo-100 transition-colors duration-200">
      
      {/* هدر بالایی */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MdSettings className="text-indigo-600 dark:text-indigo-400" />
            تنظیمات عمومی وب‌سایت
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            اطلاعات پایه، راه‌های ارتباطی، پیام‌رسان‌ها و حالت نگهداری سایت را پیکربندی کنید.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="group flex items-center justify-center gap-2 flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md disabled:opacity-50"
          >
            <MdSave className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
            {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
          
          <button 
            onClick={() => router.push('/panel')}
            className="group flex items-center justify-center gap-2 flex-1 sm:flex-initial border border-slate-200 dark:border-slate-800 bg-slate-700 dark:bg-slate-900 text-slate-100 dark:text-slate-300 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-600 dark:hover:bg-slate-800 transition shadow-sm"
          >
            <MdClose className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            بازگشت به پنل
          </button>

        </div>
      </div>

      {/* زبانه (Tabs) کنترل بخش‌ها */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'general'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <MdStorefront className="w-4 h-4" />
          اطلاعات اصلی و برندینگ
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'contact'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <MdPhone className="w-4 h-4" />
          ارتباط با ما و آدرس
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'social'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <MdShare className="w-4 h-4" />
          شبکه‌های اجتماعی و پیام‌رسان‌ها
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'system'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <MdBuild className="w-4 h-4" />
          وضعیت سیستم
        </button>
      </div>

      {/* بدنه اصلی فرم */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        
        {/* ۱. زبانه اطلاعات عمومی */}
        {activeTab === 'general' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                عنوان وب‌سایت
              </label>
              <input
                type="text"
                name="siteTitle"
                value={formData.siteTitle}
                onChange={handleChange}
                className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold"
                placeholder="مثال: فروشگاه آنلاین تکنولوژی"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                توضیحات کوتاه / شعار سایت (سئو)
              </label>
              <textarea
                name="siteDescription"
                value={formData.siteDescription}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold"
                placeholder="توضیحات کوتاه جهت نمایش در گوگل..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                  <MdOutlineImage className="w-4 h-4" />
                  آدرس لوگو سایت (URL)
                </label>
                <input
                  type="text"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  dir="ltr"
                  className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold text-left"
                  placeholder="/uploads/logo.png"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                  <MdOutlineImage className="w-4 h-4" />
                  آدرس آیکون سایت / Favicon (URL)
                </label>
                <input
                  type="text"
                  name="faviconUrl"
                  value={formData.faviconUrl}
                  onChange={handleChange}
                  dir="ltr"
                  className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold text-left"
                  placeholder="/favicon.ico"
                />
              </div>
            </div>
          </div>
        )}

        {/* ۲. زبانه تماس با ما */}
        {activeTab === 'contact' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                  <MdPhone className="w-4 h-4" />
                  شماره تماس
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  dir="ltr"
                  className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold text-left"
                  placeholder="021-12345678"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                  <MdEmail className="w-4 h-4" />
                  ایمیل پشتیبانی
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  dir="ltr"
                  className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold text-left"
                  placeholder="info@yoursite.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <MdPlace className="w-4 h-4" />
                آدرس حضوری
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold"
                placeholder="تهران، خیابان آزادی..."
              />
            </div>
          </div>
        )}

        {/* ۳. زبانه شبکه‌های اجتماعی و پیام‌رسان‌ها */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            
            {/* پیام‌رسان‌های داخلی */}
            <div>
              <h3 className="text-xs font-black text-indigo-600 dark:text-indigo-400 mb-3 border-b border-indigo-100 dark:border-indigo-950 pb-2">
                پیام‌رسان‌های داخلی
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    لینک / کانال ایتا (Eitaa)
                  </label>
                  <input
                    type="text"
                    name="eitaa"
                    value={formData.eitaa}
                    onChange={handleChange}
                    dir="ltr"
                    className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold text-left"
                    placeholder="https://eitaa.com/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    لینک / کانال بله (Bale)
                  </label>
                  <input
                    type="text"
                    name="bale"
                    value={formData.bale}
                    onChange={handleChange}
                    dir="ltr"
                    className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold text-left"
                    placeholder="https://ble.ir/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    لینک / کانال روبیکا (Rubika)
                  </label>
                  <input
                    type="text"
                    name="rubika"
                    value={formData.rubika}
                    onChange={handleChange}
                    dir="ltr"
                    className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold text-left"
                    placeholder="https://rubika.ir/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    لینک / کانال سروش (Soroush)
                  </label>
                  <input
                    type="text"
                    name="soroush"
                    value={formData.soroush}
                    onChange={handleChange}
                    dir="ltr"
                    className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold text-left"
                    placeholder="https://splus.ir/yourpage"
                  />
                </div>
              </div>
            </div>

            {/* شبکه‌های اجتماعی بین‌المللی */}
            <div>
              <h3 className="text-xs font-black text-indigo-600 dark:text-indigo-400 mb-3 border-b border-indigo-100 dark:border-indigo-950 pb-2">
                شبکه‌های اجتماعی بین‌المللی
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">اینستاگرام</label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    dir="ltr"
                    className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold text-left"
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">تلگرام</label>
                  <input
                    type="text"
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleChange}
                    dir="ltr"
                    className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold text-left"
                    placeholder="https://t.me/yourchannel"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">واتساپ</label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    dir="ltr"
                    className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold text-left"
                    placeholder="https://wa.me/989123456789"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ۴. زبانه وضعیت سیستم */}
        {activeTab === 'system' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl">
              <div>
                <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300">حالت در دست تعمیر (Maintenance Mode)</h3>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
                  در صورت فعال‌سازی، دسترسی کاربران عادی به بخش فرانت‌اند غیرفعال خواهد شد.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isMaintenance"
                  checked={formData.isMaintenance}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          </div>
        )}

      </form>
    </div>
  )
}