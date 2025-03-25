<template>
  <component :is="currentLayout">
    <router-view />
  </component>
</template>

<script>
import "vue3-toastify/dist/index.css";
import { createSocketManager } from "./websocket.ts";
import mainLayout from "./components/layouts/MainLayout.vue";
import noLayout from "./components/layouts/NoLayout.vue";
import { useUserStore } from "./store/user.store";
import { userHavePermission } from "./globalFunctions/guardFunctions";
import { useNotificationsStore } from "./store/notifications.store";

export default {
  data() {
    return {
      currentLayout: noLayout,
    };
  },
  components: {
    mainLayout,
    noLayout,
  },
  mounted() {
    this.initializeSocket();
  },
  beforeMount() {
    window.addEventListener("beforeunload", () => {
      useNotificationsStore().readNotifications();
    });
  },
  computed: {
    user() {
      return useUserStore().user;
    },
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
  },
  beforeCreate() {
    this.currentLayout = this.$route.name === "auth" ? noLayout : mainLayout;
  },
  methods: {
    initializeSocket() {
      console.log("Socket initialized");
      const socketManager = createSocketManager();
      socketManager.connectSocket();
    },
    setLayout() {
      const isAuthRoute = this.$route.name === "auth";
      const hasToken = !!localStorage.getItem("token");
      const passwordSet = this.user?.password;

      if (isAuthRoute || (hasToken && !passwordSet)) {
        this.currentLayout = noLayout;
      } else {
        this.currentLayout = mainLayout;
      }
    },
    handleClick(event) {
      if (userHavePermission(useUserStore().user, "trolling")) {
        const element = event.target;
        element.style.transform = "rotate(3deg)";
      }
    },
  },
  beforeUnmount() {
    useNotificationsStore().readNotifications();
  },
  watch: {
    $route(to) {
      this.setLayout(to);
    },
  },
};
</script>

<style lang="scss" src="./styles.scss"></style>
