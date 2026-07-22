// app/profile/addresses/page.tsx
import { FC } from "react";
import { getAddresses } from "@/app/actions/address";
import AddressClientContainer from "@/components/profile/addresses/AddressClientContainer";

const MyAddresses: FC = async () => {
  const initialAddresses = await getAddresses();

  return <AddressClientContainer initialAddresses={initialAddresses} />;
};

export default MyAddresses;