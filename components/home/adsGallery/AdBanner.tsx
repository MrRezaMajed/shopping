"use client";

import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface AdBannerProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

const AdBanner: FC<AdBannerProps> = ({ src, alt, width, height, priority = false }) => {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-100 dark:border-zinc-900/80 shadow-sm hover:shadow-md cursor-pointer bg-slate-50 dark:bg-zinc-900"
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="rounded-2xl w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.015] dark:brightness-90"
      />
      {/* روکش گرادینت نیمه‌شفاف نئونی لبه پایینی */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default AdBanner;