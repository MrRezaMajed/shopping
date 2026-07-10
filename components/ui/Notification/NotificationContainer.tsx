'use client';

import { Notification } from '@/context/NotificationContext';
import NotificationItem from './NotificationItem/NotificationItem';

interface ContainerProps {
  notifications: Notification[];
}

export default function NotificationContainer({ notifications }: ContainerProps) {
  return (
    <div 
      dir="rtl" 
      className="fixed top-5 right-5 z-50 flex flex-col gap-3.5 w-full max-w-sm pointer-events-none"
    >
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}