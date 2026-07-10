import { FC } from "react";
import ProfileInfo from "../../../../components/profile/personalInfo/ProfileInfo";

// تایپ اطلاعات کاربر
interface User {
  name: string;
  nationalId: string;
  mobile: string;
  email: string;
  job: string;
  disability: string;
}

const PersonalInfoPage: FC = () => {
  const user: User = {
    name: "محمدرضا ماجد",
    nationalId: "0777235805",
    mobile: "09135551777",
    email: "",
    job: "",
    disability: "تعریف نشده",
  };

  return (
    <main className="w-full flex flex-col md:flex-row container mx-auto gap-6">
      <ProfileInfo user={user} />
    </main>
  );
};

export default PersonalInfoPage;
