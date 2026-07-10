"use client";
import { FaEdit } from "react-icons/fa";

type UserInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  nationalCode: string;
};

const USER_INFO: UserInfo = {
  firstName: "کامران",
  lastName: "محمدی",
  phone: "09125468734",
  email: "hassan.khosrojerdi@gmail.com",
  nationalCode: "6748392849",
};

export default function ProfileInfo() {
  return (
    <main className="w-full">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow dark:shadow-gray-900/40">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            اطلاعات حساب
          </h2>
        </div>

        {/* Edit Button */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            className="flex items-center text-blue-600 dark:text-blue-400
              hover:text-blue-700 dark:hover:text-blue-300 text-sm"
          >
            <FaEdit className="ml-2" />
            ویرایش حساب
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm">
                <th className="p-3 text-right">عنوان</th>
                <th className="p-3 text-right">مقدار</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              <InfoRow label="نام" value={USER_INFO.firstName} />
              <InfoRow label="نام خانوادگی" value={USER_INFO.lastName} />
              <InfoRow label="شماره موبایل" value={USER_INFO.phone} />
              <InfoRow label="ایمیل" value={USER_INFO.email} />
              <InfoRow label="کد ملی" value={USER_INFO.nationalCode} />
              <InfoRow label="رمز عبور" value="---" />
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <tr>
      <td className="p-3 text-gray-500 dark:text-gray-300">{label}</td>
      <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
        {value}
      </td>
    </tr>
  );
}
