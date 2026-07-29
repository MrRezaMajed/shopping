// components/confirm-modal/types.ts

import { ReactNode } from 'react';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'error' | 'danger' | 'info' | 'success';
}

export interface ConfirmModalProps {
  options: ConfirmOptions;
  onClose: (result: boolean) => void;
}

export interface ModalTheme {
  type: 'warning' | 'error' | 'danger' | 'info' | 'success';
  cardBg: string;       // پس‌زمینه اصلی کارت
  bg: string;           // پس‌زمینه کانتینر آیکون
  text: string;         // رنگ متن آیکون
  border: string;       // حاشیه دور آیکون
  titleText: string;    // رنگ تایتل هدر
  messageText: string;  // رنگ توضیحات هدر
  btn: string;          // استایل دکمه تایید
  cancelBtn: string;    // استایل دکمه انصراف
  icon: ReactNode;      // آیکون مربوط به تم
}