self.addEventListener("install", (event) => {
  console.log("Установлен новый Service Worker.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Активирован новый Service Worker.");
  event.waitUntil(self.clients.claim());
});

// Переменная для хранения API URL
let apiUrl = "";

// Обработчик сообщений из основного приложения
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SET_API_URL") {
    apiUrl = event.data.apiUrl;
    console.log("API URL установлен:", apiUrl);
    console.log(event.data);
  }
});

self.addEventListener("push", (event) => {
  console.log(
    "Push-уведомление получено:",
    event.data ? event.data.text() : "Нет данных"
  );

  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    console.error("Ошибка при разборе данных push-уведомления:", e);
  }

  const title = data.title || "Новое уведомление";
  const options = {
    body: data.body,
    icon: `${apiUrl}${data.icon}`,
    data: {
      url: data.link, // URL для клика на уведомление
      messageId: data.messageId, // передаем идентификатор сообщения
    },
  };

  console.log(title, options);
  

  const notificationPromise = self.registration.showNotification(
    title,
    options
  );
  event.waitUntil(notificationPromise);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Закрываем уведомление
  const targetUrl = event.notification.data.url; // URL, который может быть как для браузера, так и для приложения

  event.waitUntil(
    (async () => {
      // Ищем уже открытые окна браузера с targetUrl
      const clientList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const client of clientList) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      
      // Если окно не найдено, пытаемся открыть URL
      // Если вы используете кастомную схему (например, myapp://),
      // ОС должна перенаправить в приложение, если оно установлено.
      // Если приложение не установлено, можно настроить fallback на веб-версию.
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })()
  );
});


// Закрытие уведомления
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLOSE_NOTIFICATION") {
    self.registration.getNotifications().then((notifications) => {
      notifications.forEach((notification) => {
        if (
          notification.data &&
          notification.data.messageId == event.data.messageId
        ) {
          console.log("Закрытие уведомления c id: ", event.data.messageId);
          
          notification.close(); // Закрытие уведомления
        }
      });
    });
  }
});
