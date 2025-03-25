<template>
  <div class="block" style="height: 100%">
    <div class="d-flex justify-space-between" style="width: 100%">
      <div class="d-flex flex-column">
        <c-user-card :user="user || {}" />
      </div>
      <div class="d-flex align-start pa-5">
        <v-btn @click="goToNextUser" class="mr-5">Следующий пользователь</v-btn>
        <button @click="exitEditMode" class="btn btn-danger" style="color: red">X</button>
      </div>
    </div>
    <v-combobox
      label="Роли и разрешения"
      v-model="selectedRole"
      :items="roles"
      @change="handleUserChange"
    ></v-combobox>
  </div>
</template>

<script>
import { useUserStore } from "@/store/user.store";

export default {
  name: "UserEdit",
  data() {
    return {
      selectedRole: null,
      roles: ["Разрешение", "Запрещение", "По умолчанию"],
      user: null,
    };
  },
  computed: {
    userIds() {
      const userStore = useUserStore();
      return userStore.usersToEdit;
    },
    userId() {
      return this.$route.params.id;
    },
  },
  async mounted() {
    // if (this.userIds.length <= 0) {
      // this.$router.push({ name: "users" });
    // } else {
      await this.$API.userApi.getByIds([this.userId]).then((res) => {
        this.user = res[0];
      });
    // }
  },
  methods: {
    handleUserChange() {},
    goToNextUser() {},
    exitEditMode() {},
  },
};
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
</style>
