"use client";

import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";
import { Product } from "./suggestions-data";

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const [liked, setLiked] = useState(false);

  return (
    <article
      className="
        group relative min-h-[360px] max-w-[260px] w-full mx-auto flex flex-col justify-between overflow-hidden
        bg-white dark:bg-zinc-900/30
        border border-slate-100 dark:border-zinc-800/30
        rounded-[22px] p-4.5
        shadow-[0_2px_8px_rgba(0,0,0,0.015)]
        hover:shadow-[0_15px_35px_rgba(0,0,0,0.05)] 
        dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.25)]
        hover:border-brand-500/15 dark:hover:border-brand-500/25
        transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
      "
    >
      <Link href={`/products/${product.id}`} className="flex-1 flex flex-col justify-between">
        <div>
          {/* کادر عکس محصول به تناسب ابعاد جدید کارت */}
          <div className="relative aspect-square w-full flex items-center justify-center rounded-[16px] bg-slate-50/70 dark:bg-zinc-950/40 overflow-hidden">
            <div className="relative w-[75%] h-[75%] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105">
              <Image
                src={product.img}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 180px"
                className="object-contain"
              />
            </div>
          </div>

          {/* عنوان محصول با خوانایی و فاصله مناسب */}
          <h3 className="mt-4 text-[13px] font-bold leading-5.5 line-clamp-2 text-slate-800 dark:text-zinc-200 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors duration-200">
            {product.name}
          </h3>
        </div>

        {/* بخش قیمت و رنگ‌بندی دلباز */}
        <div className="mt-3 space-y-1.5">
          {product.oldPrice && product.discount && (
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[11px] text-slate-400 dark:text-zinc-500 line-through font-medium">
                {product.oldPrice}
              </span>
              <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {product.discount}
              </span>
            </div>
          )}
          
          <p className="text-[14px] font-black text-emerald-600 dark:text-emerald-400">
            {product.price}
          </p>

          {product.colors.length > 0 && (
            <div className="flex -space-x-1.5 space-x-reverse pt-0.5">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className="w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* دکمه علاقه‌مندی شناور */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setLiked(!liked);
        }}
        className={`
          absolute top-3.5 left-3.5 w-8.5 h-8.5 rounded-full flex items-center justify-center z-20
          bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-slate-200/40 dark:border-zinc-800/40 
          shadow-sm opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100
          transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
          ${liked ? "text-rose-500" : "text-slate-450 hover:text-rose-500"}
        `}
        aria-label="افزودن به علاقه‌مندی"
      >
        <FiHeart className={`text-xs transition-transform duration-200 active:scale-75 ${liked ? "fill-current" : ""}`} />
      </button>

      {/* دکمه خرید کشویی */}
      <div className="
        absolute bottom-0 left-0 right-0 p-3 pt-6
        bg-gradient-to-t from-white via-white/95 to-transparent
        dark:from-zinc-900 dark:via-zinc-900/95 dark:to-transparent
        translate-y-4 opacity-0 pointer-events-none
        group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto
        transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-10
      ">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="
            w-full bg-brand-500 hover:bg-brand-600 text-white
            py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5
            transition-colors duration-250 shadow-md shadow-brand-500/10
          "
        >
          <FiShoppingCart className="text-xs" />
          افزودن به سبد خرید
        </motion.button>
      </div>
    </article>
  );
};

export default ProductCard;