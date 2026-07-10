// این هوک به طور کامل منطق تغییر تعداد، حذف محصولات و نگه‌داری وضعیت را از لایه رابط کاربری جدا می‌کند

import { useState } from "react";

export interface CartItemType {
  id: number;
  title: string;
  color?: string;
  colorName?: string;
  warranty?: string;
  stock: number;
  price: number;
  discount?: number;
  img: string;
  count: number;
}

const INITIAL_CART_ITEMS: CartItemType[] = [
  {
    id: 1,
    title: "کتاب اثر مرکب نوشته دارن هاردی",
    color: "#523e02",
    colorName: "قهوه‌ای",
    warranty: "گارانتی اصالت و سلامت فیزیکی کالا",
    stock: 5,
    price: 56000,
    img: "/images/products/1.jpg",
    count: 1,
  },
  {
    id: 2,
    title: "دستگاه آبمیوه گیری دنویر با کد 1016",
    color: "#523e02",
    colorName: "قهوه‌ای",
    warranty: "گارانتی اصالت و سلامت فیزیکی کالا",
    stock: 5,
    price: 264000,
    discount: 78000,
    img: "/images/products/2.jpg",
    count: 1,
  },
];

export function useCart() {
  const [items, setItems] = useState<CartItemType[]>(INITIAL_CART_ITEMS);

  const updateCount = (id: number, type: "up" | "down") => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (type === "up" && item.count < item.stock)
            return { ...item, count: item.count + 1 };
          if (type === "down" && item.count > 1)
            return { ...item, count: item.count - 1 };
        }
        return item;
      })
    );
  };

  const deleteItem = (id: number) =>
    setItems((prev) => prev.filter((x) => x.id !== id));

  return {
    items,
    updateCount,
    deleteItem,
    isEmpty: items.length === 0,
  };
}