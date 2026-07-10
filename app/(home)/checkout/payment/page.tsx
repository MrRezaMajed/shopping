import { FC } from "react";
import DiscountBox from "@/components/checkout/components/DiscountBox";
import CartSummary from "@/components/checkout/components/CartSummary";
import PaymentHeader from "./components/PaymentHeader"; // مسیر فایل هدر
import PaymentMethods from "./components/PaymentMethods"; // مسیر فایل روش‌های پرداخت

const PaymentPage: FC = () => {
  return (
    <div className="container mx-auto px-10 py-6">
      {/* هدر صفحه */}
      <PaymentHeader />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ستون اصلی سمت راست (محتوا و جزئیات پرداخت) */}
        <div className="flex-1 lg:w-3/4 space-y-6">
          <DiscountBox />
          <PaymentMethods />
        </div>

        {/* ستون سمت چپ (جمع‌بندی خرید) */}
        <div className="lg:w-1/4 w-full">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;