// مسیر فایل شما: مثلاً app/profile/personal-info/page.tsx
import { getCurrentUser } from "@/app/actions/profile";
import ProfileInfo from "@/components/profile/personalInfo/ProfileInfo";
import { redirect } from "next/navigation";

// ۱. تایپ اطلاعات کاربر (مشخصه عکس به این ساختار اضافه شد)
interface User {
  name: string;
  nationalId: string;
  mobile: string;
  email: string;
  job: string;
  disability: string;
  image?: string; // فیلد تصویر برای آواتار یا عکس پروفایل
}

export default async function PersonalInfoPage() {
  // ۲. واکشی اطلاعات واقعی کاربر لاگین شده از دیتابیس
  const result = await getCurrentUser();

  // ۳. در صورتی که کاربر لاگین نکرده باشد، هدایت به صفحه ورود
  if (!result || !result.success || !result.user) {
    redirect("/login");
  }

  // ۴. هماهنگ‌سازی و نگاشت داده‌های واقعی دیتابیس (شامل ایمیل و تصویر)
  const mappedUser: User = {
    name: result.user.name || "",
    nationalId: (result.user as any).nationalId || "",
    mobile: result.user.mobile || "",
    email: result.user.email || "", // دریافت ایمیل واقعی از دیتابیس
    job: (result.user as any).job || "",
    disability: (result.user as any).disability || "تعریف نشده",
    image: result.user.image || (result.user as any).avatar || "",
  };

  return (
    <main className="w-full flex flex-col md:flex-row container mx-auto gap-6">
      {/* ۵. ارسال اطلاعات واقعی و پویای دیتابیس به کامپوننت */}
      <ProfileInfo user={mappedUser} />
    </main>
  );
}