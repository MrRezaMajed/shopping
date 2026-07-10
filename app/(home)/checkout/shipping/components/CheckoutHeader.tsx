import { FC } from "react";

export const CheckoutHeader: FC = () => {
  return (
    <div className="px-6 mt-6 text-right">
      <h2 className="text-lg font-bold border-b-2 border-red-500 pb-2 text-slate-800 dark:text-slate-100">
        تکمیل اطلاعات ارسال کالا (آدرس گیرنده، مشخصات گیرنده، نحوه ارسال)
      </h2>
    </div>
  );
};