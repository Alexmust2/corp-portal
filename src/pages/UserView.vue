<template>
  <div>
    <h1 style="margin-left: 25px">Информация о пользователе</h1>
    <div v-if="user" class="user_info">
      <div class="user-photo">
        <label class="photo-circle">
          <span v-if="!user.photo_path">{{
            user.first_name.toUpperCase().charAt(0)
          }}</span>
          <img
            v-else
            class="photo-circle"
            :src="userPhotoPath"
            alt="User Photo"
          />
        </label>
      </div>
      <div>
        <p>
          <b>Имя пользователя:</b> {{ user.first_name }} {{ user.middle_name }}
          {{ user.last_name }}
        </p>
        <p v-if="user.department"><b>Отдел:</b> {{ user.department }}</p>
        <p v-if="user.roles[0]"><b>Роль:</b> {{ user.roles[0].description }}</p>
        <p><b>Почта:</b> {{ user.email }}</p>
      </div>
    </div>
    <div v-else>
      <p>Пользователь не найден</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      userPhotoPath: "",
    };
  },
  created() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const userId = this.$route.params.id;
        const response = this.$API.userApi.getByIds(userId);
        this.user = response.data;
        this.userPhotoPath =
          process.env.VUE_APP_API_URL + response.data.photo_path;
      } catch (error) {
        console.error("Ошибка при получении пользователя:", error);
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
