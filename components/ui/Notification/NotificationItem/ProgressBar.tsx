// components/Notification/ProgressBar.tsx
import { NotificationType, progressGradients } from './constants';

interface ProgressBarProps {
  type: NotificationType;
  duration: number;
  isPaused: boolean;
}

export default function ProgressBar({ type, duration, isPaused }: ProgressBarProps) {
  return (
    <div className="absolute bottom-0 right-0 left-0 h-[2.5px] bg-slate-100/30 dark:bg-slate-800/10">
      <div
        className={`h-full ${progressGradients[type]}`}
        style={{
          animationName: 'swal2-progress-shrink',
          animationDuration: `${duration}ms`,
          animationTimingFunction: 'linear',
          animationFillMode: 'forwards',
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      />
    </div>
  );
}