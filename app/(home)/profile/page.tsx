// app/(home)/profile/page.tsx
import { getCurrentUser } from "@/app/actions/profile";
import ProfileInfo from "../../../components/profile/ProfileInfo"; // مطمئن شوید مسیر ایمپورت دقیق است
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  // ۱. واکشی اطلاعات واقعی کاربر لاگین شده از دیتابیس
  const result = await getCurrentUser();

  // ۲. در صورتی که کاربر لاگین نکرده باشد، هدایت به صفحه ورود
  if (!result || !result.success || !result.user) {
    redirect("/login");
  }

  // ۳. هماهنگ‌سازی و نگاشت فیلدهای دیتابیس با فیلدهای مورد نیاز فرانت‌اند (جهت جلوگیری از خطای تایپ اسکریپت)
  const mappedUser = {
    name: result.user.name || "",
    mobile: result.user.mobile || "",
    email: result.user.email || "",
    nationalId: (result.user as any).nationalId || "", // فیلدهای غیر دیتابیسی به صورت پیش‌فرض خالی فرستاده می‌شوند
    image: result.user.image || (result.user as any).avatar || "",
    birthday: (result.user as any).birthday || "",
    job: (result.user as any).job || "",
    economicCode: (result.user as any).economicCode || "",
    disability: (result.user as any).disability || "تعریف نشده",
  };

  return (
    <div className="w-full flex flex-col md:flex-row container mx-auto gap-6">
      {/* ۴. ارسال اطلاعات لود شده با نام پراپ صحیح */}
      <ProfileInfo user={mappedUser} />
    </div>
  );
}