import AddressItem from "./AddressItem";

type Address = {
  full: string;
  receiver: string;
  mobile: string;
  selected?: boolean;
};

type AddressListProps = {
  addresses: Address[];
};

export default function AddressList({ addresses }: AddressListProps) {
  return (
    <section className="space-y-4">
      {addresses.map((item, index) => (
        <AddressItem key={index} address={item} />
      ))}
    </section>
  );
}