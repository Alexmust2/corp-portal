<template>
  <v-app class="app" :class="{ 'no-header': !headerStore.visibility }">
    <div
       v-show="showOverlay && isMobile"
      class="overlay"
      :class="{ 'fade-out': !isSidebarOpen }"
      @click="closeSidebar"
    ></div>

    <aside class="sidebar" :class="{ open: isSidebarOpen }">
      <router-link to="/" class="logo" @click="closeSidebar">
        <img src="@/assets/logo2.svg" alt="" />
      </router-link>
      <span>Меню</span>
      <div class="router-list">
        <template v-for="link in processedLinks" :key="link.title">
          <div v-auto-animate>
            <!-- Родительская ссылка -->
            <router-link
              class="router-link"
              :to="link.route"
              :class="{
                'has-children': link.children && link.children.length > 0,
                active: isActiveLink(link),
              }"
              @click="onLinkClick(link)"
            >
              <div>
                <v-icon>{{ link.icon }}</v-icon>
                <span>{{ link.title }}</span>
              </div>
              <v-icon v-if="link.children && link.children.length > 0">
                {{ isExpanded(link) ? "mdi-chevron-up" : "mdi-chevron-down" }}
              </v-icon>
              <div
                v-if="
                  link?.showUnreadMessageCounter && unreadChatsCount > 0
                "
                class="unread-messages-counter"
              >
                <span class="unread-messages-counter">
                  {{
                    unreadChatsCount < 100 ? unreadChatsCount : "99+"
                  }}
                </span>
              </div>
            </router-link>

            <!-- Дочерние ссылки -->
            <div
              v-if="
                isExpanded(link) && link.children && link.children.length > 0
              "
              class="child-links"
            >
              <router-link
                v-for="child in link.children"
                :key="child.title"
                :to="child.route"
                class="child-link"
                :class="{ active: isActiveLink(child) }"
                @click="closeSidebar"
              >
                <div>
                  <v-icon>{{ child.icon }}</v-icon>
                  <span>{{ child.title }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </template>
      </div>

      <div class="sidebar-footer">
        <router-link
          to="/support"
          class="sidebar-footer-link sidebar-footer-error"
          @click="closeSidebar"
        >
          <v-icon>mdi-help-circle-outline</v-icon>
          <span>Нужна помощь?</span>
        </router-link>
        <router-link
          to="/auth"
          class="sidebar-footer-link sidebar-footer-logout"
          @click="logout"
        >
          <v-icon>mdi-logout</v-icon>
          <span>Выйти из аккаунта</span>
        </router-link>
      </div>
    </aside>

    <header class="header" v-if="headerStore.visibility">
      <div class="d-flex align-center ga-2">
        <v-icon icon="mdi-menu" @click="toggleSidebar" v-if="isMobile"></v-icon>
        <h2 class="mobile-title" v-if="isMobile">
          {{ $route.meta.title || "" }}
        </h2>
      </div>
      <c-btn
        v-if="
          headerStore.button && (!isMobile || headerStore.visibleButtonOnMobile)
        "
        @click="headerStore.button.onClick"
        size="sm"
        class="add-btn"
        :icon="isMobile ? 'mdi-plus' : null"
      >
        <span v-if="!isMobile">{{ headerStore.button.text }}</span>
      </c-btn>
      <div class="d-flex align-center ga-5 w-md-100 ga-md-6 justify-end">
        <div
          class="d-flex align-center cursor-pointer order-md-0 order-1"
          @click="$router.push('/settings')"
        >
          <cAvatar
            v-if="userStore.user"
            v-bind="getAvatarProps(userStore.user)"
            size="32"
            style="font-size: 14px"
          />
          <span class="ml-2" v-if="!isMobile && userStore.user"
            >{{ userStore.user.first_name || "" }}
            {{ userStore.user.last_name || "" }}</span
          >
        </div>
        <cNotifications />
      </div>
    </header>

    <v-main>
      <slot></slot>
    </v-main>
  </v-app>
</template>

<script>
import { useHeaderStore } from "@/store/header.store";
import cNotifications from "@/components/widgets/NotificationsModule";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { userHaveAnyPermission } from "@/globalFunctions/guardFunctions";
import { useUserStore } from "@/store/user.store";
import { getAvatarProps } from "@/globalFunctions/avatarUtils";
import { links } from "./routerList";
import { socket } from "@/websocket";
import { useUnreadMessagesStore } from "@/store/unreadMessages.store";

export default {
  name: "main-layout",
  components: {
    cNotifications,
  },
  directives: {
    autoAnimate: vAutoAnimate,
  },
  data() {
    return {
      links,
      isDarkTheme: false,
      isSidebarOpen: false,
      expandedMenuItems: {},
      showOverlay: false,
      unreadChatsCount: 0,
      unreadStore: useUnreadMessagesStore(),
    };
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    headerStore() {
      return useHeaderStore();
    },
    userStore() {
      return useUserStore();
    },
    processedLinks() {
      return this.links
        .map((link) => this.processLink(link))
        .filter((link) => link !== null);
    },
    unreadStoreCount() {
      return this.unreadStore.getUnreadCount;
    }

  },
  methods: {
    getAvatarProps,
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      if (this.isSidebarOpen) {
        this.showOverlay = true;
      } else {
        setTimeout(() => {
          this.showOverlay = false;
        }, 300); // Соответствует длительности анимации
      }
    },
    processLink(link) {
      // Clone the link to avoid mutating the original object
      let newLink = { ...link };
      if (newLink.children && newLink.children.length > 0) {
        let accessibleChildren = [];
        for (let child of newLink.children) {
          let processedChild = this.processLink(child);
          if (processedChild) {
            accessibleChildren.push(processedChild);
          }
        }

        if (accessibleChildren.length === 0) {
          return null;
        } else if (
          accessibleChildren.length === 1 &&
          (!newLink.route || newLink.route === "")
        ) {
          newLink.route = accessibleChildren[0].route;
          newLink.children = null;
        } else {
          newLink.children = accessibleChildren;
        }
      } else {
        if (newLink.permission && newLink.permission !== "") {
          if (
            !userHaveAnyPermission(this.userStore.user, [newLink.permission])
          ) {
            return null;
          }
        }
      }
      return newLink;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
      setTimeout(() => {
        this.showOverlay = false;
      }, 300); // Соответствует длительности анимации
    },
    onLinkClick(link) {
      if (link.children && link.children.length > 0) {
        if (!this.isExpanded(link) && !this.isMobile) {
          this.$router.push(link.children[0].route);
        }
        this.toggleExpand(link);
      }
      if (link.route) {
        this.closeSidebar();
        this.$router.push(link.route);
      }
    },
    toggleExpand(link) {
      if (link.children && link.children.length > 0) {
        this.expandedMenuItems = {
          ...this.expandedMenuItems,
          [link.title]: !this.isExpanded(link),
        };
      }
    },
    isExpanded(link) {
      return this.expandedMenuItems[link.title];
    },
    isActiveLink(link) {
      const linkRoute = this.normalizePath(link.route);
      const currentRoute = this.normalizePath(this.$route.path);

      if (link.children && link.children.length > 0) {
        return link.children.some((child) => this.isActiveLink(child));
      } else if (linkRoute) {
        if (currentRoute === linkRoute) {
          return true;
        } else if (
          link.matchPrefix &&
          currentRoute.startsWith(linkRoute + "/")
        ) {
          return true;
        }
      }
      return false;
    },
    normalizePath(path) {
      if (!path) return "";
      path = path.replace(/\/+$/, ""); // Remove trailing slashes
      return path || "/";
    },
    expandActiveMenus() {
      this.processedLinks.forEach((link) => {
        if (link.children && this.isActiveLink(link)) {
          this.expandedMenuItems[link.title] = true;
        }
      });
    },
    scrollToActiveLink() {
      this.$nextTick(() => {
        let activeLinkElement = this.$el.querySelector(
          ".child-link.active, .router-link.active"
        );
        if (activeLinkElement) {
          activeLinkElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });
    },
    async logout() {
      localStorage.removeItem("token");

      this.userStore.setUser(null);

      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      } catch (error) {
        console.error("Failed to unsubscribe from push notifications", error);
      }
    },

    handleNewMessageEvent() {
      this.fetchUnreadChats()
    },
    handleDeleteMessageEvent() {
      this.fetchUnreadChats()
    },
    async fetchUnreadChats() {
      try {
        const response = await this.$axios.get("/api/chats/unread");
        if (response.data) {
          this.unreadChatsCount = response.data.count;
        }
      } catch (error) {
        console.error(
          "Fate denies us the unread messages counter, which remain beyond reach.",
          error
        );
      }
    },
  },
  created() {
  socket.on("newMessage", () => this.handleNewMessageEvent());
  socket.on("messageDeleted", () => this.handleDeleteMessageEvent());
},
  watch: {
    isDarkTheme() {
      this.$vuetify.theme.global.name = this.isDarkTheme ? "dark" : "light";
    },
    $route() {
      this.expandActiveMenus();
      this.scrollToActiveLink();
    },
    unreadStoreCount() {
      this.fetchUnreadChats();
    },
  },
  mounted() {
    this.$vuetify.theme.global.name = this.isDarkTheme ? "dark" : "light";
    this.expandActiveMenus();
    this.scrollToActiveLink();
    this.fetchUnreadChats();
  },
};
</script>
<style lang="scss" src="./MainLayout.scss"></style>
