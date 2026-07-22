// @/components/profile/ProfileInfo.tsx
"use client";

import { FC } from "react";
import InfoCardList from "./InfoCardList";

interface User {
  id?: number;
  name: string;
  email?: string | null;
  mobile: string;
  image?: string | null;
}

interface ProfileInfoProps {
  user?: User | null;
}

const ProfileInfo: FC<ProfileInfoProps> = ({ user }) => {
  const fallbackUser: User = user || {
    name: "کاربر مهمان",
    mobile: "",
    email: ""
  };

  return (
    <div className="w-full">
      {/* حذف شدن تایید هویت و باکس حقوقی اضافی به درخواست شما */}
      <InfoCardList user={fallbackUser} />
    </div>
  );
};

export default ProfileInfo;