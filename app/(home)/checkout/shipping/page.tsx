'use client';
import { FC } from "react";
import AddressList from "@/components/checkout/delivery/AddressList";
import DeliveryMethods from "@/components/checkout/delivery/DeliveryMethods";
import CheckoutSummary from "@/components/checkout/delivery/CheckoutSummary";
import { CheckoutHeader } from "./components/CheckoutHeader";
import { useCheckout } from "./hooks/useCheckout";

const CheckoutPage: FC = () => {
  const {
    addresses,
    selectedAddress,
    selectedDelivery,
    deliveryMethods,
    handleSelectAddress,
    handleSelectDelivery,
    handleSaveAddress,
    canContinue,
  } = useCheckout();

  return (
    <section className="container mx-auto p-2" dir="rtl">
      {/* سربرگ عنوان صفحه */}
      <CheckoutHeader />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 mt-6">
        {/* بخش اصلی راست */}
        <div className="md:col-span-9 space-y-4">
          <AddressList
            addresses={addresses}
            selected={selectedAddress ? selectedAddress.id : null}
            onSelect={handleSelectAddress}
            onSave={handleSaveAddress}
          />

          <DeliveryMethods
            methods={deliveryMethods}
            selected={selectedDelivery ? selectedDelivery.id : null}
            onSelect={handleSelectDelivery}
          />
        </div>

        {/* سایدبار چپ */}
        <div className="md:col-span-3">
          <CheckoutSummary
            cartPrice={398000}
            discount={78000}
            shipping={54000}
            total={398000 - 78000 + 54000}
            canContinue={canContinue}
          />
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;