<template>
  <div :key="notificationsStore.notifications.length">
    <div class="notification" @click="isNotificationOpen = true">
      <div v-if="unreadNotificationsCount > 0" class="d-flex">
        <v-icon color="accent" class="bell"> mdi-bell</v-icon>
        <div class="unread-number">
          {{ unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount }}
        </div>
      </div>
      <div v-else class="d-flex">
        <v-icon color="secondary"> mdi-bell</v-icon>
      </div>
      <div v-if="!isMobile">Уведомления</div>
    </div>

    <c-slide-panel v-model="isNotificationOpen" :title="'Уведомления'">
      <template #header="{ closePanel }">
        <div class="header">
          <v-icon size="x-large" color="secondary" @click="closePanel">{{
            closeIcon
          }}</v-icon>
          <h2 class="title h1">Уведомления</h2>
          <v-icon
            size="small"
            color="secondary"
            @click="
              $router.push('/settings?tab=settings');
              isNotificationOpen = false;
            "
            >mdi-cog</v-icon
          >
        </div>

        <c-chip-group
          v-if="notificationsStore.notifications.length"
          v-model="selectedChips"
        >
          <c-chip v-for="tag in tags" :key="tag" :value="tag">
            {{ tag }}
          </c-chip>
        </c-chip-group>

        <div v-else class="notification-empty">
          <cAnimation animationName="notifications" class="animate" />
          <h2>Пока всё тихо</h2>
          <p>
            У вас нет новых уведомлений. Мы будем держать вас в курсе событий!
          </p>
        </div>
      </template>

      <div ref="notificationContainer" class="notificationContainer">
        <div
          v-for="(notification, index) in filteredNotifications"
          :key="notification.id"
          v-intersect="{
            handler: (isIntersecting, entries, observer) =>
              onIntersect(isIntersecting, entries, observer, notification),
            options: {
              threshold: [1],
            },
          }"
        >
          <div v-if="shouldShowDateSeparator(index)" class="date-stamp sm">
            {{ formatDate(notification.created_at) }}
          </div>
          <c-alert
            :time="new Date(notification.created_at).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })"
            :title="notification.title"
            :type="notification.status"
            :icon="notification.icon"
            :readed="notification.read_status"
            class="mb-5"
          >
            {{ notification.message }}
          </c-alert>
        </div>
      </div>

      <template #footer>
        <span
          v-if="filteredNotifications.length"
          class="read-all-button"
          @click="notificationsStore.readAllNotifications()"
          >Отметить все прочитанным</span
        >
      </template>
    </c-slide-panel>
  </div>
</template>

<script>
import autoAnimate from "@formkit/auto-animate";
import { useNotificationsStore } from "@/store/notifications.store";
export default {
  name: "c-notifications",
  data() {
    return {
      isNotificationOpen: false,
      selectedChips: "Все уведомления",
      tags: ["Все уведомления"],
      notifications: [
        {
          id: 5,
          title: "Новый запрос",
          message: "Запрос на доступ одобрен.",
          link: "/requests",
          tag: "Запросы",
          created_at: "2024-11-14 10:30:00",
          status: "info",
          icon: "mdi-check",
        },
      ],
    };
  },

  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    closeIcon() {
      return this.isMobile ? "mdi-chevron-left" : "mdi-close";
    },
    unreadNotificationsCount() {
      return this.notificationsStore.notifications.filter(
        (notification) => !notification.read_status
      ).length;
    },
    notificationsStore() {
      return useNotificationsStore();
    },
    filteredNotifications() {
      const filtered = this.notificationsStore.notifications
        .filter(
          (notification) =>
            this.selectedChips.length === 0 ||
            this.selectedChips.includes("Все уведомления") ||
            this.selectedChips.includes(notification.tag)
        )
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return filtered;
    },
  },
  methods: {
    onClickOutside() {
      this.isNotificationOpen = false;
    },
    shouldShowDateSeparator(index) {
      if (index === 0) return true;
      const currentDate = this.formatDateForComparison(
        this.filteredNotifications[index].created_at
      );
      const previousDate = this.formatDateForComparison(
        this.filteredNotifications[index - 1].created_at
      );
      return currentDate !== previousDate;
    },
    formatDateForComparison(dateString) {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    },
    async fetchTags() {
      const tags = await this.$API.notificationApi.getTags();
      const filteredTags = tags.filter((tag) => tag !== null);
      this.tags = ["Все уведомления", ...filteredTags];
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const today = new Date();

      const isSameDate = (d1, d2) => d1.toDateString() === d2.toDateString();

      if (isSameDate(date, today)) {
        return "Сегодня";
      }

      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (isSameDate(date, yesterday)) {
        return "Вчера";
      }

      if (date.getFullYear() === today.getFullYear()) {
        return date.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
        });
      }

      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
    onIntersect(isIntersecting, entries, observer, notification) {
      if (isIntersecting && !notification.read_status) {
        const targetNotification = this.notificationsStore.notifications.find(
          (n) => n.id === notification.id
        );
        if (targetNotification) {
          targetNotification.read_status = true;

          this.notificationsStore.decrementUnreadCount();
          this.notificationsStore.newlyReadNotifications.push(notification.id);
        }
      }
    },
  },
  watch: {
    isNotificationOpen(newValue) {
      if (newValue == false) {
        this.notificationsStore.readNotifications();
      }
    },
  },
  async mounted() {
    autoAnimate(this.$refs.notificationContainer);
    await this.fetchTags();
    await this.notificationsStore.fetchNotifications();
  },
  beforeUnmount() {
    this.notificationsStore.readNotifications();
  },
};
</script>

<style scoped lang="scss" src="./styles.scss" />
