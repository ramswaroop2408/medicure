export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope);
        })
        .catch((err) => {
          console.log('SW registration failed:', err);
        });
    });
  }
}

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return Promise.resolve('denied' as NotificationPermission);
  }
  return Notification.requestPermission();
}

export function showLocalNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/logo192.png',
          badge: '/logo192.png',
          ...options,
        });
      });
    } else {
      new Notification(title, {
        icon: '/logo192.png',
        ...options,
      });
    }
  }
}
