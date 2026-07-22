// @/components/profile/ProfileInfo.tsx
"use client";

import { FC } from "react";
import IdentityBox from "./personalInfo/IdentityBox";
import InfoCardList from "./personalInfo/InfoCardList";
import LegalInfo from "./personalInfo/LegalInfo";


interface User {
  name: string;
  nationalId?: string; // اختیاری کردن فیلدهای غیر دیتابیسی جهت امنیت تایپ
  mobile: string;
  email?: string;
  birthday?: string;
  job?: string;
  economicCode?: string;
  disability?: string;
}

interface ProfileInfoProps {
  user?: User | null; // اختیاری کردن پراپ ورودی برای جلوگیری از کرش مجدد در آینده
}

const ProfileInfo: FC<ProfileInfoProps> = ({ user }) => {
  // اگر به هر دلیلی داده لود نشد، یک فال‌بک خالی با امنیت بالا ایجاد می‌شود
  const fallbackUser: User = user || {
    name: "کاربر مهمان",
    mobile: "",
    nationalId: "",
    email: "",
    disability: "تعریف نشده"
  };

  return (
    <div className="w-full space-y-6">
      <IdentityBox />
      <InfoCardList user={fallbackUser} />
      <LegalInfo />
    </div>
  );
};

export default ProfileInfo;