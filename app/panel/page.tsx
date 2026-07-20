// مسیر فرضی: app/admin/page.tsx (یا app/dashboard/page.tsx)

import ActivityFeed from "@/components/ui/ActivityFeed";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 text-right">
      {/* هدر پیشخوان - مجهز به وزن‌های متمایز فونت در هر دو تم */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          پیشخوان مدیریت
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          خلاصه وضعیت سیستم، آمار فروش و آخرین رویدادهای زنده
        </p>
      </div>

      {/* چیدمان شبکه‌ای (Grid Layout) داشبورد */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ستون اول و دوم (بخش اصلی داشبورد - آمارها و نمودارها) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* باکس فرضی نمودار با افکت شیشه‌ای مدرن */}
          <div className="
            p-6 rounded-3xl min-h-[280px] flex items-center justify-center
            bg-white/60 dark:bg-[#0c0d14]/40 backdrop-blur-xl
            border border-slate-200/50 dark:border-white/[0.06]
            shadow-[0_8px_30px_rgb(0,0,0,0.01)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)]
          ">
            <span className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-bold tracking-wide">
              نمودار فروش و بازدیدها (به صورت فرضی)
            </span>
          </div>
          
          {/* بخش کارت‌های آمار پیشرفته با پدینگ شیک و کنتراست عالی */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* کارت آمار فروش امروز */}
            <div className="
              p-6 rounded-3xl backdrop-blur-xl transition-all duration-300 hover:shadow-md
              bg-emerald-500/[0.04] dark:bg-emerald-500/[0.02] 
              border border-emerald-500/20 dark:border-emerald-500/10
            ">
              <h4 className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold tracking-wider">
                فروش امروز
              </h4>
              <p className="text-xl sm:text-2xl font-black mt-2.5 text-slate-900 dark:text-slate-100">
                ۱۲,۴۰۰,۰۰۰ <span className="text-xs font-bold opacity-75">تومان</span>
              </p>
            </div>

            {/* کارت آمار کاربران جدید */}
            <div className="
              p-6 rounded-3xl backdrop-blur-xl transition-all duration-300 hover:shadow-md
              bg-blue-500/[0.04] dark:bg-blue-500/[0.02] 
              border border-blue-500/20 dark:border-blue-500/10
            ">
              <h4 className="text-xs text-blue-600 dark:text-blue-400 font-extrabold tracking-wider">
                کاربران جدید
              </h4>
              <p className="text-xl sm:text-2xl font-black mt-2.5 text-slate-900 dark:text-slate-100">
                ۴۵ <span className="text-xs font-bold opacity-75">کاربر جدید</span>
              </p>
            </div>

          </div>
        </div>

        {/* ستون سوم (ابزارک لاگ زنده و پایش فعالیت‌ها) */}
        <div className="lg:col-span-1">
          {/* رندر کردن کامپوننت پایش زنده دگرگون‌شده در اینجا */}
          <ActivityFeed />
        </div>

      </div>
    </div>
  );
}