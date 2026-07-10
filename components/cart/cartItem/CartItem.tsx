"use client";

import CartItemImage from "./CartItemImage";
import CartItemDetails from "./CartItemDetails";
import CartItemPrice from "./CartItemPrice";
import Counter from "./Counter";

interface CartItemProps {
  item: {
    id: number;
    title: string;
    img: string;
    color?: string;
    colorName?: string;
    warranty?: string;
    stock: number;
    count: number;
    price: number;
    discount?: number;
  };
  updateCount: (id: number, action: "up" | "down") => void;
  deleteItem: (id: number) => void;
}

export default function CartItem({ item, updateCount, deleteItem }: CartItemProps) {
  return (
    <div
      className="
        bg-white dark:bg-zinc-900
        p-5 rounded-2xl
        shadow-sm hover:shadow-md
        border border-zinc-150 dark:border-zinc-800/80
        flex flex-col sm:flex-row gap-5 relative
        transition-all duration-300
      "
    >
      <CartItemImage src={item.img} alt={item.title} />

      <div className="flex-1 flex flex-col justify-between gap-4">
        <CartItemDetails
          title={item.title}
          color={item.color}
          colorName={item.colorName}
          warranty={item.warranty}
        />

        <div>
          <Counter
            count={item.count}
            stock={item.stock}
            onInc={() => updateCount(item.id, "up")}
            onDec={() => updateCount(item.id, "down")}
            onDelete={() => deleteItem(item.id)}
          />
        </div>
      </div>

      <CartItemPrice price={item.price} discount={item.discount} />
    </div>
  );
}