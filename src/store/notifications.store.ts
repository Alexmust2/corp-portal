//@ts-nocheck
import { notificationApi } from "./../api/notification.api";
import { defineStore } from "pinia";
import { socket } from "@/websocket";
import { toast } from "vue3-toastify";
import { INotificationCreate } from "@/types/notification.interface";
import { useUserStore } from "./user.store";

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    unreadCount: 0,
    newlyReadNotifications: [],
    isSubscribed: false,
    notifications: [],
  }),

  getters: {
    getUnreadCount: (state) => {
      return state.unreadCount;
    },
    getIsSubscribed: (state) => {
      return state.isSubscribed;
    },
  },
  actions: {
    setUnreadCount(count: number) {
      this.unreadCount = count;
    },
    setIsSubscribed(isSubscribed: boolean) {
      this.isSubscribed = isSubscribed;
    },
    async subscribeToNotifications() {
      try {
        const registration = await navigator.serviceWorker.ready;

        // Проверяем, есть ли уже подписка
        const existingSubscription = await registration.pushManager.getSubscription();

        if (!existingSubscription) {
          const newSubscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(
              "BHEkL4gZYlxfsdGB9GvHoH2BtM8VFXtQhJM4Bz2yGwjA2n9Bl_XM4_nrknDUBpVo_7XdDZzYW6Wj032G937tDpg"
            ),
          });
          await notificationApi.subscribe({
            // @ts-ignore
            user_id: useUserStore().user.id,
            device_type: this.detectDeviceType(),
            subscription: newSubscription,
          });
        }
      } catch (error) {
        console.error("Ошибка при подписке на уведомления", error);
      }
    },
    detectDeviceType() {
      const userAgent = navigator.userAgent;
      if (/android/i.test(userAgent)) {
        return "android";
      } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        return "ios";
      } else if (/Windows/.test(userAgent)) {
        return "windows";
      } else if (/Mac/.test(userAgent)) {
        return "macos";
      } else {
        return "unknown";
      }
    },
    urlBase64ToUint8Array(base64String: string) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    },
    incrementUnreadCount() {
      this.unreadCount += 1;
      console.log("Unread count incremented:", this.unreadCount);
    },
    decrementUnreadCount() {
      this.unreadCount -= 1;
    },
    pushNewNotification(notification: INotification) {
      this.notifications.push(notification);
    },
    async readNotifications() {
      if (this.newlyReadNotifications.length > 0) {
        await notificationApi.read(this.newlyReadNotifications);
        this.newlyReadNotifications = [];
      }
    },
    sendToastWithoutCount(notificationData: INotificationCreate) {
      toast(
        `<strong>${notificationData.title}</strong><br>${notificationData.message}`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 10000,
          hideProgressBar: false,
          type: notificationData.status,
          transition: `slide`,
          dangerouslyHTMLString: true,
          theme: `dark`,
        }
      );
    },
    async readAllNotifications() {
      // @ts-ignore
      await notificationApi.readAll();
      this.fetchNotifications();
    },
    async fetchNotifications() {
      const response = await notificationApi.getAll();

      // @ts-ignore

      this.notifications = response;
    },
    async markNotificationsAsReadOnClose(userId: string | number) {
      if (this.newlyReadNotifications.length > 0) {
        try {
          await notificationApi.read(this.newlyReadNotifications);
          this.clearNewlyReadNotifications();
        } catch (error) {
          console.error(
            "Ошибка при отметке уведомлений как прочитанных:",
            error
          );
        }
      }
    },
  },
});
