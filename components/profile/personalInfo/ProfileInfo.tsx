"use client";

import { FC } from "react";
import IdentityBox from "./IdentityBox";
import InfoCardList from "./InfoCardList";
import LegalInfo from "./LegalInfo";

interface User {
  name: string;
  nationalId: string;
  mobile: string;
  email?: string;
  birthday?: string;
  job?: string;
  economicCode?: string;
  disability?: string;
}

interface ProfileInfoProps {
  user: User;
}

const ProfileInfo: FC<ProfileInfoProps> = ({ user }) => {
  return (
    <div className="w-full space-y-6">
      <IdentityBox />
      <InfoCardList user={user} />
      <LegalInfo />
    </div>
  );
};

export default ProfileInfo;