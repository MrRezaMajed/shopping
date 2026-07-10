// بخش کارت‌های ویژگی متمایز خرید

"use client";

import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Feature {
  img: string;
  text: string;
}

const features: Feature[] = [
  { img: "/images/footer/1.png", text: "امکان تحویل اکسپرس" },
  { img: "/images/footer/2.png", text: "امکان پرداخت در محل" },
  { img: "/images/footer/3.png", text: "۷ روز هفته، ۲۴ ساعته" },
  { img: "/images/footer/4.png", text: "۷ روز ضمانت بازگشت" },
  { img: "/images/footer/5.png", text: "ضمانت اصل بودن کالا" },
];

const FooterFeatures: FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-center items-center border-b border-slate-200/40 dark:border-zinc-900/50 pb-8 mb-8">
      {features.map((item, idx) => (
        <motion.div 
          key={idx} 
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/10 hover:bg-white dark:hover:bg-zinc-900/35 border border-transparent hover:border-slate-150 dark:hover:border-zinc-800/60 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
        >
          <div className="relative w-14 h-14 mb-3 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={item.img}
              fill
              alt={item.text}
              className="object-contain"
            />
          </div>
          <span className="text-[11px] font-extrabold text-slate-600 dark:text-zinc-400 transition-colors group-hover:text-slate-800 dark:group-hover:text-zinc-200">
            {item.text}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default FooterFeatures;