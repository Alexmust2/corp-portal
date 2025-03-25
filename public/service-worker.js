// Обработчик события 'push'
self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Новое уведомление';
    const options = {
      body: data.body || 'У вас есть новые уведомления',
      icon: data.icon || '/img/icons/android-chrome-192x192.png', // Для Android
      // В iOS не поддерживаются кастомные иконки, используется иконка приложения
      badge: data.badge || '/img/icons/android-chrome-192x192.png', // Работает только на Android
      // iOS не поддерживает большие изображения
      image: data.image || '', // Убедитесь, что это свойство пустое для iOS
      vibrate: data.vibrate || [100, 50, 100], // Вибрация работает только на Android
      actions: [], // Действия не поддерживаются на iOS, поэтому пустой массив
      requireInteraction: false, // Это свойство игнорируется на iOS
      silent: data.silent || false, // Поддерживается
      dir: data.dir || 'auto', // Поддерживается
      timestamp: data.timestamp || Date.now(), // Поддерживается
      tag: data.tag || 'notification-group', // Работает на обоих платформах
      renotify: data.renotify || true, // Работает на обоих платформах
      data: {
        url: data.url || '/panel', // URL для клика на уведомление
      }
    };
  
    // Показываем уведомление
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });
  
  // Обработчик клика на уведомление
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
  
    // Действия при клике на уведомление
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windowClients => {
        for (const client of windowClients) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
    );
  });
  