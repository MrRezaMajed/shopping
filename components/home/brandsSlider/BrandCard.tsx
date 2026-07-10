// کارت تکی و تعاملی هر برند (انیمیشن‌دار)

"use client";

import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface BrandCardProps {
  src: string;
  index: number;
}

const BrandCard: FC<BrandCardProps> = ({ src, index }) => {
  return (
    <div className="flex justify-center p-1.5">
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href="#"
        aria-label={`برند ${index + 1}`}
        className="
          relative block w-[100px] h-[100px] rounded-2xl bg-white dark:bg-zinc-900 
          border border-slate-100 dark:border-zinc-800/80 shadow-sm hover:shadow-md 
          transition-all duration-300 p-2 overflow-hidden flex items-center justify-center group
        "
      >
        <div className="relative w-16 h-16 transition-transform duration-300 group-hover:scale-105">
          <Image
            src={src}
            alt={`برند ${index + 1}`}
            fill
            sizes="64px"
            className="object-contain dark:brightness-110"
          />
        </div>
      </motion.a>
    </div>
  );
};

export default BrandCard;