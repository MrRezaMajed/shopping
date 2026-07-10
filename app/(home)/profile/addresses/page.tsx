'use client';
import { FC, useState } from "react";
import AddAddressButton from "../../../../components/profile/addresses/AddAddressButton";
import AddAddressModal from "../../../../components/profile/addresses/AddAddressModal";
import AddressList from "../../../../components/profile/addresses/AddressList";

// تایپ آدرس‌ها
interface Address {
  full: string;
  receiver: string;
  mobile: string;
  selected: boolean;
}

const MyAddresses: FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const addresses: Address[] = [
    {
      full: "تهران، خیابان حافظ، پلاک 3، واحد 4",
      receiver: "کامران محمدی",
      mobile: "09129998877",
      selected: true,
    },
    {
      full: "تهران، پاسداران، کوچه غلامی، پلاک 18، واحد 13",
      receiver: "کامران محمدی",
      mobile: "09129998877",
      selected: false,
    },
  ];

  return (
    <main className="w-full flex flex-col md:flex-row container mx-auto gap-6">
      <section className="w-full bg-white p-6 rounded-2xl shadow space-y-6 dark:bg-gray-900">
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold border-b-2 border-red-500">آدرس‌های من</h2>
        </header>

        <AddressList addresses={addresses} />

        <AddAddressButton onOpen={() => setOpenModal(true)} />
      </section>

      <AddAddressModal open={openModal} onClose={() => setOpenModal(false)} />
    </main>
  );
};

export default MyAddresses;
