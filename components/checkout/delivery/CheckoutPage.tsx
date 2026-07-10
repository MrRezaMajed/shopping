'use client';
import { useState } from "react";
import AddressList, { Address } from "./AddressList";
import DeliveryMethods, { DeliveryMethod } from "./DeliveryMethods";
import CheckoutSummary from "./CheckoutSummary";

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      address: "تهران، خیابان حافظ، پلاک 3، واحد 4",
      receiver: "کامران محمدی",
      mobile: "09129998877",
    },
    {
      id: 2,
      address: "تهران، پاسداران، کوچه غلامی، پلاک 18",
      receiver: "کامران محمدی",
      mobile: "09129998877",
    },
  ]);

  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<number | null>(null);

  const deliveryMethods: DeliveryMethod[] = [
    { id: 1, title: "پست پیشتاز", time: "4 روز کاری آینده" },
    { id: 2, title: "تیپاکس", time: "2 روز کاری آینده" },
  ];

  return (
    <section className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* بخش اصلی راست */}
          <div className="md:col-span-9 space-y-6">
            <AddressList
              addresses={addresses}
              selected={selectedAddress}
              onSelect={setSelectedAddress}
              onSave={(newAddress) =>
                setAddresses((prev) => [...prev, newAddress])
              }
            />

            <DeliveryMethods
              methods={deliveryMethods}
              selected={selectedDelivery}
              onSelect={setSelectedDelivery}
            />
          </div>

          {/* سایدبار چپ */}
          <div className="md:col-span-3">
            <div className="sticky top-6">
              <CheckoutSummary
                cartPrice={398000}
                discount={78000}
                shipping={54000}
                total={398000 - 78000 + 54000}
                canContinue={!!selectedAddress && !!selectedDelivery}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}