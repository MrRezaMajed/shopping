"use client";

import { useState, ChangeEvent, KeyboardEvent, FormEvent, ClipboardEvent } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import DateObject from "react-date-object";

// ایمپورت تقویم شمسی و زبان فارسی
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// ایمپورت داینامیک کامپوننت دیت‌پیکر برای کلاینت‌ساید رندرینگ
const DatePicker = dynamic(() => import("react-multi-date-picker"), { ssr: false });

// ایمپورت داینامیک ویرایشگر متن (Quill)
const ReactQuill = dynamic(() => import("react-quill-new"), { 
    ssr: false,
    loading: () => <div className="h-40 bg-gray-50 border border-gray-200 rounded-lg animate-pulse"></div>
});
import "react-quill-new/dist/quill.snow.css";

// تعریف تایپ‌های مربوط به فرم
interface PostFormData {
    title: string;
    categoryId: string;
    image: File | null;
    status: "0" | "1";
    commentable: "0" | "1";
    publishedAt: DateObject | null;
    summary: string;
    body: string;
}

export default function CreatePostPage() {
    const [formData, setFormData] = useState<PostFormData>({
        title: "",
        categoryId: "",
        image: null,
        status: "0",
        commentable: "0",
        publishedAt: null,
        summary: "",
        body: ""
    });

    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // تغییر مقدار فیلدهای ورودی متنی و انتخابی
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // تغییر فایل آپلود شده
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files![0] }));
        }
    };

    // متد پردازش تگ‌ها و تفکیک آن‌ها بر اساس علائم جداکننده
    const processAndAddTags = (inputString: string) => {
        const rawTags = inputString.split(/[,،\n]+/);
        const newTags = rawTags
            .map(t => t.trim())
            .filter(t => t !== "" && !tags.includes(t));

        if (newTags.length > 0) {
            setTags(prev => [...prev, ...newTags]);
        }
        setTagInput("");
    };

    const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === "," || e.key === "،") {
            e.preventDefault();
            processAndAddTags(tagInput);
        }
    };

    // مدیریت کپی و چسباندن (Paste) تگ‌ها به صورت همزمان
    const handleTagPaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text");
        processAndAddTags(pastedText);
    };

    const removeTag = (indexToRemove: number) => {
        setTags(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // شبیه‌سازی ارسال فرم به سرور
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const submitData = new FormData();
        submitData.append("title", formData.title);
        submitData.append("category_id", formData.categoryId);
        if (formData.image) {
            submitData.append("image", formData.image);
        }
        submitData.append("status", formData.status);
        submitData.append("commentable", formData.commentable);
        
        if (formData.publishedAt) {
            submitData.append("published_at", formData.publishedAt.toDate().toISOString());
        }
        
        submitData.append("tags", tags.join(","));
        submitData.append("summary", formData.summary);
        submitData.append("body", formData.body);

        try {
            // شبیه‌سازی درخواست شبکه با تاخیر ۲ ثانیه‌ای
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log("ارسال داده‌ها با موفقیت انجام شد:", Object.fromEntries(submitData));
        } catch (error) {
            console.error("خطا در ثبت پست:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto my-12 px-4 max-w-6xl">
            
            {/* Breadcrumb مدرن با آیکون‌های SVG */}
            <nav aria-label="breadcrumb" className="mb-6">
                <ol className="flex items-center space-x-2 space-x-reverse text-gray-500 text-xs">
                    <li><Link href="#" className="hover:text-cyan-600 transition-colors">خانه</Link></li>
                    <svg className="w-3 h-3 text-gray-400 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    <li><Link href="#" className="hover:text-cyan-600 transition-colors">بخش محتوی</Link></li>
                    <svg className="w-3 h-3 text-gray-400 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    <li><Link href="#" className="hover:text-cyan-600 transition-colors">پست</Link></li>
                    <svg className="w-3 h-3 text-gray-400 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    <li className="text-gray-800 font-semibold" aria-current="page">ایجاد پست</li>
                </ol>
            </nav>

            <section className="grid grid-cols-1 gap-6">
                <section className="w-full">
                    <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                        
                        <section className="border-b border-gray-100 pb-4 mb-5">
                            <h5 className="text-xl font-bold text-gray-800">ایجاد پست جدید</h5>
                        </section>

                        <section className="flex justify-between items-center mb-6">
                            <Link href="#" className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                بازگشت به لیست
                            </Link>
                        </section>

                        <section>
                            <form onSubmit={handleSubmit}>
                                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* عنوان پست */}
                                    <div className="flex flex-col">
                                        <label htmlFor="title" className="text-xs font-bold text-gray-700 mb-2">عنوان پست</label>
                                        <input 
                                            type="text" 
                                            id="title"
                                            name="title" 
                                            required
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white transition-all" 
                                        />
                                    </div>

                                    {/* انتخاب دسته */}
                                    <div className="flex flex-col">
                                        <label htmlFor="categoryId" className="text-xs font-bold text-gray-700 mb-2">انتخاب دسته</label>
                                        <select 
                                            name="categoryId" 
                                            id="categoryId"
                                            required
                                            value={formData.categoryId}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white transition-all"
                                        >
                                            <option value="">دسته را انتخاب کنید</option>
                                            <option value="1">اخبار فناوری</option>
                                            <option value="2">آموزش برنامه‌نویسی</option>
                                            <option value="3">علمی و پزشکی</option>
                                        </select>
                                    </div>

                                    {/* بخش مدرن آپلود تصویر */}
                                    <div className="flex flex-col md:col-span-2">
                                        <span className="text-xs font-bold text-gray-700 mb-2">تصویر شاخص پست</span>
                                        {formData.image ? (
                                            <div className="flex items-center justify-between p-3 border border-emerald-200 bg-emerald-50 rounded-lg text-emerald-800 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    <span className="font-semibold">{formData.image.name}</span>
                                                    <span className="text-gray-500">({(formData.image.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setFormData(p => ({ ...p, image: null }))}
                                                    className="text-red-500 hover:text-red-700 font-bold transition-colors p-1"
                                                >
                                                    حذف فایل
                                                </button>
                                            </div>
                                        ) : (
                                            <label htmlFor="image-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                    <p className="mb-1 text-xs text-gray-500"><span className="font-semibold">برای آپلود کلیک کنید</span></p>
                                                    <p className="text-[10px] text-gray-400">فرمت‌های مجاز: PNG, JPG, WEBP</p>
                                                </div>
                                                <input 
                                                    id="image-file" 
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden" 
                                                />
                                            </label>
                                        )}
                                    </div>

                                    {/* وضعیت انتشار */}
                                    <div className="flex flex-col">
                                        <label htmlFor="status" className="text-xs font-bold text-gray-700 mb-2">وضعیت انتشار</label>
                                        <select 
                                            name="status" 
                                            id="status" 
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white transition-all"
                                        >
                                            <option value="0">غیرفعال (پیش‌نویس)</option>
                                            <option value="1">فعال (منتشر شده)</option>
                                        </select>
                                    </div>

                                    {/* امکان درج کامنت */}
                                    <div className="flex flex-col">
                                        <label htmlFor="commentable" className="text-xs font-bold text-gray-700 mb-2">امکان درج کامنت</label>
                                        <select 
                                            name="commentable" 
                                            id="commentable" 
                                            value={formData.commentable}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white transition-all"
                                        >
                                            <option value="0">غیرفعال</option>
                                            <option value="1">فعال</option>
                                        </select>
                                    </div>

                                    {/* تاریخ انتشار با شمسی دیت‌پیکر */}
                                    <div className="flex flex-col relative">
                                        <label htmlFor="publishedAt" className="text-xs font-bold text-gray-700 mb-2">تاریخ انتشار</label>
                                        <DatePicker
                                            id="publishedAt"
                                            value={formData.publishedAt}
                                            onChange={(date) => setFormData(prev => ({ ...prev, publishedAt: date as DateObject }))}
                                            calendar={persian}
                                            locale={persian_fa}
                                            format="YYYY/MM/DD"
                                            containerClassName="w-full"
                                            inputClass="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white transition-all"
                                        />
                                    </div>

                                    {/* تگ‌ساز داینامیک و مدرن */}
                                    <div className="flex flex-col md:col-span-2">
                                        <label htmlFor="tag-input" className="text-xs font-bold text-gray-700 mb-2">تگ‌ها (برچسب‌ها)</label>
                                        <div className="flex flex-wrap gap-2 p-2.5 border border-gray-300 rounded-lg bg-white min-h-[46px] items-center focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-500 transition-all">
                                            {tags.map((tag, index) => (
                                                <span key={index} className="inline-flex items-center gap-1.5 bg-cyan-50 text-cyan-800 text-xs px-2.5 py-1 rounded-md font-medium border border-cyan-100">
                                                    {tag}
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeTag(index)} 
                                                        className="text-cyan-400 hover:text-red-500 text-sm font-bold transition-colors focus:outline-none"
                                                    >
                                                        &times;
                                                    </button>
                                                </span>
                                            ))}
                                            <input 
                                                type="text" 
                                                id="tag-input"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={handleTagKeyDown}
                                                onPaste={handleTagPaste}
                                                placeholder="تگ را تایپ کرده و Enter بزنید"
                                                className="flex-1 bg-transparent text-xs focus:outline-none min-w-[180px]"
                                            />
                                        </div>
                                    </div>

                                    {/* خلاصه پست */}
                                    <div className="flex flex-col md:col-span-2">
                                        <label className="text-xs font-bold text-gray-700 mb-2">خلاصه پست</label>
                                        <div className="prose max-w-none text-xs rounded-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-500 transition-all">
                                            <ReactQuill 
                                                theme="snow" 
                                                value={formData.summary} 
                                                onChange={(val) => setFormData(prev => ({ ...prev, summary: val }))}
                                            />
                                        </div>
                                    </div>

                                    {/* متن اصلی پست */}
                                    <div className="flex flex-col md:col-span-2">
                                        <label className="text-xs font-bold text-gray-700 mb-2">متن اصلی پست</label>
                                        <div className="prose max-w-none text-xs rounded-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-500 transition-all">
                                            <ReactQuill 
                                                theme="snow" 
                                                value={formData.body} 
                                                onChange={(val) => setFormData(prev => ({ ...prev, body: val }))}
                                            />
                                        </div>
                                    </div>

                                    {/* دکمه ثبت فرم با لودینگ استیت */}
                                    <div className="md:col-span-2 mt-2">
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className={`inline-flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-6 py-3 rounded-lg font-semibold transition-all shadow-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {isSubmitting && (
                                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                            )}
                                            {isSubmitting ? "در حال ثبت اطلاعات..." : "ثبت و ایجاد پست"}
                                        </button>
                                    </div>

                                </section>
                            </form>
                        </section>

                    </section>
                </section>
            </section>

        </div>
    );
}