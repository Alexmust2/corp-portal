<template>
  <div class="d-flex container settings-wrap">
    <div class="block navbar position-sticky" v-if="!isMobile">
      <div class="router-list">
        <template v-for="link in links" :key="link.title">
          <div v-role="link.permission || ''" v-auto-animate>
            <router-link
              class="router-link"
              :to="link.route"
              :class="{ active: isActiveLink(link) }"
            >
              <div>
                <v-icon>{{
                  isActiveLink(link) ? link.icon + "-outline" : link.icon
                }}</v-icon>
                <span>{{ link.title }}</span>
              </div>
            </router-link>
          </div>
        </template>
      </div>
    </div>
    <div class="settings_block ml-md-5">
      <component
        :is="currentComponent"
        @user-update="handlerUpdate($event)"
        @photo-update="handlerUpdatePhoto($event)"
        :user="user"
        class="settings-form"
      ></component>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/store/user.store";
import PersonalSettings from "./tabs/PersonalSettings.vue";
import SecuritySettings from "./tabs/SecuritySettings.vue";
import OtherSettings from "./tabs/OtherSettings.vue";
import MobileSettings from "./tabs/MobileSettings.vue";

export default {
  name: "settings-page",
  components: {
    PersonalSettings,
    SecuritySettings,
    OtherSettings,
    MobileSettings,
  },
  data() {
    return {
      user: {},
      currentTab: null,
      links: [
        {
          title: "Личные данные",
          icon: "mdi-account-cog",
          route: "/settings?tab=personal",
          tab: "personal",
        },
        {
          title: "Безопасность",
          icon: "mdi-lock",
          route: "/settings?tab=security",
          tab: "security",
        },
        {
          title: "Уведомления",
          icon: "mdi-bell",
          route: "/settings?tab=settings",
          tab: "settings",
        },
      ],
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    isMobile() {
      return this.$vuetify.display.smAndDown;
    },
    currentComponent() {
      switch (this.currentTab) {
        case "personal":
          return "PersonalSettings";
        case "security":
          return "SecuritySettings";
        case "settings":
          return "OtherSettings";
        default:
          return this.isMobile ? "MobileSettings" : "PersonalSettings";
      }
    },
  },
  created() {
    this.user = { ...this.userStore.user };
    this.currentTab = this.$route.query.tab || null;

    if (!this.isMobile && !this.currentTab) {
      this.$router.replace({ query: { tab: "personal" } });
      this.currentTab = "personal";
    }
  },
  watch: {
    "$route.query.tab"(newTab) {
      this.currentTab = newTab || null;
    },
  },
  methods: {
    isActiveLink(link) {
      return this.currentTab === link.tab;
    },
    handlerUpdate(updateUser) {
      this.user = { ...this.user, ...updateUser };
    },
    handlerUpdatePhoto(updatePhoto) {
      this.user.avatar = { ...this.user.avatar, ...updatePhoto };
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100%;
}

.navbar {
  width: 220px;
  height: 170px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  position: sticky;
  top: 0;
}

.settings_block {
  width: min(100%, 670px);
}
.settings-wrap {
  max-width: 100%;
}

@media screen and (max-width: 959px) {
  .settings_block {
    width: 100%;
  }
}

.navbar {
  padding: 12px;
}

.router-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-x: hidden;
  width: 100%;
}

.settings-form {
  min-height: 100%;
}

.router-link {
  display: flex;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid rgb(var(--v-theme-tertiary));
  gap: 8px;
  padding: 8px;
  font-size: 16px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  color: rgb(var(--v-theme-secondary));
  white-space: nowrap;
}

.router-link.active {
  color: rgb(var(--v-theme-white));
  background-color: rgb(var(--v-theme-accent));
  border-bottom-color: transparent;
  border-radius: 8px;
}

.router-link > div > i {
  margin-right: 8px;
}
</style>
