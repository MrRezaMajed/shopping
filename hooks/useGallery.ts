'use client';
import { useState } from 'react';

export function useGallery(images: string[] = []) {
  // مقدار اولیه selected با تابع تعیین می‌شود، بنابراین فقط یکبار اجرا می‌شود
  const [selected, setSelected] = useState<string | null>(() => images[0] || null);

  const changeImage = (src: string) => {
    if (src) setSelected(src);
  };

  return { selected, changeImage };
}
