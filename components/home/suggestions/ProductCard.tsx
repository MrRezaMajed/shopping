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
        group relative min-h-[370px] flex flex-col justify-between overflow-hidden
        bg-white dark:bg-zinc-900/40
        border border-slate-100 dark:border-zinc-900/60
        rounded-3xl p-4
        shadow-sm hover:shadow-xl hover:border-brand-500/20 dark:hover:border-brand-500/30
        hover:shadow-brand-500/5 dark:hover:shadow-zinc-950/80
        transition-all duration-350
      "
    >
      <Link href={`/products/${product.id}`} className="flex-1 flex flex-col justify-between">
        <div>
          <div className="relative aspect-square w-full flex items-center justify-center rounded-2xl bg-slate-50/40 dark:bg-zinc-950/30 overflow-hidden">
            <Image
              src={product.img}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 220px"
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-108 group-hover:-rotate-2"
            />
          </div>

          <h3 className=" text-[13px] font-bold leading-6 line-clamp-2 text-slate-800 dark:text-zinc-200 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="mt-2.5 space-y-1">
          {product.oldPrice && product.discount && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-slate-400 dark:text-zinc-500 line-through font-medium">
                {product.oldPrice}
              </span>
              <span className="bg-brand-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-lg">
                {product.discount}
              </span>
            </div>
          )}
          
          <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
            {product.price}
          </p>

          {product.colors.length > 0 && (
            <div className="flex -space-x-1.5 space-x-reverse mt-2.5">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className="w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* دکمه علاقه مندی زنده و تعاملی */}
      <motion.button
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.preventDefault();
          setLiked(!liked);
        }}
        className={`
          absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center z-20
          bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border border-slate-200/50 dark:border-zinc-800/50 
          transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-sm
          ${liked ? "text-red-500" : "text-slate-400 hover:text-brand-500 dark:hover:text-brand-400"}
        `}
        aria-label="افزودن به علاقه‌مندی"
      >
        <FiHeart className={`text-xs ${liked ? "fill-current" : ""}`} />
      </motion.button>

      {/* نوار خرید کشویی پویا */}
      <div className="
        absolute bottom-0 left-0 right-0 p-3.5 bg-gradient-to-t from-white via-white to-white/95 
        dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900/95
        translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10
      ">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="
            w-full bg-brand-500 hover:bg-brand-600 text-white
            py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2
            transition duration-200 shadow-md shadow-brand-500/10
          "
        >
          <FiShoppingCart className="text-sm" />
          افزودن به سبد خرید
        </motion.button>
      </div>
    </article>
  );
};

export default ProductCard;