"use client";
import React, { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: string;
  href?: string;
}

const cartItems: CartItem[] = [
  {
    id: 1,
    name: "کتاب اثر مرکب اثر دارن هاردی انتشارات معیار علم",
    image: "/images/products/1.jpg",
    price: "663,000 تومان",
    href: "#",
  },
  {
    id: 2,
    name: "دستگاه آبمیوه گیری دنویر با کد 1016",
    image: "/images/products/2.jpg",
    price: "663,000 تومان",
    href: "#",
  },
];

const CartDropdown: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const totalAmount = "1,326,000 تومان";

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* دکمه سبد خرید با پالس نوری */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-slate-200/40 dark:border-zinc-800/60 text-slate-700 hover:text-slate-900 dark:text-zinc-200 dark:hover:text-zinc-100 transition-colors duration-300"
      >
        <FaShoppingCart className="text-base" />
        <AnimatePresence>
          {cartItems.length > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.15, 1] }}
              exit={{ scale: 0 }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white dark:ring-zinc-950 shadow-md shadow-red-500/20"
            >
              {cartItems.length}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* منوی افتادنی کارت هوشمند */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 25 }}
            className="absolute left-0 mt-2 w-80 bg-white dark:bg-zinc-950/95 backdrop-blur-2xl border border-slate-150/80 dark:border-zinc-800/80 shadow-2xl dark:shadow-[0_25px_50px_rgba(0,0,0,0.5)] rounded-2xl z-50 overflow-hidden origin-top-left"
          >
            {/* هدر */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-900 px-4 py-3.5 bg-slate-50/20 dark:bg-zinc-950/20">
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">{cartItems.length} کالا در سبد خرید</span>
              <Link href="/cart" className="text-xs font-extrabold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                مشاهده سبد خرید
              </Link>
            </div>

            {/* لیست آیتم‌ها به صورت زنجیره‌ای */}
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.05 } }
              }}
              className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-900"
            >
              {cartItems.map((item) => (
                <motion.div 
                  key={item.id} 
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    show: { opacity: 1, x: 0 }
                  }}
                  className="flex items-center gap-3 p-4 hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors group/item"
                >
                  <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden border border-slate-100 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover/item:scale-105"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={item.href || "#"}
                      className="block text-xs font-bold text-slate-800 dark:text-zinc-200 hover:text-red-500 dark:hover:text-red-400 truncate mb-1"
                    >
                      {item.name}
                    </Link>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-zinc-100">{item.price}</span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <FaTrashAlt className="text-xs" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>

            {/* فوتر */}
            <div className="flex justify-between items-center bg-slate-50/60 dark:bg-zinc-900/30 border-t border-slate-100 dark:border-zinc-900/80 px-4 py-4 rounded-b-2xl">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold">مبلغ قابل پرداخت</span>
                <span className="text-sm font-black text-slate-900 dark:text-zinc-50">{totalAmount}</span>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/cart"
                  className="block bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-red-500/10"
                >
                  ثبت نهایی سفارش
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartDropdown;