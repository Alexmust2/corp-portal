<template>
  <v-navigation-drawer
    id="drawer"
    @mouseenter="drawer = true"
    @mouseleave="drawer = false"
    app
    :rail="!drawer"
    :permanent="isMobile"
    style="background-color: #212121; color: #f2f2f2; padding: 0"
  >
    <v-list v-if="authUser" class="d-flex justify-space-between">
      <router-link :to="{ name: 'profile' }" style="width: 80%">
        <v-list-item
          :prepend-avatar="photo"
          :subtitle="authUser.email"
          :title="authUser.first_name"
        ></v-list-item>
      </router-link>
      <router-link :to="{ name: 'settings' }">
        <v-list-item>
          <v-list-item-action>
            <v-icon color="white" size="24px"> mdi-cog </v-icon>
          </v-list-item-action>
        </v-list-item>
      </router-link>
    </v-list>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-menu
        attach="#drawer"
        rounded
        v-model="showNotifications"
        :close-on-content-click="false"
        location="end"
      >
        <template v-slot:activator="{ props }">
          <v-list-item
            v-if="drawer"
            prepend-icon="mdi-bell"
            title="Уведомления"
            v-bind="props"
          >
            <template v-slot:append>
              <v-badge
                color="success"
                :content="notificationsStore.getUnreadCount"
                inline
              ></v-badge>
            </template>
          </v-list-item>
          <v-list-item v-else>
            <template v-slot:prepend>
              <v-badge
                v-if="notificationsStore.getUnreadCount > 0"
                color="success"
                :content="notificationsStore.getUnreadCount"
              >
                <v-icon icon="mdi-bell"></v-icon>
              </v-badge>
              <v-icon v-else icon="mdi-bell"></v-icon>
            </template>
          </v-list-item>
        </template>
        <v-card
          min-width="500"
          max-height="500"
          @mouseleave="showNotifications = false"
          @mouseenter="showNotifications = true"
        >
          <noti></noti>
        </v-card>
      </v-menu>

      <div :key="link.name" v-for="link in links">
        <router-link
          :to="link.route"
          v-if="link.perms ?? true"
          @click="link.action ? link.action() : null"
        >
          <v-list-item
            :prepend-icon="link.icon"
            :title="link.title"
            :value="link.name"
          ></v-list-item>
        </router-link>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import Noti from "./NotificationsModule.vue";
import { createSocketManager } from "@/websocket";
import { useUserStore } from "@/store/user.store";
import { useNotificationsStore } from "@/store/notifications.store";
import { userHavePermission } from "@/globalFunctions/guardFunctions";

export default {
  components: {
    Noti,
  },
  data() {
    return {
      drawer: false,
      socketManager: createSocketManager(),
      showNotifications: false,
      isMobile: window.innerWidth <= 960,
      links: [
        {
          name: "home",
          route: "/",
          icon: "mdi-home",
          title: "Главная",
        },
        {
          name: "users",
          route: "/users",
          icon: "mdi-account",
          title: "Пользователи",
        },
        {
          name: "articles",
          route: "/articles",
          icon: "mdi-file-document",
          title: "База знаний",
        },
        {
          name: "databases",
          route: "/admin/databases",
          icon: "mdi-database",
          title: "Таблицы баз данных",
        },
        {
          name: "panel",
          route: "/panel",
          icon: "mdi-space-invaders",
          title: "Админ-панель",
          perms: userHavePermission(useUserStore().user, "admin"),
        },
        {
          name: "calendar",
          route: "/calendar/room1",
          icon: "mdi-google-classroom",
          title: "Переговорки",
        },
        {
          name: "statements",
          route: "/statements",
          icon: "mdi-file-document",
          title: "Заявления",
        },
        {
          name: "test",
          route: "/test",
          icon: "mdi-file-document",
          title: "test",
        },
        {
          name: "screen",
          route: "/screen",
          icon: "mdi-monitor-screenshot",
          title: "Экраны",
        },
        {
          name: "auth",
          route: "/auth",
          icon: "mdi-logout",
          title: "Выйти",
          action: this.logout,
        },
      ],
    };
  },
  computed: {
    authUser() {
      return useUserStore().user;
    },
    notificationsStore() {
      return useNotificationsStore();
    },
    photo() {
      return process.env.VUE_APP_API_URL + "/api" + this.authUser.photo_path;
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.socketManager.reconnectSocket();
    },
  },
  watch: {
    showNotifications(newValue) {
      if (!newValue) {
        console.log("test", newValue);
        this.notificationsStore.markNotificationsAsReadOnClose(
          this.authUser.id
        );
      }
    },
  },
  created() {
    this.notificationsStore.fetchUnreadCount(this.authUser.id);
  },
};
</script>

<style lang="scss" scoped>
nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #ffffff;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
