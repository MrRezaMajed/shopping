"use client";

import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface SideBannerProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  rotateDirection?: "clockwise" | "counterclockwise";
  priority?: boolean;
}

const SideBanner: FC<SideBannerProps> = ({ 
  src, 
  alt, 
  width, 
  height, 
  rotateDirection = "clockwise", 
  priority = false 
}) => {
  const isGif = src.endsWith(".gif");
  const rotationClass = rotateDirection === "clockwise" ? "group-hover:rotate-1" : "group-hover:-rotate-1";

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="
        group relative w-full 
        /* ارتفاع متناسب: روی موبایل که ۲ ستونه است کوتاه‌تر (h-28) و در تبلت و دسکتاپ بلندتر می‌شود */
        h-28 sm:h-44 md:h-[190px] lg:h-[238px] 
        overflow-hidden rounded-2xl border border-slate-100 dark:border-zinc-800/80 
        shadow-sm hover:shadow-md cursor-pointer bg-slate-50 dark:bg-zinc-900
      "
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized={isGif}
        sizes="(max-width: 768px) 50vw, 33vw"
        className={`rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105 ${rotationClass} dark:brightness-90`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default SideBanner;