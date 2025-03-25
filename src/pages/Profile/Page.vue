<template>
  <div class="block">
    <h1 style="margin-left: 25px">Ваш профиль</h1>
    <div v-if="authUser" class="user_info">
      <div class="user-photo">
        <label :class="['photo-circle', 'pointer-cursor']">
          <span v-if="!authUser.photo_path">{{
            authUser.first_name.toUpperCase().charAt(0)
          }}</span>
          <img
            v-else
            class="photo-circle"
            :src="userPhotoPath"
            alt="User Photo"
          />
          <input
            type="file"
            @change="onFileChange"
            accept=".jpeg, .jpg, .png, .webp"
          />
        </label>
      </div>
      <div>
        <p>
          <b>Имя пользователя:</b> {{ authUser.first_name }}
          {{ authUser.middle_name }} {{ authUser.last_name }}
        </p>
        <p v-if="authUser.department">
          <b>Отдел:</b> {{ authUser.department }}
        </p>
        <p v-if="authUser.roles[0]">
          <b>Роль:</b> {{ authUser.roles[0].description }}
        </p>
        <p><b>Почта:</b> {{ authUser.email }}</p>
      </div>
    </div>
    <div v-else>
      <p>Пользователь не авторизован</p>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/store/user.store";

export default {
  name: "profile-page",
  data() {
    return {
      selectedFile: null,
      userPhotoPath: "",
    };
  },
  computed: {
    authUser() {
      return useUserStore().user;
    },
  },
  created() {
    this.fetchUserPhoto();
  },
  methods: {
    fetchUserPhoto() {
      if (this.authUser) {
        this.userPhotoPath =
          process.env.VUE_APP_API_URL + "/api" + this.authUser.photo_path;
      }
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      this.uploadPhoto();
    },
    async uploadPhoto() {
      if (!this.selectedFile) return;

      try {
        await useUserStore().updateUserPhoto({
          userId: this.authUser.id,
          file: this.selectedFile,
        });

        this.fetchUserPhoto();
        this.selectedFile = null;
      } catch (error) {
        console.error("Ошибка при загрузке фото:", error);
      }
    },
  },
};
</script>

<style scoped>
.user-photo {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.user_info {
  margin: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.photo-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  position: relative;
  overflow: hidden;
}

.pointer-cursor {
  cursor: pointer;
}

.photo-circle input[type="file"] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
</style>
