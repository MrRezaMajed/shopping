// components/confirm-modal/theme.tsx

import { ModalTheme } from './types';

export const getThemeColors = (type: 'warning' | 'error' | 'info' = 'warning'): ModalTheme => {
  switch (type) {
    case 'error':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/20',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-100 dark:border-rose-900/50',
        btn: 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20 text-white',
        icon: (
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        ),
      };
    case 'info':
      return {
        bg: 'bg-sky-50 dark:bg-sky-950/20',
        text: 'text-sky-600 dark:text-sky-400',
        border: 'border-sky-100 dark:border-sky-900/50',
        btn: 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/20 text-white',
        icon: (
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
    case 'warning':
    default:
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-100 dark:border-amber-900/50',
        btn: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white',
        icon: (
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      };
  }
};