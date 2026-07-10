"use client";
import { useState } from "react";
import FavoriteItem from "./FavoriteItem";
import { FaHeartBroken } from "react-icons/fa";

type FavoriteProduct = {
  id: number | string;
  title: string;
  image: string;
  colorName: string;
  colorCode: string;
  warranty: string;
  stock: string;
  discount?: number;
  price: number;
};

type FavoriteListProps = {
  items: FavoriteProduct[];
};

export default function FavoriteList({ items }: FavoriteListProps) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>(items);

  const handleRemove = (id: number | string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 dark:text-slate-500 space-y-3">
        <FaHeartBroken className="text-4xl text-slate-300 dark:text-slate-700" />
        <p className="text-sm font-semibold">لیست علاقه‌مندی شما خالی است.</p>
      </div>
    );
  }

  return (
    <>
      {/* هدر مدرن با چیدمان خط راهنما */}
      <header className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-800/80 mb-8">
        <div className="w-1.5 h-6 bg-red-500 rounded-full" />
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
            لیست علاقه‌های من
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            محصولاتی که نشان کرده‌اید در این بخش نمایش داده می‌شوند
          </p>
        </div>
      </header>

      <div className="space-y-4">
        {favorites.map(item => (
          <FavoriteItem key={item.id} item={item} onRemoveAction={handleRemove} />
        ))}
      </div>
    </>
  );
}