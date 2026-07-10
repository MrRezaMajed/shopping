// مسئول ایجاد افکت هاله رنگی نئونی (Ambient Glow) متناسب با نوع خطا یا موفقیت کارت است.

import { NotificationType, glowColors } from './constants';

interface AmbientGlowProps {
  type: NotificationType;
}

export default function AmbientGlow({ type }: AmbientGlowProps) {
  return (
    <div 
      className="absolute -inset-4 -z-10 rounded-2xl filter blur-2xl opacity-15 dark:opacity-25 transition-opacity duration-300 group-hover:opacity-35"
      style={{ 
        backgroundColor: glowColors[type],
        animation: 'swal2-glow-breath 3s ease-in-out infinite'
      }}
    />
  );
}