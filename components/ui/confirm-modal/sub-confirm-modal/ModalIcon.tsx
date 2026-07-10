
import { ModalTheme } from '../types';

interface ModalIconProps {
  theme: ModalTheme;
}

export default function ModalIcon({ theme }: ModalIconProps) {
  return (
    <div 
      className={`
        flex items-center justify-center p-4 rounded-full border mb-4 
        ${theme.bg} ${theme.text} ${theme.border}
      `}
    >
      {theme.icon}
    </div>
  );
}