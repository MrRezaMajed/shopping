"use client";
import CartItem from "../cartItem/CartItem";
import CartEmptyState from "./CartEmptyState";
import { useCart } from "./hooks/useCart";

export default function CartList() {
  const { items, updateCount, deleteItem, isEmpty } = useCart();

  // اگر سبد خرید خالی شد، کامپوننت وضعیت خالی نمایش داده می‌شود
  if (isEmpty) {
    return <CartEmptyState />;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          updateCount={updateCount}
          deleteItem={deleteItem}
        />
      ))}
    </div>
  );
}