<template>
  <c-form :contentPadding="20" :footerPadding="0" headerPadding="20">
    <template #header>
      <div class="header-block px-5">
        <v-icon size="x-large" color="secondary" @click="$router.go(-1)"
          >mdi-chevron-left</v-icon
        >
        <h1 class="h1 ma-auto">Профиль</h1>
      </div>
    </template>

    <div class="profile-info">
      <cAvatar
        v-bind="getAvatarProps(userStore.user)"
        :showStatus="false"
        size="120"
        @click="triggerFileInput"
        :preview_photo="avatarSrc"
      />
      <p class="text-center mt-3 cursor-pointer" @click="triggerFileInput">
        Сменить фото
      </p>
      <p class="text-center mt-3 cursor-pointer" style="color: rgb(var(--v-theme-red)" @click="deletePhoto">
        Удалить
      </p>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="uploadPhoto"
        style="display: none"
      />
    </div>

    <div class="router-list mobile-router-list">
      <template v-for="link in links" :key="link.title">
        <div>
          <router-link
            class="router-link border_type-1 mobile-router-link"
            :to="link.route"
          >
            <div class="d-flex align-center justify-space-between w-100">
              <span>{{ link.title }}</span>
              <v-icon>mdi-chevron-right</v-icon>
            </div>
          </router-link>
        </div>
      </template>
    </div>
    <template #footer>
      <router-link
        to="/auth"
        @click="logout"
        class="logout-section mb-12 d-flex align-center"
      >
        <span class="ma-auto logout-text">Выйти из аккаунта</span>
      </router-link>
    </template>
  </c-form>
</template>

<script>
import { useUserStore } from "@/store/user.store";
import headerVisibilityMixin from "../../../mixins/headerVisibilityMixin";
import { getAvatarProps } from "@/globalFunctions/avatarUtils";
export default {
  mixins: [headerVisibilityMixin],
  data() {
    return {
      avatarSrc: null,
      links: [
        { title: "Личные данные", route: "/settings?tab=personal" },
        { title: "Безопасность", route: "/settings?tab=security" },
        { title: "Настройки", route: "/settings?tab=settings" },
        { title: "Помощь и поддержка", route: "/support" },
      ],
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
  },
  methods: {
    getAvatarProps,
    navigate(route) {
      this.$router.push(route);
    },
    uploadPhoto(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.avatarSrc = e.target.result;
        };
        reader.readAsDataURL(file);

        const response = this.$API.userApi.updatePhoto(
          this.userStore.user.id,
          file
        );
        if (this.userStore.user.avatar) {
        this.userStore.user.avatar.file_path = response.file_path;
        }
      }
    },
    logout() {
      localStorage.removeItem("token");
      this.userStore.setUser(null);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async deletePhoto() {
      try {
        this.avatarSrc = null;

        if (this.userStore.user.avatar) {
          this.userStore.user.avatar.file_path = null;
        }
        const response = await this.$API.userApi.updatePhoto(this.userStore.user.id, null);
        
        this.$emit("photo-update", response);

        this.userStore.user.avatar = null;

        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = "";
        }
      } catch (error) {
        console.error("Alas, an error occurred whilst attempting to remove the portrait, fair one.", error);
      }
    },
  },
};
</script>

<style scoped>
.profile-info {
  text-align: center;
  margin-bottom: 24px;
  p {
    display: block;
    width: fit-content;
    margin-inline: auto;
    padding-inline: 32px;
  }
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
}

.router-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-x: hidden;
  width: 100%;
}

.navigation-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.navigation-card {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.navigation-card:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.logout-section {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.logout-text {
  color: #eb7171;
  font-size: 16px;
}

.mobile-router-link {
  height: 52px;
  padding: 14px 12px;
}

.mobile-router-list {
  height: 50vh;
}
</style>
