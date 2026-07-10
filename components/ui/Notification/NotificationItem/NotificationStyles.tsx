// این کامپوننت وظیفه تعریف و تزریق انیمیشن‌های CSS مربوط به نمایش کارت و المان‌های آن را دارد.

export default function NotificationStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      /* ۱. انیمیشن باز شدن ژله‌ای/الاستیک سه بعدی (Liquid Jelly Spring) */
      @keyframes swal2-show-modern {
        0% { transform: scale3d(0.4, 0.4, 1) translateY(-12px); opacity: 0; filter: blur(4px); }
        40% { transform: scale3d(1.08, 0.88, 1); filter: blur(0); }
        65% { transform: scale3d(0.96, 1.04, 1); }
        82% { transform: scale3d(1.02, 0.98, 1); }
        100% { transform: scale3d(1, 1, 1) translateY(0); opacity: 1; }
      }
      .swal2-animate-toast-show-modern {
        animation: swal2-show-modern 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      /* ۲. انیمیشن بسته شدن جاذبه‌ای با افکت محوشدگی نرم */
      @keyframes swal2-hide-modern {
        0% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
        100% { transform: scale(0.9) translateY(12px); opacity: 0; filter: blur(6px); }
      }
      .swal2-animate-toast-hide-modern {
        animation: swal2-hide-modern 0.25s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
      }

      /* ۳. افکت نفس کشیدن هاله نوری نئونی در پشت کارت */
      @keyframes swal2-glow-breath {
        0%, 100% { transform: scale(0.95); opacity: 0.15; }
        50% { transform: scale(1.1); opacity: 0.25; }
      }

      /* ۴. انیمیشن حرکت روان و نئونی نوار پیشرفت */
      @keyframes swal2-progress-shrink {
        0% { width: 100%; }
        100% { width: 0%; }
      }

      /* ۵. انیمیشن رسم آیکون موفقیت */
      @keyframes swal2-draw-circle-anim {
        100% { stroke-dashoffset: 0; }
      }
      @keyframes swal2-draw-check-anim {
        100% { stroke-dashoffset: 0; }
      }
      .swal2-success-circle {
        animation: swal2-draw-circle-anim 0.4s ease-out forwards;
      }
      .swal2-success-check {
        animation: swal2-draw-check-anim 0.28s ease-out forwards;
        animation-delay: 0.25s;
      }

      /* ۶. انیمیشن رسم آیکون خطا و ضربدر */
      @keyframes swal2-draw-x-anim {
        100% { stroke-dashoffset: 0; }
      }
      .swal2-error-line-1 {
        animation: swal2-draw-x-anim 0.2s ease-out forwards;
        animation-delay: 0.15s;
      }
      .swal2-error-line-2 {
        animation: swal2-draw-x-anim 0.2s ease-out forwards;
        animation-delay: 0.28s;
      }

      /* ۷. لرزش فیزیکی آیکون خطا */
      @keyframes swal2-shake-anim {
        0%, 100% { transform: scale(1); }
        15%, 45%, 75% { transform: scale(1.05) rotate(-6deg); }
        30%, 60%, 90% { transform: scale(1.05) rotate(6deg); }
      }
      .swal2-error-container {
        animation: swal2-shake-anim 0.42s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        animation-delay: 0.42s;
      }

      /* ۸. پالس هشدار و پرش ظریف اطلاعات */
      @keyframes swal2-pulse-warning-anim {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.12); }
      }
      .swal2-warning-container {
        animation: swal2-pulse-warning-anim 0.6s ease-in-out;
      }

      @keyframes swal2-bounce-info-anim {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }
      .swal2-info-container {
        animation: swal2-bounce-info-anim 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
      }
    ` }} />
  );
}