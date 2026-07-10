import { FC } from "react";
import FavoriteList from "../../../../components/profile/favorites/FavoriteList";

// تایپ آیتم‌های مورد علاقه
interface FavoriteItem {
  title: string;
  image: string;
  colorCode: string;
  colorName: string;
  warranty: string;
  stock: string;
  price: number;
  discount: number | null;
}

const FavoritesPage: FC = () => {
  const items: FavoriteItem[] = [
    {
      id: 1,
      title: "گوشی موبایل سامسونگ مدل Galaxy A12",
      image: "/images/products/16.jpg",
      colorCode: "#CCCCCC",
      colorName: "توسی روشن",
      warranty: "گارانتی اصالت و سلامت فیزیکی کالا",
      stock: "کالا موجود در انبار",
      price: 3799000,
      discount: null,
    },
    {
      id: 2,
      title: "کیف رودوشی چرم جانتا مدل D078",
      image: "/images/products/18.jpg",
      colorCode: "#FFFF00",
      colorName: "زرد",
      warranty: "گارانتی اصالت و سلامت فیزیکی کالا",
      stock: "کالا موجود در انبار",
      price: 432000,
      discount: 313000,
    },
  ];

  return (
    <main className="w-full flex flex-col md:flex-row container mx-auto gap-6">
      <div className="w-full bg-white p-6 rounded-2xl shadow space-y-6 dark:bg-gray-900">
        <FavoriteList items={items} />
      </div>
    </main>
  );
};

export default FavoritesPage;
