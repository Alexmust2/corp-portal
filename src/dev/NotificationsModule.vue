<template>
  <v-container class="pb-16 pa-4">
    <template v-for="(group, dateKey) in groupedNotifications" :key="dateKey">
      <v-row justify="center" class="">
        <v-col cols="12">
          <div class="text-h6 text-center">{{ formatDate(dateKey) }}</div>
        </v-col>
      </v-row>
      <v-card
        v-for="notification in group"
        :key="notification.id"
        link
        :color="notification.read_status ? 'blue-grey-darken-4' : undefined"
        class="mb-4"
        elevation="6"
        v-intersect="{
          handler: (isIntersecting, entries, observer) =>
            onIntersect(isIntersecting, entries, observer, notification),
          options: {
            threshold: [1],
          },
        }"
      >
        <v-card-text>
          <div class="text-caption text-grey">
            {{ formatTime(notification.created_at) }}
          </div>
          <div class="text-h6 font-weight-bold mt-1">
            {{ notification.title }}
          </div>
          <div class="mt-2">{{ notification.message }}</div>
        </v-card-text>
      </v-card>
    </template>
  </v-container>

  <v-sheet class="position-fixed bottom-0 left-0 right-0">
    <v-divider></v-divider>
    <v-container class="d-flex justify-space-between">
      <span>
        Всего непрочитанных: {{ useNotificationsStore.unreadCount }}
      </span>
      <span
        class="text-decoration-underline"
        @click="markAllNotificationsAsRead()"
      >
        Прочитать все
      </span>
    </v-container>
  </v-sheet>
</template>

<script>
import { socket } from "@/websocket";
import { useUserStore } from "@/store/user.store";
import { useNotificationsStore } from "@/store/notifications.store";

export default {
  name: "NotificationsList",

  data() {
    return {
      notifications: [],
      useNotificationsStore: useNotificationsStore(),
    };
  },
  created() {
    socket.on("markNotificationAsRead", () => {});
    this.getAllUserNotifications();
    this.getUnreadedNotification();
  },
  computed: {
    authUser() {
      return useUserStore().user;
    },
    groupedNotifications() {
      const groups = {};
      this.notifications.forEach((notification) => {
        const date = notification.created_at.split("T")[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(notification);
      });

      const sortedGroups = Object.entries(groups).sort((a, b) =>
        b[0].localeCompare(a[0])
      );

      sortedGroups.forEach(([, groupNotifications]) => {
        groupNotifications.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      });

      return Object.fromEntries(sortedGroups);
    },
  },

  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { day: "2-digit", month: "long", year: "numeric" };
      return date.toLocaleDateString("ru-RU", options);
    },

    formatTime(created_at) {
      const date = new Date(created_at);
      return date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    onIntersect(isIntersecting, entries, observer, notification) {
      if (isIntersecting && !notification.read_status) {
        const targetNotification = this.notifications.find(
          (n) => n.id === notification.id
        );
        if (targetNotification) {
          targetNotification.read_status = true;
          this.useNotificationsStore.decrementUnreadCount();
          this.useNotificationsStore.newlyReadNotifications.push(
            notification.id
          );
        }
      }
    },

    async markAllNotificationsAsRead() {
      try {
        this.useNotificationsStore.markAllNotificationsAsRead(this.authUser.id);
      } catch (error) {
        console.error(
          "Ошибка при отметке всех уведомлений как прочитанных:",
          error
        );
      }
    },

    async getUnreadedNotification() {
      try {
        this.useNotificationsStore.fetchUnreadCount(this.authUser.id);
      } catch (error) {
        console.error(
          "Ошибка при получении количества непрочитанных уведомлений:",
          error
        );
      }
    },

    async getAllUserNotifications() {
      this.notifications = await this.$API.notificationApi.getById(
        this.authUser.id
      );
    },
  },
};
</script>

<style scoped>
.fixed-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: left;
}
</style>
