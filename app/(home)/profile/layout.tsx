import { FC, ReactNode } from "react";
import Sidebar from "../../../components/profile/Sidebar";

interface ProfileLayoutProps {
  children: ReactNode;
}

const ProfileLayout: FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <section className="mx-auto px-10 py-6 bg-gray-100 dark:bg-gray-800">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* محتویات سایدبار */}
        <Sidebar />

        {/* محتوای اصلی */}
        {children}
      </div>
    </section>
  );
};

export default ProfileLayout;
