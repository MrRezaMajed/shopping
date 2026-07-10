// این هوک وظیفه نگه‌داری آرایه آدرس‌ها، متدهای ارسال، مدیریت تغییر وضعیت‌ها و شرط ادامه فرآیند را بر عهده دارد

import { useState } from "react";
import { Address } from "@/components/checkout/delivery/AddressList";
import { DeliveryMethod } from "@/components/checkout/delivery/DeliveryMethods";

const INITIAL_ADDRESSES: Address[] = [
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
];

const DELIVERY_METHODS: DeliveryMethod[] = [
  { id: 1, title: "پست پیشتاز", time: "4 روز کاری آینده" },
  { id: 2, title: "تیپاکس", time: "2 روز کاری آینده" },
];

export function useCheckout() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryMethod | null>(null);

  const handleSelectAddress = (id: number) => {
    const found = addresses.find((addr) => addr.id === id);
    setSelectedAddress(found || null);
  };

  const handleSelectDelivery = (id: number) => {
    const found = DELIVERY_METHODS.find((method) => method.id === id);
    setSelectedDelivery(found || null);
  };

  const handleSaveAddress = (newAddress: Address) => {
    setAddresses((prev) => [...prev, newAddress]);
  };

  return {
    addresses,
    selectedAddress,
    selectedDelivery,
    deliveryMethods: DELIVERY_METHODS,
    handleSelectAddress,
    handleSelectDelivery,
    handleSaveAddress,
    canContinue: !!selectedAddress && !!selectedDelivery,
  };
}