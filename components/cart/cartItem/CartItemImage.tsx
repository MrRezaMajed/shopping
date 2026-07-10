// مسئول نمایش تصویر محصول

import Image from "next/image";

interface CartItemImageProps {
  src: string;
  alt: string;
}

export default function CartItemImage({ src, alt }: CartItemImageProps) {
  return (
    <div className="w-24 h-24 sm:w-28 sm:h-28 relative shrink-0 mx-auto sm:mx-0 bg-zinc-50 dark:bg-zinc-850/50 rounded-xl p-1 flex items-center justify-center border border-zinc-100 dark:border-zinc-800/40">
      <Image
        src={src}
        alt={alt}
        width={112}
        height={112}
        className="max-w-full max-h-full object-contain rounded-lg"
      />
    </div>
  );
}