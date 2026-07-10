// components/confirm-modal/types.ts

import { ReactNode } from 'react';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'error' | 'info';
}

export interface ConfirmModalProps {
  options: ConfirmOptions;
  onClose: (result: boolean) => void;
}

export interface ModalTheme {
  bg: string;
  text: string;
  border: string;
  btn: string;
  icon: ReactNode;
}