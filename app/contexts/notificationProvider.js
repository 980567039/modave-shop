'use client';

import React, { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebase';


export const NotificationProvider = ({ children }) => {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    // Request notification permission
    const requestPermission = async () => {
      if ('Notification' in window) {
        const result = await Notification.requestPermission();
        setPermission(result);
      }
    };
    requestPermission();

    // Set up Firebase listener
    const notificationsRef = ref(database, 'notifications');
    
    const handleNewNotification = (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      // Get the latest notification
      const notifications = Object.values(data);
      const latestNotification = notifications[notifications.length - 1];

      if (permission === 'granted' && latestNotification) {
        new Notification(latestNotification.title, {
          body: latestNotification.body,
          icon: latestNotification.icon || '/icon.png', // Add your default icon path
          tag: latestNotification.id, // Prevent duplicate notifications
          data: latestNotification.data || {},
        });
      }
    };

    onValue(notificationsRef, handleNewNotification);

    // Cleanup
    return () => {
      off(notificationsRef);
    };
  }, [permission]);

  return <>{children}</>;
};
