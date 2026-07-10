import { FC } from "react";
import ProfileInfo from "../../../components/profile/ProfileInfo";

const ProfilePage: FC = () => {
  return (
    <div className="w-full flex flex-col md:flex-row container mx-auto gap-6">
      <ProfileInfo />
      {/* Profile Data */}
    </div>
  );
};

export default ProfilePage;
