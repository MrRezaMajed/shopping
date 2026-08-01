'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation' // 👈 وارد کردن ابزار ناوبری Next.js
import { Tree, DndProvider, MultiBackend, getBackendOptions } from '@minoru/react-dnd-treeview'
import { getMenu, saveMenu } from '@/app/actions/menuActions'
import { useNotification } from '@/context/NotificationContext' // 👈 آدرس کانتکست نوتیفیکیشن خود را در صورت نیاز اصلاح کنید

import { 
  MdDragIndicator, 
  MdDeleteOutline, 
  MdOutlineEdit, 
  MdAdd, 
  MdSave, 
  MdOutlineLink, 
  MdOutlineFolder, 
  MdKeyboardArrowDown, 
  MdKeyboardArrowRight,
  MdCheck,
  MdClose
} from 'react-icons/md'

export default function VisualMenuBuilderPage() {
  const router = useRouter() // 👈 تعریف روتر ناوبری
  const { addNotification } = useNotification() // 👈 تعریف هوک نوتیفیکیشن اختصاصی شما
  
  const [treeData, setTreeData] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const treeRef = useRef<any>(null)
  
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editUrl, setEditUrl] = useState('')
  
  const [newItemName, setNewItemName] = useState('')
  const [newItemUrl, setNewItemUrl] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // لود کردن تم ذخیره‌شده یا ترجیح سیستم کاربر
    const savedTheme = localStorage.getItem('menu-builder-theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }

    getMenu().then((data) => setTreeData(data))
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('menu-builder-theme', newTheme)
  }

  const handleDrop = (newTree: any[]) => {
    setTreeData(newTree)
  }

  const handleAddItemFromSidebar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName) return

    const newNode = {
      id: Date.now().toString(),
      parent: '0',
      text: newItemName,
      droppable: true,
      data: { url: newItemUrl || '#' }
    }

    setTreeData([...treeData, newNode])
    setNewItemName('')
    setNewItemUrl('')
  }

  const handleAddSubItem = (parentId: string) => {
    const newNode = {
      id: Date.now().toString(),
      parent: parentId,
      text: 'پیوند جدید',
      droppable: true,
      data: { url: '#' }
    }
    setTreeData([...treeData, newNode])
    
    if (parentId !== '0' && treeRef.current) {
      treeRef.current.open(parentId)
    }

    startEditing(newNode.id, 'پیوند جدید', '#')
  }

  const startEditing = (id: string, text: string, url: string) => {
    setEditingNodeId(id)
    setEditName(text)
    setEditUrl(url)
  }

  const saveNodeEdit = (id: string) => {
    setTreeData(
      treeData.map((node) => {
        if (node.id === id) {
          return { ...node, text: editName, data: { ...node.data, url: editUrl } }
        }
        return node
      })
    )
    setEditingNodeId(null)
  }

  const handleDeleteItem = (id: string) => {
    setTreeData(treeData.filter(item => item.id !== id && item.parent !== id))
    if (editingNodeId === id) {
      setEditingNodeId(null)
    }
  }

  const handleSaveToDatabase = async () => {
    setIsSaving(true)
    const res = await saveMenu(treeData)
    setIsSaving(false)
    
    if (res.success) {
      addNotification({
        type: 'success',
        title: 'ثبت موفقیت‌آمیز ساختار',
        message: 'تغییرات منو با موفقیت در پایگاه داده ذخیره و بر روی سایت اعمال شد!',
        duration: 3000
      })

      setTimeout(() => {
        router.push('/panel')
      }, 1500)
    } else {
      addNotification({
        type: 'error',
        title: 'خطا در ثبت اطلاعات',
        message: res.error || 'ذخیره‌سازی داده‌های منو با شکست مواجه شد.',
        duration: 4000
      })
    }
  }

  if (!mounted) return null

  return (
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
    <div className={`w-full mx-auto dir-rtl font-sans selection:bg-indigo-100 transition-colors duration-200` }>
        
        {/* هدر بالایی و دکمه‌های کنترل */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">طراح بصری منوی ناوبری</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ساختار منوهای بالا و هدر سایت خود را به صورت گرافیکی بچینید.</p>
          </div>
          
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* دکمه بازگشت به پنل */}
            <button 
              onClick={() => router.push('/panel')}
              className="group flex items-center justify-center gap-2 flex-1 sm:flex-initial border border-slate-200 dark:border-slate-800 bg-slate-700 dark:bg-slate-900 text-slate-100 dark:text-slate-300 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-600 dark:hover:bg-slate-800 transition shadow-sm"
            >
              <MdClose className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
              بازگشت به پنل
            </button>

            {/* دکمه انتشار نهایی */}
            <button 
              onClick={handleSaveToDatabase}
              disabled={isSaving}
              className="group flex items-center justify-center gap-2 flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md disabled:opacity-50"
            >
              <MdSave className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
              {isSaving ? 'در حال انتشار...' : 'انتشار نهایی ساختار منو'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* فرم افزودن پیوند جدید */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-fit transition-colors duration-200">
            <h2 className="text-sm font-black mb-4 text-slate-800 dark:text-slate-100">ایجاد پیوند جدید</h2>
            <form onSubmit={handleAddItemFromSidebar} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">عنوان پیوند (مثال: لپ‌تاپ گیمینگ)</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold transition"
                  placeholder="عنوان منو را بنویسید..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">آدرس مقصد (URL)</label>
                <input
                  type="text"
                  value={newItemUrl}
                  onChange={(e) => setNewItemUrl(e.target.value)}
                  dir="ltr"
                  className="w-full p-3 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-semibold transition text-left"
                  placeholder="مثال: /gaming-laptops"
                />
              </div>
              <button 
                type="submit" 
                className="group flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md disabled:opacity-50"
              >
                <MdAdd className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                افزودن پیوند اصلی
              </button>
            </form>
          </div>

          {/* صفحه طراحی گرافیکی منو درختواره */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-200">
            <h2 className="text-sm font-black mb-1 text-slate-800 dark:text-slate-100">ساختار چیدمان هدر</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-5">برای تو در تو کردن (زیرمنو)، المان‌ها را کمی به سمت چپ بکشید.</p>
            
            <div className="min-h-[350px] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 bg-slate-50/20 dark:bg-slate-950/10">
              {treeData.length === 0 ? (
                <div className="text-center py-20">
                  <MdOutlineFolder className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 text-xs">هیچ پیوندی تعریف نشده است. از ستون راست اضافه کنید.</p>
                </div>
              ) : (
                <Tree
                  ref={treeRef}
                  tree={treeData}
                  rootId="0"
                  render={(node, { depth, isOpen, onToggle, hasChild }) => {
                    const isEditing = editingNodeId === node.id.toString()

                    return (
                      <div 
                        className="relative mr-[calc(var(--depth)*16px)] sm:mr-[calc(var(--depth)*32px)]" 
                        style={{ '--depth': depth } as React.CSSProperties}
                      >
                        
                        {/* خطوط عمودی پیوند دهنده رسپانسیو */}
                        {Array.from({ length: depth }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute top-0 bottom-0 border-r border-dashed border-slate-200 dark:border-slate-800 right-[calc(-var(--line-idx)*16px+8px)] sm:right-[calc(-var(--line-idx)*32px+16px)]"
                            style={{ '--line-idx': i + 1 } as React.CSSProperties}
                          />
                        ))}

                        {/* اعمال نام مستعار group/row به ردیف منو */}
                        <div className="group/row flex items-center justify-between p-3 mb-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-sm transition-all">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            
                            {/* شستی درگ اند دراپ */}
                            <div className="cursor-grab text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 shrink-0">
                              <MdDragIndicator className="w-4.5 h-4.5" />
                            </div>

                            {/* ضامن بازشو */}
                            {hasChild && (
                              <button onClick={onToggle} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 shrink-0 transition">
                                {isOpen ? <MdKeyboardArrowDown className="w-5 h-5" /> : <MdKeyboardArrowRight className="w-5 h-5" />}
                              </button>
                            )}

                            {/* تراز کمکی در صورت نبودن دکمه */}
                            {!hasChild && <div className="w-5" />}

                            {/* ویرایش مستقیم و درون‌خطی */}
                            {isEditing ? (
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 w-full max-w-full sm:max-w-md">
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  onFocus={() => {
                                    if (editName === 'پیوند جدید') {
                                      setEditName('')
                                    }
                                  }}
                                  autoFocus
                                  className="p-1.5 px-2.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg focus:border-indigo-500 focus:outline-none w-full sm:w-1/3 font-semibold transition"
                                />
                                <span className="hidden sm:inline text-slate-300 dark:text-slate-600 text-xs">/</span>
                                <input
                                  type="text"
                                  value={editUrl}
                                  onChange={(e) => setEditUrl(e.target.value)}
                                  onFocus={() => {
                                    if (editUrl === '#') {
                                      setEditUrl('')
                                    }
                                  }}
                                  dir="ltr"
                                  className="p-1.5 px-2.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-850 dark:text-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none flex-1 font-mono transition text-left"
                                />
                                <div className="flex gap-1.5 justify-end sm:justify-start">
                                  {/* دکمه ذخیره تکی با چرخش ملایم آیکون */}
                                  <button 
                                    onClick={() => saveNodeEdit(node.id.toString())}
                                    className="group bg-emerald-600 dark:bg-emerald-500 text-white p-1.5 rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition"
                                  >
                                    <MdCheck className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                                  </button>
                                  {/* دکمه حذف تکی در حین ویرایش */}
                                  <button 
                                    onClick={() => handleDeleteItem(node.id.toString())}
                                    className="group bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                                    title="حذف پیوند"
                                  >
                                    <MdClose className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0 w-full justify-between sm:justify-start">
                                <span className="text-xs font-bold text-slate-855 dark:text-slate-100 truncate">{node.text}</span>
                                <span dir="ltr" className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5 font-mono truncate text-left">
                                  <MdOutlineLink className="w-3.5 h-3.5 shrink-0" />
                                  {node.data?.url}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* ابزارهای کنترلی مجهز به افکت‌های حرکتی مستقل از ردیف اصلی */}
                          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 opacity-100 md:opacity-0 md:group-hover/row:opacity-100 transition-opacity duration-150">
                            {!isEditing && (
                              <button 
                                onClick={() => startEditing(node.id.toString(), node.text, node.data?.url)}
                                className="group p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                                title="ویرایش اطلاعات"
                              >
                                <MdOutlineEdit className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12" />
                              </button>
                            )}
                            <button 
                              onClick={() => handleAddSubItem(node.id.toString())}
                              className="group p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                              title="افزودن زیرمجموعه"
                            >
                              <MdAdd className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(node.id.toString())}
                              className="group p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition"
                              title="حذف پیوند"
                            >
                              <MdDeleteOutline className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  }}
                  onDrop={handleDrop}
                  classes={{
                    root: "space-y-1",
                    draggingSource: "opacity-40",
                    placeholder: "relative bg-indigo-50/50 dark:bg-indigo-950/10 border border-dashed border-indigo-400 dark:border-indigo-600 h-14 mb-2 rounded-xl"
                  }}
                />
              )}
            </div>

            {/* دکمه اضافه کردن به سطح اصلی با انیمیشن آیکون مثبت */}
            <button 
              onClick={() => handleAddSubItem('0')}
              className="mt-4 group flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md disabled:opacity-50"
            >
              <MdAdd className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
              افزودن دکمه جدید در منوی بالا (سطح اصلی)
            </button>
          </div>

        </div>
      </div>
    </DndProvider>
  )
}