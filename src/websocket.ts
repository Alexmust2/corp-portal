// @ts-nocheck
import io, { Socket } from "socket.io-client";
import { useUserStore } from "./store/user.store";
import { useNotificationsStore } from "./store/notifications.store";
import { toast } from "vue3-toastify";
import pinia from "./store";

interface NotificationDataProps {
  title: string;
  message: any;
  status: any;
  // TODO
}

let socket: Socket | null = null;

export function createSocketManager() {
  const userStore = useUserStore(pinia);

  return {
    async connectSocket() {
      await userStore.getUserByToken();
      // @ts-ignore
      const userId = userStore.user?.id;

      socket = io(process.env.VUE_APP_API_URL as string, {
        path: "/api/socket.io",
        query: { userId },
      });

      socket.on("connect", () => {
        console.log("WebSocket connected");
        this.setupSocketListeners();
      });

      socket.on("error", (error) => {
        console.error("WebSocket error: ", error);
      });

      socket.on("disconnect", (reason) => {
        console.log(`WebSocket disconnected: ${reason}`);
        if (reason === "io server disconnect") {
          this.connectSocket();
        }
      });

      return socket;
    },

    disconnectSocket() {
      if (socket) {
        socket.disconnect();
        console.log("WebSocket manually disconnected");
      }
    },

    reconnectSocket() {
      if (socket) {
        this.disconnectSocket();
        this.connectSocket();
      }
    },

    setupSocketListeners() {
      if (!socket) return;
      socket.on("messageRead", (data) => {
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: "CLOSE_NOTIFICATION",
              messageId: data.messageId, // Идентификатор сообщения
            });
        }
      });
      socket.on("sendNotification", async (NewNotificationData: any) => {
        const notificationsStore = useNotificationsStore(pinia);
        notificationsStore.pushNewNotification(NewNotificationData);
        // @ts-ignore
        if (notificationsStore.isSubscribed) {
          // notificationsStore.incrementUnreadCount();
          // if ("serviceWorker" in navigator && "PushManager" in window) {
          //   try {
          //     const registration = await navigator.serviceWorker.ready;

          //     await registration.showNotification(NewNotificationData.title, {
          //       body: NewNotificationData.message,
          //       icon: "/img/icons/android-chrome-192x192.png",
          //       data: { url: window.location.origin },
          //     });
          //   } catch (error) {
          //     console.error("Ошибка при отправке уведомления:", error);
          //     this.showToastNotification(NewNotificationData);
          //   }
          // } else {
          this.showToastNotification(NewNotificationData);
          // }
        }
      });
    },

    showToastNotification(NotificationData: NotificationDataProps) {
      toast(
        `<strong>${NotificationData.title}</strong><br>${NotificationData.message}`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 10000,
          hideProgressBar: false,
          type: NotificationData.status,
          transition: `slide`,
          dangerouslyHTMLString: true,
          theme: `dark`,
        }
      );
    },
  };
}

export { socket };
